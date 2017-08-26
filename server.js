/* Scrape and Display
 * (If you can do this, you should be set for your hw)
 * ================================================== */

// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");

// const Note = require("./models/Note.js");
// const Article = require("./models/Article.js");

// Our scraping tools
const request = require("request");
const cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
const app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/dev-start-scraping-the-news");
const db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Routes
// ======

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.echojs.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {

      // Save an empty result object
      const result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      const entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });
    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {

  // TODO: Finish the route so it grabs all of the articles
  Article.find({}, function(err, docs) {
      if (err) {
        res.send(err);
      }
      else {
        res.send(docs);
      }
    });
});
// This will grab an article by it's ObjectId

// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
// TODO
// save the new note that gets posted to the Notes collection
// then find an article from the req.params.id
// and update its "note" property with the _id of the new note
  
const newNote = new Note(req.body);
  
  Article.save(function(err, docs) {
    if (err) {
      res.send(err);
    }
      Article.findOneAndUpdate({"_id": req.params.id}, {"comment": docs._id}, function(err, docs) { //because we only have one note, we don't need to use $push into an array, look at Article schema, can use an array and push to add more than one
        // instead of this callback, can use a .exec(function etc.))
        if (err) {
          res.send(err);
        }
        else {
          res.send(docs); // this docs is the one in the findOneAndUpdate callback, the one in the "save" callback is inaccessible to us at this point
        }
      });
  });
});
  

app.get("/articles/:id", function(req, res) {
  // TODO
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  Article.findOne({id: req.params.id})
  
  .populate("comment")
  .exec(function(err, docs) {
    if (err) {
      res.send(err);
    }
    else {
      res.send(docs);
    }
  });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
