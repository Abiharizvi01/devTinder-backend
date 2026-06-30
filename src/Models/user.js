
import mongoose from "mongoose";
import validator from "validator";

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

export default mongoose.model("User",userSchema);