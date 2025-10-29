import express from "express"
import { loginUser, registerUser } from "../contollers/userController.js";
export const userRouter =express.Router();
userRouter.post("/sign-up",registerUser)
userRouter.post("/sign-in",loginUser)
