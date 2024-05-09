import { Router } from "express";
import { Brand } from "../model/brand.model";
import { BrandRequest } from "../requests/BrandRequest";

const router = Router();
const handler = new BrandRequest(Brand);

router.get("/all", handler.getAllData); // GET ALL

router.get("/get/:id", handler.getSingleData); // GET SINGLE

router.get("/all-names", handler.allNames); // GET ALL NAMES

router.get("/total-pages", handler.getTotalPages); // GET TOTAL PAGES

router.get("/page", handler.pagination); // PAGINATION

router.get("/search", handler.search); // SEARCH

router.post("/add", handler.addData); // ADD NEW DATA

router.patch("/edit/:id", handler.updateData); // UPDATE

router.delete("/delete/:id", handler.deleteData); // DELETE

export default router;