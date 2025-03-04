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
exports.ProductService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const Querybuilder_1 = __importDefault(require("../builder/Querybuilder"));
const product_constant_1 = require("./product.constant");
const product_schema_1 = require("./product.schema");
const http_status_codes_1 = require("http-status-codes");
const createProductToDB = (product, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new AppError_1.default('User not found', http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    const createProduct = yield product_schema_1.Product.create(Object.assign(Object.assign({}, product), { author: userId }));
    return createProduct;
});
const getAllProductsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new Querybuilder_1.default(product_schema_1.Product.find(), query)
        .search(product_constant_1.productSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield productQuery.modelQuery;
    const meta = yield productQuery.countTotal();
    return {
        result,
        meta,
    };
});
const getSingleProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_schema_1.Product.findById(id);
    return product;
});
const updateProductById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // update inStock status
    if (typeof payload.quantity === 'number') {
        payload.inStock = payload.quantity > 0;
    }
    const updatedProduct = yield product_schema_1.Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
        updatedAt: new Date(),
    });
    return updatedProduct;
});
const deleteProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedProduct = yield product_schema_1.Product.findByIdAndDelete(id);
    return deletedProduct;
});
exports.ProductService = {
    createProductToDB,
    getAllProductsFromDB,
    getSingleProductById,
    updateProductById,
    deleteProductById,
};
