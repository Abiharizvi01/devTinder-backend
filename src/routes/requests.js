import express from "express";
import userAuth from "../middlewares/auth.js";

const requestRouter=express.Router();

requestRouter.post("/sendConnectionRequest",userAuth,(req,res)=>{
    const user=req.user;
    res.send(user.firstName + "sent a connection request");
});

export default requestRouter;