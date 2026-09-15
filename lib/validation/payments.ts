import { z } from "zod";

export const paymentSchema = z.object({
  paymentMethod: z.enum(["card", "ach"]).default("card"),
  accountNumber: z.string().min(3, "Enter your account number."),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid payment amount."),
  email: z.string().email("Enter a valid receipt email."),
  token: z.string().min(1, "Payment details did not tokenize correctly. Please try again.")
});

export type PaymentInput = z.infer<typeof paymentSchema>;
