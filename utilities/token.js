const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
require('dotenv').config();

jwt_secret_key = process.env.JWT_SECRET_KEY;

function encodeToken(payload) {
	return jwt.sign(payload, jwt_secret_key, {expiresIn: "7 days"})
}

module.exports = {
	encodeToken
}