import { Request } from "express";
import jwt from "jsonwebtoken";
import secrets from "../config/secret";

interface User {
  id: string;
  name: string;
  role?: string;
  status: boolean;
}

export const generateToken = (user: User) => {
  const payload = {
    id: user.id,
    name: user.name,
    role: user.role,
    status: user.status,
  };

  if (!secrets.jwt_secret) {
    throw new Error("JWT token not found!!");
  }

  const token = jwt.sign(payload, secrets.jwt_secret, { expiresIn: "7d" });
  return token;
};

export const getBearerToken = async (req: Request) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      return bearerToken;
    } else {
      throw new Error("Token is unavailable");
    }
  } catch (err: any) {
    throw err;
  }
};
