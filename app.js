//jshint esversion:6
//////default
require('dotenv').config();//environment variable for encryption instal npm i dotenv
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const  encrypt = require('mongoose-encryption');//ecryption purpose
const app = express();



app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
//////default

mongoose.connect("mongodb://localhost:27017/userDB",{userNewUrlsParser: true,useUnifiedTopology: true});
//user scheman
//simple jave script schema
// const userSchema={
//   email:String,
//   password:String,
// };
const userSchema = new mongoose.Schema({
  email:String,
   password:String,
});
//const secret = "thisisourlonglittlesecret.";
userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);
app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      sonsole.log(err);
    }else{
      res.render("secrets");
    }
  });
})
app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username},function(err, foundUser){
    if (err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  })
})
////default
app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000.");
});
