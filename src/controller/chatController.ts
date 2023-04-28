import { RequestHandler } from "express";
import messageModel from "../model/messageModel";
import createHttpError, { InternalServerError } from "http-errors";

// get messages
export const getMessages: RequestHandler = async (req, res, next) => {
    try {
        const messages = await messageModel.find({})
        res.status(200).json({ messages })
    } catch (error) {
        return next(InternalServerError)
    }
}

// send message
export const sendMessage: RequestHandler = (req, res, next) => {
    try {

        const { sender, message } = req.body

        const newMessage = new messageModel({
            sender,
            message
        })
        newMessage.save()
        return res.status(200)
    } catch (error) {
        return next(InternalServerError)
    }
}