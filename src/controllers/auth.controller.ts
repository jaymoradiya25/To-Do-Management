import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { generateToken } from "../middlewares/auth.middleware";
import { hashPassword, comparePassword } from "../helpers/validation";

export const signUp = async (req: Request, res: Response) => {
    try {

        let { userName, password, email } = req.body
        if (!userName || !password || !email) return res.status(400).send({ code: 400, error: "All field are mandatory" })

        let existUser = await UserModel.findOne({ userName: userName });
        if (existUser) return res.status(409).send({ code: 409, error: "Username already exist" })

        let hashPass = await hashPassword(password)
        let newUser = await UserModel.create({ userName: userName, email: email, password: hashPass })
        let token = await generateToken({ _id: newUser._id, email: newUser.email, userName: newUser.userName })

        return res.status(201).send({ code: 201, message: "Sign Up success", token })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Error in Sign Up", error: error })
    }
}


export const signIn = async (req: Request, res: Response) => {
    try {

        let { userName, password } = req.body
        if (!userName || !password) return res.status(400).send({ code: 400, error: "All field are mandatory" })

        let existUser = await UserModel.findOne({ userName });
        if (!existUser) return res.status(404).send({ code: 404, error: "User dosen't exist" })

        let compare = await comparePassword(password, existUser.password as string);
        if (!compare) return res.status(400).send({ error: "Invalid password", code: 400 })

        let token = await generateToken({ _id: existUser._id, email: existUser.email, userName: existUser.userName });
        return res.status(200).send({ code: 200, message: "Sign In success", token })

    } catch (error) {
        return res.status(500).send({ code: 500, message: "Error in Sign In", error })
    }
}