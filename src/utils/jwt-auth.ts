import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import secrets from "../config/secret";
import { getBearerToken } from "./token";
import { ExtendedRequest } from "../types/extended-request";

export async function setAuthInfoWithReq(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    let data = null
    const bearerToken = await getBearerToken(req);

    if (!bearerToken) {
      return next()
    }

    try {
      data = jwt.verify(bearerToken, secrets.jwt_secret) as any
      req.id = data.id
      req.role = data.role
    } catch (error) {
      next()
    }

    next()
  } catch (error) {
    res.status(401).json({
      success: false
    });
  }
}