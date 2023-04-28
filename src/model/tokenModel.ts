import { Schema, model, Document, Types } from "mongoose";

interface Token extends Document {
    userId: Types.ObjectId;
    token: string;
    createdAt: Date;
}

const userTokenSchema = new Schema({
    userId: { type: Types.ObjectId, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 7 * 86400 }, // 7 days
});

const UserToken = model<Token>("UserToken", userTokenSchema);

export default UserToken;