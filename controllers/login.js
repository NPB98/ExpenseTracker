const User=require('../models/user');
const bcrypt=require('bcrypt');
const express = require('express');
const jwt=require('jsonwebtoken');

const addUser = (req,res,next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if(name==undefined||name.length===0||email==null||email.length===0||password==null||password.length===0){
      return res.status(400).json({err:'Something is missing'});
    }
    const saltRounds=10;
    bcrypt.hash(password,saltRounds,(err,hash)=>{
      console.log(name,email,password);
      const response= User.create({
        name:name,
        email:email,
        password:hash
     })
     .then((response)=>{
        return res.status(201).json({message:"Successfully created a new user"});
     })
  .catch((err)=> {
     return res.status(500).json({err:"User Already Exists"});
  })
 })
} 

function generateAccessToken(id,name,isPremiumUser){
  return jwt.sign({userId:id,name:name,isPremiumUser},process.env.TOKEN_SECRET)
}

 const loginUser=async(req,res,next)=>{
  try{
  const email=req.body.email;
  const passWord=req.body.password;
  //console.log(email);
  const user=await User.findAll({where:{email}})
  //console.log(user);
    if(user.length>0){
      bcrypt.compare(passWord,user[0].password,(err,response)=>{
        //console.log(response);
        if(err){
          res.status(500).json({success:false,message:"Something went wrong"});
        }
        if(response===true){
          res.status(200).json({success:true, message:"User logged in successfully",token:generateAccessToken(user[0].id,user[0].name,user[0].isPremiumUser)});
        }
        else{
          res.status(401).json({success:false,message:"User not authorized"});
        }
      })
    }
    else{
      res.status(404).json({success:false,message:"User not found"});
    }
  }
  catch(err){
    res.status(500).json({success:false,message:err});
  }
 }
 module.exports={
  addUser,
  loginUser
 }