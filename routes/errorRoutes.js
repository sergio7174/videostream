"use strict";

const 
// use the Router module in Express.js
router = require("express").Router(),
errorController = require("../controllers/errorController");

 // tell Express.js router to use this middleware function by requiring errorController.js 
router.use(errorController.logErrors);
// Handle missing routes and errors with custom messages
// Add error-handling middleware to main
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

module.exports = router;
