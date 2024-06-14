//@ts-check
import { Router } from "express";
import { ExtraRequest } from "../controller/extra.controller";
import { Extra } from "../model/extra.model";

const router = Router();
const handler = new ExtraRequest(Extra);

router.get("/all", handler.getAllData); // GET ALL

router.get("/all/colors", handler.allColors); // GET ALL COLORS

router.get("/all/sizes", handler.allSizes); // GET ALL SIZES

router.post("/add", handler.addData); // ADD

router.patch("/edit/:id", handler.updateData); // UPDATE

router.delete("/delete", handler.deleteByQuery); // DELETE WITH QUERY PARAMS

export default router;
