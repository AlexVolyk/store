import { UserModel } from '../models/index.ts';
import type { ServiceResult } from '../types/index.ts';
import { comparePasswords, getToken, hashPassword } from '../utils/index.ts';
import { LoginUserDTO, RegisterUserDTO } from '../validators/auth.validators.ts';

type SafeUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'user' | 'admin';
    phone?: string;
    avatar?: string | null;
};

const toSafeUser = (user: SafeUser): SafeUser => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
});

export const registerUser = async (registerDTO: RegisterUserDTO): Promise<ServiceResult<SafeUser>> => {
    const { firstName, lastName, email, phone, avatar, password } = registerDTO;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        return {
            statusCode: 409,
            message: 'Email is already in use',
        };
    }


    const user = await UserModel.create({
        firstName,
        lastName,
        email,
        phone,
        avatar,
        password: hashPassword(password),
    });

    const token = getToken(user.id);

    return {
        statusCode: 201,
        message: 'User registered successfully',
        data: toSafeUser(user),
        token,
    };
};

export const loginUser = async (loginDTO: LoginUserDTO): Promise<ServiceResult<SafeUser>> => {
    const { email, password } = loginDTO;

    const user = await UserModel.findOne({ email });

    if (!user) {
        return {
            statusCode: 401,
            message: 'Incorrect email or password',
        };
    }

    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
        return {
            statusCode: 401,
            message: 'Incorrect email or password',
        };
    }

    const token = getToken(user.id);

    return {
        statusCode: 200,
        message: 'User has successfully logged in',
        data: toSafeUser(user),
        token,
    };
};
