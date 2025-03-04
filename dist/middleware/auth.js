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
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../error/AppError"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError_1.default('You are not authorized', http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        // checking token is valid or not :
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessTokenSecret);
        const { error, role, email } = decoded;
        if (error) {
            throw new AppError_1.default('Invalid credentials', http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        // const user = await User.isUserExist(email);
        // if (!user) {
        //   throw new AppError('User not found', StatusCodes.NOT_FOUND);
        // }
        // checking user role :
        // if (requiredRoles && !requiredRoles.includes(role)) {
        //   throw new AppError('You are not authorized! Invalid role', StatusCodes.UNAUTHORIZED);
        // }
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
