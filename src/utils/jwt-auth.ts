import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import secrets from "../config/secret";
import { getBearerToken } from "./token";
import { ExtendedRequest } from "../types/extended-request";

export async function jwtAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.url.includes("/bkash/execute-payment/")) {
      return next();
    }

    // const bearerToken = await getBearerToken(req);

    // const data = jwt.verify(bearerToken, secrets.jwt_secret);
    // if (!data) {
    //   throw new Error("Invalid token found");
    // }

    // // save information for later use
    // setDataInReq(data, req);
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}

function setDataInReq(data: any, req: ExtendedRequest) {
  req.id = data.id;
  req.role = data.role;
  req.status = data.status;
}
