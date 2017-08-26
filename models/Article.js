// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true,
    unique: true
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comments" // links us back to Comment.js
  }
});

// Create the Article model with the ArticleSchema
var Articles = mongoose.model("Articles", ArticleSchema);

// Export the model
module.exports = Articles;
