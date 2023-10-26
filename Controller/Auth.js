const bcrypt=require('bcrypt');
const User = require('../model/User');
const jwt=   require('jsonwebtoken');
require("dotenv").config;

// signup route handler

exports.signup=async(req,res)=>{
    try{

        // get data
        const{name,email,password,role}=req.body;

        // check if user already exist

        const existenceUser=await User.findOne({email});

        if(existenceUser)
        {
            return res.status(400).json({
                success:false,
                message:"User already exist",
            });
        }

        // secure password

        let hashedPassword;
         try
         {

            hashedPassword=await bcrypt.hash(password,10);
         }
         catch(err)
         {
            return res.status(500).json({
                success:false,
                message:"Error facing while encrpting the password",
            });

         }

        //  create entry into database 
        const user=await User.create({
            name,email,password:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message:'User created succesfully',
        });

    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registred ,please try again",
        });

    }
}


// login api route handler 

exports.login=async(req,res)=>{
    try
    {
        // fetch data
        const{email,password}=req.body;

        // validation on mail to check verify identification

        if(!email || !password)
        {
            return res.status(400).json({
                success:false,
                message:"Please fill the correct data",
            });
        }

        // check for registered user in database

        let user=await User.findOne({email});

        if(!user)
        {
            return res.status(401).json({
                success:false,
                message:"user not registred"
            });
        }

        // verify password and generate a jwt tocken

        const payload={
            email:user.email,
            id:user._id,
            role:user.role,
        };


        if(await bcrypt.compare(password,user.password)){
            let token=jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                expiresIn:"2h",
            });
            user=user.toObject();
            user.token=token;
            user.password=undefined;

            const options={
                expires:new Date(Date.now()+ 3* 24 * 60 * 60 * 1000),
                httpOnly:true,

            }
            res.cookie("new_token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User login succesfully",
                
            });

        }
    
        else
        {
            // password do not match

            return res.status(403).json({
                success:false,
                message:"Password Incoreect"
            });
        }

    }

    catch(error)
    {
        console.error(error);
        return res.status(500).json({
            status:false,
            message:"Sorry Failed to login database"
        });
    }
}

