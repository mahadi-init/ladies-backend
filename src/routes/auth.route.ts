import { Router } from "express";
import { AuthRequest } from "../controller/auth.controller";

const router = Router()
const handler = new AuthRequest()

router.post('/login', handler.login)

router.post("/forget-password", handler.forgetPassword)

export default router