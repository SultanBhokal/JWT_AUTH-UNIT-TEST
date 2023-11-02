import { Response, Request } from "express";
import { loginType } from "../../types/auth/signup";
import jwt, { TokenExpiredError } from "jsonwebtoken";

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

interface myPayload {
    id: string,
    username: string,
    email: string
}

export const login = (req: Request<{}, {}, loginType>, res: Response) => {
    try {
        const user = (req as any).user;
        const { email, username } = user;
        if (user !== null || user !== undefined) {
            const payload = {
                email,
                username,
                id: user._id,
            };
            const token = jwt.sign(payload, privateKey, {
                algorithm: "ES512",
                expiresIn: "5h",
            });
            const refreshToken = jwt.sign(payload, privateKey, {
                expiresIn: "1d",
                algorithm: "ES512",
            });
            res.cookie("rToken", refreshToken, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            return res.json({
                accessToken: token,
                msg: "Successfully Logged In , Please use the token as Authorization Bearer , e.g Authorization :Bearer yourtoken",
                error: "",
                data: [],
                success: true
            });
        }

        throw "Error , no user found";
    } catch (error) {
        console.log(error);
        return res.json({ error: "Internal Server Error", msg: "", data: [],success:false }).status(500)
    }
};

export const refreshToken = (req: Request<{}, {}, loginType>, res: Response) => {
    try {
        const rToken = req.cookies.rToken;
        const decryptToken = jwt.verify(rToken, publicKey) as myPayload
        const { email, username, id } = decryptToken
        const accessToken = jwt.sign({ email, username, id }, privateKey, { algorithm: "ES512", expiresIn: "5h" })
        return res.json({ token: accessToken, msg: "New Token use as bearer", error: "", data: [],success:true })
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.json({ msg: "", error: "Please login ", data: [],success:false }).status(401)
        }
        return res.json({ msg: "", error: "Please login ... Internal Server Error ", data: [],success:false }).status(500)
    }
}


export const logout = (req: Request<{}, {}, loginType>, res: Response) => {
    try {
        res.cookie('rToken', null, {
            expires: new Date(0)
        })
        return res.json({ msg: "Logout Successfull" }).status(200)
    } catch (error) {
        return res.json({ error: "Internal Server Error", msg: "", data: [] }).status(500)
    }
}
