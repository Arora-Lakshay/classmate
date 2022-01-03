const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI, {
  dbName: process.env.DB_NAME
}).then(() => {
  console.log("Established connection with database")
}).catch(err => {
  console.log(err.message);
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to database");
});

mongoose.connection.on("error", (err) => {
  console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from database");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});