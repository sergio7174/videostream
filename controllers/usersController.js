"use strict";

const 
  
  User = require("../models/user"),
  Video = require ("../models/videos"),
  //Comment = require ("../models/commentOut"),

  // objectId using mongodb
  //mongodb = require('mongodb'),
  //ObjectId = require("mongodb").ObjectId;

  mongoose = require("mongoose"),
  // objectId using mongoose
  ObjectId = mongoose.Types.ObjectId,

  passport = require("passport"),
  formidable = require("formidable"),
  fileSystem = require("fs"),
  { getVideoDurationInSeconds } = require('get-video-duration'),
  
  // This function is reused throughout the controller to organize user attributes 
  // in one object. You should create the same functions for your other model controllers.
  
  getUserParams = body => {
    return {
       email: body.email,
       firstName: body.firstName,
       lastName: body.lastName,
       password: body.password,
       
      filePath: body.newPath,
      createdAt: body.currentTime,
       views: 0,
       image: body.image,
       watch: body.currentTime,
       minutes: body.minutes,
       seconds: body.seconds,
       hours: body.hours,
       title: body.title,
       description: body.description,
       tags: body.tags,
       category: body.category,
       thumbnail: body.thumbnail,
      
      
       
  

     
    };
  };

  function getUser(userId, callBack) {
    User.findOne({
      _id: userId
    }, function (error, res) {
      if (error) {
        console.log(error);
        return;
      }
      if (callBack != null) {
        callBack(res);
      }
    });
  }

