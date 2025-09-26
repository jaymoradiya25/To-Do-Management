import { Request, Response } from "express";
import { ToDoModel } from "../models/todo.model";

export const createToDo = async (req: Request, res: Response) => {
    try {

        let { title, description, dueDate } = req.body
        if (!title || !description || !dueDate) {
            return res.status(400).send({ code: 400, error: "All field are mandatory" })
        }

        const now = new Date(); // current date and time
        const utcMidnight = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            0, 0, 0, 0
        ));

        console.log(utcMidnight.toISOString());
        // Output: 2025-09-26T00:00:00.000Z

        let newTodo = await ToDoModel.create({ title, description, reminderTime: req.body.reminderTime, dueDate: new Date(dueDate), addedBy: req["user"]._id, createdAt: new Date() })
        return res.status(201).send({ code: 201, message: "TO-DO create successfuly", data: newTodo });
    } catch (error) {
        return res.status(500).send({ message: "Error retrieving create TO-DO", error: error, code: 500 })
    }
}

export const getAllTodoByUser = async (req: Request, res: Response) => {
    try {
        let toDoByUser = await ToDoModel.find({ addedBy: req["user"]._id }).sort({ createdAt: -1 });
        let total = await ToDoModel.countDocuments({ addedBy: req["user"]._id });

        return res.status(200).send({ code: 200, message: "TO-DO retrieve successfully", total, data: toDoByUser })
    } catch (error) {
        return res.status(500).send({ message: "Error retrieving get all TO-DO by user", error: error, code: 500 });
    }
}

export const getToDoByDate = async (req: Request, res: Response) => {
    try {

        let { date } = req.query;
        if (!date) {
            return res.status(400).json({ code: 400, message: "Date query is required" });
        }

        // Create Date objects for start and end of the day
        const start = new Date(`${date}T00:00:00.000Z`);
        const end = new Date(`${date}T23:59:59.999Z`);

        const query = {
            addedBy: req["user"]._id,
            createdAt: { $gte: start, $lte: end }
        };

        const todos = await ToDoModel.find(query).sort({ createdAt: -1 });
        let total = await ToDoModel.countDocuments(query);

        return res.status(200).send({ code: 200, message: "TO-DO retrieve successfully", total, data: todos })

    } catch (error) {
        return res.status(500).send({ message: "Error retrieving TO-DOs by date", error: error, code: 500 });
    }
}

export const getToDoByDateRange = async (req: Request, res: Response) => {
    try {

        let { fromDate, toDate } = req.query;

        if (!fromDate || !toDate) {
            return res.status(400).json({ code: 400, message: "fromDate and toDate are required" });
        }

        // Ensure fromDate is start of day, toDate is end of day
        const start = new Date(`${fromDate}T00:00:00.000Z`);
        const end = new Date(`${toDate}T23:59:59.999Z`);

        const query = {
            addedBy: req["user"]._id,
            createdAt: {
                $gte: start,
                $lte: end
            }
        };

        const todos = await ToDoModel.find(query).sort({ createdAt: -1 });
        const total = await ToDoModel.countDocuments(query);

        return res.status(200).send({ code: 200, message: "TO-DO retrieve successfully", total, data: todos })

    } catch (error) {
        return res.status(500).send({ message: "Error retrieving TO-DOs by date range", error: error, code: 500 });
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
        return res.status(500).send({ message: "Error retrieving update TO-DO", error: error, code: 500 })
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
        return res.status(500).send({ message: "Error retrieving update TO-DO status", error: error, code: 500 })
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
        return res.status(500).send({ message: "Error retrieving delete TO-DO", error: error, code: 500 })
    }
}