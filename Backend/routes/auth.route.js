import express from "express"
import { login, logout, register } from "../controllers/auth.controller.js"
import upload from "../upload.js"

const router = express.Router()

router.post("/register", upload.single("file"), register)
router.post("/login", login)
router.post("/logout", logout);

export default router;