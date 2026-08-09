import { NextFunction, Request, Response } from "express";
import { env } from "../config/env.ts";
import { UserModel } from "../models/index.ts";
import { verifyToken } from "../utils/token.utils.ts";
import { JwtPayload } from "jsonwebtoken";
import { invalidToken, sendUnauthorized } from "../utils/controller.utils.ts";

const hasUserId = (payload: string | JwtPayload): payload is JwtPayload & { id: string } => {
    return typeof payload !== 'string' && typeof payload.id === 'string';
};

export const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    if (req.method == "OPTIONS") {
        next();

    } else if (
        req.headers.authorization
    ) {

        const { authorization } = req.headers;

        const token = authorization?.split(' ')[1];

        const payload = token
            ? verifyToken(token, env.jwtSecret)
            : undefined;

        if (payload && hasUserId(payload)) {

            const user = await UserModel.findById(payload.id)

            if (user) {
                req.user = user;
                next();

            } else {
                sendUnauthorized(res)
            }

        } else {
            invalidToken(res)
        }

    } else {
        sendUnauthorized(res)
    }
};
