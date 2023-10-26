const jwt=require('jsonwebtoken');
require("dotenv").config();


exports.auth=(req,res,next)=>{
    try{
        //  There are several ways to handle an extract token from body,header and cookie-parser
     
        /*
        console.log(req.cookies.token)
        console.log(req.header("Authorization").replace("Bearer",""));
        */
       
        const token=req.body.token;

        if(!token)
        {
            return res.status(401).json({
                success:false,
                message:"Token Misssing"
            });
        }

        // verify token
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        }
        catch(error){
            return res.status(401).json({
                success:false,
                message:"token is invalid",
            });
        }
    next();

    }
    catch(error)
    {
        return res.status(401).json({
            success:false,
            message:"This is protected route and something went wrong",
        });
    }
}


exports.isStudent=(req,res,next)=>{
    try
    {
        if(req.user.role !=="Student")
        {
            return res.status(401).json({
                success:false,
                message:"This is not  protected route for student ",
            });
        
        }

        next();

    }

    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"User Role is not matching ",
        })
    }
}

exports.isAdmin=(req,res,next)=>{
    try{
        if(req.user.role!=="Admin")
        {
            return res.status(401).json({
                success:false,
                message:"This is  not a protected route for Admin",
            });
        }
       next();
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"User Role is not matching",
        });

    }
}