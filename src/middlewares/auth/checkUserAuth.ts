import { Request, Response, NextFunction } from "express";
import { loginType } from "../../types/auth/signup";
import { getUserByEmail } from "../../models/auth/UserModel";
import crypto from "crypto";
import jwt,{TokenExpiredError} from "jsonwebtoken"

const privateKey = `-----BEGIN PRIVATE KEY-----
MIHuAgEAMBAGByqGSM49AgEGBSuBBAAjBIHWMIHTAgEBBEIBK/nM70aSp4Y2ZeJg
B6GIe4YbgIoQojtRdhbZpnfSZcsJaOgnMlRFkzAEmvHtF08AaeJG9mASQB4k0x0H
dgajcUShgYkDgYYABADIu4preCS9PSr18DN+4cqdna75mNDbtz7IO2AQw+Ugu77p
i96FCIlUwZ6qyNyGLUQEnh40x0WaYL+8cugfQqnD7gDmndkaDAFyR3DhVeMnc5HN
8ROB6MsJX2c2NZcDo+yVosSM2jlYn9g3TigtTfjbjyuBhYFAhW7Uw0zNLoFL0gzK
1Q==
-----END PRIVATE KEY-----`;

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQAyLuKa3gkvT0q9fAzfuHKnZ2u+ZjQ
27c+yDtgEMPlILu+6YvehQiJVMGeqsjchi1EBJ4eNMdFmmC/vHLoH0Kpw+4A5p3Z
GgwBckdw4VXjJ3ORzfETgejLCV9nNjWXA6PslaLEjNo5WJ/YN04oLU34248rgYWB
QIVu1MNMzS6BS9IMytU=
-----END PUBLIC KEY-----`;

export const checkUserAuth = async (
  req: Request<{}, {}, loginType>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ msg: "Please enter email and password",error:"",success:false,data:[] }).status(409);
    }
    const userDetails = await getUserByEmail(email);
    if (userDetails === null) {
      return res.json({ msg: "Please check email or password",error:"",success:false,data:[] }).status(200);
    }

    let splitUserPassword = userDetails.password?.split("_$_");
    if (splitUserPassword) {
      let salt = splitUserPassword[1];
      let hash = crypto
        .createHmac("sha512", salt)
        .update(password)
        .digest("base64");

      if (hash === splitUserPassword[0]) {
        (req as any).user = userDetails;
        next();
        return
      }
    }
    return res.json({ msg: "Please check email or password",error:"",success:false,data:[] }).status(200);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Internal Server Error", msg:"",success:false,data:[] }).status(500);
  }
};


export const verifyToken = (req: Request<{}, {}, loginType>, res: Response, next: NextFunction) => {
  try {
    const headers = req.headers.authorization;
    const bearer = headers?.split(" ")
    if (bearer && bearer[1]) {
      try {
        const token = bearer[1]
        const decryptToken = jwt.verify(token, publicKey, { algorithms: ["ES512"] });
        (req as any).user = decryptToken
        next()
      } catch (error) {
        if(error instanceof TokenExpiredError ){
          return res.json({msg:"",error:"Token Expired",success:false,data:[]}).status(401)
        }
        return res.json({msg:"",error:"Something went wrong please try again",success:false,data:[]}).status(404)
      }
    }
    else {
      return res.json({ error: "Please login ", msg: "", data: [] ,success:false}).status(404)
    }
  } catch (error) {
    console.log(error)
    return res.json({ error: "Internal Server Error OR Please login to continue", msg: "", data: [],success:false }).status(500);
  }
}
