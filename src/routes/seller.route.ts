// @ts-check
import { Router } from "express";
import { Seller } from "../model/seller.model";
import { generateToken } from "../utils/token";
import { SellerRequest } from "../requests/SellerRequest";

const router = Router();
const handler = new SellerRequest(Seller);

router.get("/all", handler.getAllData); // GET ALL

router.get("/get/:id", handler.getSingleData); // GET SINGLE

router.get("/total-pages", handler.getTotalPages); // GET TOTAL PAGES

router.get("/page", handler.pagination); // PAGINIATION

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
  } catch (error) {
    next(error);
  }
});

router.post("/register", handler.addData); // ADD NEW SELLER

// login
router.post("/login", async (req, res, next) => {
  try {
    const seller = await Seller.findOne({ phone: req.body.phone });

    if (seller && req.body.password === seller.password) {
      const token = generateToken({
        id: seller._id.toString(),
        name: seller.name,
        status: seller.status,
      });

      res.cookie("auth", token, {
        secure: true,
        path: "/",
        sameSite: "none",
        maxAge: 3 * 86400,
      });

      return res.status(200).json({
        success: true,
        data: seller,
      });
    }

    res.status(400).json({
      success: false,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/edit/:id", handler.updateData); // UPDATE SELLR

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
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:id", handler.deleteData); // DELETE DATA

export default router;
