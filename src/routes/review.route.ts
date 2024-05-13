//@ts-check
import { Router } from "express";
import { ReviewRequest } from "../controller/review.controller";
import { Review } from "../model/review.model";

const router = Router();
const handler = new ReviewRequest(Review);

router.get("/all", handler.getAllData); // GET ALL

router.post("/add", handler.addData); // ADD NEW DATA

router.delete("/delete/:id", handler.deleteData); // DELETE REVIEW

export default router;
