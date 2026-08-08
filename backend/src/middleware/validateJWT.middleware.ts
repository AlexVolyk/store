import { NextFunction, Request, Response } from "express";
import { env } from "../config/env.ts";
import { UserModel } from "../models/index.ts";
import { verifyToken } from "../utils/getToken.utils.ts";
import { JwtPayload } from "jsonwebtoken";

const hasUserId = (payload: string | JwtPayload): payload is JwtPayload & { id: string } => {
    return typeof payload !== 'string' && typeof payload.id === 'string';
};

export const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    if (req.method == "OPTIONS") {
        next();

    } else if (
        req.headers.authorization &&
        req.headers.authorization.includes(env.jwtSecret)
        ) {

            const {authorization} = req.headers;

            const payload: undefined| string | JwtPayload = authorization ? verifyToken(authorization.includes(env.jwtSecret)
            ? authorization.split(' ')[1]
            : authorization, env.jwtSecret
            )
            : undefined;
            
            if (payload && hasUserId(payload)) {
                
                const user = await UserModel.findById(payload.id)


                if (user) {
                    req.user = user;
                    next();

                } else {
                    res.status(400).json({message: "Not Authorized"
                    });
                }

            } else {
                res.status(401).send({
                    message: "Invalid token"
                });
            }

    } else {
        res.status(403).send({
            message: "Forbidden"
        });
    }
};