// Export object literal with all controller actions.
module.exports = {
  index: (req, res, next) => {
    User.find()
      .then(users => {
         // Send saved data to the next then code block.
         // Store the user data on the response and call the next middleware function.
        res.locals.users = users;
        next();
      })
      // Log error messages and redirect to the home page.
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    // Render the index page with an array of users.
    res.render("users/index");
  },
    
  // Add the new action to render a form.
    new: (req, res) => {
      if (req.session.user_id) {
        res.render("/", {
          "error": ``,
          "message":`${user.fullName}'s account created successfully!`,
          "isLogin": req.session.user_id ? true : false,
			    "videos": videos,
			    "url": req.url
        })
        return;
      }
      res.render("users/register", {
        "error": "",
        "message": ""
      });
      res.end();
    },

  // create action, assign a userParams variable to the collected incoming data.
  create: (req, res, next) => {
    if (req.skip) return next();
    let newUser = new User(getUserParams(req.body));

    User.register(newUser, req.body.password, (error, user) => { // Register new users.
  
      if (user) {

        console.log("Estoy en create User user en if(user): "+user)
    // Respond with a success flash message.    
        /*req.flash("success", `${user.fullName}'s account created successfully!`);
        res.locals.redirect = "/users";*/
        
        res.render("users/register", {
          "error": ``,
          "message": `${user.fullName}'s account created successfully!`
          });
     // must use return before next()
        return;

        next();
      } else {
     
        res.render("users/register", {
          "error": `Failed to create user account because: ${error.message}.`,
          "message": ""
        })
        // must use return before next()
        return;
        next();
      }
    });
   
  },
  // redirectView, determines which view to show based on the redirect path it 
  // receives as part of the response object
  redirectView: (req, res) => {
    console.log("En redirectView action in usersControllers")
    res.render("users/register", {
      "error": "",
      "message": ""
    });
    /*let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);

    else next();*/
  },
  // Show action for a specific user

 /* show: (req, res, next) => {
  // First, collect the user’s ID from the URL parameters; you can get 
  // that information from req.params.id.  
    let userId = req.params.id;
  // Use the findById query, and pass the user’s ID  
    User.findById(userId)
  // Because each ID is unique, you should expect a single user in return  
      .then(user => {
  // If a user is found, add it as a local variable on the response object   
  // Pass the user through the response object to the next middleware function.   
        res.locals.user = user;
  // and call the next middleware      
        next();
      })
  // If an error occurs, log the message, and pass the error to the next
  // middleware function.    
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },*/
  // render the show page and pass the user object to display that
  // user’s information.
  showView: (req, res) => { 
    res.render("users/show"); // Render show view.
  },
  // Adding edit and update actions
  // Add the edit action.
  edit: (req, res, next) => {
    let userId = req.params.id;
  // Use findById to locate a user in the database by their ID.  
    User.findById(userId)
      .then(user => {
  // Render the user edit page for a specific user in the database.
        res.render("users/edit", {
          user: user
        });
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  // use some Mongoose methods in a specific update action
  // Add the update action.
  update: (req, res, next) => {
    let userId = req.params.id,
  // Collect user parameters from request.  
      userParams = {
        
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        
      };
  // Use findByIdAndUpdate to locate a user by ID and update the document record in one command.    
    User.findByIdAndUpdate(userId, {
  // This method takes an ID followed by parameters you’d like to replace for that document
  //  by using the $set command    
      $set: userParams
    })
      .then(user => {
        res.locals.redirect = `/users/${userId}`;
  // Add user to response as a local variable, and call the next middleware function.
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },
  // Deleting users with the delete action
  delete: (req, res, next) => {
    let userId = req.params.id;
  // using the Mongoose findByIdAndRemove method to locate the record you clicked
  // and remove it from your database  
    User.findByIdAndRemove(userId)
  // If you’re successful in locating and removing the
  // document log that deleted user to the console and redirect in the next 
  // middleware function to the users index page
      .then(() => {
        res.locals.redirect = "/users";
        next();
      })
  // Otherwise, log the error as usual, and let your error handler
  // catch the error you pass it.
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },
  login: (req, res) => {
   
 /*if (req.session.user) {
      res.redirect("/");
      return;
    }*/
    res.render("users/login", {
      "error": "",
      "message": ""
    });
    return;
  },
// Call on passport to authenticate a user via the local strategy.
  authenticate: passport.authenticate("local", {
 // Set up success and failure flash messages and redirect
 // paths based on the user’s authentication status.   
    

    failureRedirect: "/login",
    failureFlash: "Failed to login.",

   
    successRedirect: ("/"),

    successFlash: "Logged in!",

  }
  ),


  // The first validation function uses the request and response, and it may 
  // pass on to the next function in the middleware chain, so you need the next parameter
  validate: (req, res, next) => {
    req
  // Start with a sanitization of the email field, using express-validator’s 
  // normalizeEmail method to convert all email addresses to lowercase and then trimwhitespace away  
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true
      })
      .trim(); // Remove whitespace with the trim method.
   // with the validation of email to make sure that it follows the email-format 
   // requirements set by express-validator   
    req.check("email", "Email is invalid").isEmail();
    /*req
   // The zipCode validation ensures that the value isn’t empty and is an integer, 
   // and that the length is exactly five digits. 
      .check("zipCode", "Zip code is invalid")
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5
      })
      .equals(req.body.zipCode);*/
      // The last validation checks that the password field isn’t empty.
    req.check("password", "Password cannot be empty").notEmpty();
   // req.getValidationResult collects the results of the previous validations and returns a
   // promise with those error results.
    req.getValidationResult().then(error => {
   // If errors occur, you can collect their error messages and add them to your 
   // request’s flash messages.   
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg);
   // If errors have occurred in the validations 
   // This value tells your next middleware function, create, not to process 
   // your user data because of validation errors and instead to skip to your redirectView action.    
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/register";
        next();
      } else {

        next();
      }
    });
  },


  // logout action
  logout:
  (req, res, next)=>{
  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session.user = null
  req.session.save(function (err) {
    if (err) next(err)

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err)
      /*req.flash("success", "You have been logged out!");*/
      res.redirect('/');

      /*res.render("/", {
        "error": "",
         "message": "You have been logged out!"
      });*/
      return;
    })
  })
},

// Adding the /search action, Add a action to handle
// GET request made to the /search path. in header.ejs navbar view

GETsearch:(req, res) => {
   
   console.log("Estoy en GETsearch - line 361 - userControllers")
   console.log("Estoy en GETsearch - line 362 - req.query.search_query: "+ req.query.search_query)

    // $regex: Provides regular expression capabilities for pattern matching strings in queries
      // search_query, name of the input field in html view form

      Video.find( { title: {
         
          $regex: req.query.search_query,
          $options: "i" }

        }).then (videos=> {
          console.log ("Estoy en GETsearch - line 372 - userControllers, videos: "+ videos)
          res.render("search-query", {
            "isLogin": res.locals.currentUser? true : false,
            "videos": videos,
            "query": req.query.search_query,
            "url": req.url
          });
      })
     
},

// Adding the /upload action, Add a action to handle
// GET request made to the /upload path. in header.ejs navbar view

upload: (req, res) => {

  res.render("upload", {"url": req.url})
  return;
},
// upload-video action in upload view - button up-load video - Post action

