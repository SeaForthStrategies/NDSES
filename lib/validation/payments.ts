import { z } from "zod";

export const paymentSchema = z.object({
  paymentMethod: z.enum(["card", "ach"]).default("card"),
  accountNumber: z.string().min(3, "Enter your account number."),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid payment amount."),
  email: z.string().email("Enter a valid receipt email.")
});

export type PaymentInput = z.infer<typeof paymentSchema>;
