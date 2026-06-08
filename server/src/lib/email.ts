import { Resend } from "resend";
import { env } from "../env.js";

function getResend(): Resend {
  return new Resend(env.RESEND_API_KEY);
}
const from = env.RESEND_FROM;
const appUrl = env.CLIENT_URL;

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080c14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;">
    <tr><td style="padding:40px 32px;background:#0f1724;border-radius:12px;border:1px solid #1e2d44;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="text-align:center;padding-bottom:24px;">
          <span style="font-size:32px;font-weight:700;color:#e8a045;">学</span>
          <span style="font-size:18px;color:#f0f4ff;font-weight:600;margin-left:8px;">Learn Kanji</span>
        </td></tr>
        ${content}
        <tr><td style="text-align:center;padding-top:24px;border-top:1px solid #1e2d44;margin-top:24px;">
          <p style="margin:0;color:#8fa3be;font-size:13px;">Learn Kanji — Master Japanese characters</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendVerificationEmail(to: string, displayName: string, token: string): Promise<void> {
  const link = `${appUrl}/verify-email?token=${token}`;

  if (env.NODE_ENV === "development") {
    console.log(`\n=== Verification email for ${to} ===`);
    console.log(`Link: ${link}\n`);
  }

  const html = baseTemplate(`
    <tr><td style="padding-bottom:16px;">
      <h1 style="margin:0;color:#f0f4ff;font-size:22px;font-weight:700;">Verify your email</h1>
    </td></tr>
    <tr><td style="padding-bottom:24px;">
      <p style="margin:0;color:#8fa3be;font-size:15px;line-height:1.6;">Hi ${displayName},<br><br>Welcome to Learn Kanji! Please verify your email address to get started.</p>
    </td></tr>
    <tr><td style="padding-bottom:24px;">
      <a href="${link}" style="display:inline-block;padding:14px 32px;background:#e8a045;color:#080c14;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">Verify Email</a>
    </td></tr>
    <tr><td>
      <p style="margin:0;color:#8fa3be;font-size:13px;">Or copy this link: <span style="color:#f0f4ff;">${link}</span></p>
    </td></tr>
  `);
  await getResend().emails.send({ from, to, subject: "Verify your Learn Kanji account", html });
}

export async function sendPasswordResetEmail(to: string, displayName: string, token: string): Promise<void> {
  const link = `${appUrl}/reset-password?token=${token}`;

  if (env.NODE_ENV === "development") {
    console.log(`\n=== Password reset for ${to} ===`);
    console.log(`Link: ${link}\n`);
  }

  const html = baseTemplate(`
    <tr><td style="padding-bottom:16px;">
      <h1 style="margin:0;color:#f0f4ff;font-size:22px;font-weight:700;">Reset your password</h1>
    </td></tr>
    <tr><td style="padding-bottom:24px;">
      <p style="margin:0;color:#8fa3be;font-size:15px;line-height:1.6;">Hi ${displayName},<br><br>Click below to reset your password. This link expires in 1 hour.</p>
    </td></tr>
    <tr><td style="padding-bottom:24px;">
      <a href="${link}" style="display:inline-block;padding:14px 32px;background:#e8a045;color:#080c14;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">Reset Password</a>
    </td></tr>
    <tr><td>
      <p style="margin:0;color:#8fa3be;font-size:13px;">Or copy this link: <span style="color:#f0f4ff;">${link}</span></p>
    </td></tr>
  `);
  await getResend().emails.send({ from, to, subject: "Reset your Learn Kanji password", html });
}
