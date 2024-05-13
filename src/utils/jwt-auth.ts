import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import secrets from "../config/secret";

export async function jwtAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.path.endsWith("/register") || req.path.endsWith("/login")) {
    next();
    return;
  }

  try {
    if (!secrets.jwt_secret) {
      throw new Error("JWT token not found!!");
    } else if (!req.cookies.auth) {
      throw new Error("Cookies not found!!");
    }

    const result = jwt.verify(req.cookies.auth, secrets.jwt_secret);
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