uploadVideo: (req, res)=>{
  res.locals.currentUser = req.user;
  
   
    if (res.locals.currentUser._id) {

    var formData = new formidable.IncomingForm();
    formData.maxFileSize = 1000 * 1024 * 1204;
    formData.parse(req, function (error1, fields, files) {
      var oldPath = files.video.path;
      var newPath = "public/videos/" + new Date().getTime() + "-" + files.video.name;

      var title = fields.title;
      var description = fields.description;
      var tags = fields.tags;
      var videoId = fields.videoId;
      var thumbnail = fields.thumbnailPath;

      var oldPathThumbnail = files.thumbnail.path;

      var thumbnail = "public/thumbnails/" + new Date().getTime() + "-" + files.thumbnail.name;

      console.log("oldPathThumbnail: "+ oldPathThumbnail);
      console.log("thumbnail: "+ thumbnail);


     /* fileSystem.rename(oldPathThumbnail, thumbnail, function (error2) {
        console.log("thumbnail upload error = ", error2);
      });

      fileSystem.rename(oldPath, newPath, function (error2) {
        getUser(res.locals.currentUser._id, function (user) {*/

        fileSystem.copyFile(oldPathThumbnail, thumbnail, function (error2) {
          console.log("thumbnail upload error = ", error2);
        });
  
        fileSystem.copyFile(oldPath, newPath, function (error2) {
          getUser(res.locals.currentUser._id, function (user) {
          
          delete user.password;
          var currentTime = new Date().getTime();

          getVideoDurationInSeconds(newPath).then((duration) => {

            var hours = Math.floor(duration / 60 / 60);
            var minutes = Math.floor(duration / 60) - (hours * 60);
            var seconds = Math.floor(duration % 60);

            console.log("upload video, before linea - 405 video.collection.insertOne"),


           Video.collection.insertOne({              
              
              "id": user._id,
              "firstName": user.firstName,
              "lastName":  user.lastName,
              "image":  user.image,
              "subscribers":  user.subscribers,
              "filePath": newPath,
              "createdAt": currentTime,
              "views": 0,
              "watch": currentTime,
              "minutes": minutes,
              "seconds": seconds,
              "hours": hours,
              "title": title,
              "description": description,
              "tags": tags,
              "category": fields.category,
              "thumbnail": thumbnail


            }, function (error3, data) {


              User.updateOne({
                "_id": ObjectId(res.locals.currentUser._id)
              }, {
                $push: {
                  "videos": {
                    //"_id": data.insertedId,
                    "_id": ObjectId(res.locals.currentUser._id),
                    "filePath": newPath,
                    "createdAt": currentTime,
                    "views": 0,
                    "watch": currentTime,
                    "minutes": minutes,
                    "seconds": seconds,
                    "hours": hours,
                    "title": title,
                    "description": description,
                    "tags": tags,
                    "category": fields.category,
                    "thumbnail": thumbnail
                  }
                }
              }, function (error4, data1) {

                console.log("upload vide0 - linea 492, antes de redirect /")

                res.redirect("/")
                return;
                res.end(); });
            });
          }
          );






          
        });
      });
    });
  } else {
    res.json({
      "status": "error",
      "message": "Please login to perform this action."
    });
  }
 
},

// save-video action in /upload view

