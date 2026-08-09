import {
    CategoryModel,
    ProductModel,
} from "../models/index.ts";

import type {
    ServiceResult,
    ServiceResultProduct,
} from "../types/index.ts";
import { CreateProductDTO, ProductQueryDTO, UpdateProductDTO } from "../validators/product.validators.ts";

export const getProducts = async (
    query: ProductQueryDTO,
): Promise<ServiceResultProduct> => {

    const filter: Record<string, unknown> = {
        isActive: true,
    };

    if (query.category) {
        filter.category = query.category;
    }

    if (query.search) {
        filter.name = {
            $regex: query.search,
            $options: "i",
        };
    }

    if (
        query.minPrice !== undefined ||
        query.maxPrice !== undefined
    ) {
        filter.price = {};

        if (query.minPrice !== undefined) {
            (filter.price as Record<string, number>).$gte =
                query.minPrice;
        }

        if (query.maxPrice !== undefined) {
            (filter.price as Record<string, number>).$lte =
                query.maxPrice;
        }
    }

    let sortOption: Record<string, 1 | -1> = {
        createdAt: -1,
    };

    switch (query.sort) {
        case "oldest":
            sortOption = { createdAt: 1 };
            break;

        case "price_asc":
            sortOption = { price: 1 };
            break;

        case "price_desc":
            sortOption = { price: -1 };
            break;

        case "rating":
            sortOption = { averageRating: -1 };
            break;
    }


    const skip = (query.page - 1) * query.limit;

    const [products, total] = await Promise.all([
        ProductModel.find(filter)
            .populate('category', 'name description')
            .sort(sortOption)
            .skip(skip)
            .limit(query.limit),

        ProductModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / query.limit) || 1;

    const message =
        products.length === 0
            ? "No products yet"
            : "Products fetched successfully";

    if (query.page > totalPages && totalPages > 0) {
        return {
            statusCode: 404,
            message: 'Page not found',
        };
    } 

    return {
        statusCode: 200,
        data: products,
        pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages,
        },
        message,
    };
};

export const getProductById = async (id: string): Promise<ServiceResult> => {
    const product = await ProductModel.findById(id)
        .populate("category", "name description");

    if (!product) {
        return {
            statusCode: 404,
            message: "Product not found",
        };
    }

    return {
        statusCode: 200,
        data: product,
        message: "Product fetched successfully",
    };
};

export const createProduct = async (
    productDTO: CreateProductDTO,
): Promise<ServiceResult> => {
    const existingProduct = await ProductModel.findOne({
        name: productDTO.name.trim(),
    });

    if (existingProduct) {
        return {
            statusCode: 409,
            message: "Product with this name already exists",
        };
    }

    const category = await CategoryModel.findById(
        productDTO.category,
    );

    if (!category) {
        return {
            statusCode: 404,
            message: "Category not found",
        };
    }

    const product = await ProductModel.create({
        ...productDTO,
        name: productDTO.name.trim(),
    });

    return {
        statusCode: 201,
        data: product,
        message: "Product created successfully",
    };
};

export const updateProduct = async (
    id: string,
    productDTO: UpdateProductDTO,
): Promise<ServiceResult> => {
    const product = await ProductModel.findById(id);

    if (!product) {
        return {
            statusCode: 404,
            message: "Product not found",
        };
    }

    if (productDTO.name) {
        const existingProduct = await ProductModel.findOne({
            _id: { $ne: id },
            name: productDTO.name.trim(),
        });

        if (existingProduct) {
            return {
                statusCode: 409,
                message: "Product with this name already exists",
            };
        }
    }

    if (productDTO.category) {
        const category =
            await CategoryModel.findById(
                productDTO.category,
            );

        if (!category) {
            return {
                statusCode: 404,
                message: "Category not found",
            };
        }
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        {
            ...productDTO,
            ...(productDTO.name && {
                name: productDTO.name.trim(),
            }),
        },
        {
            new: true,
            runValidators: true,
        },
    );

    return {
        statusCode: 200,
        data: updatedProduct,
        message: "Product updated successfully",
    };
};

export const deleteProduct = async (
    id: string,
): Promise<ServiceResult> => {
    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
        return {
            statusCode: 404,
            message: "Product not found",
        };
    }

    return {
        statusCode: 200,
        data: product,
        message: "Product deleted successfully",
    };
};
