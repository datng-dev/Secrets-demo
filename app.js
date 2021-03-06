require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const alert = require("alert");
const encrypt = require("mongoose-encryption");

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
   email: String,
   password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

app.get('/' , (req , res)=>{

   res.render("home");

});

app.get('/login' , (req , res)=>{

   res.render("login");

});

app.post('/login' , (req , res)=>{

   User.findOne({email: req.body.username}, function(err, foundUser){

      if (err) {
         console.log(err);
      } else {
         if (foundUser) {
            if (foundUser.password === req.body.password) {
               res.render("secrets");
            } else {
               res.redirect("/login");
            }
         }
      }

   });

})

app.get('/register' , (req , res)=>{

   res.render("register");

});

app.post('/register' , (req , res)=>{

   const newUser = new User({
      email: req.body.username,
      password: req.body.password
   });

   newUser.save(function(err){
      if (!err) {
         res.render("secrets");
      } else {
         console.log(err);
      }
   })

})

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})