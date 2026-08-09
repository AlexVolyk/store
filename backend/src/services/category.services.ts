import { CategoryModel } from '../models/index.ts';
import type { ServiceResult } from '../types/index.ts';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../validators/category.validators.ts';



export const getCategories = async (): Promise<ServiceResult> => {
    const categories = await CategoryModel
        .find()
        .sort({ createdAt: -1 });

    const message = categories.length === 0
        ? "No categories yet"
        : "Categories fetched successfully"
    return {
        statusCode: 200,
        data: categories,
        message,
    };
};

export const getCategoryById = async (id: string): Promise<ServiceResult> => {
    const category = await CategoryModel.findById(id);
    const message = category ? 'Category fetched successfully' : 'Category not found'
    const statusCode = category ? 200 : 404
    if (!category) {

        return {
            statusCode,
            message
        };
    }

    return {
        statusCode,
        data: category,
        message
    };
};



export const createCategory = async (categoryDTO: CreateCategoryDTO): Promise<ServiceResult> => {
    const existingCategory = await CategoryModel.findOne({
        name: categoryDTO.name.trim(),
    });
    const message = existingCategory ? 'Category with this name already exists' : 'Category created successfully'
    const statusCode = existingCategory ? 409 : 201


    if (existingCategory) {
        return {
            statusCode,
            message
        };
    }

    const category = await CategoryModel.create({
        ...categoryDTO,
        name: categoryDTO.name.trim(),
    });

    return {
        statusCode,
        data: category,
        message
    };
};

export const updateCategory = async (
    id: string,
    categoryDTO: UpdateCategoryDTO,
): Promise<ServiceResult> => {

    const message = 'Category updated successfully'
    const statusCode = 200

    if (categoryDTO.name) {
        const existingCategory = await CategoryModel.findOne({
            _id: { $ne: id },
            name: categoryDTO.name.trim(),
        });

        if (existingCategory) {
            return {
                message: 'Category with this name already exists',
                statusCode: 409
            }
        }
    }

    const category = await CategoryModel.findByIdAndUpdate(
        id,
        {
            ...categoryDTO,
            ...(categoryDTO.name && {
                name: categoryDTO.name.trim(),
            }),
        },
        {
            new: true,
            runValidators: true,
        },
    );

    if (!category) {
        return {
            message: 'Category not found',
            statusCode: 404
        }
    }

    return {
        statusCode,
        data: category,
        message
    };

};

export const deleteCategory = async (id: string): Promise<ServiceResult> => {
    const category = await CategoryModel.findByIdAndDelete(id);

    const message = category ? 'Category deleted successfully' : 'Category not found'
    const statusCode = category ? 200 : 404

    if (!category) {
        return {
            message,
            statusCode
        }
    }


    return {
        data: category,
        message,
        statusCode
    };
};
