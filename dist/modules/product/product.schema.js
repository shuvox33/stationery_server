"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        message: 'Name is required',
    },
    brand: {
        type: String,
        required: true,
        trim: true,
        message: 'Brand is required',
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: (v) => v > 0,
            message: 'Price must be a positive number',
        },
    },
    category: {
        type: String,
        enum: [
            'Writing',
            'Office Supplies',
            'Art Supplies',
            'Educational',
            'Technology',
        ],
        required: true,
        message: 'Category is required',
    },
    description: {
        type: String,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        message: 'Quantity must be a positive number',
    },
    inStock: {
        type: Boolean,
        required: true,
        message: 'In stock is required',
    },
    image: {
        type: String,
    },
}, { timestamps: true });
exports.Product = (0, mongoose_1.model)('Product', productSchema);
