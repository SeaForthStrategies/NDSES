import { z } from "zod";

// Guard against typos like 15000 for 150.00; matches NDSES_MAX_PAYMENT_AMOUNT in the WordPress plugin.
export const MAX_PAYMENT_AMOUNT = 50000;

export const paymentSchema = z.object({
  paymentMethod: z.enum(["card", "ach"]).default("card"),
  accountNumber: z.string().min(3, "Enter your account number."),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid payment amount.")
    .refine((value) => Number(value) > 0 && Number(value) <= MAX_PAYMENT_AMOUNT, "Enter an amount between $0.01 and $50,000."),
  email: z.string().email("Enter a valid receipt email."),
  token: z.string().min(1, "Payment details did not tokenize correctly. Please try again.")
});

export type PaymentInput = z.infer<typeof paymentSchema>;
