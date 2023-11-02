import { Request, Response } from "express"
import { userPasswordUpdateBody, userUpdateEmailBody, userUsernameUpdateBody } from "../../types/user/userTypes"
import { checkEmailFormat, checkPasswordFormat } from "../../utils/validations";
import { getUserByEmail, updateEmailById, updatePasswordById, updateUsernameById } from "../../models/auth/UserModel";
import crypto from "crypto"


export const updateEmail = async (req: Request<{}, {}, userUpdateEmailBody>, res: Response) => {
    try {
        const { email, updateEmail } = req.body;
        if (!checkEmailFormat(updateEmail)) {
            return res.json({ msg: "Email not valid", error: "", data: [] }).status(200)
        }
        const { id } = (req as any).user
        const emailInDb = await getUserByEmail(updateEmail)
        if (emailInDb !== null) {
            return res.json({ msg: "please try different email id", error: "", data: [] }).status(200)
        }
        const results = await updateEmailById(id, updateEmail)
        return res.json({ msg: "Successfully updated", error: "", data: [results] }).status(200)

    } catch (error) {
        return res.json({ msg: "", error: "Internal Server Error", data: [] }).status(500)
    }
}

export const updatePassword = async (req: Request<{}, {}, userPasswordUpdateBody>, res: Response) => {
    try {
        const {newPassword} = req.body
        console.log(checkPasswordFormat(newPassword))
        if(!checkPasswordFormat(newPassword)){
            return res.json({msg:"password should contain atleast 1 new special char 1 number and total length should be more than or equal to 6"}).status(409)
        }
        const {id} = (req as any).user
        let salt = crypto.randomBytes(16).toString("base64");
        let hash = crypto
          .createHmac("sha512", salt)
          .update(newPassword)
          .digest("base64");
        let newHashedPass = hash + "_$_" + salt;
        const results = await updatePasswordById(id,newHashedPass)
        return res.json({msg:"successfully updated",error:"",data:[results]}).status(200)

    } catch (error) {
        console.log(error)
        return res.json({ msg: "", error: "Internal Server Error", data: [] }).status(500)
    }
}

export const updateUsername = async (req: Request<{}, {}, userUsernameUpdateBody>, res: Response) =>{
    try {
        const {newUsername } = req.body;
        if(newUsername && newUsername.length){
            const {id} = (req as any).user
            const results = await updateUsernameById(id,newUsername)
            return res.json({msg:"Succesfully updated",error:"",data:[results]}).status(200)
        }
        return res.json({error:"",msg:"Provide username to update"}).status(409)

    } catch (error) {
        return res.json({ msg: "", error: "Internal Server Error", data: [] }).status(500)
    }
}