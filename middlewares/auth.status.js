const JWT = require("jsonwebtoken");
const User = require("../models/User.model");

exports.authenticate = async (req, res, next) => {
  try {
    if (!req.cookies) {
      return res.redirect("/login");
    }

    const accessToken = req.cookies[process.env.AXS_TOKEN];
    const refreshToken = req.cookies[process.env.RFX_TOKEN];

    if (accessToken && refreshToken) {
      return JWT.verify(accessToken, process.env.JWT_ASECRET, (err, payload) => {
        if (err) {
          // return res.redirect("/api/auth/refresh");
          return res.redirect(307, `/api/auth/refresh?redirect=true&d=${encodeURIComponent(req.originalUrl)}`);
        } else {
          req.payload = payload;
          return next();
        }
      });
    }

    if (!accessToken && refreshToken) {
      // res.redirect("/api/auth/refresh");
      res.redirect(307, `/api/auth/refresh?redirect=true&d=${encodeURIComponent(req.originalUrl)}`);
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    next(error);
  }
};

exports.validateGuest = async (req, res, next) => {
  try {
    if (!req.cookies) {
      return next();
    }

    const accessToken = req.cookies[process.env.AXS_TOKEN];
    const refreshToken = req.cookies[process.env.RFX_TOKEN];

    if (accessToken && refreshToken) {
      return JWT.verify(accessToken, process.env.JWT_ASECRET, (err, payload) => {
        if (err) {
          return res.redirect(307, "/api/auth/refresh");
        } else {
          return res.redirect(307, "/in/dashboard");
        }
      });
    }

    if (!accessToken && refreshToken) {
      res.redirect(307, "/api/auth/refresh");
    } else {
      return next();
    }
  } catch (error) {
    next(error);
  }
};

exports.validateAccess = async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.aud);

    if (!user) {
      throw createHttpError.NotFound("User does not exist");
    }

    if (user.role != "student" && user.role != "alumni") {
      req.currentUser = user;
      return next();
    } else {
      const options = {
        status: 404,
        title: "Looks like you're Lost",
        description: "The page you are looking for is not available !"
      }
      return res.render("public/error", { title: "Page Not Found", style: "error", options });
    }
  } catch (error) {
    next(error);
  }
};
