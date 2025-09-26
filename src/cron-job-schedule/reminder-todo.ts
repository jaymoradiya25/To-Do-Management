import cron from "node-cron";
import { ToDoModel } from "../models/todo.model";
import { sendReminder } from "../helpers/email";

// Runs every minute
export const startReminderJob = () => {

  cron.schedule("* * * * *", async () => {
    const now = new Date();
    console.log('now --->', now);

    console.log("Cron invoked!!");

    // Find pending reminders
    const todos = await ToDoModel.find({
      reminderTime: { $lte: now },
      isCompleted: false,
      reminderSent: { $ne: true }
    }).populate("addedBy");

    for (const todo of todos) {
      const user = todo.addedBy as any;

      if (user?.email) {
        await sendReminder(
          user.email,
          `Todo Reminder: ${todo.title}`,
          `Hi ${user.userName},\n\nThis is a reminder for your task: "${todo.title}".\nDue Date: ${todo.dueDate}`
        );

        await ToDoModel.updateOne(
          { _id: todo._id },
          { $set: { reminderSent: true } }
        );
      }

    }
  });
}