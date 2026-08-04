import { Document } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "user" | "admin";
    phone?: string;
    avatar?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface RegisterUserDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "user" | "admin";
    phone?: string;
    avatar?: string | null;
}

export interface LoginUserDTO {
    email: string;
    password: string;
}

export interface UpdateUserDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    avatar?: string | null;
}