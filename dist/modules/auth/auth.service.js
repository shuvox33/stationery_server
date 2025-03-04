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
exports.authService = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../error/AppError"));
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config"));
const loginUserInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExist(payload.email);
    if (!user) {
        throw new AppError_1.default('Invalid credentials', http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    if (!(yield user_model_1.User.isPasswordMatched(payload.password, user.password))) {
        throw new AppError_1.default('Password is incorrect', http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    // create token and send it to user
    const JwtPayload = {
        email: user.email,
        role: user.role,
        userId: user._id.toString(),
    };
    // create access token
    const token = (0, auth_utils_1.createToken)(JwtPayload, config_1.default.jwtAccessTokenExpiresIn, config_1.default.jwtAccessTokenSecret);
    return {
        token,
    };
});
exports.authService = {
    loginUserInDB,
};
