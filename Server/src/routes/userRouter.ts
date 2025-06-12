import express from "express";
import cors from "cors";
import { userController } from "../controllers/userController";

const router = express.Router();
router.use(cors());

router.post("/userRegister", userController.userRegister);
router.post("/userLogin", userController.userLogin);
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserByIdForAdmin);
router.get("/userProfile", userController.getUserProfile);
router.put("/userProfile", userController.updateUserProfile);
router.delete("/users/:id", userController.deleteUser);

export default router;
