import { Router } from "express";
import { BaseRequest } from "../helpers/BaseRequest";
import { Contact } from "../model/contact.model";

const router = Router();
const handler = new BaseRequest(Contact);

router.get("/all", handler.getAllData); // GET ALL MESSAGES

router.post("/send-message", handler.addData); // ADD NEW MESSAGE

export default router;
