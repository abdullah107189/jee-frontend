import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */
export const DELIVERY_FEE_INSIDE_DHAKA = 70;
export const DELIVERY_FEE_OUTSIDE_DHAKA = 130;
export const FREE_DELIVERY_THRESHOLD = 5000;
export const DHAKA_DISTRICT_ID = "47";

/** Cities and Upazilas considered inside Dhaka */
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
  "keraniganj",
  "dhamrai",
] as const;

/* -------------------------------------------------------------------------- */
/* Enums                                                                      */
/* -------------------------------------------------------------------------- */
export const PAYMENT_PLANS = ["COD"] as const;
export type PaymentPlan = (typeof PAYMENT_PLANS)[number];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */
export function isInsideDhaka(
  location?: { districtId?: string; districtName?: string; upazilaName?: string } | string,
): boolean {
  if (!location) return true; // Default inside Dhaka if not selected yet

  if (typeof location === "string") {
    const loc = location.trim().toLowerCase();
    if (!loc) return true;
    if (loc === "47" || loc.includes("dhaka")) return true;
    return DHAKA_CITIES.includes(loc as any);
  }

  if (location.districtId === DHAKA_DISTRICT_ID) return true;
  if (location.districtName?.trim().toLowerCase().includes("dhaka")) return true;
  if (location.upazilaName) {
    const upazila = location.upazilaName.trim().toLowerCase();
    return DHAKA_CITIES.includes(upazila as any);
  }

  // If districtId is present and not Dhaka
  if (location.districtId && location.districtId !== DHAKA_DISTRICT_ID) {
    return false;
  }

  return true;
}

export function getDeliveryFee(
  location?: { districtId?: string; districtName?: string; upazilaName?: string } | string,
  subtotal = 0,
): number {
  if (subtotal >= FREE_DELIVERY_THRESHOLD && subtotal > 0) {
    return 0;
  }

  // If location object passed with districtId
  if (location && typeof location === "object" && location.districtId) {
    return location.districtId === DHAKA_DISTRICT_ID || isInsideDhaka(location)
      ? DELIVERY_FEE_INSIDE_DHAKA
      : DELIVERY_FEE_OUTSIDE_DHAKA;
  }

  return isInsideDhaka(location)
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
    // city: z.string().min(2, "City is required"),
    zipCode: z.string().optional(),

    // Notes
    notes: z.string().max(500, "Notes too long").optional(),

    // Payment - MVP COD only
    paymentPlan: z.enum(PAYMENT_PLANS),
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
