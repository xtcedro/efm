import express from "express";
import { chatController } from "../controllers/chatController.js"; // ✅ Use the correct export name

const router = express.Router();

router.post("/", chatController); // ✅ Use the correct function

export default router;