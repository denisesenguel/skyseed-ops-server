const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide all required fields." });
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Provide a valid email address.' });
    return;
  }
  
  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  // Search the database for a user with the submitted email
  User.findOne({ email }).then((found) => {
    // If the user is found, send message
    if (found) {
      return res.status(400).json({ errorMessage: "Email already taken." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          email,
          password: hashedPassword,
        });
      })
      .then((createdUser) => {
        // Removing password hash to not expose publicly
        const { email, _id } = createdUser;
        const user = { email, _id };
        res.status(201).json({ user: user });
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        } else {
          // Hand over to error handling middleware
          next(error)
        }
      });
  });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide your email and password." });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ email })
    .then((foundUser) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!foundUser) {
        return res.status(401).json({ errorMessage: "User not found." });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, foundUser.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            return res.status(401).json({ errorMessage: "Unable to authenticate user." });
          }
          // Deconstruct to not expose password hash
          const { _id, email } = foundUser;
          const payload = { _id, email };
          // Create and sign JWT token
          const authToken = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { algorithm: 'HS256', expiresIn: "6h"}
          );
          return res.status(200).json({ authToken: authToken});
        });
    })
    .catch((error) => {
      // Hand over to error handling middleware
      next(error);
    });
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log("req.payload", req.payload);
  res.status(200).json(req.payload);
})

module.exports = router;
