import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connect } from "./config/db";
import indexRoute from "./routes/index.route";
import { startReminderJob } from "./cron-job-schedule/reminder-todo";

const PORT = process.env.PORT || 4040;
const app = express();

const start = async () => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(morgan("dev"));

    connect();
    startReminderJob();
    app.get("/", (req, res) => {
        return res.status(200).send("Welcome to the TO-DO Management")
    });

    app.use("/api", indexRoute);

    app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))

}

start();