import express from "express";
import saveUserPreferences from "../controllers/preferenceController";

const router = express.Router();
router.post("/preferences", saveUserPreferences);
export default router;
