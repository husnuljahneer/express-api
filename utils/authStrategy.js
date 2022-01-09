const PassportJwt = require("passport-jwt");
const Service = require("../controllers/authController");
const createError = require("http-errors");
const { Strategy: JwtStrategy, ExtractJwt } = PassportJwt;
require("dotenv").config();

module.exports = function (passport) {
  // Authenticate Using JWT strategy
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_ACCESS_SECRET,
      },
      async (payload, done) => {
        try {
          // database query to find user by userid
          const user = await Service.getUserByUserId(payload.id);
          if (!user) {
            throw createError(401, "User not found");
          }

          return done(null, payload);
        } catch (err) {
          return done(err, false, {
            message: (err && err.message) || "Invalid Token",
          });
        }
      }
    )
  );
};