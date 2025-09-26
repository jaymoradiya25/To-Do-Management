import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.model";
import jwt from "jsonwebtoken";

export const generateToken = async (data: object) => {
    let token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1d" })
    return token;
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const accessToken = req.headers["authorization"];
        const bearerToken = accessToken?.split(" ")[1];

        if (accessToken) {
            let payload = jwt.verify(bearerToken, process.env.JWT_SECRET)
            if (!payload) return res.status(404).send({ error: "Authorization Invalid", code: 404 })

            req["user"] = payload

            let existUser = await UserModel.findOne({ userName: req["user"].userName });
            if (!existUser) return res.status(404).send({ code: 404, error: "User dosen't exist" })

            next();
        } else {
            return res.status(400).send({ code: 400, error: "No token provided" })
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Error in verify token", error })
    }
}