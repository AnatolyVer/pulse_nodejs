import express from 'express'

import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from "http";
import dotenv from 'dotenv'

import WebSocketManager from './WebSocket.js';
import userRouter from "./routes/users.js";
import chatRouter from "./routes/chat.js";

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
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'access-token', 'refresh-token'],
  credentials: true,
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, access-token, refresh-token');
  res.header('Access-Control-Expose-Headers', 'access-token, refresh-token');
  next();
});

/*-------------------------- ROUTING --------------------------*/

app.use('/user', userRouter)
app.use('/chat', chatRouter)


/*-------------------------- RUNNING SERVER --------------------------*/

export const ws = new WebSocketManager(server);

try {
  server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
} catch (error) {
  console.error("An error occurred while starting the server:", error);
}

