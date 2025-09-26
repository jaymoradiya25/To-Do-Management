import express from "express";
import { signIn, signUp } from "../controllers/auth.controller";

const route = express.Router();

route.post("/sign-in", signIn);
route.post("/sign-up", signUp);

export default route