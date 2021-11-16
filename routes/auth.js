const express = require("express");
const router = express.Router();

const { login, register, token } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/token", token);

module.exports = router;
