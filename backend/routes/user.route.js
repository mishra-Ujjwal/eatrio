import express from "express"
import { getMe, loginUser, logoutUser, registerUser } from "../contollers/userController.js";
import isUser from "../middleware/isUser.js";
export const userRouter =express.Router();
userRouter.post("/sign-up",registerUser)
userRouter.post("/sign-in",loginUser)
userRouter.post("/logout", logoutUser);
userRouter.get("/me", isUser, getMe);