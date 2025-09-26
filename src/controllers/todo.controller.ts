import { Request, Response } from "express";
import { ToDoModel } from "../models/todo.model";

export const createToDo = async (req: Request, res: Response) => {
    try {

        let { title, description, dueDate } = req.body
        if (!title || !description || !dueDate) {
            return res.status(400).send({ code: 400, error: "All field are mandatory" })
        }

        let newTodo = await ToDoModel.create({ title, description, reminderTime: req.body.reminderTime, dueDate: new Date(dueDate), addedBy: req["user"]._id })
        return res.status(201).send({ code: 201, message: "TO-DO create successfuly", data: newTodo });
    } catch (error) {
        return res.status(500).send({ message: "Error in create TO-DO", error: error, code: 500 })
    }
}

export const getAllTodoByUser = async (req: Request, res: Response) => {
    try {
        let toDoByUser = await ToDoModel.find({ addedBy: req["user"]._id }).sort({ createdAt: -1 });
        let total = await ToDoModel.countDocuments({ addedBy: req["user"]._id });

        return res.status(200).send({ code: 200, message: "TO-DO retrieve successfully", total, data: toDoByUser })
    } catch (error) {
        return res.status(500).send({ message: "Error in get all TO-DO by user", error: error, code: 500 });
    }
}

export const getToDoByDate = async (req: Request, res: Response) => {
    try {

        let { date } = req.query;

        const todos = await ToDoModel.find({ addedBy: req["user"]._id, dueDate: new Date(date as any) }).sort({ dueDate: -1 });
        let total = await ToDoModel.countDocuments({ addedBy: req["user"]._id, dueDate: new Date(date as any) });

        return res.status(200).send({ code: 200, message: "TO-DO retrieve successfully", total, data: todos })

    } catch (error) {
        return res.status(500).send({ message: "Error in get TO-DO by date", error: error, code: 500 });
    }
}

export const getToDoByDateRange = async (req: Request, res: Response) => {
    try {

        let { fromDate, toDate } = req.query;

        const todos = await ToDoModel.find({ addedBy: req["user"]._id, dueDate: { $gte: new Date(fromDate as any), $lte: new Date(toDate as any) } }).sort({ dueDate: -1 });
        let total = await ToDoModel.countDocuments({ addedBy: req["user"]._id, dueDate: { $gte: new Date(fromDate as any), $lte: new Date(toDate as any) } });

        return res.status(200).send({ code: 200, message: "TO-DO retrieve successfully", total, data: todos })

    } catch (error) {
        return res.status(500).send({ message: "Error in get TO-DO by date", error: error, code: 500 });
    }
}

export const updateToDo = async (req: Request, res: Response) => {
    try {

        let { _id } = req.body;
        let existToDo = await ToDoModel.findOne({ _id: _id, addedBy: req["user"]._id });
        if (!existToDo) return res.status(404).send({ code: 404, error: "TO-DO dosen't exist" })

        let updatedToDo = await ToDoModel.findByIdAndUpdate({ _id: _id, addedBy: req["user"]._id }, req.body, { new: true })
        return res.status(200).send({ code: 200, message: "TO-DO update successfully", data: updatedToDo })

    } catch (error) {
        return res.status(500).send({ message: "Error in update TO-DO", error: error, code: 500 })
    }
}

export const updateToDoStatus = async (req: Request, res: Response) => {
    try {

        let { isCompleted, _id } = req.body

        let existToDo = await ToDoModel.findOne({ _id: _id, addedBy: req["user"]._id });
        if (!existToDo) return res.status(404).send({ code: 404, error: "TO-DO dosen't exist" })

        if (existToDo.isCompleted && req.body.isCompleted) {
            return res.status(400).send({ code: 400, error: 'Already status is marked as read' });
        }

        if (!existToDo.isCompleted && !req.body.isCompleted) {
            return res.status(400).send({ code: 400, error: 'No status change detected' });
        }

        let updatedToDo = await ToDoModel.findByIdAndUpdate({ _id: _id, addedBy: req["user"]._id }, { $set: { isCompleted: isCompleted } }, { new: true })
        return res.status(200).send({ code: 200, message: "TO-DO status update successfully", data: updatedToDo })

    } catch (error) {
        return res.status(500).send({ message: "Error in update TO-DO status", error: error, code: 500 })
    }
}

export const deleteToDo = async (req: Request, res: Response) => {
    try {

        let { id } = req.params;
        let existToDo = await ToDoModel.findOne({ _id: id, addedBy: req["user"]._id });
        if (!existToDo) return res.status(404).send({ code: 404, error: "TO-DO dosen't exist" })

        await ToDoModel.findByIdAndDelete({ _id: id, addedBy: req["user"]._id })
        return res.status(200).send({ code: 200, message: "TO-DO delete successfully" })

    } catch (error) {
        return res.status(500).send({ message: "Error in delete TO-DO", error: error, code: 500 })
    }
}