import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import secrets from "../config/secret";
import { getBearerToken } from "./token";

export async function jwtAuthorization(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.url.includes("/bkash/execute-payment/")) {
      return next();
    }

    const bearerToken = await getBearerToken(req);

    const data = jwt.verify(bearerToken, secrets.jwt_secret);
    if (!data) {
      throw new Error("Invalid token found");
    }

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}
