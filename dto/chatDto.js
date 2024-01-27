import {CryptoService} from "../services/cryptoService.js";


export default class chatDto{
    _id
    messages
    members
    type
    constructor(chatDoc, members) {
        const chat = chatDoc._doc
        this._id = chat._id
        this.members = members
        this.type = chat.type
        const messages = []
        for (const message of chat.messages){
            const text = CryptoService.decrypt(message.text)
            messages.push({...message, text})
        }
        this.messages = messages
    }

}