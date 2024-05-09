//@ts-check
import { Router } from "express";
import { Category } from "../model/category.model";
import { CategoryRequest } from "../requests/CategoryRequest";

const router = Router();
const handler = new CategoryRequest(Category);

router.get("/all", handler.getAllData); // GET ALL

router.get("/get/:id", handler.getSingleData); // GET SINGLE

router.get("/show/:type", handler.showTypes); // GET SHOW TYPE

router.get("/total-pages", handler.getTotalPages); // GET TOTAl PAGES

router.get("/page", handler.pagination); // PAGINATION

router.get("/search", handler.search); // SEARCH

router.post("/add", handler.addData); // ADD NEW DATA

router.patch("/edit/:id", handler.updateData); // UPDATE DATA

router.delete("/delete/:id", handler.deleteData); // DELETE DATA

export default router;
