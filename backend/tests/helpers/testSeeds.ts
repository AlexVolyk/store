import bcrypt from 'bcrypt';
import {
    CartModel,
    CategoryModel,
    OrderModel,
    ProductModel,
    ReviewModel,
    UserModel,
    WishlistModel,
} from '../../src/models/index.ts';
import { getToken } from '../../src/utils/token.utils.ts';
import { redis } from '../../src/config/redis.ts';
import type { UserRole } from '../../src/constants/index.ts';

const DEFAULT_TEST_PASSWORD = 'Password123!';
const PRECOMPUTED_TEST_PASSWORD_HASH = bcrypt.hashSync(DEFAULT_TEST_PASSWORD, 1);

export const getTestHashedPassword = async (password = DEFAULT_TEST_PASSWORD) => {
    if (password === DEFAULT_TEST_PASSWORD) {
        return PRECOMPUTED_TEST_PASSWORD_HASH;
    }
    return bcrypt.hash(password, 1);
};

export const clearTestDatabase = async () => {
    await Promise.all([
        UserModel.deleteMany({}),
        CategoryModel.deleteMany({}),
        ProductModel.deleteMany({}),
        OrderModel.deleteMany({}),
        ReviewModel.deleteMany({}),
        CartModel.deleteMany({}),
        WishlistModel.deleteMany({}),
    ]);

    if (redis.isOpen) {
        await redis.flushDb();
    }
};

export const createTestUser = async (
    role: UserRole = 'user',
    email = `test_${Date.now()}_${Math.random().toString(36).substring(7)}@test.com`,
    password = DEFAULT_TEST_PASSWORD,
) => {
    const hashedPassword = await getTestHashedPassword(password);
    const user = await UserModel.create({
        firstName: role === 'admin' ? 'Admin' : 'Test',
        lastName: 'User',
        email,
        password: hashedPassword,
        phone: '1234567890',
        role,
        shippingAddress: {
            street: '123 Test St',
            city: 'San Francisco',
            postalCode: '94103',
            country: 'United States',
        },
    });

    const token = getToken(user._id.toString());

    return { user, token, rawPassword: password };
};

export const createTestCategory = async (name = 'Test Category') => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
    return CategoryModel.create({
        name,
        slug,
        description: 'Test category description',
    });
};

export const createTestProduct = async (
    categoryId: string,
    overrides: Record<string, unknown> = {},
) => {
    const name = (overrides.name as string) || `Test Product ${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);

    return ProductModel.create({
        name,
        slug,
        description: 'High-grade precision luxury item with refined tactile finishes.',
        price: 250,
        discountPrice: 200,
        stock: 15,
        images: ['https://images.unsplash.com/photo-1?w=900'],
        brand: 'Forma Studio',
        category: categoryId,
        badge: 'New Arrival',
        ...overrides,
    });
};

export const createTestOrder = async (
    userId: string,
    productId: string,
    overrides: Record<string, unknown> = {},
) => {
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    return OrderModel.create({
        orderNumber,
        user: userId,
        items: [
            {
                product: productId,
                name: 'Test Product',
                price: 200,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1?w=900',
            },
        ],
        shippingAddress: {
            fullName: 'Test User',
            phone: '1234567890',
            addressLine: '123 Test St',
            city: 'San Francisco',
            postalCode: '94103',
            country: 'United States',
        },
        itemsPrice: 200,
        shippingPrice: 15,
        taxPrice: 16,
        totalPrice: 231,
        paymentMethod: 'Credit Card (Stripe)',
        paymentStatus: 'paid',
        orderStatus: 'delivered',
        paidAt: new Date(),
        deliveredAt: new Date(),
        ...overrides,
    });
};
