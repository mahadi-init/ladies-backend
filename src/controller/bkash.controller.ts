import { Request, Response } from "express";
import url from "url";
import secrets from "../config/secret";
import { Bkash } from "../model/bkash.model";
import { Seller } from "../model/seller.model";
import { Transaction } from "../model/transaction.model";
import { BkashPayment } from "../types/bkash.t";
import { ExtendedRequest } from "../types/extended-request";

export class BkashRequest {
  private readonly sandboxUrl = secrets.bkash_sandbox_baseurl;
  private readonly app_key = secrets.bkash_app_key;
  private readonly secret_key = secrets.bkash_secret_key;
  private readonly username = secrets.bkash_username;
  private readonly password = secrets.bkash_password;
  private readonly refresh_token = secrets.bkash_refresh_token;
  private id_token: string | null | undefined;

  userSiteURL: string;
  sellerSiteURL: string;

  constructor(userSiteURL: string, sellerSiteURL: string) {
    this.userSiteURL = userSiteURL;
    this.sellerSiteURL = sellerSiteURL;
  }

  /**
   * generate id token
   */
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

  /**
   * If last id token is more that 50 mintues
   * get token from refresh token or else get
   * token from db
   */
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

  /**
   * make the payment
   */
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

  executeSellerPaymentCallback = async (req: Request, res: Response) => {
    try {
      const { paymentID } = req.query;
      const sellerID = req.params.id;

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
        throw new Error(data.statusMessage);
      }

      // STORE TRANSACTION DETAILS
      const tRes = await Transaction.create({
        ...data,
        person: sellerID,
        isSeller: true,
      });

      // ADD BALANCE & TRANSACTION ID
      await Seller.findByIdAndUpdate(
        sellerID,
        { $inc: { balance: Number.parseInt(data.amount) } },
        { $push: { transcations: tRes._id } },
      );

      this.siteRedirect(res, this.sellerSiteURL, {
        success: true,
        paymentID: data.paymentID,
      });
    } catch (error: any) {
      this.siteRedirect(res, this.sellerSiteURL, {
        success: false,
        message: error.message,
      });
    }
  };

  // executeCallbackPayment = async (req: Request, res: Response) => {
  //   try {
  //     const { paymentID } = req.query;
  //     const id = req.params.id;
  //
  //     const result = await fetch(`${this.sandboxUrl}/execute`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: this.id_token as string,
  //         "X-App-Key": this.app_key,
  //       },
  //       body: JSON.stringify({
  //         paymentID: paymentID,
  //       }),
  //       credentials: "include",
  //     });
  //
  //     const data: BkashPayment = await result.json();
  //
  //     this.siteRedirect(res, {
  //       success: true,
  //       paymentID: data.paymentID,
  //     });
  //   } catch (error: any) {
  //     this.siteRedirect(res, {
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // };

  private siteRedirect = (res: Response, pathname: string, query?: object) => {
    res.redirect(
      url.format({
        pathname: pathname,
        query: query as any,
      }),
    );
  };
}
