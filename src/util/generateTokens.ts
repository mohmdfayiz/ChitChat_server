import 'dotenv/config';
import jwt from "jsonwebtoken";
import UserToken from "../model/tokenModel";
import { User } from '../model/userModel';

const ACCESS_TOKEN_PRIVATE_KEY = process.env.ACESS_TOKEN_SECRET as string
const REFRESH_TOKEN_PRIVATE_KEY = process.env.REFRESH_TOKEN_SECRET as string

const generateTokens = async (user: User) => {
    try {
        const payload = { userId: user._id, userName: user.userName, email: user.email };
        const accessToken = jwt.sign(
            payload,
            ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "5m" }
        );
        const refreshToken = jwt.sign(
            payload,
            REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: "7d" }
        );

        const userToken = await UserToken.findOne({ userId: user._id });
        if (userToken) await UserToken.deleteOne({ userId: user._id })

        await new UserToken({ userId: user._id, token: refreshToken }).save();
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

export default generateTokens;