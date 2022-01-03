const JWT = require("jsonwebtoken");
const createHttpError = require("http-errors");
const client = require("../helpers/redis.config");

// Creating an Access Token...
exports.signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {}
    const secret = process.env.JWT_ASECRET;
    const options = {
      expiresIn: process.env.JWT_AEXP,
      issuer: process.env.JWT_ISS,
      audience: userId
    }
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        return reject(createHttpError.InternalServerError());
      }
      resolve(token);
    });
  });
};

// Verifying an Access Token...
exports.verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return next(createHttpError.Unauthorized());
  }
  const bearerToken = req.headers["authorization"].split(" ")[1];
  JWT.verify(bearerToken, process.env.JWT_ASECRET, (err, payload) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        return next(createHttpError.Unauthorized());
      }
      return next(createHttpError.Unauthorized(err.message));
    }
    req.payload = payload;
    next();
  });
};

// Creating a Refresh Token...
exports.signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {}
    const secret = process.env.JWT_RSECRET;
    const options = {
      expiresIn: process.env.JWT_REXP,
      issuer: process.env.JWT_ISS,
      audience: userId
    }
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        return reject(createHttpError.InternalServerError());
      }
      client.SET(userId, token, "EX", process.env.IMD_EXP, (err, res) => {
        if (err) {
          console.log(err.message);
          return reject(createHttpError.InternalServerError());
        }
        resolve(token);
      });
    });
  });
};

// Verifying a Refresh Token...
exports.verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(refreshToken, process.env.JWT_RSECRET, (err, payload) => {
      if (err) {
        return reject(createHttpError.Unauthorized());
      }
      const userId = payload.aud;
      client.GET(userId, (err, token) => {
        if (err) {
          console.log(err.message);
          return reject(createHttpError.InternalServerError());
        }
        if (refreshToken === token) {
          return resolve(userId);
        }
        reject(createHttpError.Unauthorized());
      });
    });
  });
};
