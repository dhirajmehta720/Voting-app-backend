import express from "express";
import { changePassword, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyjwt, logoutUser);
router.post("/changePassword",verifyjwt, changePassword);

export default router;