import validator from "validator";

const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName ||  !lastName){
        throw new Error("please enter name");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("please enter a strong password");
    }
};

export default validateSignUpData;