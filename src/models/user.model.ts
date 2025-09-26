import mongoose, { Document, Schema } from "mongoose";
mongoose.pluralize(null);

export interface IUser extends Document {
    userName: String,
    email: String,
    password: String

}

const UserSchema = new Schema<IUser>({
    userName: { type: String, unique: true, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true, versionKey: false });

export const UserModel = mongoose.model<IUser>("User", UserSchema);