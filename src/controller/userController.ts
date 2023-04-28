import { RequestHandler } from "express"
import userModel from "../model/userModel"
import bcrypt from 'bcrypt'
import createHttpError, { InternalServerError } from "http-errors"
import generateTokens from "../util/generateTokens"
import UserToken from "../model/tokenModel"

// User Sign up
export const signup: RequestHandler = async (req, res, next) => {

    try {
        const { userName, email, password } = req.body;
        const userExist = await userModel.findOne({ userName });
        const emailExist = await userModel.findOne({ email })
        if (userExist) return next(createHttpError(422, 'User name already exist!'));
        if (emailExist) return next(createHttpError(422, 'Email already exist!'))

        await bcrypt.hash(password, 10).then((hashPassword) => {
            const newUser = new userModel({
                userName,
                email,
                password: hashPassword
            });
            newUser.save()
                .then(() => {
                    return res.status(201).json({
                        message: "Signup Successful..."
                    })
                })
                .catch((error) => { res.status(500).json(error) })
        })

    } catch (error) {
        return next(InternalServerError)
    }
}

// User Sign in
export const signin: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email })
        if (!user) return next(createHttpError(404, 'User not found!'));

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return next(createHttpError(401, 'Invalid password!'));
        const { accessToken, refreshToken } = await generateTokens(user);

        res.cookie('jwt', refreshToken, {
            httpOnly: true, secure: true,
            maxAge: 7 * 86400 // 7 days
        })

        return res.status(200).json({
            message: "Signin Successful...",
            accessToken
        })

    } catch (error) {
        return next(InternalServerError)
    }
}