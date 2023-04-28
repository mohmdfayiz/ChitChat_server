import { NextFunction, Request, RequestHandler, Response } from 'express';
import createHttpError from "http-errors";
import jwt, { JwtPayload } from 'jsonwebtoken';
const JWT_SECRET = process.env.ACESS_TOKEN_SECRET as string

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //   get the token from the authorization header
        if (!req.headers.authorization) return next(createHttpError(401, 'Invalid request!'))
        const token: string = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload
        res.locals.decodedToken = decodedToken;
        next()
    } catch (error:any) {
        return next(createHttpError(403, error.message ))
    }
}