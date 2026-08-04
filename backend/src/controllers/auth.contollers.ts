import { NextFunction, Request, Response } from 'express'
import { UserModel } from '../models/index.ts'
import { RegisterUserDTO, LoginUserDTO } from '../types/index.ts';
import { getToken, hashPassword, comparePasswords } from '../utils/index.ts';

export const register = async (req: Request, res: Response, _next: NextFunction) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        avatar,
        password
    } = <RegisterUserDTO>req.body;

    try {

        const isUser = await UserModel.findOne({ email });

        if (isUser) {
            return res.status(409).json({
                message: "Email is already in use",
            });
        }

        const user = await UserModel.create({
            firstName,
            lastName,
            email,
            phone,
            avatar,
            password: hashPassword(password)
        });



        const token = getToken(user.id)

        res.status(201).json({
            message: "User successfully registered",
            user: user,
            token: token,
        })


    } catch (err) {
        res.status(500).json({
            message: `Failse to register user ${err}`
        })
    }


}

export const login = async (req: Request, res: Response, _next: NextFunction) => {
    const {
        email,
        password
    } = <LoginUserDTO>req.body;

    try {
        const loginUser = await UserModel.findOne({
            email: email
        });

        if (loginUser) {

            const isPasswordHashComprasion = await comparePasswords(password, loginUser.password)
            if (isPasswordHashComprasion) {

                const token = getToken(loginUser.id)
                res.status(200).json({
                    message: "User successfully logged in",
                    user: loginUser,
                    token: token,
                })


            } else {
                res.status(401).json({
                    message: "User is unauthorized"
                })
            }


        } else {
            res.status(401).json({
                message: "Incorrect email or password"
            })
        }


    } catch (err) {
        res.status(500).json({
            message: `Failed to login ${err}`
        })
    }

}