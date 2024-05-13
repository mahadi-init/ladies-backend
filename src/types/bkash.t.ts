export interface BkashPayment {
  amount: string;
  bkashURL: string;
  callbackURL: string;
  cancelledCallbackURL: string;
  currency: string;
  failureCallbackURL: string;
  intent: string;
  merchantInvoiceNumber: string;
  paymentCreateTime: string;
  paymentID: string;
  statusCode: string;
  statusMessage: string;
  successCallbackURL: string;
  transactionStatus: string;
}
