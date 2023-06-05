const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { ensureLoggedOut, ensureLoggedIn } = require("connect-ensure-login");
const passport = require("passport");
const { roles } = require("../utils/constants");

router.get(
  "/login",
  ensureLoggedOut({ redirectTo: "/" }),
  async (req, res, next) => {
    res.render("login");
  }
);
router.post(
  "/login",
  ensureLoggedOut({ redirectTo: "/" }),
  passport.authenticate("local", {
    // successRedirect: '/',
    successReturnToOrRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    keepSessionInfo: true,
  })
);
router.get("/register", async (req, res, next) => {
  res.render("register");
});
router.post(
  "/register",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Email must be a valid email")
      .normalizeEmail()
      .toLowerCase(),
    body("password")
      .trim()
      .isLength(2)
      .withMessage("Password length is too short, min 2 char required"),
    body("password2").custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error("Password do not match");
      }
      return true;
    }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
          req.flash("error", error.msg);
        });
        res.render("register", {
          email: req.body.email,
          messages: req.flash(),
        });
        return;
      }

      const { email, password } = req.body;
      const doesExist = await User.findOne({ email });
      if (doesExist) {
        req.flash("error", `${email} Email already exists`);
        res.redirect("/auth/register");
        return;
      }
      //encryting password
      const encryptedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        password: encryptedPassword,
      });
      // console.log(newUser.email);
      // console.log(process.env.ADMIN_EMAIL);
      // if (newUser.email === process.env.ADMIN_EMAIL) {
      //   newUser.role = roles.admin;
      // }
      await User.findOneAndUpdate(
        { email: process.env.ADMIN_EMAIL.toLowerCase() },
        {
          role: roles.admin,
        }
      );

      req.flash(
        "success",
        `${newUser.email} registered sucessfully, you can now login`
      );
      res.redirect("/auth/login");
    } catch (error) {
      next(error);
    }
  }
);
router.get("/logout", ensureLoggedIn({ redirectTo: "/" }), async (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
