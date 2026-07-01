import jwt from "jsonwebtoken";
import User from "../Models/user.js";

const userAuth=async(req,res,next)=>{
    try{
        const{token}=req.cookies;
        if(!token){
            throw new Error("token is not valid");
        }
        const decodedObj=await jwt.verify(token,process.env.JWT_SECRET);

        const {_id}=decodedObj;

        const user=await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }

        req.user=user;
        next();
    }catch(err){
        res.status(401).send("Error" +err.message);
    }
};

export default userAuth;