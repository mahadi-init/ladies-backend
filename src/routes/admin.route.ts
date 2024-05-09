// @ts-check
import { Router } from "express";
import { Admin } from "../model/admin.model";
import { AdminRequest } from "../requests/AdminRequest";

const router = Router();
const handler = new AdminRequest(Admin);

router.get("/all", handler.getAllData); // GET ALL

router.get("/get/:id", handler.getSingleData); //GET SINGLE

router.get("/total-pages", handler.getTotalPages); // GET TOTAL PAGES

router.get("/page", handler.pagination); // PAGINATION

router.get("/search", handler.search); // SEARCH

router.post("/register", handler.addData); // ADD NEW ADMIN

router.post("/login", handler.login);

router.patch("/edit/:id", handler.updateData); // UPDATE

router.delete("/delete/:id", handler.deleteData); // DELETE

export default router;
