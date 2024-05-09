//@ts-check
import { Router } from "express";
import { Extra } from "../model/extra.model";
import { ExtraRequest } from "../requests/ExtraRequest";

const router = Router();
const handler = new ExtraRequest(Extra);

router.get("/all", handler.getAllData); // GET ALL

router.get("/all/product-types", handler.allProductTypes); // GET PRODUCT TYPES

router.get("/all/colors", handler.allColors); // GET ALL COLORS

router.get("/all/sizes", handler.allColors); // GET ALL SIZES

router.post("/add", handler.addData); // ADD

router.patch("/edit/:id", handler.updateData); // UPDATE

router.delete("/delete/:id", handler.deleteData); // DELETE

export default router;
