"use strict";

const 
  // use the Router module in Express.js
  // This line creates a Router object that offers its own middleware
  // and routing alongside the Express.js app object.
  router = require("express").Router(),
  // use system routes
  userRoutes = require("./userRoutes"),
     //subscriberRoutes = require("./subscriberRoutes"),
    //courseRoutes = require("./courseRoutes"),
  errorRoutes = require("./errorRoutes"),
  homeRoutes = require("./homeRoutes");
 

  // // Adding routes for each page and request type
router.use("/", userRoutes);
   //router.use("/subscribers", subscriberRoutes);
   //router.use("/courses", courseRoutes);
// implement a namespace for API endpoints that return JSON data or perform actions asynchronously

router.use("/", homeRoutes);
router.use("/", errorRoutes);


module.exports = router;
