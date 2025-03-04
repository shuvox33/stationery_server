"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("../error/AppError"));
const config_1 = __importDefault(require("../config"));
const handleValidationError_1 = __importDefault(require("../error/handleValidationError"));
const handleCastError_1 = __importDefault(require("../error/handleCastError"));
const handleZodError_1 = __importDefault(require("../error/handleZodError"));
const globalErrorHandler = (errors, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    let error = [
        {
            path: '',
            message: 'Something went wrong',
        },
    ];
    // checking there it's zod error or validation error
    if (errors instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(errors);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        error = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSource;
    }
    if ((errors === null || errors === void 0 ? void 0 : errors.name) === 'ValidationError') {
        const simplifiedError = (0, handleValidationError_1.default)(errors);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        error = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSource;
    }
    else if ((errors === null || errors === void 0 ? void 0 : errors.name) === 'CastError') {
        const simplifiedError = (0, handleCastError_1.default)(errors);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        error = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSource;
    }
    else if (errors instanceof AppError_1.default) {
        statusCode = errors === null || errors === void 0 ? void 0 : errors.statusCode;
        message = errors === null || errors === void 0 ? void 0 : errors.message;
        error = [
            {
                path: '',
                message: errors === null || errors === void 0 ? void 0 : errors.message,
            },
        ];
    }
    else if (errors instanceof Error) {
        message = errors === null || errors === void 0 ? void 0 : errors.message;
        error = [
            {
                path: '',
                message: errors === null || errors === void 0 ? void 0 : errors.message,
            },
        ];
    }
    // sending response
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        error,
        stack: config_1.default.nodeEnv === 'development' ? errors === null || errors === void 0 ? void 0 : errors.stack : null,
    });
    next();
};
exports.default = globalErrorHandler;
