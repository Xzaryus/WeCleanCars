// app.js
import express from 'express';
import cors from 'cors';
import bookingRoutes from './src/routes/bookings.js';
import './src/models/adminModel.js';
import availabilityRoutes from './src/routes/availability.js';
import customerRoutes from './src/routes/customers.js';
import { webhookRouter, paymentRouter } from "./src/routes/payment.js";
import rateLimit from 'express-rate-limit';
// import other routes if needed

const app = express();

// Stripe requires raw body for signature verification
app.use("/api/stripe", webhookRouter);

app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
});

// Middleware
app.use(express.json()); // parse JSON request bodies
app.use(cors({
    origin: 'http://localhost:5173',
    //! origin: 'Prod env here',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use('/api', limiter);

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
