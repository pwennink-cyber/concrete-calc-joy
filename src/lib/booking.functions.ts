import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const postcodeSchema = z
  .string()
  .trim()
  .regex(/^[1-9][0-9]{3}\s?[A-Za-z]{2}$/, "Vul een geldige Nederlandse postcode in.");

const priceLineSchema = z.object({
  label: z.string().max(120),
  detail: z.string().max(200).optional(),
  amount: z.number().finite(),
});

const bookingSchema = z.object({
  website: z.string().max(0).optional().default(""), // honeypot
  clientToken: z.string().min(8).max(80),
  customerType: z.enum(["particulier", "zakelijk"]),
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(80),
  companyName: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().min(8).max(30),
  deliveryStreet: z.string().trim().min(3).max(160),
  deliveryPostcode: postcodeSchema,
  deliveryCity: z.string().trim().min(2).max(90),
  billingSame: z.boolean(),
  billingStreet: z.string().trim().max(160).optional().default(""),
  billingPostcode: z.string().trim().max(10).optional().default(""),
  billingCity: z.string().trim().max(90).optional().default(""),
  projectType: z.string().trim().min(2).max(40),
  dimensions: z
    .object({
      mode: z.string().max(20),
      length: z.number().nonnegative().optional(),
      width: z.number().nonnegative().optional(),
      thicknessCm: z.number().nonnegative().optional(),
      surfaces: z.number().nonnegative().optional(),
    })
    .nullable(),
  netVolume: z.number().min(0).max(500),
  marginVolume: z.number().min(0).max(100),
  orderVolume: z.number().min(0.1).max(500),
  concreteType: z.string().trim().min(2).max(40),
  accessWithinFourMeters: z.enum(["ja", "nee", "weetniet"]),
  unloadingMethod: z.string().trim().min(2).max(30),
  unloadingMinutes: z.number().int().min(0).max(600),
  distanceMeters: z.number().int().min(0).max(500).nullable(),
  obstacles: z.string().trim().max(600).optional().default(""),
  extraHoseMeters: z.number().int().min(0).max(300),
  asap: z.boolean(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  timeslot: z.string().trim().max(20).optional().default(""),
  flexible: z.boolean(),
  priceLines: z.array(priceLineSchema).max(20),
  subtotal: z.number().min(0),
  vat: z.number().min(0),
  total: z.number().min(0),
  internalReference: z.string().trim().max(80).optional().default(""),
  accessNotes: z.string().trim().max(1000).optional().default(""),
  projectNotes: z.string().trim().max(1000).optional().default(""),
  acceptTerms: z.literal(true),
});

export type BookingInput = z.infer<typeof bookingSchema>;

/** Eenvoudige rate limiting per werker-instantie. */
const submissions = new Map<string, number[]>();
const processedTokens = new Map<string, string>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const previous = (submissions.get(key) ?? []).filter((t) => now - t < windowMs);
  if (previous.length >= 5) {
    submissions.set(key, previous);
    return true;
  }
  previous.push(now);
  submissions.set(key, previous);
  return false;
}

export const submitBookingRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website && data.website.length > 0) {
      return { ok: true as const, requestNumber: "BB-0000-000000" };
    }

    const existing = processedTokens.get(data.clientToken);
    if (existing) {
      return { ok: true as const, requestNumber: existing };
    }

    if (rateLimited(data.email.toLowerCase())) {
      throw new Error(
        "Er zijn kort achter elkaar meerdere aanvragen verstuurd. Probeer het later opnieuw of bel ons.",
      );
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: numberData, error: numberError } = await supabaseAdmin.rpc(
      "next_booking_request_number",
    );
    if (numberError || !numberData) {
      console.error("Kon aanvraagnummer niet genereren", numberError);
      throw new Error("Je aanvraag kon niet worden opgeslagen. Probeer het opnieuw.");
    }

    const requestNumber = String(numberData);

    const { error } = await supabaseAdmin.from("booking_requests").insert({
      request_number: requestNumber,
      customer_type: data.customerType,
      first_name: data.firstName,
      last_name: data.lastName,
      company_name: data.companyName || null,
      email: data.email,
      phone: data.phone,
      delivery_street: data.deliveryStreet,
      delivery_postcode: data.deliveryPostcode.toUpperCase(),
      delivery_city: data.deliveryCity,
      billing_same_as_delivery: data.billingSame,
      billing_street: data.billingSame ? null : data.billingStreet || null,
      billing_postcode: data.billingSame ? null : data.billingPostcode || null,
      billing_city: data.billingSame ? null : data.billingCity || null,
      project_type: data.projectType,
      dimensions: data.dimensions,
      net_volume_m3: data.netVolume,
      safety_margin_m3: data.marginVolume,
      order_volume_m3: data.orderVolume,
      concrete_type: data.concreteType,
      access_within_four_meters: data.accessWithinFourMeters,
      unloading_method: data.unloadingMethod,
      unloading_minutes: data.unloadingMinutes,
      distance_meters: data.distanceMeters,
      obstacles: data.obstacles || null,
      extra_hose_meters: data.extraHoseMeters,
      preferred_date: data.asap ? null : data.preferredDate,
      preferred_timeslot: data.timeslot || null,
      asap: data.asap,
      flexible_planning: data.flexible,
      price_lines: data.priceLines,
      subtotal_ex_vat: data.subtotal,
      vat_amount: data.vat,
      total_inc_vat: data.total,
      internal_reference: data.internalReference || null,
      access_notes: data.accessNotes || null,
      project_notes: data.projectNotes || null,
    });

    if (error) {
      console.error("Opslaan reserveringsaanvraag mislukt", error);
      throw new Error("Je aanvraag kon niet worden opgeslagen. Probeer het opnieuw.");
    }

    processedTokens.set(data.clientToken, requestNumber);

    // E-mailbevestiging volgt zodra er een echt e-mailadres is geconfigureerd.
    return { ok: true as const, requestNumber };
  });

const callbackSchema = z.object({
  website: z.string().max(0).optional().default(""),
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(30),
  preferredMoment: z.string().trim().max(120).optional().default(""),
  question: z.string().trim().max(600).optional().default(""),
});

export const submitCallbackRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => callbackSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website && data.website.length > 0) {
      return { ok: true as const };
    }

    if (rateLimited(`callback:${data.phone}`)) {
      throw new Error("Er zijn kort achter elkaar meerdere verzoeken verstuurd. Probeer het later opnieuw.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("callback_requests").insert({
      name: data.name,
      phone: data.phone,
      preferred_moment: data.preferredMoment || null,
      question: data.question || null,
    });

    if (error) {
      console.error("Opslaan terugbelverzoek mislukt", error);
      throw new Error("Je terugbelverzoek kon niet worden opgeslagen. Probeer het opnieuw.");
    }

    return { ok: true as const };
  });
