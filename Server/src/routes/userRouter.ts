import express from "express";
import cors from "cors";
import { userController } from "../controllers/userController";

const router = express.Router();
router.use(cors());

router.post("/userRegister", userController.userRegister);
router.post("/userLogin", userController.userLogin);

export default router;
