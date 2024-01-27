import jwt from "jsonwebtoken";
import chatService from "../services/ChatService.js";
import {FullChat} from "../dto/previewChat.js";


export default class ChatController {

    static async getAll(req, res) {
        try {
            const {_id} = jwt.decode(req.headers['refresh-token'])
            const {substr} = req.query
            const chats = await chatService.getAllPreviewChats(_id, substr)
            res.status(200).json(chats)
        } catch (err) {
            console.error(err);
            res.status(404).send(err)
        }
        return res
    }

    static async getOne(req, res) {
        try{
            const {_id} = jwt.decode(req.headers['refresh-token'])
            const {chat_id} = req.params
            const chat = await chatService.getOne(_id, chat_id)
            const fullChat = new FullChat(chat, _id)
            return res.status(200).json(fullChat)
        }catch (e) {
            console.log(e)
            res.status(500).end(e.message)
        }
        return res
    }

    static async sendMessage(req, res) {
        try{
            const sender = jwt.decode(req.headers['refresh-token'])._id
            const message = req.body
            const chat_id = req.query._id
            const result = await chatService.sendMessage(sender, chat_id, message)
            return res.status(200).json(result)
        }catch (e) {
            res.status(500).end(e.message)
        }
        return res
    }

    static async createChat(req, res) {
        try{
            const users_id = req.body
            const {_id} = jwt.decode(req.headers['refresh-token'])
            const chat = await chatService.create(_id, users_id)
            const fullChat = new FullChat(chat, _id)
            return res.status(200).json(fullChat)
        }catch (e) {
            res.status(500).end(e.message)
        }
        return res
    }
}