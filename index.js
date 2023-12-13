import express from 'express'

import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from "http";
import dotenv from 'dotenv'

import WebSocketManager from './WebSocket.js';
import userRouter from "./routes/users.js";

/*-------------------------- SETTINGS -------------------------*/

dotenv.config()
const app = express()
const server = http.createServer(app);
const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.NODE_ENV === "development" ? process.env.MONGO_URL_DEV : process.env.MONGO_URL_PROD


if (process.env.NODE_ENV !== "test"){
  mongoose.set('strictQuery', true)
  mongoose.connect(MONGO_URL).then(() => console.log("Successfully connected to DB")
  ).catch((e) => console.error(e.message))
}

app.use(cookieParser('key'))
app.use(express.json())
app.use(cors({
  origin: '*',
  credentials: true,
}));

/*-------------------------- ROUTING --------------------------*/

app.use('/user', userRouter)

/*-------------------------- RUNNING SERVER --------------------------*/

new WebSocketManager(server);

try {
  server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
} catch (error) {
  console.error("An error occurred while starting the server:", error);
}

export default server
