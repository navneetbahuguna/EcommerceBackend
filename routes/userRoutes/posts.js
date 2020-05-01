const router = require("express").Router();
const mongoose = require("mongoose")
const bodyparser = require("body-parser")
const morgan = require("morgan")
const express = require("express")

require("../../mongo")  //return data from mongo.js file

router.use(express.json({inflate: true,
     limit: '200kb',
     reviver: null,
     strict: true,
     type: 'application/x-www-form-urlencoded',
     verify: undefined}))//require("../model/Post")
require("../../model/Post")

const Post = mongoose.model("signup")
router.use(bodyparser.json())
//router.use(morgan())
router.use(express.json())
console.log("data start")


router.post("/userSignup", async (req, res) =>{
     Post.findOne({"email": req.body.email})
           .then(userDoc => {
                if(userDoc){
                     console.log("email exist")
                     res.send("Email Exist")
                }else {
                //this.post.save()
                const posts = new Post();
                console.log("Admin enter data api")
                console.log('request data ->', req.body) //showing data in cmd
                posts.name = req.body.name;
                console.log(posts.name)
                posts.contact = req.body.contact;
                console.log(posts.contact)
                posts.email = req.body.email;
                console.log(posts.email)
                pass = req.body.password;
                console.log(pass)
                newpass = bcrypt.hashSync(pass, 12)
                posts.password = newpass;
                console.log(posts.password)
                posts.save()
                res.send("data inserted")
               
                }
     }).catch(err => {
          console.log("error in post ")
          //res.status(500)
 
     });
 
 })
 
 router.post("/userLogin", async (req, res) =>{
      const posts = new Post();
      console.log("Admin login data api")
      console.log('request data ->', req.body) //showing data in cmd
      
      posts.email = req.body.email;
      console.log(posts.email)
      password = req.body.password;
      console.log(password)
      Post.findOne({"email": req.body.email})
            .then(userDoc => {
                 //console.log("")
                 if(!userDoc){
                      //console.log("email exist")
                      res.send("Email not exist Exist")
                 }
                 //this.post.save()
                 else{
                      console.log("password matching")
                      bcrypt.compare(password, userDoc.password)
                      .then(doMatch =>{
                           console.log("password match")
                          //  req.session.isLoggedIn = true;
                          //  req.session.user = userDoc;
                          //  req.session.save(err =>{
                          //       console.log(err);
                          //       res.send("save session");
                          //  })
                           res.send("AdminLogin")
                      })
                  
                 }
      }).catch(err => {
           console.log("error in post ")
           //res.status(500)
  
      });
  
  })
module.exports = router;
