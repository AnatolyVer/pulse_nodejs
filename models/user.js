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
    },
    online:{
        type:Boolean,
        default:false
    },
    last_seen:{
        type:Date
    }
});

export default mongoose.model('user', userSchema)