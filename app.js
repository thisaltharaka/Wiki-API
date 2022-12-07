const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public")); //use public library to store public files such as styles sheets

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//mongoose
const mongoose = require('mongoose');
//MongoDB Atlas
// mongoose.connect('mongodb+srv://admin-thisal:Ch%40nG31T@cluster0.rtoqjvk.mongodb.net/wikiDB', {
//   useNewUrlParser: true
// });

//MongoDB local
mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true
});

const {
  Schema
} = mongoose;

const articleSchema = new Schema({
  title: {
    type: String,
    required: [true, "Blog Post Title Empty !"] //validation
  },
  content: {
    type: String,
    required: [true, "Blog Post content is Empty !"] //validation
  }
});

const Article = mongoose.model('Article', articleSchema);

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// app.get("/articles", (req, res)=>{
//   Article.find((err, foundArticles) => {
//     console.log(foundArticles);
//     if (!err) {
//       res.send(foundArticles);
//     } else {
//       res.send(err);
//     }
//   });
// });
//
// app.post("/articles",(req,res)=>{
//   console.log(req.body.title);
//   console.log(req.body.content);
//
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content
//   });
//
//   newArticle.save((err)=>{
//     if(!err){
//       res.send("Article is succesfully added !");
//     }else {
//       res.send("There is an error when saving the article");
//     }
//   });
// });
//
// app.delete("/articles", (req,res)=>{
//   Article.deleteMany((err)=>{
//     if(!err){
//       res.send("Succesfully deleted all articles !");
//     }
//       else{
//         res.send(err);
//       }
//
//   });
// });

////////using route ///////
app.route("/articles")
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      console.log(foundArticles);
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save((err) => {
      if (!err) {
        res.send("Article is succesfully added !");
      } else {
        res.send("There is an error when saving the article");
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Succesfully deleted all articles !");
      } else {
        res.send(err);
      }

    });
  });

  app.route('/articles/:blogPostTitle')
  .get(function(req, res) {
    //  res.send(req.params)
    //console.log(req.params);
  ///////////////////////////////////////////
  Article.findOne({title:req.params.blogPostTitle}, function(err, selectedBlogPost) {
    if (err) {
      console.log(err);
    } else {
        if(!selectedBlogPost){
          //create a new list
          console.log("Blog post does not exists");
          res.send("Blog post does not exists");
        }
        else{
          res.send(selectedBlogPost);
        }

    }
  });
  ///////////////////////////////////////////
  })
  .put((req,res)=>{
    Article.replaceOne(
      {'title': req.params.blogPostTitle},
      {title: req.body.title, content: req.body.content},
      {upsert: true},
      (err,doc)=>{
        if (err) return res.send(500, {error: err});
        return res.send('Succesfully saved.');
        }
    );
  })
  .patch((req,res)=>{
    Article.updateOne(
      {'title': req.params.blogPostTitle},
      {title: req.body.title, content: req.body.content},
      {upsert: true},
      (err,doc)=>{
        if (err) return res.send(500, {error: err});
        return res.send('Succesfully saved.');
        }
    );
  })
  .delete((req,res)=>{
    Article.deleteOne({'title': req.params.blogPostTitle}, (err)=>{
      if(!err){
        res.send("Deleted the document succesfully");
      }
      else {
        res.send(err);
      }
    });
  });



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
