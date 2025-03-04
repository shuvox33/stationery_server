"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./middleware/globalErrorHandler"));
const notFound_1 = __importDefault(require("./middleware/notFound"));
const app = (0, express_1.default)();
// parser -->
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
//corse setup :
const corsOptions = {
    origin: 'https://frontend-note-and-nest.vercel.app',
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
//routes
app.use('/api', router_1.default);
app.get('/', (req, res) => {
    res.send('This api is working');
});
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
