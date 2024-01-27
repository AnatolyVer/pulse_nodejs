import { Router } from "express";
import ChatController from "../controllers/ChatController.js";
import {validateTokens} from "../middlewares/index.js";

const chatRouter = Router()

chatRouter.get('/get_all', validateTokens, ChatController.getAll)


chatRouter.post('/send', validateTokens, ChatController.sendMessage)
chatRouter.post('/create', validateTokens, ChatController.createChat)

chatRouter.get('/:chat_id', validateTokens, ChatController.getOne)


export default chatRouter