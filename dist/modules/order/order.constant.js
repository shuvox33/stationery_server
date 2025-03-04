"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSearchableFields = exports.OrderSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.OrderSchema = new mongoose_1.default.Schema({
    transaction: {
        id: { type: String, required: true },
        bank_status: String,
        sp_code: String,
        sp_message: String,
        transactionStatus: String,
        method: String,
        date_time: Date,
    },
});
exports.orderSearchableFields = ['product', 'user'];
