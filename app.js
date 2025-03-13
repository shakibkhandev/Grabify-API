require("dotenv/config");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
const User = require("./models/userModel");
const jwt = require("jsonwebtoken");
const MongoStore = require("connect-mongo");

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL_PRO
        : process.env.FRONTEND_URL_DEV,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

// Configure session middleware with MongoDB store
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret key for signing the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    store: MongoStore.create({
      mongoUrl: process.env.NODE_ENV === "production" ? process.env.MONGO_DB_URI_PRO : process.env.MONGO_DB_URI_DEV, // MongoDB connection string
      collectionName: "sessions", // Optional: Name of the collection to store sessions (default: 'sessions')
      ttl: 14 * 24 * 60 * 60, // Optional: Time-to-live in seconds (e.g., 14 days)
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 1000 * 60 * 60 * 24 * 14, // Cookie expiry: 14 days (in milliseconds)
    },
  })
);


app.use(passport.initialize());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL_PRO
        : process.env.FRONTEND_URL_DEV
    }`,
  }),
  async function (req, res) {
    const user = await User.findOne({ email: req.user.emails[0].value });
    if (!user) {
      const newUser = new User({
        name: req.user.displayName,
        email: req.user.emails[0].value,
        password: "empty password",
        loginType: "GOOGLE",
        avatar: req.user.photos[0].value,
      });
      await newUser.save();
      const access_token = await jwt.sign(
        { id: newUser.id },
        process.env.JWT_SECRET
      );
      return res.redirect(
        `${process.env.FRONTEND_URL_DEV}?token=${access_token}`
      );
    }
    const access_token = await jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET
    );
    return res.redirect(
      `${process.env.FRONTEND_URL_DEV}?token=${access_token}`
    );
  }
);

app.get("/", (req, res, next) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "Server is running" });
  } catch (err) {
    next(err);
  }
});

app.get("/health", (req, res, next) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "Server is healthy" });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
  });
});

module.exports = app;
