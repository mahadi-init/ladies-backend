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
  let data = null
  let bearerToken = await getBearerToken(req);

  if (!bearerToken) {
    return next()
  }

  try {
    data = jwt.verify(bearerToken, secrets.jwt_secret) as any
    req.id = data.id
    req.role = data.role

    next()
  } catch {
    next()
  }
}