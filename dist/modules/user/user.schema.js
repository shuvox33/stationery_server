"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Enter your full name',
        })
            .min(3)
            .max(30),
        email: zod_1.z
            .string({
            required_error: 'email is required ',
        })
            .email(),
        password: zod_1.z
            .string({
            required_error: 'password is required',
        })
            .min(6, { message: 'Password must be at least 6 characters' }),
        role: zod_1.z.enum(['admin', 'user']).optional(),
        isBlocked: zod_1.z.boolean().optional(),
    }),
});
exports.UserValidation = {
    userValidationSchema,
};
