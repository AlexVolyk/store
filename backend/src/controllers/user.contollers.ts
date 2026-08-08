import { NextFunction, Request, Response } from 'express'
import { UserModel } from '../models/index.ts'
import { UpdateUserDTO } from '../types/index.ts';
import { hashPassword } from '../utils/index.ts';

export const allUsers = async (req: Request, res: Response, _next: NextFunction) => {

    res.json({
        users: await UserModel.find({},{ createdAt: 0, updatedAt: 0, password: 0})
    })
}


export const updateUser = async (req: Request, res: Response, _next: NextFunction) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        avatar,
        password
    } = <UpdateUserDTO>req.body.user;
    const userId = req.params.id;

    const query = {
        where: {
            id: userId,
        }
    };

    const updateUser = {
        firstName,
        lastName,
        email,
        phone,
        avatar,
        password: hashPassword(password)
    };

    try {
        const updated = await UserModel.findByIdAndUpdate(query, updateUser, {new: true});
        res.status(201).json({
            message: 'User updated successfully',
            update: updateUser,
            updateUser: updated
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};


export const deleteUser = async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.params.id;
    try {

        const bye = await UserModel.findById(userId)
        await UserModel.findByIdAndDelete(userId);
        res.status(200).json({
            message: "User successfully deleted",
            user_deleted: bye,
        });
    } catch (err) {
        res.status(500).json({ error: err })
    }
};