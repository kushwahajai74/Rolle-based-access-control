const express = require("express");
const createHTTPError = require("http-errors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const DBConnection = require("./dbConnection");
require("dotenv").config();
const port = process.env.PORT || 3000;
const session = require("express-session");
const connectFlash = require("connect-flash");
const passport = require("passport");
const MongoStore = require("connect-mongo");

//initialization
const app = express();
DBConnection();
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const { ensureLoggedIn } = require("connect-ensure-login");
const { roles } = require("../utils/constants");

// const MongoStore = connectMongo(session);
//init session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // secure:true
      httpOnly: true,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: "rbac_user",
    }),
  })
);
//for passsport js Authentication
app.use(passport.initialize());
app.use(passport.session());
require("../utils/passport.auth");

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

//connect flash
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

//routes
app.use("/", require("../routes/index.route"));
app.use("/auth", require("../routes/auth.route"));
app.use(
  "/user",
  ensureLoggedIn({ redirectTo: "/auth/login" }),
  require("../routes/user.route")
);
app.use(
  "/admin",
  ensureLoggedIn({ redirectTo: "/auth/login" }),
  ensureAdmin,
  require("../routes/admin.route")
);

// app.use((req, res, next) => {
//   next(createHTTPError.NotFound());
// });
// app.use((error, req, res, next) => {
//   error.status = error.status || 500;
//   res.status(error.status);
//   res.render("error_40x", { error });
//   res.send(error);
// });
app.listen(port, () => {
  console.log(`🚀 is running at ${port}`);
});

function ensureAdmin(req, res, next) {
  if (req.user.role === roles.admin) {
    next();
  } else {
    req.flash("warning", "You are not authorised to see this route");
    res.redirect("/");
  }
}
function ensureHead(req, res, next) {
  if (req.user.role === roles.head) {
    next();
  } else {
    req.flash("warning", "You are not authorised to see this route");
    res.redirect("/");
  }
}
