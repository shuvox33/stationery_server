"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const product_route_1 = require("./modules/product/product.route");
const order_route_1 = require("./modules/order/order.route");
const app = (0, express_1.default)();
// parser -->
app.use(express_1.default.json());
//corse setup :
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
//routes
app.use('/api/products', product_route_1.ProductRoute);
app.use('/api/orders', order_route_1.OrderRoute);
app.get('/', (req, res) => {
    res.send('This api is working');
});
exports.default = app;
