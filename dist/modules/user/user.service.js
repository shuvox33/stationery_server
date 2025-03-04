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
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("./user.model");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_codes_1 = require("http-status-codes");
const createUserToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.isUserExist(payload.email);
    if (isUserExist) {
        throw new AppError_1.default('User already exist', http_status_codes_1.StatusCodes.CONFLICT);
    }
    const createdUser = yield user_model_1.User.create(payload);
    return createdUser;
});
const getAllUserFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const allUser = yield user_model_1.User.find({});
    return allUser;
});
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const singleUser = yield user_model_1.User.findOne({ _id: id });
    return singleUser;
});
const updateUserInDB = (id, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ _id: id }, { isBlocked: true }, {
        new: true,
    });
    return updatedUser;
});
const updateUserDetails = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the password is being updated
    if (data.password) {
        data.password = yield bcrypt_1.default.hash(data.password, Number(config_1.default.bcryptSaltRounds));
    }
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ _id: id }, data, {
        new: true,
    });
    return updatedUser;
});
exports.UserService = {
    createUserToDB,
    getAllUserFromDB,
    updateUserInDB,
    getSingleUserFromDB,
    updateUserDetails,
};
