import mongoose, { Document, ObjectId, Schema } from "mongoose";
mongoose.pluralize(null);

export interface IToDo extends Document {
    title: String;
    description: String;
    dueDate: Date;
    reminderTime: Date;
    addedBy: ObjectId;
    isCompleted: Boolean;
    reminderSent: Boolean;
}

const ToDoSchema = new Schema<IToDo>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    reminderTime: { type: Date },
    addedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    isCompleted: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false
});

export const ToDoModel = mongoose.model<IToDo>("TO-DO", ToDoSchema)