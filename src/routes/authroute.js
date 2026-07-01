import express from "express";
import User from "../Models/user.js";
import validateSignUpData from "../utils/validation.js";
import bcrypt from "bcrypt";

const authRouter=express.Router();

authRouter.post("/signup",async (req,res)=>{

    // const user=new User({
    //     firstName:"Abiha",
    //     lastName:"Rizvi",
    //     emailId:"abiha@gmail.com",
    //     password:"password1234"
    // });
    try{
        validateSignUpData(req);

        const {firstName,lastName,emailId,password}=req.body;

        const passwordHash=await bcrypt.hash(password,10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash,
        });
        await user.save();
        res.send("data added successfully");
    }catch(err){
        res.status(400).send("Error saving the user "+err.message);
    }
    //const users = await User.insertMany(req.body);
    
});

authRouter.post("/login",async(req,res)=>{

    try{
       
        const {emailId,password}=req.body;

        const user=await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid EmailId");
        }

        //const isPasswordValid=await bcrypt.compare(password,user.password);
        const isPasswordValid=await user.validatePassword(password);
        if(isPasswordValid){

            // const token=await jwt.sign({_id:user._id},process.env.JWT_SECRET,{
            //     expiresIn: "7d",
            // });
            const token=await user.getJWT();
            res.cookie("token",token,{
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
            res.send("Login Successfully");
        }else{
            throw new Error("Password is Invalid");
        }
    }catch(err){
        res.status(400).send("ERROR"+err.message);
    }
});

export default authRouter;