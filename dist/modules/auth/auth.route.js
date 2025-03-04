"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const auth_schema_1 = require("./auth.schema");
const router = (0, express_1.Router)();
router.post('/login', (0, validateRequest_1.default)(auth_schema_1.AuthValidation.loginValidationSchema), auth_controller_1.authController.loginUser);
exports.authRoutes = router;
