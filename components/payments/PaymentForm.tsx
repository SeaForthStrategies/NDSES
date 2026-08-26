"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { paymentSchema, type PaymentInput } from "@/lib/validation/payments";
import { trackEvent } from "@/lib/analytics";

export function PaymentForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { formState, handleSubmit, register } = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { amount: "", paymentMethod: "card" }
  });

  async function onSubmit(data: PaymentInput) {
    setStatus("loading");
    trackEvent("payment_button_click");
    const response = await fetch("/api/payments/create-session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
    const body = await response.json();
    setMessage(body.message || "");
    setStatus(response.ok ? "success" : "error");
    trackEvent(response.ok ? "payment_completion" : "payment_failure");
  }

  return (
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
        <input id="accountNumber" {...register("accountNumber")} />
        {formState.errors.accountNumber ? <span className="error">{formState.errors.accountNumber.message}</span> : null}
      </div>
      <div className="field">
        <label htmlFor="amount">Payment amount</label>
        <input id="amount" inputMode="decimal" {...register("amount")} />
        {formState.errors.amount ? <span className="error">{formState.errors.amount.message}</span> : null}
      </div>
      <div className="field">
        <label htmlFor="email">Receipt email</label>
        <input id="email" type="email" {...register("email")} />
        {formState.errors.email ? <span className="error">{formState.errors.email.message}</span> : null}
      </div>
      <p className="fine-print">Do not enter card or bank numbers here. PayEngine will provide the secure hosted payment step when connected.</p>
      <button className="btn primary" disabled={status === "loading"} type="submit">{status === "loading" ? "Preparing..." : "Continue to secure payment"}</button>
      {message ? <p role={status === "error" ? "alert" : "status"} className={status === "error" ? "error" : ""}>{message}</p> : null}
    </form>
  );
}
