const redis = require("redis");

const client = redis.createClient();

client.on("connect", () => {
  console.log("Established connection with Redis");
});

client.on("ready", () => {
  console.log("Redis-Client is listening to requests...");
});

client.on("error", (err) => {
  console.log(err.message);
});

client.on("end", () => {
  console.log("Redis-Client has been disconnected");
});

process.on("SIGINT", () => {
  client.quit();
  process.exit(0);
});

module.exports = client;
