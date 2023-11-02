import {mongoose} from "../../service/mongooseService";
import { signUpType } from "../../types/auth/signup";

const Schema = mongoose.Schema

const userSchema = new Schema({
    username:String,
    password:String,
    email:String
})


const userModel = mongoose.model('user',userSchema);

export const registerUser = (data:signUpType)=>{
    const newUser = new userModel(data);
    return newUser.save()
}

export const getUserByEmail = (email:string)=>{
    return userModel.findOne({email})
}

export const updatePasswordById = (id:string,password:string)=>{
    return userModel.findByIdAndUpdate({_id:id},{password:password})
}

export const updateUsernameById = (id:string,username:string)=>{
    return userModel.findByIdAndUpdate({_id:id},{username:username})
}

export const updateEmailById = (id:string,email:string)=>{
    return userModel.findByIdAndUpdate({_id:id},{email:email})
}

export const deleteUserByEmail = (email:string)=>{
    return userModel.deleteOne({email})
}