import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { createToDo, getAllTodoByUser, updateToDo, deleteToDo, getToDoByDate, getToDoByDateRange, updateToDoStatus } from "../controllers/todo.controller";
const route = express.Router();

route.post("/add-todo", verifyToken, createToDo);
route.get("/get-todo-by-user", verifyToken, getAllTodoByUser);
route.get("/get-todo-by-date", verifyToken, getToDoByDate);
route.get("/get-todo-by-date-range", verifyToken, getToDoByDateRange);
route.put("/update-todo", verifyToken, updateToDo);
route.put("/update-todo-status", verifyToken, updateToDoStatus);
route.delete("/delete-todo/:id", verifyToken, deleteToDo);

export default route;