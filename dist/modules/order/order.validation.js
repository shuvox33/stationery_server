"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
const updateOrderValidation = zod_1.z.object({
    status: zod_1.z.string().optional(),
});
exports.OrderValidation = {
    updateOrderValidation,
};
