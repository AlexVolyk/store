import type { Request, Response } from 'express';
import type { ServiceResult, ServiceResultProduct } from '../types/index.ts';
import { IdParamsDTO, ProductIdParamsDTO } from '../validators/common.validators.ts';
import { ProductQueryDTO } from '../validators/product.validators.ts';

export const getCurrentUserId = (req: Request): string => {
    const userId = req.user!._id;

    return userId.toString();
};

export const getValidateParamsProductId = (req: Request): string => {
    const { productId } = req.validatedParams as ProductIdParamsDTO

    return productId
}

export const getValidateProductQuery = (req: Request): ProductQueryDTO  => {
    const query = req.validatedQuery as ProductQueryDTO

    return query
}


export const getValidateParamsId = (req: Request): string => {
    const { id } = req.validatedParams as IdParamsDTO

    return id
}


export const isAdmin = (req: Request) => req.user!.role === 'admin';

export const canAccessOrder = (req: Request, orderUserId: string) =>
    isAdmin(req) || req.user!._id.toString() === orderUserId;


export const sendUnauthorized = (res: Response) => {
    res.status(401).json({
        success: false,
        message: 'User is not authorized',
    });
};

export const sendForbidden = (res: Response) => {
    res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action. No token',
    });
};

export const invalidToken = (res: Response) =>
    res.status(401).json({
        success: false,
        message: 'Invalid token',
    });


export const sendServiceResult = <T>(res: Response, result: ServiceResult<T>) => {
    const body = {
        ...(result.data !== undefined && { data: result.data }),
        ...(result.token !== undefined && { token: result.token }),
        message: result.message,
    };
    return res.status(result.statusCode).json(body);

}

export const sendServiceResultProduct = <T>(res: Response, result: ServiceResultProduct<T>) => {
    const body = {
        ...(result.data !== undefined && { data: result.data }),
        ...(result.token !== undefined && { token: result.token }),
        ...(result.pagination !== undefined && { pagination: result.pagination }),
        message: result.message,
    };

    return res.status(result.statusCode).json(body);
};