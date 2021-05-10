"use strict";
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
var { secret } = require("./config");
// const db = require("../models/sql");

// Setup work and export for the JWT passport strategy
function auth() {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: secret,
  };
  passport.use(
    new JwtStrategy(opts, (jwt_payload, callback) => {
      const user_id = jwt_payload.id;
      console.log("User ID From Token :" + user_id);
      let req = {};
      req.body = {};
      req.body.path = "jwt-auth";
      req.body.user_id = user_id;
      kafka.make_request("JWT_auth", req.body, (error, result) => {
        if (result.status === 404) {
          callback(result.data, false);
        }
        if (result.status === 200) {
          callback(null, result.data);
        } else {
          callback(null, false);
        }
      });
    })
  );
}

exports.auth = auth;
exports.checkAuth = passport.authenticate("jwt", { session: false });
