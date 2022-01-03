const express = require("express");
const { home, login, register } = require("../controllers/public.controller");
const { validateGuest } = require("../middlewares/auth.status");

const router = express.Router();

router.route("/").get(validateGuest, home);

router.route("/login").get(validateGuest, login);

router.route("/register").get(validateGuest, register);

module.exports = router;
