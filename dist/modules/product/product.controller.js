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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("./product.service");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = __rest(req.body, []);
        const result = yield product_service_1.ProductService.createProductToDB(data);
        return res.status(200).json({
            success: true,
            message: 'Product created successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Validation failed',
            error: error,
        });
    }
});
// get all products by search term  :
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchTerm } = req.query;
        const result = yield product_service_1.ProductService.getAllProductsFromDB(searchTerm);
        return res.status(200).json({
            status: true,
            message: 'Products retrieved successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'Failed to get products',
            error: error,
        });
    }
});
// get single product by id :
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const result = yield product_service_1.ProductService.getSingleProductById(productId);
        return res.status(200).json({
            status: 'true',
            message: 'Product retrieved successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'Failed to get product',
            error: error,
        });
    }
});
// update product :
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const data = req.body;
        const result = yield product_service_1.ProductService.updateProductById(productId, data);
        return res.status(200).json({
            status: 'true',
            message: 'Product updated successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'Failed to update product',
            error: error,
        });
    }
});
// delete product :
const deletedProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        yield product_service_1.ProductService.deleteProductById(productId);
        return res.status(200).json({
            status: 'true',
            message: 'Product deleted successfully',
            data: {},
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'Failed to delete product',
            error: error,
        });
    }
});
exports.ProductController = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deletedProduct,
};
