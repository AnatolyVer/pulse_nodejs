import mongoose, {Schema} from "mongoose"

const userSchema = new Schema({
    nickname:{
        type: String,
        required:true
    },
    username:{
        type: String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    avatar_url:{
        type: String,
        default: ''
    },
    bio:{
        type: String,
        default: ''
    },
    sessions:{
        type: [Object],
        default:[]
    },
    chats:{
        type:[String],
        default:[]
    }
});

export default mongoose.model('user', userSchema)