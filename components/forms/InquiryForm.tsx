"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { inquirySchema, type InquiryInput } from "@/lib/validation/forms";
import { trackEvent } from "@/lib/analytics";

export function InquiryForm({ formType }: { formType: InquiryInput["formType"] }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { formState, handleSubmit, register, setValue } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { formType }
  });

  useEffect(() => {
    if (formType === "dumpster") {
      const selected = window.sessionStorage.getItem("ndses:selectedDumpsterSize");
      if (selected) setValue("selectedDumpsterSize", selected);
    }
  }, [formType, setValue]);

  async function onSubmit(data: InquiryInput) {
    setStatus("loading");
    const response = await fetch("/api/forms", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
    if (response.ok) {
      trackEvent("form_submission", { formType });
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <input type="hidden" {...register("formType")} />
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
      {status === "success" ? <p role="status">Thank you. Your request has been received by the website. Final routing will be connected to the NDS inbox or CRM.</p> : null}
      {status === "error" ? <p className="error" role="alert">Something went wrong. Please try again or contact NDSES directly.</p> : null}
    </form>
  );
}
