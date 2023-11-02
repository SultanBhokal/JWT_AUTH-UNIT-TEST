import { Request, Response } from "express";
import {  signUpType } from "../../types/auth/signup";
import { registerUser } from "../../models/auth/UserModel";
import crypto from "crypto";

export async function signUp(req: Request<{}, {}, signUpType>, res: Response) {
  try {
    const { username, email, password } = req.body;
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(password)
      .digest("base64");
    let newHashedPass = hash + "_$_" + salt;
    const result = await registerUser({
      username,
      email,
      password: newHashedPass,
    });
    return res
      .json({ data: [{ username, email }], msg: "Successfully registered ." , error:"",success:true})
      .status(200);
  } catch (error) {
    return res.json({ msg: "Internal Server Error",error:"Please try again , Internal server error",data:[], success:false}).status(500);
  }
}


