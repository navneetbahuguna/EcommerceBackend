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
     verify: undefined}))
require("../../model/Post")
const Post = mongoose.model("signup")
router.use(bodyparser.json())
//router.use(morgan())
//app.use(logger('combined'));


//router.use(bodyparser.urlencoded({ extended: true }))
router.use(bodyparser.urlencoded({ extended: true }));
router.use(bodyparser.json())

console.log("data start")

router.get("/extractAllData", async (req, res) => {
    try{
         const posts =  await Post.find({})
         console.log("extractAllData done")
         res.send(posts)

    } catch (error){
         console.log("error gen")
         res.status(500)

    
}});

//extractData
router.post("/extractSingleData",  async(req,res) => {
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
router.post("/update", async(req, res) =>{
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
router.post("/delete", async (req, res) =>{
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

router.post("/enterData", async (req, res) =>{
    const posts = new Post();
    console.log("Admin enter data api")
    console.log('request data ->', req.body) //showing data in cmd
    posts.name = req.body.name;
    console.log(posts.name)
    posts.contact = req.body.contact;
    console.log(posts.contact)
    posts.email = req.body.email;
    console.log(posts.email)
    posts.password = req.body.password;
    console.log(posts.password)
    Post.findOne({"email": req.body.email})
          .then(userDoc => {
               if(userDoc){
                    console.log("email exist")
                    res.send("Email Exist")
               }
               //this.post.save()
               posts.save((err, result) =>{
                    if (err){
                         return res.status(400).json({
                              error : err
                         })
                    }
                    res.status(200).json({
                     post: result,
                       })
               }); 
         
    }).catch(err => {
         console.log("error in post ")
         //res.status(500)

    });

})

module.exports = router;
