import {
    CartModel,
    ProductModel,
} from "../models/index.ts";

import type {
    ServiceResult,
} from "../types/index.ts";
import { AddCartItemDTO, UpdateCartItemDTO } from "../validators/cart.validators.ts";

export const getCart = async (userId: string,): Promise<ServiceResult> => {
    const cart = await CartModel.findOne({
        user: userId,
    }).populate("items.product");

    return {
        statusCode: 200,
        data: cart ?? {
            user: userId,
            items: [],
        },
        message: "Cart fetched successfully",
    };
};

export const addCartItem = async (
    userId: string,
    cartDTO: AddCartItemDTO
): Promise<ServiceResult> => {
    const quantity = cartDTO.quantity ?? 1;
    const product = await ProductModel.findById(
        cartDTO.productId,
    );

    if (!product) {
        return {
            statusCode: 404,
            message: "Product not found",
        };
    }

    if (!product.isActive) {
        return {
            statusCode: 422,
            message: "Product is not available",
        };
    }

    if (product.stock < quantity) {
        return {
            statusCode: 422,
            message: "Not enough product stock",
        };
    }

    const cart = await CartModel.findOneAndUpdate(
        { user: userId },
        {
            $setOnInsert: {
                user: userId,
            },
        },
        {
            new: true,
            upsert: true,
        },
    );

    const item = cart.items.find(
        (cartItem) => cartItem.product.toString() === cartDTO.productId,
    );

    if (item) {
        const newQuantity =
            item.quantity + quantity;

        if (newQuantity > product.stock) {
            return {
                statusCode: 422,
                message: "Not enough product stock",
            };
        }

        item.quantity = newQuantity;
    } else {
        cart.items.push({
            product: product._id,
            quantity,
        });
    }

    await cart.save();
    await cart.populate("items.product");

    return {
        statusCode: 200,
        data: cart,
        message: "Cart item added successfully",
    };
};


export const updateCartItem = async (
    userId: string,
    productId: string,
    cartDTO: UpdateCartItemDTO
): Promise<ServiceResult> => {
    const cart = await CartModel.findOne({
        user: userId,
    });

    if (!cart) {
        return {
            statusCode: 404,
            message: "Cart not found",
        };
    }

    const item = cart.items.find(
        (cartItem) => cartItem.product.toString() === productId,
    );

    if (!item) {
        return {
            statusCode: 404,
            message: "Cart item not found",
        };
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
        return {
            statusCode: 404,
            message: "Product not found",
        };
    }

    if (product.stock < cartDTO.quantity) {
        return {
            statusCode: 422,
            message: "Not enough product stock",
        };
    }

    item.quantity = cartDTO.quantity;

    await cart.save();
    await cart.populate("items.product");

    return {
        statusCode: 200,
        data: cart,
        message: "Cart item updated successfully",
    };
};


export const deleteCartItem = async (
    userId: string,
    productId: string,
): Promise<ServiceResult> => {
    const cart = await CartModel.findOne({
        user: userId,
    });

    if (!cart) {
        return {
            statusCode: 404,
            message: "Cart not found",
        };
    }

    const itemExists = cart.items.some(
        (cartItem) => cartItem.product.toString() === productId,
    );

    if (!itemExists) {
        return {
            statusCode: 404,
            message: "Cart item not found",
        };
    }

    cart.items = cart.items.filter(
        (cartItem) => cartItem.product.toString() !== productId,
    );

    await cart.save();
    await cart.populate("items.product");

    return {
        statusCode: 200,
        data: cart,
        message: "Cart item deleted successfully",
    };
};


export const clearCart = async (userId: string): Promise<ServiceResult> => {
    const cart = await CartModel.findOneAndUpdate(
        { user: userId },
        {
            items: [],
        },
        {
            new: true,
            upsert: true,
        },
    );

    return {
        statusCode: 200,
        data: cart,
        message: "Cart cleared successfully",
    };
};
