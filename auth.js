"use strict";

const base64 = require("base-64");

function decodeCredentials(authHeader) {
  const encodedCredentials = authHeader.trim().replace(/Basic\s+/i, '');

  const decodedCredentials = base64.decode(encodedCredentials);
  
  return decodedCredentials.split(":");
}

// check for auth headers
// send auth request if headers don't match/are empty (first request)
module.exports = function auth(req, res, next) {
  const [username, password] = decodeCredentials(req.headers.authorization || '');

  if (username === "test" && password === "test") {
    return next();
  }

  res.set("WWW-Authenticate", "Basic realm='user_pages'");
  res.status(401).send("Authentication required.");
}