const router = require("express").Router();
const mongoose = require("mongoose")
const bodyparser = require("body-parser")
const morgan = require("morgan")
var cors = require('cors')

const express = require("express")
var bcrypt = require('bcryptjs');

require("../../mongo")  //return data from mongo.js file

router.use(express.json({inflate: true,
     limit: '200kb',
     reviver: null,
     strict: true,
     type: 'application/x-www-form-urlencoded',
     verify: undefined}))
require("../../model/Post")
const Post = mongoose.model("signup")
router.use(bodyparser.json())
router.use(cors())

//router.use(morgan())
//app.use(logger('combined'));


//router.use(bodyparser.urlencoded({ extended: true }))
router.use(bodyparser.urlencoded({ extended: true }));
router.use(bodyparser.json())

console.log("data start")
router.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin", "*");
     res.header(
       "Access-Control-Allow-Headers",
       "Origin, X-Requested-With, Content-Type, Accept, Authorization"
     );
     if (req.method === "OPTIONS") {
       res.header(
         "Access-Control-Allow-Headers",
         "Origin, X-Requested-With, Content-Type, Accept, Authorization"
       );
       res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
       return res.status(200).json({});
     }
     next();
   });
   
router.get("/adminExtractAllData", async (req, res) => {
    try{
         const posts =  await Post.find({})
         console.log("extractAllData done")
         //res.header("Access-Control-Allow-Origin", "*");
         //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
         res.send(posts)

    } catch (error){
         console.log("error gen")
         res.status(500)

    
}});

//extractData
router.post("/adminExtractSingleData",  async(req,res) => {
     try{
          var data = req.body;
          //var name = req.body;
          console.log("data", data)
          const posts =  await Post.findOne({"name": data.name})
          
          res.send(posts)
          // console.log("req data", req.body)
          // const post = await Post.findOne({ _id:req.body});
          // res.send(post)
     }catch(error){
          res.status(500);
     }
     
     
 })


//update data
router.post("/adminUpdateData", async(req, res) =>{
    try{
         console.log("data",req.body)
         const post = await Post.findByIdAndUpdate({
              _id: req.body.id
         }, req.body, {
              new:true, 
              runValidators:true
         })
         res.send(post)
    }catch(error){
         res.send(500)

    }
})


//delete data
router.post("/adminDeleteData", async (req, res) =>{
    try{
         console.log("name", req.body.id)
         const post = await Post.findByIdAndRemove({
              _id: req.body.id
         })
         res.send(post)
    }catch(error){
         res.send(500)
    }
})

router.post("/adminSignup", async (req, res) =>{
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

router.post("/adminLogin", async (req, res) =>{
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
