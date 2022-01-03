const createHttpError = require("http-errors");
const formidable = require("formidable");
const User = require("../models/User.model");
const { registerSchema, loginSchema } = require("../helpers/validation.schema");
const { signAccessToken, signRefreshToken } = require("../helpers/jwt.helper");
const JWT = require("jsonwebtoken");
const client = require("../helpers/redis.config");

exports.register = async (req, res, next) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, feilds) => {
    try {
      if (err) {
        throw createHttpError.InternalServerError();
      }

      const result = await registerSchema.validateAsync(feilds);
      let hasAccount = await User.findOne({ email: result.email });
      if (hasAccount) {
        throw createHttpError.Conflict("Email is already registered");
      } else {
        hasAccount = await User.findOne({ uid: result.uid });
      }

      if (hasAccount) {
        throw createHttpError.Conflict("UID is already registered");
      }

      const user = await User.create(result);
      await user.save();

      res.send({ success: true });
    } catch (error) {
      if (error.isJoi) {
        error.status = 422;
      }
      next(error);
    }
  });
};

exports.login = async (req, res, next) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, feilds) => {
    try {
      if (err) {
        throw createHttpError.InternalServerError();
      }

      const result = await loginSchema.validateAsync(feilds);
      const user = await User.findOne({ email: result.email }).select("+password");

      if (!user) {
        throw createHttpError.NotFound("User does not exist");
      }

      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch) {
        throw createHttpError.Unauthorized("Invalid Email or Password");
      }

      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      res.cookie(process.env.AXS_TOKEN, accessToken, {
        maxAge: 300000,
        httpOnly: true
      });
      res.cookie(process.env.RFX_TOKEN, refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.send({ success: true });
    } catch (error) {
      if (error.isJoi) {
        return next(createHttpError.BadRequest("Inavlid Email or Password"));
      }
      next(error);
    }
  });
};

exports.refresh = async (req, res, next) => {
  try {
    if (!req.cookies) {
      return res.redirect("/login");
    }

    const refreshToken = req.cookies[process.env.RFX_TOKEN];
    if (!refreshToken) {
      res.redirect("/login");
    }

    JWT.verify(refreshToken, process.env.JWT_RSECRET, async (err, payload) => {
      if (err) {
        res.clearCookie(process.env.RFX_TOKEN);
        return res.redirect("/login");
      }
      const userId = payload.aud;
      client.GET(userId, async (err, token) => {
        if (err) {
          console.log(err.message);
          res.clearCookie(process.env.RFX_TOKEN);
          return res.redirect("/login");
        }
        if (refreshToken === token) {
          const accessToken = await signAccessToken(userId);
          const refToken = await signRefreshToken(userId);
          res.cookie(process.env.AXS_TOKEN, accessToken, {
            maxAge: 300000,
            httpOnly: true
          });
          res.cookie(process.env.RFX_TOKEN, refToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          });
          if (req.query.redirect && req.query.d) {
            return res.redirect(307, req.query.d);
          } else {
            return res.redirect(307, "/in/dashboard");
          }
        }
        res.clearCookie(process.env.RFX_TOKEN);
        return res.redirect("/login");
      });
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (!req.cookies) {
      return res.redirect("/login");
    }

    const refreshToken = req.cookies[process.env.RFX_TOKEN];
    if (!refreshToken) {
      return res.redirect("/login");
    }
    return JWT.verify(refreshToken, process.env.JWT_RSECRET, (err, payload) => {
      if (err) {
        res.clearCookie(process.env.RFX_TOKEN);
        return res.redirect("/login");
      }
      const userId = payload.aud;
      return client.DEL(userId, (err, val) => {
        if (err) {
          console.log(err.message);
        }
        res.clearCookie(process.env.RFX_TOKEN);
        return res.redirect("/login");
      });
    });
  } catch (error) {
    next(error);
  }
};