"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { paymentSchema, type PaymentInput } from "@/lib/validation/payments";
import { trackEvent } from "@/lib/analytics";

// PayEngine SecureFields tokenizes card/bank details in a hosted iframe —
// the raw numbers never touch our form fields or our server.
// https://docs.payengine.co/merchant-api-reference/secure-fields/secure-fields-overview
declare global {
  interface Window {
    PayEngine?: {
      SecureFields: {
        create: () => Promise<PayEngineSecureFieldsForm>;
      };
    };
  }
}

type PayEngineSecureFieldsForm = {
  field: (selector: string, options: Record<string, unknown>) => void;
  createCard: (options: { manuallyEntered: boolean }) => Promise<{ token?: string; card?: { token?: string } }>;
  createBankAccount: () => Promise<{ token?: string; bank_account?: { token?: string } }>;
};

const fieldCss = {
  fontFamily: "inherit",
  fontSize: "16px",
  boxSizing: "border-box",
  width: "100%",
  height: "48px",
  padding: "11px 13px",
  color: "#14211a"
};

const PAYENGINE_HOST = process.env.NEXT_PUBLIC_PAYENGINE_HOST || "https://console.payengine.dev";
const PAYENGINE_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYENGINE_PUBLIC_KEY;

export function PaymentForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [sdkReady, setSdkReady] = useState(false);
  // PayEngine's createCard()/createBankAccount() validate every field
  // registered on that SecureFields form instance, not just the ones
  // relevant to the call being made. Card and ACH fields must therefore
  // live on two separate instances, or submitting a card payment fails
  // validation against the empty, hidden ACH fields (and vice versa).
  const cardForm = useRef<PayEngineSecureFieldsForm | null>(null);
  const achForm = useRef<PayEngineSecureFieldsForm | null>(null);
  const { formState, handleSubmit, register, watch } = useForm<Omit<PaymentInput, "token">>({
    resolver: undefined,
    defaultValues: { amount: "", paymentMethod: "card", accountNumber: "", email: "" }
  });
  const paymentMethod = watch("paymentMethod");

  const initializeSecureFields = useCallback(async () => {
    if (!window.PayEngine || (cardForm.current && achForm.current)) return;
    const [card, ach] = await Promise.all([window.PayEngine.SecureFields.create(), window.PayEngine.SecureFields.create()]);

    card.field("#card-name", { type: "text", name: "card_holder", placeholder: "Name on card", validations: ["required"], css: fieldCss });
    card.field("#card-number", { type: "card-number", name: "card_number", placeholder: "Card number", showCardIcon: true, validations: ["required", "validCardNumber"], css: fieldCss });
    card.field("#card-expiry", { type: "card-expiration-date", name: "card_exp", placeholder: "MM / YY", validations: ["required", "validCardExpirationDate"], css: fieldCss });
    card.field("#card-cvc", { type: "card-security-code", name: "card_cvc", placeholder: "CVC", maxLength: 4, validations: ["required", "validCardSecurityCode"], css: fieldCss });
    card.field("#cc-zip", { type: "zip-code", name: "address_zip", placeholder: "Billing ZIP", validations: ["required"], css: fieldCss });

    ach.field("#routing-number", { type: "number", name: "routing_number", placeholder: "Routing number", validations: ["required"], css: fieldCss });
    ach.field("#account-number", { type: "number", name: "account_number", placeholder: "Account number", validations: ["required"], css: fieldCss });
    ach.field("#ach-first-name", { type: "text", name: "first_name", placeholder: "First name", validations: ["required"], css: fieldCss });
    ach.field("#ach-last-name", { type: "text", name: "last_name", placeholder: "Last name", validations: ["required"], css: fieldCss });

    cardForm.current = card;
    achForm.current = ach;
    setSdkReady(true);
  }, []);

  useEffect(() => {
    // Script may already be loaded (e.g. fast client-side navigation back to this page).
    if (window.PayEngine) initializeSecureFields();
  }, [initializeSecureFields]);

  async function onSubmit(values: Omit<PaymentInput, "token">) {
    if (!cardForm.current || !achForm.current) {
      setStatus("error");
      setMessage("Payment fields are still loading. Please wait a moment and try again.");
      return;
    }

    setStatus("loading");
    setMessage("");
    trackEvent("payment_button_click");

    try {
      const tokenObj =
        values.paymentMethod === "ach"
          ? await achForm.current.createBankAccount()
          : await cardForm.current.createCard({ manuallyEntered: true });
      const token = tokenObj.token ?? ("card" in tokenObj ? tokenObj.card?.token : undefined) ?? ("bank_account" in tokenObj ? tokenObj.bank_account?.token : undefined);

      if (!token) {
        setStatus("error");
        setMessage("We could not process those payment details. Please check them and try again.");
        return;
      }

      const response = await fetch("/api/payments/charge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, token })
      });
      const body = await response.json();
      setMessage(body.message || "");
      setStatus(response.ok ? "success" : "error");
      trackEvent(response.ok ? "payment_completion" : "payment_failure");
    } catch {
      setStatus("error");
      setMessage("We could not process that payment. Please try again or contact NDSES.");
    }
  }

  return (
    <>
      <Script src={`${PAYENGINE_HOST}/js/1.0.0/securefields.min.js?key=${PAYENGINE_PUBLIC_KEY}`} strategy="afterInteractive" onLoad={initializeSecureFields} />
      <form className="card form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset className="payment-methods">
          <legend>Payment path</legend>
          <label>
            <input type="radio" value="card" {...register("paymentMethod")} />
            Card payment
          </label>
          <label>
            <input type="radio" value="ach" {...register("paymentMethod")} />
            ACH payment
          </label>
        </fieldset>
        <div className="field">
          <label htmlFor="accountNumber">Account number</label>
          <input id="accountNumber" {...register("accountNumber", { required: true, minLength: 3 })} />
          {formState.errors.accountNumber ? <span className="error">Enter your account number.</span> : null}
        </div>
        <div className="field">
          <label htmlFor="amount">Payment amount</label>
          <input id="amount" inputMode="decimal" {...register("amount", { required: true, pattern: /^\d+(\.\d{1,2})?$/ })} />
          {formState.errors.amount ? <span className="error">Enter a valid payment amount.</span> : null}
        </div>
        <div className="field">
          <label htmlFor="email">Receipt email</label>
          <input id="email" type="email" {...register("email", { required: true })} />
          {formState.errors.email ? <span className="error">Enter a valid receipt email.</span> : null}
        </div>

        <div hidden={paymentMethod !== "card"}>
          <div className="field">
            <label htmlFor="card-name">Name on card</label>
            <div id="card-name" className="secure-field" />
          </div>
          <div className="field">
            <label htmlFor="card-number">Card number</label>
            <div id="card-number" className="secure-field" />
          </div>
          <div className="split-fields">
            <div className="field">
              <label htmlFor="card-expiry">Expiration</label>
              <div id="card-expiry" className="secure-field" />
            </div>
            <div className="field">
              <label htmlFor="card-cvc">CVC</label>
              <div id="card-cvc" className="secure-field" />
            </div>
            <div className="field">
              <label htmlFor="cc-zip">Billing ZIP</label>
              <div id="cc-zip" className="secure-field" />
            </div>
          </div>
        </div>

        <div hidden={paymentMethod !== "ach"}>
          <div className="split-fields">
            <div className="field">
              <label htmlFor="ach-first-name">First name</label>
              <div id="ach-first-name" className="secure-field" />
            </div>
            <div className="field">
              <label htmlFor="ach-last-name">Last name</label>
              <div id="ach-last-name" className="secure-field" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="routing-number">Routing number</label>
            <div id="routing-number" className="secure-field" />
          </div>
          <div className="field">
            <label htmlFor="account-number">Bank account number</label>
            <div id="account-number" className="secure-field" />
          </div>
        </div>

        <button className="btn primary" disabled={status === "loading" || !sdkReady} type="submit">
          {status === "loading" ? "Processing..." : sdkReady ? "Submit payment" : "Loading secure payment form..."}
        </button>
        {message ? <p role={status === "error" ? "alert" : "status"} className={status === "error" ? "error" : ""}>{message}</p> : null}
      </form>
    </>
  );
}
