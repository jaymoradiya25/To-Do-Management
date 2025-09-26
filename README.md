# Todo API

A RESTful API for managing personal tasks with features like creating, updating, deleting, and scheduling reminders. Built with **Node.js**, **Express**, **MongoDB**, and **TypeScript**.

---

## Features

- User authentication (Sign Up / Sign In)  
- CRUD operations for Todo items  
- Get Todos by date or date range  
- Mark Todos as completed  
- Email reminders for pending Todos using a cron job  
- JWT-based authentication  

---

## Technologies

- Node.js & Express.js  
- TypeScript  
- MongoDB & Mongoose  
- Node-Cron (for reminders)  
- JWT Authentication  
- Nodemailer (for sending emails)  

---

## Installation

1. Clone the repository: git@github.com:jaymoradiya25/To-Do-Management.git

```bash
git clone <repo-url>
cd <repo-folder>

2. Install dependencies:
npm install

3. Create a .env file based on .env.example:
PORT=4040
MONGO_URI=<your-mongo-uri>
JWT_SECRET=<your-jwt-secret>
EMAIL_USER=<your-email>
EMAIL_PASS=<your-email-password>


4. Start the server:
npm run dev


| Method | Route      | Description       | Body Parameters                 |
| ------ | ---------- | ----------------- | ------------------------------- |
| POST   | `/sign-up` | Register new user | `username`, `email`, `password` |
| POST   | `/sign-in` | User login        | `username`, `password`             |



| Method | Route                     | Description                     | Body / Query Parameters                           |
| ------ | ------------------------- | ------------------------------- | ------------------------------------------------- |
| POST   | `/add-todo`               | Create a new Todo               | `title`, `description`, `dueDate`, `reminderTime` |
| GET    | `/get-todo-by-user`       | Get all Todos of logged-in user | None                                              |
| GET    | `/get-todo-by-date`       | Get Todos by specific date      | `date` (YYYY-MM-DD)                               |
| GET    | `/get-todo-by-date-range` | Get Todos within date range     | `fromDate`, `toDate` (YYYY-MM-DD)                 |
| PUT    | `/update-todo`            | Update Todo details             | `_id`, other fields to update                     |
| PUT    | `/update-todo-status`     | Update completion status        | `_id`, `isCompleted`                              |
| DELETE | `/delete-todo/:id`        | Delete Todo by ID               | `id` (path param)                                 |




Note: Cron Job for Reminders =>
A cron job runs every minute and checks for Todos with reminderTime <= current time and isCompleted = false.
Sends email reminders to the user and marks reminderSent = true to avoid duplicate emails.


==>> All Todo routes are protected with JWT. Include Authorization: Bearer <token> in headers.
==>> Make sure to configure the email settings in .env for reminder emails.