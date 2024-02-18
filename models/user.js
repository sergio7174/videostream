"use strict";

const 
// You need to require mongoose in this module because both the schema and model
// use Mongoose methods to work
mongoose = require("mongoose"),
//{ Schema } = mongoose,
  Video = require("./videos"),
  // let bcrypt perform the hashing process through an algorithm
  bcrypt = require("bcrypt"),

  // connect your user model to the passport-local-mongoose module
  // which is where you’ll add a Passport.js plugin to the user schema
  passportLocalMongoose = require("passport-local-mongoose"),

  // Create a new schema with mongoose.Schema.
  userSchema = new mongoose.Schema(
    {
  // add schema properties
     
        firstName: {
          type: String,
          trim: true
        },
        lastName: {
          type: String,
          trim: true
        }
      ,
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
      },
      password: {
        type: String,
        required: true,
       
      },
      videos:[{ 

    _id: String,
    image: String,
    filePath: String,
    createdAt: Date,
    views: Number,
    watch: Number,
    minutes: Number,
    seconds: Number,
    hours: Number,
    title: String,
    description: String,
    tags: String,
    category: String,
    thumbnail: String,
        



      }],
      image: String,
    },
    {
      // The timestamps property lets Mongoose know to include the createdAt and updatedAt 
      // values, which are useful for keeping records on how and when data changes
      timestamps: true
    }
  );

  // Adding a virtual attribute to the user model  
// Mongoose virtual attribute to store that data for each instance,
// Add a virtual attribute to get the user’s full name. 
userSchema.virtual("fullName").get(function() {
  return `${this.firstName} ${this.lastName}`;
});


// Apply the passport-local mongoose module as a plugin to the user schema.
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});
// schema is defined, you need to apply it to a model and export it
module.exports = mongoose.model("User", userSchema);
