const mongoose = require('mongoose');

module.exports = (app) => {
  app.use((req, res, next) => {
    // this middleware runs whenever requested page is not available
    res.status(404).json({ errorMessage: "This route does not exist" });
  });

  app.use((err, req, res, next) => {
    // whenever you call next(err), this middleware will handle the error
    // always logs the error
    console.error("ERROR", req.method, req.path, err);

    // only render if the error ocurred before sending the response
    if (!res.headersSent) { 
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ 
            message: err._message,
            fields: Object.keys(err.errors)
        });
      } else if (err.code === 11000) {
        return res.status(400).json({ 
          message: `${Object.keys(err.keyValue)[0]} already taken.`
        })
      } else {
        return res.status(500).json({
          message: "Internal server error.",
          error: err
        });
      }
    }
  });
};
