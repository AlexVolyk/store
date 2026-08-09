import { UserModel } from '../models/index.ts';
import { ServiceResult } from '../types/service.types.ts';
import { hashPassword } from '../utils/index.ts';
import { UpdateUserDTO } from '../validators/user.validator.ts';


export const getUsers = async (): Promise<ServiceResult> => {
    const users = await UserModel.find(
        {},
        {
            createdAt: 0,
            updatedAt: 0,
            password: 0,
        },
    );

    return {
        statusCode: 200,
        data: users,
        message: "Users fetched successfully",
    };
};


export const updateUser = async (
    id: string,
    userDTO: UpdateUserDTO,
): Promise<ServiceResult> => {
    if (userDTO.email) {
        const existingUser = await UserModel.findOne({
            _id: { $ne: id },
            email: userDTO.email,
        });

        if (existingUser) {
            return {
                statusCode: 409,
                message: "Email is already in use",
            };
        }
    }

    const updateUserData = {
        ...userDTO,
        ...(userDTO.password
            ? {
                password: hashPassword(userDTO.password),
            }
            : {}),
    };

    const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        updateUserData,
        {
            new: true,
            runValidators: true,
        },
    ).select("-password -createdAt -updatedAt");

    if (!updatedUser) {
        return {
            statusCode: 404,
            message: "User not found",
        };
    }

    return {
        statusCode: 200,
        data: updatedUser,
        message: "User updated successfully",
    };
};

export const deleteUser = async (id: string): Promise<ServiceResult> => {
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
        return {
            statusCode: 404,
            message: "User not found",
        };
    }

    return {
        statusCode: 200,
        data: deletedUser,
        message: "User deleted successfully",
    };
};

