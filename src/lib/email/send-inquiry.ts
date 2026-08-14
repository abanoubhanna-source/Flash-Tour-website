import "server-only";
import { Resend } from "resend";

export type InquiryEmailInput = {
  source: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  phone?: string;
  inquiryType: string;
  destination?: string;
  message: string;
};

const DEFAULT_RECIPIENT = "info@flashtour.travel";
const RECIPIENT_BY_SOURCE: Record<string, string> = {
  "Partner Portal RFP": "b2b@flashtour.travel",
};

export async function sendInquiryEmail(input: InquiryEmailInput): Promise<{ ok: boolean; message: string }> {
  const recipient = RECIPIENT_BY_SOURCE[input.source] ?? DEFAULT_RECIPIENT;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, message: `Email sending isn't configured yet. Please contact us directly at ${recipient}.` };
  }

  const resend = new Resend(apiKey);
  const lines = [
    `Source: ${input.source}`,
    `Name: ${input.firstName} ${input.lastName}`,
    input.companyName ? `Company: ${input.companyName}` : null,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : null,
    `Inquiry type: ${input.inquiryType}`,
    input.destination ? `Target destination: ${input.destination}` : null,
    "",
    "Message:",
    input.message,
  ].filter((line): line is string => line !== null);

  const { error } = await resend.emails.send({
    from: "Flash Group Website <onboarding@resend.dev>",
    to: [recipient],
    replyTo: input.email,
    subject: `New ${input.source} inquiry from ${input.firstName} ${input.lastName}`,
    text: lines.join("\n"),
  });

  if (error) {
    return { ok: false, message: "Something went wrong sending your message. Please try again or email us directly." };
  }
  return { ok: true, message: "Thanks — your message is on its way. Our team will be in touch within 24 hours." };
}
