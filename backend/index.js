import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.config.js";

// Routes
import { userRouter } from "./routes/user.route.js";
import paymentRouter from "./routes/payment.route.js";
import ownerRouter from "./routes/owner.route.js";
import restaurantRouter from "./routes/restaurant.route.js";
import uploadRoutes from "./routes/upload.route.js";
import menuRouter from "./routes/menu.route.js";

dotenv.config();

const app = express();

// 🧩 Connect to MongoDB
connectDB();

// 🔧 Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// 🧠 CORS Setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🚏 API Routes
app.use("/user", userRouter);
app.use("/owner/payment", paymentRouter);
app.use("/owner", ownerRouter);
app.use("/restaurant", restaurantRouter);
app.use("/api/upload", uploadRoutes);
app.use("/menu", menuRouter);

// 🩺 Health check
app.get("/", (req, res) => {
  res.send("✅ Server is running successfully!");
});

// 🚀 Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
