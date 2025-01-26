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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_schema_1 = require("./product.schema");
//TODO-1 : create product ------- :
const createProductToDB = (product) => __awaiter(void 0, void 0, void 0, function* () {
    const createdProduct = yield product_schema_1.Product.create(product);
    return createdProduct;
});
//TODO-2 : get all products by search term ------- :
const getAllProductsFromDB = (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    let searchFilter = {};
    if (searchTerm) {
        searchFilter = {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { brand: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } },
            ],
        };
    }
    const result = yield product_schema_1.Product.find(searchFilter);
    return result;
});
//TODO-3 : get single product by id ------- :
const getSingleProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_schema_1.Product.findById(id);
    return product;
});
//TODO-4 : update product ------- :
const updateProductById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedProduct = yield product_schema_1.Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
        updatedAt: new Date(),
    });
    return updatedProduct;
});
//TODO-5 : delete product :
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
