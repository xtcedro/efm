import express from "express";
import { createPaymentIntent } from "../controllers/stripeController.js"; // Import controller

const router = express.Router();

// ✅ Create Payment Intent Route
router.post("/create-payment-intent", createPaymentIntent);

export default router;