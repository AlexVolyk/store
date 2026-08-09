import {
    OrderModel,
    ProductModel,
} from "../models/index.ts";
import { OrderSchemaType } from "../models/order.models.ts";

import type { ServiceResult } from "../types/index.ts";
import { CreateOrderDTO, UpdateOrderStatusDTO } from "../validators/order.validators.ts";
import { HydratedDocument } from 'mongoose';

type OrderDocument = HydratedDocument<OrderSchemaType>;

export const createOrder = async (
    userId: string,
    orderDTO: CreateOrderDTO,
): Promise<ServiceResult> => {
    const orderItems = await Promise.all(
        orderDTO.items.map(async (item) => {
            const product = await ProductModel.findById(item.product);

            if (!product) {
                return {
                    error: `Product not found: ${item.product}`,
                    statusCode: 400,
                };
            }

            if (!product.isActive) {
                return {
                    error: `Product is not available: ${product.name}`,
                    statusCode: 422,
                };
            }

            if (product.stock < item.quantity) {
                return {
                    error: `Not enough stock for product: ${product.name}`,
                    statusCode: 422,
                };
            }

            const price = product.discountPrice ?? product.price;

            return {
                product: product._id,
                name: product.name,
                image: product.images[0],
                price,
                quantity: item.quantity,
            };
        }),
    );

    const errorItem = orderItems.find(
        (item) => "error" in item,
    );

    if (errorItem && "error" in errorItem) {
        return {
            statusCode: errorItem.statusCode || 400,
            message: errorItem.error || 'Bad request',
        };
    }

    const itemsPrice = orderItems.reduce(
        (sum, item) => {
            if ("error" in item) {
                return sum;
            }

            return (
                sum + item.price * item.quantity
            );
        },
        0,
    );

    const shippingPrice =
        orderDTO.shippingPrice ?? 0;

    const taxPrice =
        orderDTO.taxPrice ?? 0;

    const totalPrice =
        itemsPrice +
        shippingPrice +
        taxPrice;

    const order =
        await OrderModel.create({
            user: userId,
            items: orderItems,
            shippingAddress:
                orderDTO.shippingAddress,
            paymentMethod:
                orderDTO.paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        });

    return {
        statusCode: 201,
        data: order,
        message: "Order created successfully",
    };
};


export const getMyOrders = async (userId: string): Promise<ServiceResult> => {
    const orders = await OrderModel.find({
        user: userId,
    }).sort({
        createdAt: -1,
    });

    return {
        statusCode: 200,
        data: orders,
        message: "Orders fetched successfully",
    };
};

export const getOrderById = async (id: string): Promise<ServiceResult<OrderDocument>> => {
    const order = await OrderModel.findById(id).populate(
        "user",
        "firstName lastName email role",
    );

    if (!order) {
        return {
            statusCode: 404,
            message: "Order not found",
        };
    }

    return {
        statusCode: 200,
        data: order,
        message: "Order fetched successfully",
    };
};

export const markOrderAsPaid = async (id: string): Promise<ServiceResult<OrderDocument>> => {
    const order = await OrderModel.findById(id);

    if (!order) {
        return {
            statusCode: 404,
            message: "Order not found",
        };
    }

    if (order.paymentStatus === "paid") {
        return {
            statusCode: 400,
            message: "Order is already paid",
        };
    }

    order.paymentStatus = "paid";
    order.paidAt = new Date();

    await order.save();

    return {
        statusCode: 200,
        data: order,
        message: "Order marked as paid",
    };
};


export const markOrderAsDelivered = async (id: string): Promise<ServiceResult> => {
    const order = await OrderModel.findByIdAndUpdate(
        id,
        {
            orderStatus: "delivered",
            deliveredAt: new Date(),
        },
        {
            new: true,
            runValidators: true,
        },
    );

    if (!order) {
        return {
            statusCode: 404,
            message: "Order not found",
        };
    }

    return {
        statusCode: 200,
        data: order,
        message: "Order marked as delivered",
    };
};

export const updateOrderStatus = async (
    id: string,
    orderDTO: UpdateOrderStatusDTO,
): Promise<ServiceResult> => {
    const order = await OrderModel.findByIdAndUpdate(
        id,
        {
            orderStatus: orderDTO.orderStatus,
        },
        {
            new: true,
            runValidators: true,
        },
    );

    if (!order) {
        return {
            statusCode: 404,
            message: "Order not found",
        };
    }

    return {
        statusCode: 200,
        data: order,
        message: "Order status updated successfully",
    };
};
