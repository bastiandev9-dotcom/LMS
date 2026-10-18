// ── Pengiriman email ─────────────────────────────────────────────────
// Produksi : SMTP generik (Gmail app-password, Brevo, Mailtrap, dst).
// Development: MAIL_DEV=true (atau SMTP belum dikonfigurasi) -> tautan
//              dicetak ke console sehingga alur tetap bisa diuji tanpa
//              akun email.

import nodemailer, { type Transporter } from "nodemailer";
import type { EmailContent } from "./email-templates";

const APP_URL = process.env.APP_URL ?? "http://localhost:3001";
const MAIL_DEV = process.env.MAIL_DEV === "true";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (MAIL_DEV) return null;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return transporter;
}

export async function sendEmail(
  to: string,
  content: EmailContent
): Promise<void> {
  const from =
    process.env.SMTP_FROM ?? "SiManis LMS <no-reply@simanis.local>";
  const client = getTransporter();

  if (!client) {
    console.info(
      [
        "",
        "📧 [MAIL_DEV] Email tidak dikirim (SMTP belum dikonfigurasi).",
        `   To      : ${to}`,
        `   Subject : ${content.subject}`,
        content.text
          .split("\n")
          .map((line) => `   ${line}`)
          .join("\n"),
        "",
      ].join("\n")
    );
    return;
  }

  await client.sendMail({
    from,
    to,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });
}

export function buildAppLink(path: string, token: string): string {
  const base = APP_URL.replace(/\/+$/, "");
  return `${base}${path}?token=${encodeURIComponent(token)}`;
}
