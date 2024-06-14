import { Request, Response } from "express";
import url from "url";
import secrets from "../config/secret";
import { Bkash } from "../model/bkash.model";
import { Seller } from "../model/seller.model";
import { Transaction } from "../model/transaction.model";
import { BkashPayment } from "../types/bkash.t";
import { ExtendedRequest } from "../types/extended-request";
import mongoose from "mongoose";

export class BkashRequest {
  private readonly sandboxUrl = secrets.bkash_sandbox_baseurl;
  private readonly app_key = secrets.bkash_app_key;
  private readonly secret_key = secrets.bkash_secret_key;
  private readonly username = secrets.bkash_username;
  private readonly password = secrets.bkash_password;
  private readonly refresh_token = secrets.bkash_refresh_token;
  private id_token: string | null | undefined;

  //TODO: ADD actual site url
  private isSeller: boolean = false
  private sellerSite = "http://localhost:3000/profile"
  private userSite = "/user/site"

  private getIDToken = async () => {
    try {
      const result = await fetch(`${this.sandboxUrl}/token/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          username: this.username,
          password: this.password,
        },
        body: JSON.stringify({
          app_key: this.app_key,
          app_secret: this.secret_key,
          refresh_token: this.refresh_token,
        }),
        credentials: "include",
      });

      const data = await result.json();
      const { id_token } = data;

      await Bkash.deleteMany({});
      await Bkash.create({
        id_token: id_token,
        lastRefreshed: new Date().getTime(),
      });

      return id_token;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  private getProcessedIDToken = async () => {
    const dbRes = await Bkash.find({}).limit(1);

    if (dbRes.length <= 0) {
      this.id_token = await this.getIDToken();
    } else {
      // @ts-expect-error
      let difference = new Date().getTime() - dbRes[0].lastRefreshed?.getTime();
      let minutesDifference = Math.floor(difference / (1000 * 60));

      if (minutesDifference >= 50) {
        this.id_token = await this.getIDToken();
      } else {
        this.id_token = dbRes[0].id_token;
      }
    }

    return this.id_token;
  };

  createPayment = async (req: ExtendedRequest, res: Response) => {
    try {
      const id_token = await this.getProcessedIDToken();

      const result = await fetch(`${this.sandboxUrl}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: id_token as string,
          "X-App-Key": this.app_key,
        },
        body: JSON.stringify({
          ...req.body,
        }),
        credentials: "include",
      });

      const data = await result.json();

      if (data.statusCode !== "0000") {
        throw new Error(data.statusMessage);
      }

      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        data: error.message,
      });
    }
  };

  executePaymentCallback = async (req: Request, res: Response) => {
    try {
      const { paymentID, seller, user } = req.query;

      let id;
      if (seller) {
        id = seller
        this.isSeller = true
      } else {
        id = user
      }

      const transaction = await this.getBkashTransactionData(paymentID, id)

      if (this.isSeller) {
        await Seller.findByIdAndUpdate(
          id,
          { $inc: { balance: Number.parseInt(transaction?.amount as string) } },
        );
      }

      this.redirct(res, {
        success: true,
        data: transaction.paymentID,
      });
    } catch (error: any) {
      this.redirct(res, {
        success: false,
        message: "Payment failed",
      });
    }
  };

  private getBkashTransactionData = async (paymentID: any, personID: any) => {
    const result = await fetch(`${this.sandboxUrl}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.id_token as string,
        "X-App-Key": this.app_key,
      },
      body: JSON.stringify({
        paymentID: paymentID,
      }),
      credentials: "include",
    });

    const data: BkashPayment = await result.json();

    if (data.statusCode !== "0000") {
      throw new Error("Payment failed");
    }

    const transaction = await Transaction.create({
      ...data,
      person: personID,
    });

    return transaction
  }

  private redirct = (res: Response, query?: object) => {
    if (this.isSeller) {
      res.redirect(
        url.format({
          pathname: this.sellerSite,
          query: query as any,
        }),
      );
    } else {
      res.redirect(
        url.format({
          pathname: this.userSite,
          query: query as any,
        }),
      );
    }
  };
}
