import express from "express";
import userAuth from "../middlewares/auth.js";

const profileRouter=express.Router();

profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
       res.send(req.user);
    }catch(err){
        res.status(400).send("ERROR" +err.message);
    }
});

export default profileRouter;