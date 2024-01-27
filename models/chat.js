import mongoose, {Schema} from "mongoose"

const userSchema = new Schema({
    messages:{
        type:[Object],
        default:[]
    },
    members:{
        type:[Schema.Types.ObjectId],
        default:[]
    },
    type:{
        type: String,
        required:true
    }
});

export default mongoose.model('chat', userSchema)