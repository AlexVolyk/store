import { isValidObjectId } from 'mongoose';
import { CategoryModel, ProductModel } from '../models/index.ts';

import type { ServiceResult, ServiceResultProduct } from '../types/index.ts';
import type {
    CreateProductDTO,
    ProductQueryDTO,
    UpdateProductDTO,
} from '../validators/product.validators.ts';
import { clearCachePattern, slugify } from '../utils/index.ts';

export const getProducts = async (query: ProductQueryDTO): Promise<ServiceResultProduct> => {
    const filter: Record<string, unknown> = {
        isActive: true,
    };

    if (query.category) {
        if (isValidObjectId(query.category)) {
            filter.category = query.category;
        } else {
            const categoryDoc = await CategoryModel.findOne({
                slug: query.category.toLowerCase()
.trim(),
            });
            if (categoryDoc) {
                filter.category = categoryDoc._id;
            }
        }
    }

    if (query.search) {
        filter.name = {
            $regex: query.search,
            $options: 'i',
        };
    }

    if (query.brand) {
        filter.brand = {
            $regex: query.brand,
            $options: 'i',
        };
    }

    if (query.badge) {
        filter.badge = query.badge;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
        filter.price = {};

        if (query.minPrice !== undefined) {
            (filter.price as Record<string, number>).$gte = query.minPrice;
        }

        if (query.maxPrice !== undefined) {
            (filter.price as Record<string, number>).$lte = query.maxPrice;
        }
    }

    let sortOption: Record<string, 1 | -1> = {
        createdAt: -1,
    };

    switch (query.sort) {
        case 'oldest':
            sortOption = { createdAt: 1 };
            break;

        case 'price_asc':
            sortOption = { price: 1 };
            break;

        case 'price_desc':
            sortOption = { price: -1 };
            break;

        case 'rating':
            sortOption = { averageRating: -1 };
            break;
    }

    const skip = (query.page - 1) * query.limit;

    const [products, total] = await Promise.all([
        ProductModel.find(filter)
            .populate('category', 'name slug description')
            .sort(sortOption)
            .skip(skip)
            .limit(query.limit),

        ProductModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / query.limit) || 1;

    const message = products.length === 0 ? 'No products yet' : 'Products fetched successfully';

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

export const getProductById = async (idOrSlug: string): Promise<ServiceResult> => {
    const query = isValidObjectId(idOrSlug)
        ? { _id: idOrSlug }
        : { slug: idOrSlug.toLowerCase()
.trim() };

    const product = await ProductModel.findOne(query)
.populate('category', 'name slug description');

    if (!product) {
        return {
            statusCode: 404,
            message: 'Product not found',
        };
    }

    return {
        statusCode: 200,
        data: product,
        message: 'Product fetched successfully',
    };
};

export const createProduct = async (productDTO: CreateProductDTO): Promise<ServiceResult> => {
    const trimmedName = productDTO.name.trim();
    const slug = productDTO.slug ? slugify(productDTO.slug) : slugify(trimmedName);

    const existingProduct = await ProductModel.findOne({
        $or: [{ name: trimmedName }, { slug }],
    });

    if (existingProduct) {
        return {
            statusCode: 409,
            message: 'Product with this name or slug already exists',
        };
    }

    const category = await CategoryModel.findById(productDTO.category);

    if (!category) {
        return {
            statusCode: 404,
            message: 'Category not found',
        };
    }

    const product = await ProductModel.create({
        ...productDTO,
        name: trimmedName,
        slug,
    });

    await clearCachePattern('cache:/api/products*');

    return {
        statusCode: 201,
        data: product,
        message: 'Product created successfully',
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
            message: 'Product not found',
        };
    }

    const updateData: Record<string, unknown> = { ...productDTO };

    if (productDTO.name) {
        updateData.name = productDTO.name.trim();
    }

    if (productDTO.name && !productDTO.slug) {
        updateData.slug = slugify(productDTO.name);
    } else if (productDTO.slug) {
        updateData.slug = slugify(productDTO.slug);
    }

    if (updateData.name || updateData.slug) {
        const existingProduct = await ProductModel.findOne({
            _id: { $ne: id },
            $or: [
                ...(updateData.name ? [{ name: updateData.name }] : []),
                ...(updateData.slug ? [{ slug: updateData.slug }] : []),
            ],
        });

        if (existingProduct) {
            return {
                statusCode: 409,
                message: 'Product with this name or slug already exists',
            };
        }
    }

    if (productDTO.category) {
        const category = await CategoryModel.findById(productDTO.category);
        if (!category) {
            return {
                statusCode: 404,
                message: 'Category not found',
            };
        }
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    await clearCachePattern('cache:/api/products*');

    return {
        statusCode: 200,
        data: updatedProduct,
        message: 'Product updated successfully',
    };
};

export const deleteProduct = async (id: string): Promise<ServiceResult> => {
    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
        return {
            statusCode: 404,
            message: 'Product not found',
        };
    }

    await clearCachePattern('cache:/api/products*');

    return {
        statusCode: 200,
        data: product,
        message: 'Product deleted successfully',
    };
};
