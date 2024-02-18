"use strict";

const 
 // use the Router module in Express.js
  router = require("express").Router(),
  usersController = require("../controllers/usersController");

// Adding routes for each page and request type  
//router.get("/", usersController.index, usersController.indexView);
router.get("/register", usersController.new);
router.post("/register",
  usersController.validate,
  usersController.create,
  usersController.redirectView
);
// Adding the login route, Add a route to handle
// GET requests made to the /users/login path. in index view

router.get("/login", usersController.login);

// Adding the login route, Add a route to handle
// Post requests made to the /users/login path. in index view
router.post("/login", usersController.authenticate);

// Adding the logout route, Add a route to handle
// GET requests made to the /users/logout path. in index view

router.get("/logout", usersController.logout, usersController.redirectView);

// Adding the upload route, Add a route to handle
// GET requests made to the /upload path. in index view

router.get("/upload", usersController.upload);

// Adding the upload-video route, Add a route to handle
// POST requests made to the /upload path. in upload view

router.post("/upload-video", usersController.uploadVideo); 
  
// Adding the save-video route, Add a route to handle
// POST request made to the /upload path. in upload view

router.post("/save-video", usersController.saveVideo); 
  
// Adding the /watch route, Add a route to handle
// GET request made to the /watch path. in index view
// cliking up over each video

router.get("/watch", usersController.watchVideo);

// Adding the /search route, Add a route to handle
// GET request made to the /search path. in header.ejs navbar view

router.get("/search", usersController.GETsearch);


// Adding the /watchChannel route, Add a route to handle
// GET request made to the /watchChannel path. in single-channel view
// cliking up over each video
router.get("/watchChannel", usersController.watchVideoChannel);

// Adding the /edit route, Add a route to handle
// POST request made to the /edit path. in video-page view

router.post("/edit", usersController.saveVideoEditPost);

// Adding the /edit route, Add a route to handle
// GET request made to the /edit path. in video-page view
// save Video Edit get route - in video page view - button edit

router.get("/edit", usersController.saveVideoEdit);

// GET request made to the /edit path. in video-page view
// save Video Edit get route - in video page view - delete edit

router.get("/delete-video", usersController.deleteVideo);


// GET request made to the /edit path. in video-page view
// save Video Edit get route - in video page view - delete edit

router.get("/delete-videoChannel", usersController.deleteVideoChannel);

// GET request made to the /my_channel. in header - user - optionchannel menu view
// route - in header menu view - inside user avatar image - option channel

router.get("/my_channel", usersController. GETChannel);

// do-comment route - page video-page - view: watch- button post(comment)

router.post("/do-comment", usersController.doCommentPost);

// do-replay route - page video-page - view: watch - button reply ()

router.post("/do-reply", usersController.doReplayPost);




module.exports = router;
