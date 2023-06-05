const mongoose = require("mongoose");
function dbConnection() {
  const DB_URI = process.env.MONGO_URI;

  mongoose.connect(DB_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "Connection error: "));
  db.once("open", function () {
    console.log("💾 DB connected");
  });
}

module.exports = dbConnection;
