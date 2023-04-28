import { Document, model, Schema } from 'mongoose'

interface Message extends Document {
    sender: string;
    message: string,
    createdAt: Date,
}

const messageSchema = new Schema({
    sender: { type: String, required:true },
    message: { type: String, required: true },
},
    { timestamps: true }
)

export default model<Message> ('Message', messageSchema)