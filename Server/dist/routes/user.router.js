"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.use((0, cors_1.default)());
router.post("/userRegister", userController_1.userController.userRegister);
router.post("/userLogin", userController_1.userController.userLogin);
exports.default = router;
