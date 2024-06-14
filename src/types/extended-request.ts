import { Request } from "express";

export interface ExtendedRequest extends Request {
  id?: string;
  role?: "USER" | "SELLER" | "EDITOR" | "ADMIN" | "SUPERADMIN";
  status?: boolean;
}
