// app.js
import express from 'express';
import cors from 'cors';
import bookingRoutes from './src/routes/bookings.js';
import availabilityRoutes from './src/routes/availability.js';
import customerRoutes from './src/routes/customers.js';
import { webhookRouter, paymentRouter } from "./src/routes/payment.js";
// import other routes if needed

const app = express();

// Stripe requires raw body for signature verification
app.use("/api/stripe", webhookRouter);

// Middleware
app.use(express.json()); // parse JSON request bodies
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

// Routes
app.use('/api/payments', paymentRouter);
app.use('/api/bookings', bookingRoutes);
app.use('/api', availabilityRoutes);
app.use('/api', customerRoutes);


// Optional: health check
app.get('/api/health', (req, res) => {
    res.json({ message: 'API is running' });
});

export default app;
