"use server";

import { z } from "zod";
import { sendInquiryEmail } from "@/lib/email/send-inquiry";

const partnerInquirySchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(120),
  lastName: z.string().trim().min(1, "Last name is required.").max(120),
  companyName: z.string().trim().min(1, "Company name is required.").max(160),
  email: z.string().trim().email("Enter a valid email.").max(200),
  inquiryType: z.string().trim().min(1, "Choose an inquiry type.").max(120),
  destination: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(1, "Please describe your project.").max(4000),
});

export type PartnerFormState = { status: "idle" | "success" | "error"; message?: string };

export async function submitPartnerInquiry(
  _previousState: PartnerFormState,
  formData: FormData,
): Promise<PartnerFormState> {
  const parsed = partnerInquirySchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    companyName: formData.get("companyName"),
    email: formData.get("email"),
    inquiryType: formData.get("inquiryType"),
    destination: formData.get("destination"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Please fill in all required fields." };
  }

  const result = await sendInquiryEmail({ source: "Partner Portal RFP", ...parsed.data });
  return result.ok ? { status: "success", message: result.message } : { status: "error", message: result.message };
}
