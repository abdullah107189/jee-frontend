import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */
export const DELIVERY_FEE_INSIDE_DHAKA = 70;
export const DELIVERY_FEE_OUTSIDE_DHAKA = 130;

/** Cities considered inside Dhaka */
export const DHAKA_CITIES = [
  "dhaka",
  "dhanmondi",
  "mirpur",
  "uttara",
  "gulshan",
  "banani",
  "mohammadpur",
  "badda",
  "motijheel",
  "old dhaka",
  "tejgaon",
  "bashundhara",
  "khilgaon",
  "jatrabari",
  "savar",
] as const;

/* -------------------------------------------------------------------------- */
/* Enums                                                                      */
/* -------------------------------------------------------------------------- */
export const PAYMENT_GATEWAYS = ["Bkash", "Rocket", "Nagad"] as const;
export type PaymentGateway = (typeof PAYMENT_GATEWAYS)[number];

export const PAYMENT_PLANS = ["FULL", "ADVANCE", "COD"] as const;
export type PaymentPlan = (typeof PAYMENT_PLANS)[number];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */
export function isInsideDhaka(city: string): boolean {
  if (!city) return false;
  return DHAKA_CITIES.includes(city.trim().toLowerCase() as any);
}

export function getDeliveryFee(city: string): number {
  return isInsideDhaka(city)
    ? DELIVERY_FEE_INSIDE_DHAKA
    : DELIVERY_FEE_OUTSIDE_DHAKA;
}

const bdPhoneRegex = /^(?:01[3-9]\d{8}|\+8801[3-9]\d{8})$/;

/* -------------------------------------------------------------------------- */
/* Checkout schema                                                            */
/* -------------------------------------------------------------------------- */
export const checkoutSchema = z
  .object({
    // Shipping
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().regex(bdPhoneRegex, "Enter a valid BD phone number"),
    email: z.string().email("Enter a valid email").optional().or(z.literal("")),
    addressLine1: z.string().min(5, "Address is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    zipCode: z.string().optional(),

    // Notes
    notes: z.string().max(500, "Notes too long").optional(),

    // Payment
    paymentPlan: z.enum(PAYMENT_PLANS),
    paymentGateway: z.enum(PAYMENT_GATEWAYS).optional(),

    // Gateway fields
    senderNumber: z
      .string()
      .regex(bdPhoneRegex, "Enter a valid sender number")
      .optional()
      .or(z.literal("")),
    transactionId: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const needsGateway =
      data.paymentPlan === "FULL" || data.paymentPlan === "ADVANCE";

    if (needsGateway) {
      if (!data.paymentGateway) {
        ctx.addIssue({
          code: "custom",
          path: ["paymentGateway"],
          message: "Select a payment gateway",
        });
      }
      if (!data.senderNumber) {
        ctx.addIssue({
          code: "custom",
          path: ["senderNumber"],
          message: "Sender number is required",
        });
      }
      if (!data.transactionId || data.transactionId.length < 5) {
        ctx.addIssue({
          code: "custom",
          path: ["transactionId"],
          message: "Transaction ID is required",
        });
      }
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
