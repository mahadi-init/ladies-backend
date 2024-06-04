//@ts-check
import { Router } from "express";
import { ReviewRequest } from "../controller/review.controller";
import { Review } from "../model/review.model";

const router = Router();
const handler = new ReviewRequest(Review);

router.get("/all", handler.getAllData); // GET ALL

router.get("/:id", handler.getReviewsByProductId); // BY PRODUCT ID

router.post("/add", handler.addData); // ADD NEW DATA

router.patch("/approve/:id", handler.approveReview); // APPROVE

router.delete("/delete/:id", handler.deleteData); // DELETE REVIEW

export default router;
