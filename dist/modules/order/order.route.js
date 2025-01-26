"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoute = void 0;
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const router = (0, express_1.Router)();
router.post('/', order_controller_1.OrderController.createOrder);
router.get('/revenue', order_controller_1.OrderController.getRevinue);
exports.OrderRoute = router;
