import express from "express";
import { chatController } from "../controllers/chatController.js";

const router = express.Router();

// ✅ Debugging Log to Check if API is Hit
router.post("/", (req, res, next) => {
    console.log("Chat API hit with request body:", req.body);
    next();
});

router.post("/", chatController);

export default router;