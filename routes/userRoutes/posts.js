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

router.post("/signup", async (req, res, next) =>{
    try{
         console.log("signup start")
    const posts = new Post();

    console.log("user")
    console.log('request data ->', req.body) //showing data in cmd
    posts.name = req.body.name;
    console.log(posts.name)
    posts.contact = req.body.contact;
    console.log(posts.contact)
    posts.email = req.body.email;
    console.log(posts.email)
    posts.password = req.body.password;
    console.log(posts.password)
    posts.save((err, result) =>{
         if (err){
              return res.status(400).json({
                   error : err
              })
         }
         res.status(200).json({
              post: result  //showing in postman (response) and save in database
         })
    }); 
    //res.json(posts)
    console.log("1")
    res.send(posts) // for showing the response
    console.log("2")
    }catch(error){
         console.log("error in post ")
         res.status(500)

    }
    next();
})

module.exports = router;