saveVideo: (req, res)=>{
  
  console.log("Estoy en save-video, findOne before findOne")

  if (res.locals.currentUser._id) {
    var title = req.body.title;
    var description = req.body.description;
    var tags = req.body.tags;
    var videoId = req.body.videoId;

   
    console.log("ObjectId(res.locals.currentUser._id): " + ObjectId(res.locals.currentUser._id));
    console.log("ObjectId(videoId): " + ObjectId(videoId));


    // seek user in database
    User.findOne({
      "_id": ObjectId(res.locals.currentUser._id),
      "videos._id": ObjectId(videoId)

    }, function (error1, video) {

      console.log("Estoy en save-video, findOne video: "+ video)
      // if not find user - video==null
      if (video == null) {
        res.send("Sorry you do not own this video");
      } else { 
        //  if  find user - video!=null
        // update video collection 
        Video.updateOne({
          "_id": ObjectId(videoId)
        }, {
          $set: {
            "title": title,
            "description": description,
            "tags": tags,
            "category": req.body.category,
            "minutes": req.body.minutes,
            "seconds": req.body.seconds
          }
        }, function (error1, data) {
               
            console.log("Estoy en video-save, Video.updateOne, data: "+ data)

            // update user video-data

            console.log("ObjectId(res.locals.currentUser._id): "+ ObjectId(res.locals.currentUser._id))
            console.log("videos._id: "+ ObjectId(videoId))

          User.findOneAndUpdate({
            $and: [{
              "_id": ObjectId(res.locals.currentUser._id)
            }, {
              "videos._id": ObjectId(videoId)
            }]
          }, {
            $set: {
              "videos.$.title": title,
              "videos.$.description": description,
              "videos.$.tags": tags,
              "videos.$.category": req.body.category,
              "videos.$.minutes": req.body.minutes,
              "videos.$.seconds": req.body.seconds
            }
          }, function (error2, data1) {
            res.json({
              "status": "success",
              "message": "Video has been published"
            });
          });
        });
      }
    });
  } else {
    res.json({
      "status": "danger",
      "message": "Please login to perform this action."
    });
  }},

  // watch video action - index view

  watchVideo:  (req, res)=>{

    
    Video.findOne({
    //  "watch": parseInt(req.query.v)
    "watch": parseInt(req.query.v)
    }, function (error1, video) {   
       

      if (video == null) {
        res.render("404", {
          "isLogin": res.locals.currentUser._id ? true : false,
          "message": "Video does not exist.",
          "url": req.url
        });
      } else {
  
        Video.updateOne({
          _id: video._id
        }, {
          $inc: {
            "views": 1
          }
        });
        
          // video.id it is user id, it must be idUser, fix it in database !!!!!

        getUser(video.id, function (user) {

       //   console.log("Estoy en watch Video, res.locals.currentUser "+ res.locals.currentUser)

          res.render("video-page", {
          

            "isLogin": res.locals.currentUser ? true : false,
            "video": video,
            "user": user,
            "url": req.url,
            
           
            

          });
          res.end();
        });
      }
    });
  
  },


  watchVideoChannel: (req, res)=>{

    
    Video.findOne({
    //  "watch": parseInt(req.query.v)
    "watch": parseInt(req.query.v)
    }, function (error1, video) {   
       

      if (video == null) {
        res.render("404", {
          "isLogin": req.session.user_id ? true : false,
          "message": "Video does not exist.",
          "url": req.url
        });
      } else {
  
        Video.updateOne({
          _id: video._id
        }, {
          $inc: {
            "views": 1
          }
        });
        
       // video.id - es el id del usuario, debio ser idUser, fix in database !!!!

        getUser(video.id, function (user) {

          res.render("video-page-channel", {
          

            "isLogin": user._id ? true : false,
            "video": video,
            "user": user,
            "url": req.url,
            
           
            

          });
          res.end();
        });
      }
    });
  
  },

// edit action in upload-view get

saveVideoEdit:  (req, res)=>{


  if (res.locals.currentUser._id) {
    

    //console.log("parseInt(res.query.v): "+ parseInt(res.query.url))


    Video.findOne({
      "watch" : parseInt(req.query.v)
    }, function (error, video) {
    
       

      if (video == null) {
        res.render("404", {
          "isLogin": true,
          "message": "This video does not exist.",
          "url": req.url
        });
      } else {
        
        



        if (video.id != res.locals.currentUser._id) {
          res.send("Sorry you do not own this video.");
        } else {

          getUser(res.locals.currentUser._id, function (user) {

            res.render("edit-video", {
              "isLogin": true,
              "video": video,
              "user": user,
              "url": req.url
            });
          });
        }
      }
    })
    

  } else {
    res.redirect("/login");
  }
},



  // edit action in upload-view post 
  saveVideoEditPost:  (req, res)=>{

     
  if (res.locals.currentUser._id) {

    var formData = new formidable.IncomingForm();
    formData.parse(req, function (error1, fields, files) {
      var title = fields.title;
      var description = fields.description;
      var tags = fields.tags;
      var videoId = fields.videoId;
      var thumbnail = fields.thumbnailPath;

      if (files.thumbnail.size > 0) {
        
        if (typeof fields.thumbnailPath !== "undefined" && fields.thumbnailPath != "") {
          fileSystem.unlink(fields.thumbnailPath, function (error3) {
            //
          });
        }

        var oldPath = files.thumbnail.path;
        var newPath = "public/thumbnails/" + new Date().getTime() + "-" + files.thumbnail.name;
        thumbnail = newPath;

        fileSystem.rename(oldPath, newPath, function (error2) {
          //
        });
      }
 
         
      // seek for video in daatbase by video_id    
      Video.findOne({
        
        // parameter to seek, video: _id
        "_id": videoId
 

      }, function (error1, video) {
         
         // if dont find video
        if (video == null) {
          res.send("Sorry you do not own this video");
        } else {
          // if find video in database - update
          Video.findByIdAndUpdate({

            "_id": videoId
          }, {
            $set: {
              "title": title,
              "description": description,
              "tags": tags,
              "category": fields.category,
              "thumbnail": thumbnail
            }
          }, function (error1, data) {
          
            // if data is update it get back
             
                    res.redirect('back');
                      
         
          });
        }
      });
    });
  } else {
    res.redirect("/login");
  }

  },

  // delete video action in video-page view button delete
  deleteVideo:  (req, res)=>{
          

    if (res.locals.currentUser._id) {
      Video.find({
        $and: [{
          "id": res.locals.currentUser._id
        }, {
          "watch": parseInt(req.query.v)
        }]

      }, function (error1, video) {


        if (video == null) {
          res.render("404", {
            "isLogin": true,
            "message": "Sorry, you do not own this video."
          });
        } else {

     

          Video.remove({
            //"_id": video._id
            "watch" : parseInt(req.query.v)

          }, function (error3, videoData) {

         
           

            Video.find().then (videos=> {
     
               
            res.render("index", {
              
              "isLogin": res.locals.currentUser._id ? true : false,

              "videos": videos,
              "message": "Video has been saved",
              "url": req.url,
            });


          });


          });
        
        }})
        
  }},

 // delete video action in my-channel view - simple channel page button delete in watch
 deleteVideoChannel:  (req, res)=>{
  console.log("Estoy en deletevideochannel action");

if (res.locals.currentUser._id) {
Video.find({
$and: [{
 "id": res.locals.currentUser._id
}, {
 "watch": parseInt(req.query.v)
}]

}, function (error1, video) {

       

if (video == null) {
 res.render("404", {
   "isLogin": true,
   "message": "Sorry, you do not own this video."
 });
} else {

 console.log("Estoy en deleteVideoChannel hacia my_channel");

 Video.remove({
   //"_id": video._id
   "watch" : parseInt(req.query.v)

 }, function (error3, videoData) {


    res.redirect("my_channel")

 });

}})

}},

