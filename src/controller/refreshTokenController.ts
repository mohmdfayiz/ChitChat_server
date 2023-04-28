import { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import UserToken from "../model/tokenModel";
import createHttpError, { InternalServerError } from "http-errors";

interface JwtPayload extends jwt.JwtPayload {
    userId: string;
    userName: string;
    email: string;
}

export const verifyToken: RequestHandler = async (req, res, next) => {

    try {
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
        const refreshToken = req.cookies.jwt;

        console.log(refreshToken , '----refresh token----');
    
        // check token in DB
        const token = UserToken.findOne({ token: refreshToken })
        if (!token) return next(createHttpError(401, 'Invalid Token'))

        // verify validity of token
        const decodeToken = jwt.verify(refreshToken, refreshTokenSecret) as JwtPayload
        if (decodeToken.exp && decodeToken.exp * 1000 > Date.now()) {
            return next(createHttpError(401, 'Invalid Token'))
        }

        const payload = {
            userId: decodeToken.userId,
            userName: decodeToken.userName,
            email: decodeToken.email
        };

        // new access token
        const accessToken = jwt.sign(
            payload,
            accessTokenSecret,
            { expiresIn: "5m" }
        );

        res.status(200).json({
            error: false,
            accessToken,
            message: "Access token created successfully",
        });

    } catch (error) {
        return next(createHttpError(401, 'Invalid Token'))
    }
}

export const logout: RequestHandler = async (req, res, next) => {

    try {
        const refreshToken = req.cookies.jwt;
        const deletedToken = await UserToken.deleteOne({ token: refreshToken })

        if (deletedToken) {
            return next(createHttpError(400, 'Invalid token'))
        }
        
        return res.sendStatus(200)
    } catch (error) {
        return next(InternalServerError)
    }

}