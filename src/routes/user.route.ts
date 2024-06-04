import { Router } from "express";
import { UserRequest } from "../controller/user.controller";
import { User } from "../model/user.model";

const router = Router();
const handler = new UserRequest(User);

router.get("/all", handler.getAllData); // GET ALL

router.get("/page", handler.pagination); // PAGINATION

router.get("/active", handler.getActiveData); // GET ACTIVE PRODUCTS

router.get("/total-pages", handler.getTotalPages);

router.post("/register", handler.addData); // CREATE USER

router.patch("/change-status/:id", handler.changeStatus); // UPDATE STATUS

router.delete("/delete/:id", handler.deleteData);

export default router;
