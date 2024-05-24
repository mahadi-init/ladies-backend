import { Router } from "express";
import { UserRequest } from "../controller/user.controller";
import { User } from "../model/user.model";

const router = Router();
const handler = new UserRequest(User);

router.get("/all", handler.getAllData); // GET ALL

router.get("/page", handler.pagination); // PAGINATION

router.get("/total-pages", handler.getTotalPages);

router.post("/register", handler.addData); // CREATE USER

router.get("/page");

router.post("/login", handler.login); //USER LOGIN

export default router;
