"use strict";

const
// use the Router module in Express.js 
router = require("express").Router(),


homeController = require("../controllers/homeController");






// Adding routes for each page and request type
router.get("/", homeController.index);


module.exports = router;
