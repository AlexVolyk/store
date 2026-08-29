import type { Request, Response } from 'express';

import { productService } from '../services/index.ts';
import {
    getValidateParamsId,
    getValidateProductQuery,
    sendServiceResult,
    sendServiceResultProduct,
} from '../utils/index.ts';
import { CreateProductDTO, UpdateProductDTO } from '../validators/product.validators.ts';

export const getProducts = async (req: Request, res: Response) => {
    const query = getValidateProductQuery(req);

    const result = await productService.getProducts(query);

    return sendServiceResultProduct(res, result);
};

export const getProductById = async (req: Request, res: Response) => {
    const id = getValidateParamsId(req);

    const result = await productService.getProductById(id);

    return sendServiceResult(res, result);
};

export const createProduct = async (req: Request, res: Response) => {
    const body = req.validatedBody as CreateProductDTO;

    const result = await productService.createProduct(body);

    return sendServiceResult(res, result);
};

export const updateProduct = async (req: Request, res: Response) => {
    const id = getValidateParamsId(req);
    const body = req.validatedBody as UpdateProductDTO;

    const result = await productService.updateProduct(id, body);

    return sendServiceResult(res, result);
};

export const deleteProduct = async (req: Request, res: Response) => {
    const id = getValidateParamsId(req);

    const result = await productService.deleteProduct(id);

    return sendServiceResult(res, result);
};
