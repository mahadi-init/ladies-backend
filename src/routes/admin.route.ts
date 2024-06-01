import { Router } from "express";
import { AdminRequest } from "../controller/admin.controller";
import { Admin } from "../model/admin.model";

const router = Router();
const handler = new AdminRequest(Admin);

router.get("/all", handler.getAllData); // GET ALL

router.get("/get/:id", handler.getSingleData); //GET SINGLE

router.get("/status/:id", handler.getStatus); // GET STATUS

router.get("/total-pages", handler.getTotalPages); // GET TOTAL PAGES

router.get("/page", handler.pagination); // PAGINATION

router.get("/search", handler.search); // SEARCH

router.post("/register", handler.addData); // ADD NEW ADMIN

router.post("/login", handler.login);

router.post("/forget-password", handler.forgetPassword); // FORGET PASSWORD

router.post("/reset-token-login", handler.resetTokenLogin); // RESET TOKEN LOGIN

router.patch("/edit/:id", handler.updateData); // UPDATE

router.patch("/change-status/:id", handler.changeStatus); // UPDATE STATUS

router.patch("/change-password/:id", handler.changePassword); // CHANGE PASSWORD

router.delete("/delete/:id", handler.deleteData); // DELETE

export default router;