// do-comment action - page video-page - button post(comment)

doCommentPost: (req, res)=>{          
            
            if (res.locals.currentUser._id) { // if there is a login user
              
              var comment = req.body.comment;
              var videoId = req.body.videoId;
      
              getUser(res.locals.currentUser._id, function (user) {
              //  delete user.password;

              // find the video by the _id video data in database
              Video.findOneAndUpdate({

                  "_id": ObjectId(videoId)

                }, {
                  // it is an array, thats we use put method , intead of set
                  $push: {
                    "comments": {
                      "_id": ObjectId(),
                      "author": {
                        "_id": user._id,
                        "firstName": user.firstName,
                        "lastName": user.lastName,
                        "image": user.image
                      },
                      "comment": comment,
                      "createdAt": new Date().getTime()
                    }
                  }
                }, function (error1, data) {


                  res.json({
                    "status": "success",
                    "message": "Comment has been posted",
                    "user": {
                      "_id": user._id,
                      "firstName": user.firstName,
                      "lastName": user.lastName,
                      "image": user.image
                    },
                    "comment": comment
                  });
                });
              });
            } else {
              res.json({
                "status": "danger",
                "message": "Please login to perform this action."
              });
            }
          },

  // Get channel action - in avatar user - header menu - option channel
  // here I only get the User and then pushing up the videos button, appear my videos.

  GETChannel: (req, res)=>{

    if ( res.locals.currentUser._id) {

      var id =  res.locals.currentUser._id;
      User.findById ( id, function (error1, user) { 

           
       

        res.render("users/single-channel", {
          "isLogin": true,
           "user": user,
          //"user": user,
          "headerClass": "single-channel-page",
          "footerClass": "ml-0",
          "isMyChannel": true,
          "message": req.query.message ? req.query.message : "",
          "error": req.query.error ? req.query.error : "",
          "url": req.url
      });

      return;
      end.res();

      });
    
    } else {
      res.redirect("/login");
    }},

 // do-replay route - page video-page - view: watch - button reply ()
   doReplayPost:  (req, res)=>{

    if ( res.locals.currentUser._id) {

      var reply = req.body.reply;
      var commentId = req.body.commentId;
  
      getUser(res.locals.currentUser._id, function (user) {
        // delete user.password;
  


        var replyObject = {
          "_id": ObjectId(),
          "author": {
            "_id": user._id,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "image": user.image
          },
          "reply": reply,
          "createdAt": new Date().getTime()
        };
  
        Video.findOneAndUpdate({
          "comments._id": ObjectId(commentId)
        }, {
          $push: {
            "comments.$.replies": replyObject
          }
        }, function (error1, data) {
          res.json({
            "status": "success",
            "message": "Reply has been posted",
            "user": {
              "_id": user._id,
              "firstName": user.firstName,
              "lastName": user.lastName,
              "image": user.image
            },
            "reply": reply
          });
          res.end();
          return;
        });
      });
    } else {
      res.json({
        "status": "danger",
        "message": "Please login to perform this action."
      });

    }
    res.end();
    return;

  
  },


}