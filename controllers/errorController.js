"use strict";

const httpStatus = require("http-status-codes");

// Add middleware to handle errors.
exports.logErrors = (error, req, res, next) => {
// Log the error stack  
  console.error(error.stack);
// Pass the error to the next middleware function.  
  next(error);
};

//Handle missing routes and errors with custom messages
// Respond with a 404 status code.
exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND;
  res.status(errorCode);
  res.send(`${errorCode} | The page does not exist!`);
};
// Catch all errors and respond with a 500 status code.
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
  console.log(`ERROR occurred: ${error.stack}`);
  res.status(errorCode);
  res.send(`${errorCode} | Sorry, our application is experiencing a problem!`);
};
