import {Request,Response,NextFunction} from "express"
import {signUpType} from "../../types/auth/signup"
import { getUserByEmail } from "../../models/auth/UserModel";
import { checkEmailFormat, checkPasswordFormat } from "../../utils/validations";

export async function validate(req:Request<{},{},signUpType>,res:Response,next:NextFunction){
    try {
        const {email,username,password} = req.body;
        const getEmail = await getUserByEmail(email);
        if(getEmail !== null){
            return res.json({msg:"Email Already Exists",data:[],error:"",success:false}).status(409)
        }
        if(!checkEmailFormat(email)){
            return res.json({msg:"Your email address is denied , Please enter valid email",error:"",success:false,data:[]}).status(400)
        }
        if(!checkPasswordFormat(password)){
            return res.json({msg:"Password should be of min 6 character with one special and one uppercase and one number",data:[],error:"",success:false}).status(535)
        }
        if(!username){
            return res.json({msg:"All fields are require",data:[],error:"",success:false}).status(400)
        }
        next()
    } catch (error) {
        console.log(error)
        return res.json({msg:"Internal Server Error",success:false,error:error,data:[]}).status(500)
    }
}
