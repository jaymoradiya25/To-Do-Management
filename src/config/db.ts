import mongoose from "mongoose";

export const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log("Database connection successfully !");
    } catch (error) {
        console.log("Database connection error", error);

    }
}