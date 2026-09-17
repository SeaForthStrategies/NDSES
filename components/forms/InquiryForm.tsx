"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Script from "next/script";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, type UseFormSetValue } from "react-hook-form";
import { inquirySchema, type InquiryInput } from "@/lib/validation/forms";
import { trackEvent } from "@/lib/analytics";
import { DUMPSTER_SIZE_SELECTED_EVENT } from "@/lib/dumpster-events";

// reCAPTCHA v3 runs invisibly (no checkbox, no challenge) and is verified
// server-side by the WordPress endpoint every form proxies to. Not
// configured yet? The site key is empty, the script never loads, and the
// form submits with an empty token -- WordPress treats that as "spam
// protection not enabled" rather than a failure.
declare global {
  interface Window {
    grecaptcha?: { ready: (cb: () => void) => void; execute: (siteKey: string, opts: { action: string }) => Promise<string> };
  }
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY;

const SERVICE_TYPE_VALUES: InquiryInput["serviceType"][] = ["residential", "commercial", "dumpster", "event"];

// Reads ?service=&size= from the URL for the cross-page handoff (a
// "Request This Size"/"Request a Quote" link elsewhere navigates here with
// those params). Isolated in its own component because useSearchParams()
// requires a Suspense boundary in the App Router — without this split, every
// page that renders InquiryForm would opt out of static generation.
function SearchParamsPrefill({ setValue }: { setValue: UseFormSetValue<InquiryInput> }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const service = searchParams.get("service");
    if (service && (SERVICE_TYPE_VALUES as string[]).includes(service)) {
      setValue("serviceType", service as InquiryInput["serviceType"]);
    }
    const size = searchParams.get("size");
    if (size) setValue("selectedDumpsterSize", size);
  }, [searchParams, setValue]);

  return null;
}

export function InquiryForm({ formType }: { formType: InquiryInput["formType"] }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { formState, handleSubmit, register, setValue } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { formType }
  });

  useEffect(() => {
    // Same-page handoff: the dumpster size guide on this same page dispatches
    // this event when a visitor picks "Request This Size" — no navigation, so
    // the query-param effect above never fires for that interaction.
    if (formType !== "dumpster") return;
    function handleSizeSelected(event: Event) {
      const size = (event as CustomEvent<string>).detail;
      if (size) setValue("selectedDumpsterSize", size);
    }
    window.addEventListener(DUMPSTER_SIZE_SELECTED_EVENT, handleSizeSelected);
    return () => window.removeEventListener(DUMPSTER_SIZE_SELECTED_EVENT, handleSizeSelected);
  }, [formType, setValue]);

  const [errorMessage, setErrorMessage] = useState("");

  async function getCaptchaToken(): Promise<string> {
    if (!RECAPTCHA_SITE_KEY || !window.grecaptcha) return "";
    return new Promise((resolve) => {
      window.grecaptcha!.ready(() => {
        window.grecaptcha!.execute(RECAPTCHA_SITE_KEY!, { action: "submit" }).then(resolve).catch(() => resolve(""));
      });
    });
  }

  async function onSubmit(data: InquiryInput) {
    setStatus("loading");
    data.captchaToken = await getCaptchaToken();
    const response = await fetch("/api/forms", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
    if (response.ok) {
      trackEvent("form_submission", { formType });
      setStatus("success");
    } else {
      const body = await response.json().catch(() => null);
      setErrorMessage(body?.error || "Something went wrong. Please try again or contact NDSES directly.");
      setStatus("error");
    }
  }

  return (
    <form className="card form" id={`${formType}-inquiry-form`} onSubmit={handleSubmit(onSubmit)} noValidate>
      {RECAPTCHA_SITE_KEY ? <Script src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`} strategy="afterInteractive" /> : null}
      <Suspense fallback={null}>
        <SearchParamsPrefill setValue={setValue} />
      </Suspense>
      <input type="hidden" {...register("formType")} />
      <div className="honeypot-field" aria-hidden="true">
        <label htmlFor={`${formType}-website`}>Leave this field blank</label>
        <input id={`${formType}-website`} tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      {formState.errors.root ? <p className="error">{formState.errors.root.message}</p> : null}
      <div className="field">
        <label htmlFor={`${formType}-name`}>Name</label>
        <input id={`${formType}-name`} {...register("name")} autoComplete="name" />
        {formState.errors.name ? <span className="error">{formState.errors.name.message}</span> : null}
      </div>
      <div className="field">
        <label htmlFor={`${formType}-email`}>Email</label>
        <input id={`${formType}-email`} {...register("email")} autoComplete="email" type="email" />
        {formState.errors.email ? <span className="error">{formState.errors.email.message}</span> : null}
      </div>
      <div className="field">
        <label htmlFor={`${formType}-phone`}>Phone</label>
        <input id={`${formType}-phone`} {...register("phone")} autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor={`${formType}-service-type`}>Service type</label>
        <select id={`${formType}-service-type`} {...register("serviceType")} defaultValue={formType === "general" ? "" : formType}>
          <option value="">Select a service</option>
          <option value="residential">Residential trash & recycling</option>
          <option value="commercial">Commercial trash & recycling</option>
          <option value="dumpster">Dumpster rental</option>
          <option value="event">Special event service</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${formType}-address`}>Service address</label>
        <input id={`${formType}-address`} {...register("serviceAddress")} />
      </div>
      {formType === "dumpster" ? (
        <div className="field">
          <label htmlFor="selectedDumpsterSize">Selected dumpster size</label>
          <input id="selectedDumpsterSize" {...register("selectedDumpsterSize")} />
        </div>
      ) : null}
      {formType === "event" ? (
        <div className="field">
          <label htmlFor="eventDate">Event date</label>
          <input id="eventDate" {...register("eventDate")} type="date" />
        </div>
      ) : null}
      <div className="field">
        <label htmlFor={`${formType}-message`}>How can NDSES help?</label>
        <textarea id={`${formType}-message`} {...register("message")} />
        {formState.errors.message ? <span className="error">{formState.errors.message.message}</span> : null}
      </div>
      <button className="btn primary" disabled={status === "loading"} type="submit">{status === "loading" ? "Sending..." : "Submit"}</button>
      {status === "success" ? <p role="status">Thank you. Your request has been sent to the NDS team — we&apos;ll be in touch soon.</p> : null}
      {status === "error" ? <p className="error" role="alert">{errorMessage}</p> : null}
    </form>
  );
}
