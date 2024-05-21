import { Router } from "express";
import { DashboardRequest } from "../controller/dashboard.controller";

const router = Router();
const handler = new DashboardRequest();

router.get("/steadfast-balance", handler.getSteadFastBalance);

router.get("/amount", handler.getDashboardAmount); // DASHBOARD ADMOUNT

router.get("/sales-report", handler.getSalesReport); // SALES REPORT

router.get("/most-selling-category", handler.getMostSellingCategory); // MOST SELLING CATEGORY

router.get("/recent-order", handler.getDashboardRecentOrder); // RECENT recent-order

export default router;
