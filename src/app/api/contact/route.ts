import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const TO_EMAIL = "medodakhly11@gmail.com";
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
};

function asTrimmedString(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "Email service is not configured." },
        { status: 503 },
      );
    }

    let body: ContactBody;
    try {
      body = (await request.json()) as ContactBody;
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid request body." },
        { status: 400 },
      );
    }

    // Bots fill hidden honeypot — pretend success, send nothing.
    if (asTrimmedString(body.website, 200)) {
      return NextResponse.json({ ok: true });
    }

    const name = asTrimmedString(body.name, 100);
    const email = asTrimmedString(body.email, 254);
    const message = asTrimmedString(body.message, 5000);

    if (name.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Please enter your name." },
        { status: 400 },
      );
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (message.length < 5) {
      return NextResponse.json(
        { ok: false, error: "Please enter a longer message." },
        { status: 400 },
      );
    }

    const resend = new Resend(apiKey);
    const subject = `Portfolio inquiry from ${name}`;
    const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const html = `
      <div style="font-family:Georgia,serif;line-height:1.6;color:#0a0a0a">
        <p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 16px"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to send email. Please try again." },
        { status: 502 },
      );
    }

    if (!data?.id) {
      return NextResponse.json(
        { ok: false, error: "Email provider did not confirm delivery." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error. Please try again." },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
