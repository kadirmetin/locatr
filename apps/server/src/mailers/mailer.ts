import { config } from "../configs/app.config";
import { resend } from "./resendClient";

interface Parameters_ {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  from?: string;
}

const mailer_sender =
  config.NODE_ENV === "development"
    ? `no-reply <onboarding@resend.dev>`
    : `no-reply <${config.RESEND.SENDER}>`;

export const sendEmail = async ({
  to,
  from = mailer_sender,
  subject,
  text,
  html,
}: Parameters_) =>
  await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    text,
    subject,
    html,
  });
