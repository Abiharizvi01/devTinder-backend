
import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema=new mongoose.Schema({
    firstName: {
        type:String,
        required:true
    },
    lastName: {
        type: String
    },
    emailId:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address:"+value);
            }
        },
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Invalid password:"+value);
            }
        },
    },
    age:{
        type:Number
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("gender data is not valid");  
            }
        }
    },
    photourl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photoURL:"+value);
            }
        },
    },
    about:{
        type:String
    },
    skills:{
        type:[String]
    }
},
{
    timestamps:true
});


userSchema.methods.getJWT=async function(){
    const user=this;//here in this that obj will be stored that called it

    const token=await jwt.sign({_id:user._id},process.env.JWT_SECRET,{
        expiresIn: "7d",
    });

    return token;
};

userSchema.methods.validatePassword=async function(passwordinputbyuser){
    const user=this;
    const hashedPassword=user.password;
    const isPasswordValid=await bcrypt.compare(passwordinputbyuser,hashedPassword);
    return isPasswordValid;
};
export default mongoose.model("User",userSchema);