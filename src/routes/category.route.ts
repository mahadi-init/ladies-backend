import { Router } from "express";
import { CategoryRequest } from "../controller/category.controller";
import { Category } from "../model/category.model";

const router = Router();
const handler = new CategoryRequest(Category);

router.get("/all", handler.getAllData); // GET ALL

router.get("/get/:id", handler.getSingleData); // GET SINGLE

router.get("/active", handler.getActiveData); // GET ALL ACTIVE

router.get("/active/type", handler.showTypes); // GET SHOW TYPE

router.get("/total-pages", handler.getTotalPages); // GET TOTAl PAGES

router.get("/page", handler.pagination); // PAGINATION

router.get("/search", handler.search); // SEARCH

router.post("/add", handler.addData); // ADD NEW DATA

router.patch("/edit/:id", handler.updateData); // UPDATE DATA

router.patch("/change-status/:id", handler.changeStatus); // UPDATE STATUS

router.delete("/delete/:id", handler.deleteData); // DELETE DATA

export default router;
