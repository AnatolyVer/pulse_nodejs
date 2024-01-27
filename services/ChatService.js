import {CryptoService} from "./cryptoService.js";

import User from "../models/user.js";
import Chat from "../models/chat.js";

import chatDto from "../dto/chatDto.js";

import {ws} from "../index.js"
import {PreviewChat} from "../dto/previewChat.js";
import {PublicUserDto} from "../dto/userDto.js";

export default class ChatService{

    static cutTheMessage (message){
        if (message){
            if (message.text.length > 30) message.text = message.text.substring(0, 30 - 3) + '...';
            return message
        }
        else return {}

    }

    static unreadMessagesToString = (unreadMessages) => unreadMessages > 99 ? "+99" : unreadMessages

    static #createPreviewChat (chat, user_id, user) {
        switch (chat.type) {
            case "chat":
                return new PreviewChat(chat, user_id, user)
            case "channel":
                break;
        }
    }

    static async getAllPreviewChats(_id, substr){
        try {
            const userChatsOwner = await User.findById(_id)
            const chatsToSend = []
            const readChat = {}
            for (const chat_id of userChatsOwner.chats){
                let chat = await this.getOne(_id, chat_id)
                if (substr.trim()){
                    for (const member_id of chat.members){
                        const member = await User.findById(member_id)
                        if (member.nickname.toLowerCase().includes(substr.toLowerCase()) || member.username.toLowerCase().includes(substr.toLowerCase())){
                            if (member.username !== userChatsOwner.username){
                                chatsToSend.push(this.#createPreviewChat(chat, _id, member))
                                readChat[member.username] = true
                            }
                        }
                    }
                    if (chatsToSend.length < 5){
                        const users = await User.find({
                            $or: [
                                { nickname: { $regex: substr, $options: 'i' } },
                                { username: { $regex: substr, $options: 'i' } }
                            ]
                        })
                        for (const user of users){
                            if (!readChat[user.username]){
                                if (user.username !== userChatsOwner.username){
                                    const unknownChat = {
                                        _id:undefined,
                                        type:"chat",
                                        members:[user, userChatsOwner],
                                        messages:[]
                                    }
                                    chatsToSend.push(this.#createPreviewChat(unknownChat, _id, user))
                                    readChat[user.username] = true
                                }
                            }
                        }
                    }

                }
                else chatsToSend.push(this.#createPreviewChat(chat, _id))
            }
            return chatsToSend
        } catch (e) {
            throw new Error(e);
        }
    }

    static async getOne(user_id, _id) {
        try {
            const chat = await Chat.findById(_id)
            const members = []
            for (const member_id of chat.members) {
                const member = await User.findById(member_id)
                const memberToPush = new PublicUserDto(member)
                members.push(memberToPush)
            }
            return new chatDto(chat, members)
        }catch (e){
            throw new Error(e)
        }
    }

    static async sendMessage(sender, chat_id, message) {
        try {
            if (chat_id !== "undefined"){
                const chat = await Chat.findById(chat_id)
                const text = CryptoService.encrypt(message.text)
                chat.messages.push({...message, text, delivered:true})

                await chat.save()

                for (const member_id of chat.members) {
                    if (member_id.toString() !== sender.toString()){
                        ws.sendMessage(member_id, {body: {message, chat_id}, type:"NEW_MESSAGE"})
                    }
                }

                return {message: "Message sent"}
            }
            else{
                return {message: "Create new chat"}
            }
        }catch (e) {
            console.log(e)
            throw new Error("Chat not found")
        }
    }

    static async create(user_id, users) {
        try {
            const {_id} = await Chat.create({members: users, type: "chat"})
            for (const id of users) {
                const user = await User.findById(id)
                user.chats.push(_id)
                await user.save()
            }
            return this.getOne(user_id, _id)
        }catch (e) {
            console.log(e.message)
            throw new Error(e.message)
        }
    }
}