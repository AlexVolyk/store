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
    // 1. 🚀 Query Optimization: Fetch ALL ordered products in ONE single batch query ($in)
    const productIds = orderDTO.items.map((item) => item.product);
    const products = await ProductModel.find({ _id: { $in: productIds } });

    // Map by string ID for fast O(1) in-memory lookup
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    // 2. In-memory validation and snapshot calculation (Zero additional DB calls)
    const orderItems = [];
    let itemsPrice = 0;

    for (const item of orderDTO.items) {
        const product = productMap.get(item.product);

        if (!product) {
            return {
                statusCode: 400,
                message: `Product not found: ${item.product}`,
            };
        }

        if (!product.isActive) {
            return {
                statusCode: 422,
                message: `Product is not available: ${product.name}`,
            };
        }

        if (product.stock < item.quantity) {
            return {
                statusCode: 422,
                message: `Not enough stock for product: ${product.name} (Available: ${product.stock}, Requested: ${item.quantity})`,
            };
        }

        const price = product.discountPrice ?? product.price;
        itemsPrice += price * item.quantity;

        orderItems.push({
            product: product._id,
            name: product.name,
            image: product.images?.[0] ?? '',
            price,
            quantity: item.quantity,
        });
    }

    const shippingPrice = orderDTO.shippingPrice ?? 0;
    const taxPrice = orderDTO.taxPrice ?? 0;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // 3. Create the order document
    const order = await OrderModel.create({
        user: userId,
        items: orderItems,
        shippingAddress: orderDTO.shippingAddress,
        paymentMethod: orderDTO.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
    });

    // 4. 🚀 Batch Decrement: Update stock across all products in ONE single atomic bulkWrite
    await ProductModel.bulkWrite(
        orderDTO.items.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { stock: -item.quantity } },
            },
        }))
    );

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

export const markOrderAsPaid = async (id: string): Promise<ServiceResult> => {
    const order = await OrderModel.findByIdAndUpdate(
        id,
        {
            paymentStatus: "paid",
            paidAt: new Date(),
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
    const existingOrder = await OrderModel.findById(id);

    if (!existingOrder) {
        return {
            statusCode: 404,
            message: "Order not found",
        };
    }

    const previousStatus = existingOrder.orderStatus;
    const newStatus = orderDTO.orderStatus;

    // 🚀 If order is newly cancelled, restore product inventory in ONE single bulkWrite
    if (previousStatus !== "cancelled" && newStatus === "cancelled") {
        await ProductModel.bulkWrite(
            existingOrder.items.map((item) => ({
                updateOne: {
                    filter: { _id: item.product },
                    update: { $inc: { stock: item.quantity } },
                },
            }))
        );
    }

    // 🚀 If a previously cancelled order is reopened, re-decrement stock in ONE single bulkWrite
    if (previousStatus === "cancelled" && newStatus !== "cancelled") {
        await ProductModel.bulkWrite(
            existingOrder.items.map((item) => ({
                updateOne: {
                    filter: { _id: item.product },
                    update: { $inc: { stock: -item.quantity } },
                },
            }))
        );
    }

    existingOrder.orderStatus = newStatus;
    if (newStatus === "delivered" && !existingOrder.deliveredAt) {
        existingOrder.deliveredAt = new Date();
    }

    await existingOrder.save();

    return {
        statusCode: 200,
        data: existingOrder,
        message: "Order status updated successfully",
    };
};
