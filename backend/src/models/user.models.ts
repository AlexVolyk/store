
import { db } from '../config/db.ts';
import { IUser } from '../types/index.ts';


const UserSchema = new db.Schema<IUser>({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    phone: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
        default: null,
    },
},
    {
        timestamps: true,
    });

export const UserModel = db.model('User', UserSchema)