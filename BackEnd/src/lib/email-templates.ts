// ── Template email transaksional ──────────────────────────────────────
// HTML sederhana + versi teks agar email tetap terbaca di klien apa pun.

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function layout(params: {
  title: string;
  greeting: string;
  body: string;
  ctaLabel: string;
  link: string;
  footer: string;
}): string {
  return `<!doctype html>
<html lang="id">
  <body style="margin:0;padding:24px;background:#f5f6fa;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;padding:32px;">
            <tr><td>
              <h1 style="margin:0 0 16px;font-size:20px;color:#0f766e;">${params.title}</h1>
              <p style="margin:0 0 12px;font-size:14px;line-height:1.6;">${params.greeting}</p>
              <p style="margin:0 0 24px;font-size:14px;line-height:1.6;">${params.body}</p>
              <p style="margin:0 0 24px;">
                <a href="${params.link}" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:bold;">${params.ctaLabel}</a>
              </p>
              <p style="margin:0 0 8px;font-size:12px;color:#6b7280;line-height:1.6;">Jika tombol tidak berfungsi, salin tautan berikut ke browser:</p>
              <p style="margin:0 0 24px;font-size:12px;word-break:break-all;"><a href="${params.link}" style="color:#0f766e;">${params.link}</a></p>
              <p style="margin:0;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:16px;">${params.footer}</p>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export interface EmailContent {
  subject: string;
  text: string;
  html: string;
}

export function buildActivationEmail(params: {
  name: string;
  link: string;
}): EmailContent {
  const name = escapeHtml(params.name);
  return {
    subject: "Aktivasi akun SiManis",
    text: [
      `Halo ${params.name},`,
      "",
      "Akun SiManis kamu sudah terdaftar. Buka tautan berikut untuk membuat password dan mengaktifkan akun:",
      params.link,
      "",
      "Tautan berlaku selama 24 jam dan hanya bisa dipakai sekali.",
      "Jika kamu tidak merasa mendaftar, abaikan email ini.",
    ].join("\n"),
    html: layout({
      title: "Aktivasi akun SiManis",
      greeting: `Halo ${name},`,
      body: "Akun SiManis kamu sudah terdaftar. Klik tombol di bawah untuk membuat password dan mengaktifkan akun.",
      ctaLabel: "Buat password",
      link: params.link,
      footer:
        "Tautan berlaku 24 jam dan hanya bisa dipakai sekali. Jika kamu tidak merasa mendaftar, abaikan email ini.",
    }),
  };
}

export function buildPasswordResetEmail(params: {
  name: string;
  link: string;
}): EmailContent {
  const name = escapeHtml(params.name);
  return {
    subject: "Reset password SiManis",
    text: [
      `Halo ${params.name},`,
      "",
      "Kami menerima permintaan reset password. Buka tautan berikut untuk membuat password baru:",
      params.link,
      "",
      "Tautan berlaku selama 1 jam dan hanya bisa dipakai sekali.",
      "Jika kamu tidak meminta reset, abaikan email ini — password lama tetap berlaku.",
    ].join("\n"),
    html: layout({
      title: "Reset password SiManis",
      greeting: `Halo ${name},`,
      body: "Kami menerima permintaan reset password. Klik tombol di bawah untuk membuat password baru.",
      ctaLabel: "Buat password baru",
      link: params.link,
      footer:
        "Tautan berlaku 1 jam dan hanya bisa dipakai sekali. Jika kamu tidak meminta reset, abaikan email ini — password lama tetap berlaku.",
    }),
  };
}
