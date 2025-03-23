"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const user_router_1 = __importDefault(require("./routes/user.router"));
dotenv_1.default.config(); // Load .env variables
const app = (0, express_1.default)();
const PORT = process.env.PORT || 2300;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Routes
app.use("/users", user_router_1.default);
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
