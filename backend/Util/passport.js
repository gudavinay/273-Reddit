"use strict";
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
var { secret } = require("./config");
const Users = require("../Model/UserRegistrationModel");

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
      Users.findById(user_id, (err, results) => {
        if (err) {
          return callback(err, false);
        }
        if (results) {
          callback(null, results);
        } else {
          callback(null, false);
        }
      });
    })
  );
}

exports.auth = auth;
exports.checkAuth = passport.authenticate("jwt", { session: false });
