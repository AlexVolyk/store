import type { Request, Response } from 'express';

import { userService } from "../services/index.ts";
import { getCurrentUserId, getValidateParamsId, sendServiceResult } from '../utils/index.ts';
import { UpdateUserDTO } from '../validators/user.validator.ts';

export const allUsers = async (_req: Request, res: Response) => {
    const result = await userService.getUsers();

    return sendServiceResult(res, result);
};

export const getMe = async (req: Request, res: Response) => {
    const userId = getCurrentUserId(req);
    const result = await userService.getUserById(userId);

    return sendServiceResult(res, result);
};

export const getUserById = async (req: Request, res: Response) => {
    const id = getValidateParamsId(req);
    const result = await userService.getUserById(id);

    return sendServiceResult(res, result);
};

export const updateMe = async (req: Request, res: Response) => {
    const userId = getCurrentUserId(req);
    const body = req.validatedBody as UpdateUserDTO;

    const result = await userService.updateUser(userId, body);

    return sendServiceResult(res, result);
};

export const updateUser = async (req: Request, res: Response) => {
    const id = getValidateParamsId(req);
    const body = req.validatedBody as UpdateUserDTO;

    const result = await userService.updateUser(id, body);

    return sendServiceResult(res, result);
};

export const deleteUser = async (req: Request, res: Response) => {
    const id = getValidateParamsId(req);
    
    const result = await userService.deleteUser(id);

    return sendServiceResult(res, result);
};
