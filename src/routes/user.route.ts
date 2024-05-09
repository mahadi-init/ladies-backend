//@ts-check
import { Router } from "express";
import { User } from "../model/user.model";
import { UserRequest } from "../requests/UserRequest";

const router = Router();
const handler = new UserRequest(User);

router.get("/all", handler.getAllData); // GET ALL

export default router;
