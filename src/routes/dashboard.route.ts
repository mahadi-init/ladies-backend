import { Router } from "express";
import { DashboardRequest } from "../controller/dashboard.controller";

const router = Router();
const handler = new DashboardRequest();

router.get("/steadfast-balance", handler.getSteadFastBalance);

router.get("/amount", handler.getDashboardAmount);

router.get("/recent-order", handler.getDashboardPendingOrders);

router.get("/sales-per-month", handler.salesPermonth);

export default router;
