//@ts-check
import { Router } from "express";
import { UserRequest } from "../controller/user.controller";
import { User } from "../model/user.model";

const router = Router();
const handler = new UserRequest(User);

router.get("/all", handler.getAllData); // GET ALL

export default router;
