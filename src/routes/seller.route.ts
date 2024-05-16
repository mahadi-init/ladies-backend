// @ts-check
import { Router } from "express";
import { SellerRequest } from "../controller/seller.controller";
import { Seller } from "../model/seller.model";

const router = Router();
const handler = new SellerRequest(Seller);

router.get("/all", handler.getAllData); // GET ALL

router.get("/get/:id", handler.getSingleData); // GET SINGLE

router.get("/total-pages", handler.getTotalPages); // GET TOTAL PAGES

router.get("/page", handler.pagination); // PAGINATION

router.get("/status/:id", handler.getStatus); // GET STATUS

// search
router.get("/search", async (req, res, next) => {
  try {
    const q = req.query.q;

    const result = await Seller.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { cid: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/register", handler.addData); // ADD NEW SELLER

// login
router.post("/login", async (req, res, next) => {
  try {
    const seller = await Seller.findOne({ phone: req.body.phone });

    if (seller && req.body.password === seller.password) {
      return res.status(200).json({
        success: true,
        data: seller,
      });
    }

    res.status(400).json({
      success: false,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.patch("/edit/:id", handler.updateData); // UPDATE SELLR

router.patch("/update-status/:id", handler.updateData); // UPDATE STATUS

// change password
router.patch("/change-password/:id", async (req, res, next) => {
  try {
    const result = await Seller.findByIdAndUpdate(req.params.id, {
      password: req.body.password,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/delete/:id", handler.deleteData); // DELETE DATA

export default router;
