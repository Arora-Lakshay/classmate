const express = require("express");
const { register, login, refresh, logout } = require("../controllers/auth.controller");

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/refresh").get(refresh);

router.route("/refresh").post(refresh);

router.route("/logout").get(logout);

module.exports = router;
