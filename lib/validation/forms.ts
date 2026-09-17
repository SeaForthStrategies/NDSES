import { z } from "zod";

export const inquirySchema = z.object({
  formType: z.enum(["general", "residential", "commercial", "dumpster", "event"]),
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().optional(),
  serviceType: z.string().optional(),
  serviceAddress: z.string().optional(),
  selectedDumpsterSize: z.string().optional(),
  eventDate: z.string().optional(),
  message: z.string().min(10, "Tell us a little more."),
  // Honeypot: left blank by real visitors, often auto-filled by bots.
  // Enforced server-side; kept permissive here so it never blocks a real submission.
  website: z.string().optional(),
  // reCAPTCHA v3 token, verified server-side by the WordPress endpoint this
  // proxies to. Optional here too -- WordPress treats a missing token as
  // "spam protection not configured yet" rather than a hard failure.
  captchaToken: z.string().optional()
});

export type InquiryInput = z.infer<typeof inquirySchema>;
