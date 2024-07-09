import { Router } from "express";
import { AdminRequest } from "../controller/admin.controller";
import { Admin } from "../model/admin.model";

const router = Router();
const handler = new AdminRequest(Admin);

router.get("/all", handler.getAllData);

router.get("/get/:id", handler.getSingleData);

router.get("/status/:id", handler.getStatus);

router.get("/page", handler.pagination);

router.post("/register", handler.addData);

router.patch("/edit/:id", handler.updateData);

// router.patch("/edit/me",)

router.patch("/refresh", handler.refresh)

router.patch("/change-password/:id", handler.changePassword);

// router.patch("/change-password/me",)

router.delete("/delete/:id", handler.deleteData)

export default router;
