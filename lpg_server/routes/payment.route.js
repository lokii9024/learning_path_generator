import { createRazorpayOrder, verifyRazorpayPayment, webhookHandler } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import express from "express";
const router = express.Router();

router.post("/razorpay/create-order",verifyJWT, createRazorpayOrder);
router.post("/razorpay/verify-payment",verifyJWT, verifyRazorpayPayment);
router.post("/razorpay/webhook", express.raw({type: 'application/json'}), webhookHandler);

export default router;