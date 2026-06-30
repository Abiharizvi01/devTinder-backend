//express js is a open source framework of node js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/database.js"; // Note: In ES Modules, adding the .js extension is required!
import User from "./Models/user.js"
import validateSignUpData from "./utils/validation.js";
import bcrypt from "bcrypt";

const app = express();
const PORT = 7777;

app.use(express.json());

app.post("/signup",async (req,res)=>{

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

app.post("/login",async(req,res)=>{

    try{
       
        const {emailId,password}=req.body;
    }catch(err){
        res.status(400).send("ERROR"+err.message);
    }
});

app.get("/user", async (req, res) => {

    const userEmail = req.body.emailId;

    try {
        const users = await User.find({ emailId: userEmail });

        if (users.length === 0) {
            return res.status(404).send("User not found");
        }

        res.send(users);

    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});

app.delete("/deleteuser",async(req,res)=>{

    const userId=req.body.userId;

    try{
        const user=await User.findByIdAndDelete({_id:userId});
        res.send("user deleted successfully");
    }catch(err){
        res.status(400).send("user not found")
    }
});

app.patch("/updateuser/:userId",async(req,res)=>{

    const userId=req.params?.userId;
    const data=req.body;
 
    try{
        const ALLOWED_UPDATES=[
            "photourl",
            "age",
            "skills",
            "about",
            "gender"
        ];
        const isUpdateAllowed = Object.keys(data).every(k =>
            ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed){
            throw new Error("Update is not allowed")
        }
        if(data?.skills.length>10){
            throw new Error("skills cant be more than 10");
        }
        const user=await User.findByIdAndUpdate(userId,data,{runValidators:true});
        res.send("user updated succsessfully");
    }catch(err){
        res.status(400).send("UPDATE FAILED:"+err.message);
    }
});
console.log(process.env.MONGODB_URI);
// Establish connection before spinning up the server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running beautifully on port ${PORT}...🚀`);
        });
    })
    .catch((err) => {
        console.error("Server failed to start due to a DB issue:", err);
    });