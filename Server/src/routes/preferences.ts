import express from "express";
import saveUserPreferences from "../controllers/preferenceController";

const router = express.Router();

router.post("/save", saveUserPreferences);

export default router;
