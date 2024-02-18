"use strict";
const
Videos = require ("../models/videos"),
User = require ("../models/user");



// Export object literal with all controller actions.
module.exports = {

// id del Admin del sistema


// Root route
index: (req, res) => {

	Videos.find().then (videos=> { 

	         //let newpath = videos.filePath.replace("public","")


		res.render("index", {
			
			"isLogin": res.locals.currentUser ? true : false,
			"videos": videos,

			"url": req.url
		});
	});
},


 

}




    
  
