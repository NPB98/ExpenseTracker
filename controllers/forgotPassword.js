const uuid = require('uuid');
const bcrypt=require('bcrypt')
const Sib = require("sib-api-v3-sdk");
require('dotenv').config();
const jwt=require('jsonwebtoken');

const User = require('../models/user');
const ForgotPassword = require('../models/forgotPassword');

const client = Sib.ApiClient.instance;

const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;


const tranEmailApi = new Sib.TransactionalEmailsApi();
const sender = {
    email: 'nishibiswasroy@gmail.com',
}
exports.forgotPassword = async(req,res,next)=>{
    try{
        console.log(req);
    const email=req.body.email;
    console.log(email);
    const user= await User.findOne({where:email})
    if(user){
        const id=uuid.v4();
        console.log(id);
        await ForgotPassword.create({
            id:id,
            isActive:true,
            userId:1
        })
        .catch((err)=>{ throw new Error(err)});
    console.log(req);
    const receivers = [
        {
            email: req.body.email,
        },
    ]
    tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Subscribe to Cules Coding to become a developer',
        textContent:`
        Cules Coding will help us become a developer
        `,
        htmlContent: `
        <a href="http://localhost:4000/resetPassword/${id}">Reset password</a>`,
    })
    .then((response)=> {
      res.status(response[0].statusCode).json({message:'Link send to mail successfully',success:true});
    })
    .catch((err) =>{ throw new Error(err)});    
    }
    else{
        throw new Error('User do not exist');
    }
    }
    catch(err){
        return res.status(500).json({success:false,message:`${err}`})
    }
}
exports.resetpassword =  (req,res,next) =>{
    const id=req.params.id;
    ForgotPassword.findOne({where: {id:id} })
    .then((forgotPasswordRequest)=>{
        if(forgotPasswordRequest){
            forgotPasswordRequest.update({isActive:false});
            res.status(202).send(`<html>
            <script>
                function formsubmitted(e){
                    e.preventDefault();
                    console.log('called')
                }
            </script>
            <form action="/updatepassword/${id}" method="get">
                <label for="newPassword">Enter New password</label>
                <input name="newPassword" type="password" required></input>
                <button>Reset Password</button>
            </form>
        </html>`)
        res.end();
        }
    })
}

exports.updatePassword= (req,res,next)=>{
        try{
       const newPassword = req.query.newPassword;
       const resetPasswordId = req.params.resetPasswordId;
      
       ForgotPassword.findOne({where: {id: resetPasswordId}})
       .then((resetPasswordRequest) => {
         User.findOne({where: {id:resetPasswordRequest.userId}})
         .then((user) => {
           if(user){
               bcrypt.hash(newPassword,10, (err,hash) => {
               user.update({password:hash})
               .then(()=>{
                   res.status(201).json({message:"Successfully updates new password"});
               })
               .catch((err)=>{
                   throw new Error(err);
               })
                });
            }
            else{
                return res.status(404).json({error:"No User Exist", success:false});
            }
            })
        })
    }
   catch(err){
       return res.status(403).json({error:`${err}`,success:false});
   }
}

