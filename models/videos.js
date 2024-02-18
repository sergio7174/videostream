const 
mongoose = require("mongoose"), 
passportLocalMongoose = require("passport-local-mongoose"),
User = require("../models/user");

VideoSchema = new mongoose.Schema({
	

    firstName: String,
    lastName: String,
    email: String,
    id: String,
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

    comments:[{ _id: String,

          author:{ 
                   _id: String,
                  firstName: String,
                  lastName: String },

                  comment: String,
                  createAt: String,

                  
                  replies:[{
                    
                    _id: String,

                    author:{ 
                      _id: String,
                      firstName: String,
                      lastName: String },
                      
                      reply: String,
                      createAt: String,
                  }] 




      }],},
  {
    // The timestamps property lets Mongoose know to include the createdAt and updatedAt 
    // values, which are useful for keeping records on how and when data changes
    timestamps: true
  });

VideoSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});
// Apply the passport-local mongoose module as a plugin to the user schema.
/*VideoSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});*/
module.exports = mongoose.model("Videos",VideoSchema);