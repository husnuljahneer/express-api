const passport = require("passport");
const createError = require("http-errors");

module.exports = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    try {
      if (err) {
        next(createError(401, err.message));
      }
      req.user = user;
      next();
    } catch (ex) {
      next(ex);
    }
  })(req, res, next);
};