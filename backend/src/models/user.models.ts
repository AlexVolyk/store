import { db } from '../config/db.ts';
import { IUser } from '../types/index.ts';

const UserAddressSchema = new db.Schema(
    {
        street: {
            type: String,
            trim: true,
            default: '',
        },
        city: {
            type: String,
            trim: true,
            default: '',
        },
        postalCode: {
            type: String,
            trim: true,
            default: '',
        },
        country: {
            type: String,
            trim: true,
            default: 'United States',
        },
    },
    { _id: false }
);

const UserSchema = new db.Schema<IUser>(
    {
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
            enum: ['user', 'admin'],
            default: 'user',
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        avatar: {
            type: String,
            default: null,
        },
        bio: {
            type: String,
            trim: true,
            default: '',
        },
        newsletter: {
            type: Boolean,
            default: true,
        },
        shippingAddress: {
            type: UserAddressSchema,
            default: () => ({}),
        },
    },
    {
        timestamps: true,
    }
);

// Virtual field for user full name
UserSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`.trim();
});

export const UserModel = db.model<IUser>('User', UserSchema);