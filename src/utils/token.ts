import { Request } from "express";
import jwt from "jsonwebtoken";
import secrets from "../config/secret";

interface User {
  id: string;
  role?: string;
}

export const generateToken = (user: User) => {
  const payload = {
    id: user.id,
    role: user.role,
  };

  if (!secrets.jwt_secret) {
    throw new Error("JWT token not found!!");
  }

  const token = jwt.sign(payload, secrets.jwt_secret, { expiresIn: "7d" });
  return token;
};

export const getBearerToken = async (req: Request) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader && bearerHeader.startsWith("Bearer ")) {
    const bearerToken = bearerHeader.split(" ")[1];
    return bearerToken;
  } else {
    return null
  }
};
