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
const { isValidMongooseId } = require("../middleware/isValidMongooseId");

// require email controllers
const sendEmailConfirm = require("../controllers/email.send.js");

function getAuthToken(payload) {
  const authToken = jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    { algorithm: 'HS256', expiresIn: "6h"}
    );
  return authToken;
}

router.post("/signup", (req, res, next) => {
  const { email, password, firstName } = req.body;

  if (!email || !password || !firstName) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      message: 'Email invalid.',
      fields: ['email']
    });
    return;
  }

  // If allowed domains are specified, check if email is allowed
  if (process.env.ALLOWED_DOMAINS) {
    const emailDomain = email.split("@")[1];
    if (!process.env.ALLOWED_DOMAINS.split(", ").includes(emailDomain)) {
      return res.status(400).json({ message: "Email domain not allowed." })
    }
  }
  
  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({ 
      message: 'Password must have at least 6 characters and contain number, lowercase and uppercase letters.',
      fields: ['password'] 
    });
    return;
  }

  // Search the database for a user with the submitted email
  User.findOne({ email })
    .then((found) => {
        
      if (found && found.confirmed) {
        // if user already exists with confirmed email, send error response
        return res.status(400).json({ message: "Email already taken." });
      } else if (found && !found.confirmed) {
        // if user exists without confirmed email, resend
        const { email, _id, firstName } = found;
        return sendEmailConfirm({ email, _id, firstName})
          .then(() => {
            return res.status(400).json({ message: "Email already exists. Confirmation link resent."})
          })
          .catch((error) => {
            next(error)
          })
      } else {
        // if user is not found, create a new user - start with hashing the password
        return bcrypt
          .genSalt(saltRounds)
          .then((salt) => bcrypt.hash(password, salt))
          .then((hashedPassword) => {
            // Create a user and save it in the database
            return User.create({
              email,
              password: hashedPassword,
              firstName,
              role: 'internal'
            });
          })
          .then((createdUser) => {
            // Send confirmation email
            const { email, _id, firstName } = createdUser;
            sendEmailConfirm({ email, _id, firstName});
          })
          .then(() => {
            res.status(201).json({ message: "Sucess! User created and confirmation mail sent." });
          })
          .catch((error) => {
            next(error);
          });
      }
    })
    .catch((error) => {
      next(error);
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

      // If the user hasn't confirmed their email adress yet, return 401 as well
      if (!foundUser.confirmed) {
        return res.status(401).json({errorMessage: "Email still needs to be confirmed."})
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, foundUser.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            return res.status(401).json({ errorMessage: "Unable to authenticate user." });
          }
          // Deconstruct to not expose password hash
          const { _id, email, firstName, role } = foundUser;
          const payload = { _id, email, firstName, role };
          // Create and sign JWT token
          const authToken = getAuthToken(payload);
          return res.status(200).json({ authToken: authToken });
        });
    })
    .catch((error) => {
      // Hand over to error handling middleware
      next(error);
    });
});


router.post("/confirm/:id", isValidMongooseId, (req, res, next) => {
  // find existing user and set confirmed to true
  User.findByIdAndUpdate(req.params.id, { confirmed: true })
  .then((userDB) => {
    if (!userDB) {
      return res.status(404).json({ message: "User not found." });
    } 
    return res.status(200).json({ message: "Email confirmed. "});  
  })
  .catch((error) => {
    next(error)
  })
})

router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log("req.payload", req.payload);
  res.status(200).json(req.payload);
})

module.exports = router;
