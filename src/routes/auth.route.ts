import { Router } from "express";
import { nodemailerImpl } from "../utils/nodemailer-impl";

const router = Router();

router.post("/forget-password", async (req, res) => {
  try {
    const data = await nodemailerImpl(
      ["mahadi.dev@outlook.com"],
      "Forget Password",
      "Your password is $something",
    );

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
