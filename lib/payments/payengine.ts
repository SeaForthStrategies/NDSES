import crypto from "node:crypto";
import type { PaymentInput } from "@/lib/validation/payments";

/**
 * PayEngine direct payment integration (SecureFields tokenization + Sale API).
 *
 * Confirmed against the authenticated merchant API reference
 * (docs.payengine.co/merchant-api-reference, gated behind PayEngine console
 * login) on 2026-09-15 — this is the real spec, not the public guide pages.
 *
 * Flow:
 * 1. Client page loads PayEngine's SecureFields JS SDK and tokenizes the
 *    card/bank details in PayEngine's hosted iframe fields (card/bank data
 *    never touches our server). See components/payments/PaymentForm.tsx.
 * 2. Client posts the resulting token to /api/payments/charge.
 * 3. Server calls PayEngine's Sale/ACH API with the token to actually move
 *    money, authenticating with `Authorization: Basic <secret key>` (PayEngine's
 *    "Basic" scheme is just the literal word "Basic" + the raw secret key,
 *    not standard HTTP Basic auth and not a bearer JWT).
 *
 * https://docs.payengine.co/merchant-api-reference/authentication
 * https://docs.payengine.co/merchant-api-reference/transactions/credit-card-sale
 * https://docs.payengine.co/merchant-api-reference/transactions/ach-sale
 * https://docs.payengine.co/merchant-api-reference/secure-fields/secure-fields-overview
 * https://docs.payengine.co/developer-docs/webhooks/check-signature
 */

type PayEngineChargeResult =
  | { mode: "placeholder"; message: string; accountNumber: string }
  | { mode: "success"; message: string; accountNumber: string; transactionId: string; authCode?: string }
  | { mode: "declined"; message: string; accountNumber: string; responseMessage?: string }
  | { mode: "error"; message: string; accountNumber: string };

/** PayEngine's order_number field only accepts [a-zA-Z0-9], max 20 chars. */
function toOrderNumber(accountNumber: string): string {
  return accountNumber.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20) || "NDSES";
}

function payEngineCredentials() {
  const apiUrl = process.env.PAYENGINE_API_URL;
  const merchantId = process.env.PAYENGINE_MERCHANT_ID;
  const secretKey = process.env.PAYENGINE_SECRET_KEY;

  if (!apiUrl || !merchantId || !secretKey) return null;
  return { apiUrl: apiUrl.replace(/\/$/, ""), merchantId, secretKey };
}

type SaleResponse = {
  status: "PASS" | "FAIL" | "PENDING_3DSAUTH";
  responseCode?: string;
  responseMessage?: string;
  authCode?: string;
  transactionID?: string;
};

type PayEngineApiResponse = {
  error?: boolean;
  message?: string;
  data?: {
    ID?: string;
    TransactionID?: string;
    SaleResponse?: SaleResponse;
    AchResponse?: SaleResponse;
  };
};

/**
 * Charge a tokenized card via PayEngine's direct Sale API (auth + capture in
 * one call — appropriate for a simple "pay now" flow with no separate
 * fulfillment step).
 */
export async function chargePayEngineCard(
  cardToken: string,
  input: Omit<PaymentInput, "paymentMethod" | "token">
): Promise<PayEngineChargeResult> {
  const creds = payEngineCredentials();
  if (!creds) {
    return {
      mode: "placeholder",
      message: "Card payments are not available yet. Please contact NDSES for current payment options.",
      accountNumber: input.accountNumber
    };
  }

  const body = {
    merchant_id: creds.merchantId,
    data: {
      transactionAmount: Number(input.amount).toFixed(2),
      cardToken,
      currencyCode: "USD",
      order_number: toOrderNumber(input.accountNumber),
      internalTransactionID: input.accountNumber,
      description: `NDSES account ${input.accountNumber}`,
      metadata: { accountNumber: input.accountNumber, email: input.email }
    }
  };

  return submitPayEngineCharge(`${creds.apiUrl}/api/payment/sale`, creds.secretKey, body, input.accountNumber);
}

