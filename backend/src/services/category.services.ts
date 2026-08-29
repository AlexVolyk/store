import { isValidObjectId } from 'mongoose';
import { CategoryModel, ProductModel } from '../models/index.ts';
import type { ServiceResult } from '../types/index.ts';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../validators/category.validators.ts';
import { slugify } from '../utils/slug.utils.ts';

export const getCategories = async (): Promise<ServiceResult> => {
    const categories = await CategoryModel
        .find()
        .sort({ name: 1 });

    const message = categories.length === 0
        ? "No categories yet"
        : "Categories fetched successfully";

    return {
        statusCode: 200,
        data: categories,
        message,
    };
};

export const getCategoryById = async (idOrSlug: string): Promise<ServiceResult> => {
    const query = isValidObjectId(idOrSlug)
        ? { _id: idOrSlug }
        : { slug: idOrSlug.toLowerCase().trim() };

    const category = await CategoryModel.findOne(query);

    if (!category) {
        return {
            statusCode: 404,
            message: "Category not found",
        };
    }

    return {
        statusCode: 200,
        data: category,
        message: "Category fetched successfully",
    };
};

export const createCategory = async (categoryDTO: CreateCategoryDTO): Promise<ServiceResult> => {
    const trimmedName = categoryDTO.name.trim();
    const slug = categoryDTO.slug ? slugify(categoryDTO.slug) : slugify(trimmedName);

    const existingCategory = await CategoryModel.findOne({
        $or: [{ name: trimmedName }, { slug }],
    });

    if (existingCategory) {
        return {
            statusCode: 409,
            message: "Category with this name or slug already exists",
        };
    }

    const category = await CategoryModel.create({
        ...categoryDTO,
        name: trimmedName,
        slug,
    });

    return {
        statusCode: 201,
        data: category,
        message: "Category created successfully",
    };
};

export const updateCategory = async (
    id: string,
    categoryDTO: UpdateCategoryDTO,
): Promise<ServiceResult> => {
    const updateData: Record<string, unknown> = { ...categoryDTO };

    if (categoryDTO.name) {
        updateData.name = categoryDTO.name.trim();
    }

    if (categoryDTO.name && !categoryDTO.slug) {
        updateData.slug = slugify(categoryDTO.name);
    } else if (categoryDTO.slug) {
        updateData.slug = slugify(categoryDTO.slug);
    }

    if (updateData.name || updateData.slug) {
        const existingCategory = await CategoryModel.findOne({
            _id: { $ne: id },
            $or: [
                ...(updateData.name ? [{ name: updateData.name }] : []),
                ...(updateData.slug ? [{ slug: updateData.slug }] : []),
            ],
        });

        if (existingCategory) {
            return {
                statusCode: 409,
                message: "Category with this name or slug already exists",
            };
        }
    }

    const category = await CategoryModel.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true,
        },
    );

    if (!category) {
        return {
            statusCode: 404,
            message: "Category not found",
        };
    }

    return {
        statusCode: 200,
        data: category,
        message: "Category updated successfully",
    };
};

export const deleteCategory = async (id: string): Promise<ServiceResult> => {
    const category = await CategoryModel.findById(id);

    if (!category) {
        return {
            statusCode: 404,
            message: "Category not found",
        };
    }

    // Protect against deleting category that has active products
    const productsCount = await ProductModel.countDocuments({ category: id });
    if (productsCount > 0) {
        return {
            statusCode: 400,
            message: `Cannot delete category "${category.name}". It is assigned to ${productsCount} product(s).`,
        };
    }

    await category.deleteOne();

    return {
        statusCode: 200,
        data: category,
        message: "Category deleted successfully",
    };
};
