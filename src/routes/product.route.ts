import { Router } from "express";
import { ProductRequest } from "../controller/product.controller";
import { Product } from "../model/product.model";

const router = Router();
const handler = new ProductRequest(Product);

router.get("/all", handler.getAllData); // GET ALL

router.get("/get/:id", handler.getSingleData); // GET SINGLE DATA

router.get("/active", handler.getActiveData); // GET ACTIVE PRODUCTS

router.get("/total-pages", handler.getTotalPages); // GET TOTAL PAGES

router.get("/page", handler.pagination); // PAGINATION

router.get("/search", handler.getSearchData); // GET SEARCH DATA

router.get("/offer", handler.getOfferTimeProduct); // GET OFFER TIMER PRODUCT

router.get("/top-rated", handler.getTopRated); // GET TOP RATED

router.get("/review", handler.getReviewProduct); // GET REVIEW

router.get("/popular/:type", handler.getPopularProducts); // GET POPULAR PRODUCTS

router.get("/find", handler.findProducts); // GET TYPE OF PRODuCTS

router.get("/related/:id", handler.getRelatedProducts); // GET REALTED PRODUCTS

router.get("/stock-out", handler.getStockoutProducts); // GET STOCK PRODUCTS

router.post("/add", handler.addProduct); // ADD PRODUCT

router.patch("/edit/:id", handler.updateData); // UPDATE

router.delete("/delete/:id", handler.deleteData); // DELETE

export default router;
