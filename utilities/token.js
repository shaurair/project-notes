const jwt = require("jsonwebtoken");
require('dotenv').config();

jwt_secret_key = process.env.JWT_SECRET_KEY;

function encodeToken(payload) {
	return jwt.sign(payload, jwt_secret_key, {expiresIn: "7 days"})
}

function decodeToken(token) {
	try {
		return jwt.verify(token, jwt_secret_key)
	}
	catch(err) {
		return null;
	}
}

module.exports = {
	encode: encodeToken,
	decode: decodeToken
}