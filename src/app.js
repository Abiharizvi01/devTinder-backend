//express js is a open source framework of node js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/database.js"; // Note: In ES Modules, adding the .js extension is required!
import cookieParser from "cookie-parser";

import authRouter from "./routes/authroute.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/requests.js";


const app = express();
const PORT = 7777;

app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);


// Establish connection before spinning up the server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running beautifully on port ${PORT}...🚀`);
        });
    })
    .catch((err) => {
        console.error("Server failed to start due to a DB issue:", err);
    });