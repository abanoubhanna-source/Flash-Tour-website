"use server";

import { z } from "zod";
import { sendInquiryEmail } from "@/lib/email/send-inquiry";

const contactInquirySchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(120),
  lastName: z.string().trim().min(1, "Last name is required.").max(120),
  email: z.string().trim().email("Enter a valid email.").max(200),
  phone: z.string().trim().max(60).optional().default(""),
  inquiryType: z.string().trim().min(1, "Choose an inquiry type.").max(120),
  message: z.string().trim().min(1, "Message is required.").max(4000),
});

export type ContactFormState = { status: "idle" | "success" | "error"; message?: string };

export async function submitContactInquiry(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactInquirySchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    inquiryType: formData.get("inquiryType"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Please fill in all required fields." };
  }

  const result = await sendInquiryEmail({ source: "Contact Form", ...parsed.data });
  return result.ok ? { status: "success", message: result.message } : { status: "error", message: result.message };
}
