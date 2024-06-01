import { NextFunction, Request, Response } from "express";
import secrets from "../config/secret";
import { getBearerToken } from "./token";

export async function jwtAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.url.includes("/bkash/execute-payment/")) {
      return next();
    }

    const bearerToken = await getBearerToken(req);

    if (!bearerToken) {
      throw new Error("Token not found");
    }

    if (bearerToken !== secrets.bearer_token) {
      throw new Error("Invalid token");
    }

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}
