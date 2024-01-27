import ChatService from "../services/ChatService.js";

export class PreviewChat{
    _id
    type
    image
    name
    online
    last_message
    unread_messages
    user
    constructor(chat, user_id, member) {
        this._id = chat._id
        this.type = chat.type
        this.user = member
        for (const member of chat.members){
            if (member._id.toString() !== user_id.toString()){
                
                this.image = member.avatar_url
                this.name = member.nickname
                this.online = member.online
            }
        }
        if (chat.messages){
            this.last_message = ChatService.cutTheMessage(chat.messages[chat.messages.length - 1])
            this.unread_messages = ChatService.unreadMessagesToString(chat.messages.length)
        }
        else {
            this.last_message = undefined
            this.unread_messages = "0"
        }
    }
}

export class FullChat{
    _id
    messages
    user
    type
    online
    unread_messages
    constructor(chat, user_id) {
        this._id = chat._id
        this.messages = chat.messages
        this.type = chat.type
        for (const member of chat.members){
            if (member._id.toString() !== user_id.toString()){
                this.user = member
            }
        }

        this.unread_messages = ChatService.unreadMessagesToString(chat.messages.length)
    }
}