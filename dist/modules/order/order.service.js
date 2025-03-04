"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const product_schema_1 = require("./../product/product.schema");
const order_schema_1 = require("./order.schema");
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_codes_1 = require("http-status-codes");
const order_utils_1 = require("./order.utils");
const Querybuilder_1 = __importDefault(require("../builder/Querybuilder"));
const order_constant_1 = require("./order.constant");
const createOrderToDB = (orderData, userId, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    const { product, quantity, totalPrice, name, email, phone, address, city, postalCode, } = orderData;
    // Validate user and product
    if (!userId) {
        throw new AppError_1.default('User not found', http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    const foundProduct = yield product_schema_1.Product.findById(product);
    if (!foundProduct) {
        throw new AppError_1.default('Product not found', http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    // Check product availability
    if (!(foundProduct === null || foundProduct === void 0 ? void 0 : foundProduct.inStock) || (foundProduct === null || foundProduct === void 0 ? void 0 : foundProduct.quantity) < quantity) {
        throw new AppError_1.default('Product is not available', http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    // Update product quantity
    yield product_schema_1.Product.findByIdAndUpdate(foundProduct._id, {
        $inc: { quantity: -quantity },
    });
    // Update product inStock status
    const updatedProduct = yield product_schema_1.Product.findById(foundProduct._id);
    if ((updatedProduct === null || updatedProduct === void 0 ? void 0 : updatedProduct.quantity) === 0) {
        yield product_schema_1.Product.findByIdAndUpdate(foundProduct._id, {
            $set: { inStock: false },
        });
    }
    // Calculate total price
    const calculatedTotalPrice = foundProduct.price * quantity;
    const finalTotalPrice = totalPrice !== null && totalPrice !== void 0 ? totalPrice : calculatedTotalPrice;
    // Create the order in the database
    const order = yield order_schema_1.Order.create({
        user: userId,
        product,
        quantity,
        totalPrice: finalTotalPrice,
        name,
        email,
        phone,
        address,
        city,
        postalCode,
        status: 'Pending',
        payment_status: 'Pending',
        transaction: {
            id: '',
            transactionStatus: '',
        },
    });
    // payment gateway integration shurjopay
    const shurjopayPayload = {
        amount: finalTotalPrice,
        order_id: order._id,
        currency: 'BDT',
        customer_name: name,
        customer_email: order.email,
        customer_phone: phone,
        customer_address: address,
        customer_city: city,
        customer_post_code: postalCode,
        client_ip,
    };
    const payment = yield order_utils_1.orderUtils.makePaymentAsyn(shurjopayPayload);
    // Update transaction details in the order
    if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
        yield order_schema_1.Order.updateOne({ _id: order._id }, {
            $set: {
                'transaction.id': payment.sp_order_id,
                'transaction.transactionStatus': payment.transactionStatus,
            },
        });
    }
    return {
        checkout_url: payment === null || payment === void 0 ? void 0 : payment.checkout_url,
    };
});
// verifyPayment shurjopay
const verifyPayment = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyPayment = yield order_utils_1.orderUtils.verifyPaymentAsync(order_id);
    if (verifyPayment.length) {
        yield order_schema_1.Order.findOneAndUpdate({
            'transaction.id': order_id,
        }, {
            'transaction.bank_status': verifyPayment[0].bank_status,
            'transaction.sp_code': verifyPayment[0].sp_code,
            'transaction.sp_message': verifyPayment[0].sp_message,
            'transaction.transactionStatus': verifyPayment[0].transactionStatus,
            'transaction.method': verifyPayment[0].method,
            'transaction.date_time': verifyPayment[0].date_time,
            payment_status: verifyPayment[0].bank_status === 'Success'
                ? 'Paid'
                : verifyPayment[0].bank_status === 'Failed'
                    ? 'Pending'
                    : verifyPayment[0].bank_status === 'Cancel'
                        ? 'Cancelled'
                        : 'Pending',
        });
    }
    return verifyPayment;
});
// updatePaymentStatus function
const updatePaymentStatus = (transaction_id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_schema_1.Order.updateOne({ transaction: transaction_id }, { payment_status: status }, { new: true });
    console.log(`Payment status updated to ${status} for order ${orderId}`);
    return result;
});
const getRevinueFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_schema_1.Order.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'productDetails',
            },
        },
        {
            $unwind: '$productDetails',
        },
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: { $multiply: ['$quantity', '$productDetails.price'] },
                },
            },
        },
        { $project: { _id: 0, totalRevenue: 1 } },
    ]);
    return result;
});
const getAllOrdersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new Querybuilder_1.default(order_schema_1.Order.find(), query)
        .search(order_constant_1.orderSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield orderQuery.modelQuery;
    const meta = yield orderQuery.countTotal();
    return {
        result,
        meta,
    };
});
const getSingleOrderFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_schema_1.Order.findById(id).populate('product').populate('user');
    return result;
});
const updateOrderToDB = (orderId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_schema_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default('Order not found', http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    const product = order.product;
    if (status === 'Cancelled' && product && typeof product !== 'string') {
        yield product_schema_1.Product.findByIdAndUpdate(product._id, {
            $inc: { quantity: order.quantity },
            inStock: true,
        });
    }
    const result = yield order_schema_1.Order.findByIdAndUpdate(orderId, { status }, { new: true });
    return result;
});
const deleteOrderFromDB = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_schema_1.Order.findById(orderId).populate('product');
    if (!order) {
        throw new AppError_1.default('Order not found', http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    const product = order.product;
    // update product quantity and inStock status if order is deleted
    if (product && typeof product !== 'string') {
        yield product_schema_1.Product.findByIdAndUpdate(product._id, {
            $inc: { quantity: order.quantity },
            inStock: true,
        }, { new: true });
    }
    const result = yield order.deleteOne();
    return result;
});
const getMyOrdersFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_schema_1.Order.find({ user: userId }).populate('product').populate('user');
    return result;
});
exports.OrderService = {
    createOrderToDB,
    getRevinueFromDB,
    getAllOrdersFromDB,
    getSingleOrderFromDB,
    updateOrderToDB,
    deleteOrderFromDB,
    updatePaymentStatus,
    verifyPayment,
    getMyOrdersFromDB,
};
