import type { Request, Response } from 'express';

import { categoryService } from '../services/index.ts';
import { getValidateParamsId, sendServiceResult } from '../utils/index.ts';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../validators/category.validators.ts';

export const getCategories = async (_req: Request, res: Response) => {
        const result = await categoryService.getCategories()

        return sendServiceResult(res, result);
};

export const getCategoryById = async (req: Request, res: Response) => {
        const id = getValidateParamsId(req)

        const result = await categoryService.getCategoryById(id);

        return sendServiceResult(res, result);
};

export const createCategory = async (req: Request, res: Response) => {
        const body = req.validatedBody as CreateCategoryDTO

        const result = await categoryService.createCategory(body);

        return sendServiceResult(res, result);
};

export const updateCategory = async (req: Request, res: Response) => {
        const id = getValidateParamsId(req)
        const body = req.validatedBody as UpdateCategoryDTO

        const result = await categoryService.updateCategory(id, body)

        return sendServiceResult(res, result);
};

export const deleteCategory = async (req: Request, res: Response) => {
        const id = getValidateParamsId(req)

        const result = await categoryService.deleteCategory(id);

        return sendServiceResult(res, result);
};
