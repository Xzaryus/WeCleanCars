import express from "express";
import { Router } from "express";
import { stripeWebhook } from "../payments/stripeWebhook.js";
import { createPaymentIntent } from "../controllers/paymentController.js";

const webhookRouter = Router();
const paymentRouter = Router();

// Stripe requires raw body for this route only
webhookRouter.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);
paymentRouter.post("/create-intent", createPaymentIntent);

export { webhookRouter, paymentRouter };
