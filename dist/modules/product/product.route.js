"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoute = void 0;
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const multer_config_1 = require("../../../src/config/multer.config");
const router = (0, express_1.Router)();
router.post('/create', (0, auth_1.default)(user_constant_1.USER_ROLES.admin), multer_config_1.multerUpload.single('image'), product_controller_1.ProductController.createProduct);
router.get('/', 
// auth(USER_ROLES.admin),
product_controller_1.ProductController.getAllProducts);
router.get('/:productId', 
// auth(USER_ROLES.admin),
product_controller_1.ProductController.getSingleProduct);
router.put('/:productId', (0, auth_1.default)(user_constant_1.USER_ROLES.admin), multer_config_1.multerUpload.single('image'), product_controller_1.ProductController.updateProduct);
router.delete('/:productId', (0, auth_1.default)(user_constant_1.USER_ROLES.admin), product_controller_1.ProductController.deletedProduct);
exports.ProductRoute = router;
