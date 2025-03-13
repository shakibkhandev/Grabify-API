const passport = require("passport");
const User = require("../models/userModel");
const GoogleStrategy = require("passport-google-oauth20").Strategy;



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.NODE_ENV === "production" ? process.env.BASE_URL_PRO : process.env.BASE_URL_DEV}/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

passport.serializeUser((profile, cb) => {
  cb(null, profile);
});

passport.deserializeUser((profile, cb) => {
  cb(null, profile);
});

module.exports = passport;
