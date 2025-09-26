import express from "express";
import authRoute from "./auth.routes";
import toDoRoute from "./todo.routes";

const route = express.Router();

route.use(
    "/",
    authRoute,
    toDoRoute
)

export default route