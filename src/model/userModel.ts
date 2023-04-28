import { Document, Schema, model } from "mongoose";

export interface User extends Document {
    userName: string;
    email: string;
    password: string;
    profilePhoto:string;
}

const userSchema = new Schema({
    userName:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, requried:true},
    profilePhoto:{type:String}
})

export default model<User> ('User',userSchema)