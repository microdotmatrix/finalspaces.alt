"use server";

import { EmailTemplate } from "@/components/email/template";
import type { ActionState } from "@/types/state";
import { mailchimp, resend } from "../api/email";

export async function emailAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Missing name, email, or message" };
  }

  try {
    await resend.emails.send({
      from: `FinalSpaces <${process.env.RESEND_EMAIL_FROM as string}>`,
      to: [process.env.RESEND_EMAIL_TO as string],
      subject: "New message from FinalSpaces",
      react: EmailTemplate({ name, email, message }) as React.ReactElement,
    });
    return { success: "Email sent successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to send email" };
  }
}

export async function waitlistAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Missing email" };
  }

  try {
    await mailchimp({ email });
    return { success: "Email added to waitlist successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to add email to waitlist" };
  }
}
