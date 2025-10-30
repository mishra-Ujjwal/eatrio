import express from "express";

import { uploadImage } from "../contollers/upload.controller.js";
import upload from "../middleware/upload.js";


const uploadRoutes = express.Router();

// POST /api/upload
uploadRoutes.post("/", upload.single("image"), uploadImage);


export default uploadRoutes;
