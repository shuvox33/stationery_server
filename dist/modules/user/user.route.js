"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("./user.constant");
const router = (0, express_1.Router)();
router.post('/create', 
//   validateRequest(UserValidation.userValidationSchema),
user_controller_1.UserControllers.createUser);
router.get('/', user_controller_1.UserControllers.getAllUser);
router.get('/:id', user_controller_1.UserControllers.getSingleUser);
router.put('/:id', (0, auth_1.default)(user_constant_1.USER_ROLES.admin), 
//   validateRequest(UserValidation.userValidationSchema),
user_controller_1.UserControllers.updateUserBlock);
router.patch('/update/:id', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.user), user_controller_1.UserControllers.updateUserDetails);
exports.userRoutes = router;