/** Charge a tokenized bank account via PayEngine's ACH Sale API. */
export async function chargePayEngineACH(
  accountToken: string,
  input: Omit<PaymentInput, "paymentMethod" | "token">
): Promise<PayEngineChargeResult> {
  const creds = payEngineCredentials();
  if (!creds) {
    return {
      mode: "placeholder",
      message: "ACH payments are not available yet. Please contact NDSES for current payment options.",
      accountNumber: input.accountNumber
    };
  }

  const body = {
    merchant_id: creds.merchantId,
    data: {
      transactionAmount: Number(input.amount).toFixed(2),
      accountToken,
      order_number: toOrderNumber(input.accountNumber),
      internalTransactionID: input.accountNumber,
      description: `NDSES account ${input.accountNumber}`,
      metadata: { accountNumber: input.accountNumber, email: input.email }
    }
  };

  return submitPayEngineCharge(`${creds.apiUrl}/api/payment/ach`, creds.secretKey, body, input.accountNumber);
}

async function submitPayEngineCharge(
  url: string,
  secretKey: string,
  body: unknown,
  accountNumber: string
): Promise<PayEngineChargeResult> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Basic ${secretKey}`
      },
      body: JSON.stringify(body)
    });

    const json = (await response.json().catch(() => null)) as PayEngineApiResponse | null;

    if (!response.ok || !json || json.error) {
      console.error("PayEngine charge request failed", response.status, json?.message);
      return {
        mode: "error",
        message: "We could not reach the payment processor. Please try again shortly.",
        accountNumber
      };
    }

    const saleResponse = json.data?.SaleResponse ?? json.data?.AchResponse;
    const transactionId = json.data?.TransactionID ?? json.data?.ID;

    if (saleResponse?.status === "PASS" && transactionId) {
      return {
        mode: "success",
        message: "Thank you! Your payment has been received.",
        accountNumber,
        transactionId,
        authCode: saleResponse.authCode
      };
    }

    return {
      mode: "declined",
      message: "Payment failed. Please try again or contact NDSES.",
      accountNumber,
      responseMessage: saleResponse?.responseMessage
    };
  } catch (error) {
    console.error("PayEngine charge request failed", error);
    return {
      mode: "error",
      message: "We could not reach the payment processor. Please try again shortly.",
      accountNumber
    };
  }
}

/**
 * Fetch authoritative transaction details server-side after a webhook notification,
 * rather than trusting the webhook payload's fields directly.
 * https://docs.payengine.co/merchant-api-reference/transactions/search-transactions/transaction-detail
 */
export async function getPayEngineTransaction(transactionId: string) {
  const creds = payEngineCredentials();
  if (!creds) return null;

  const response = await fetch(`${creds.apiUrl}/api/merchant/${creds.merchantId}/transaction/${transactionId}`, {
    headers: { authorization: `Basic ${creds.secretKey}` }
  });

  if (!response.ok) {
    console.error("PayEngine transaction lookup failed", response.status);
    return null;
  }

  return response.json();
}

/**
 * Verify the `X-PF-Signature` header PayEngine sends with every webhook event.
 * Header format: `t=<unix timestamp>,s=<hex hmac>`
 * signed_payload = `${timestamp}.${rawBody}`, HMAC-SHA256 keyed with the
 * per-endpoint webhook signing secret from the PayEngine dashboard.
 * https://docs.payengine.co/developer-docs/webhooks/check-signature
 */
export function verifyPayEngineWebhook(body: string, signatureHeader: string | null, toleranceSeconds = 300) {
  const secret = process.env.PAYENGINE_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key?.trim(), value?.trim()];
    })
  );

  const timestamp = parts.t;
  const signature = parts.s;
  if (!timestamp || !signature) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > toleranceSeconds) return false;

  const signedPayload = `${timestamp}.${body}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload, "utf-8").digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(signature, "hex");
  if (expectedBuffer.length !== receivedBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}
