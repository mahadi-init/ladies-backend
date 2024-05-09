import jwt from "jsonwebtoken";
import secrets from "../config/secret";
import { NextFunction, Request, Response } from "express";

export async function jwtAuthorization(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.path.endsWith("/register") || req.path.endsWith("/login")) {
    next();
    return;
  }

  try {
    if (!secrets.JWT_SECRET) {
      throw new Error("JWT token not found!!");
    } else if (!req.cookies.auth) {
      throw new Error("Cookies not found!!");
    }

    const result = jwt.verify(req.cookies.auth, secrets.JWT_SECRET);
    // @ts-ignore
    if (!result.status) {
      throw new Error("Inactive user!!");
    }

    next();
  } catch (err: any) {
    res.status(403).json({
      message: err.message,
    });
  }
}
