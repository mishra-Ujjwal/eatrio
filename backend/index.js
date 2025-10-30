import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser";
import connectDB from "./config/mongodb.config.js";
import { userRouter } from "./routes/user.route.js";
import cors from "cors";
import paymentRouter from "./routes/payment.route.js";
import ownerRouter from "./routes/owner.route.js";
import restaurantRouter from "./routes/restaurant.route.js";
import uploadRoutes from "./routes/upload.route.js";
import cookieParser from "cookie-parser";
import menuRouter from "./routes/menu.route.js";
dotenv.config()

const app = express()
connectDB()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL], // your React frontend URL
    credentials: true, // allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/user",userRouter);
app.use("/owner/payment",paymentRouter)
app.use("/owner",ownerRouter)
app.use("/restaurant",restaurantRouter)
app.use("/api/upload", uploadRoutes);
app.use("/menu",menuRouter)
app.get("/", (req, res) => {
   res.send("Server is running!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));