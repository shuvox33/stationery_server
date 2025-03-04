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
exports.ProductController = void 0;
const product_service_1 = require("./product.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const product_schema_1 = require("./product.schema");
const AppError_1 = __importDefault(require("../../error/AppError"));
const createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId } = req.user;
    let productData;
    try {
        if (!req.body.data) {
            throw new AppError_1.default('Missing product data', http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        productData = JSON.parse(req.body.data);
    }
    catch (error) {
        throw new AppError_1.default('Invalid product data', http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const result = yield product_service_1.ProductService.createProductToDB(Object.assign(Object.assign({}, productData), { image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path }), userId);
    const products = yield product_schema_1.Product.findById(result._id);
    if (!products) {
        throw new AppError_1.default('Product not found', http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Product created successfully',
        data: result,
    });
}));
// get all products by search term  :
const getAllProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductService.getAllProductsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Products retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
}));
// get single product by id :
const getSingleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const result = yield product_service_1.ProductService.getSingleProductById(productId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Product retrieved successfully',
        data: result,
    });
}));
// update product :
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    let productData;
    try {
        if (!req.body.data) {
            throw new AppError_1.default('Missing product data', http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        productData = JSON.parse(req.body.data);
    }
    catch (error) {
        throw new AppError_1.default('Invalid product data', http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    // get image path
    const imagePath = req.file ? req.file.path : productData.image;
    const result = yield product_service_1.ProductService.updateProductById(productId, Object.assign(Object.assign({}, productData), { image: imagePath }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Product updated successfully',
        data: result,
    });
}));
// delete product :
const deletedProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    yield product_service_1.ProductService.deleteProductById(productId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Product deleted successfully',
        data: {},
    });
}));
exports.ProductController = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deletedProduct,
};
