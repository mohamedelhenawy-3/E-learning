const { request } = require("express");
const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).send("Access denied. No token provided!");

  const decoded = jwt.verify(token, "privateKey");
  req.user = decoded;
  console.log(req.user.id)
  req.token = decoded
  next();
};