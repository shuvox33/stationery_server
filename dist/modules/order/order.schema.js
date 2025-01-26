"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const orderSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        message: 'Email is required',
        validate: {
            validator: (v) => validator_1.default.isEmail(v),
            message: 'Invalid email address',
        },
    },
    product: {
        type: Object,
        required: true,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
