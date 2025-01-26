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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const product_schema_1 = require("../product/product.schema");
const order_schema_1 = require("./order.schema");
const createOrderToDB = (orderData, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, product, quantity, totalPrice } = orderData;
    const foundProduct = yield product_schema_1.Product.findById(product);
    if (!foundProduct) {
        return res.status(404).json({
            status: 'false',
            message: 'Product not found',
        });
    }
    // check if product is available or not
    if (!(foundProduct === null || foundProduct === void 0 ? void 0 : foundProduct.inStock) || (foundProduct === null || foundProduct === void 0 ? void 0 : foundProduct.quantity) < quantity) {
        return res.status(400).json({
            status: 'false',
            message: 'Product is not available or insufficient quantity',
        });
    }
    // update product quantity
    yield product_schema_1.Product.findByIdAndUpdate(foundProduct._id, {
        $inc: { quantity: -quantity },
    });
    // update product inStock status
    const updatedProduct = yield product_schema_1.Product.findById(foundProduct._id);
    if ((updatedProduct === null || updatedProduct === void 0 ? void 0 : updatedProduct.quantity) === 0) {
        yield product_schema_1.Product.findByIdAndUpdate(foundProduct._id, {
            $set: { inStock: false },
        });
    }
    yield foundProduct.save();
    // calculate total price for the order
    const calculatedTotalPrice = foundProduct.price * quantity;
    const finalTotalPrice = totalPrice !== null && totalPrice !== void 0 ? totalPrice : calculatedTotalPrice;
    const order = yield order_schema_1.Order.create({
        email,
        product: foundProduct._id,
        quantity,
        totalPrice: finalTotalPrice,
    });
    return order;
});
// get total revenue from db :
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
exports.OrderService = {
    createOrderToDB,
    getRevinueFromDB,
};
