/**
 * WhatsApp Cloud API webhook handler for Next.js.
 *
 * GET  /api/whatsapp — Meta webhook verification handshake
 * POST /api/whatsapp — Incoming message processing
 *
 * Set these environment variables:
 *   WHATSAPP_TOKEN           — System user access token from Meta
 *   WHATSAPP_PHONE_NUMBER_ID — Phone Number ID from Meta dashboard
 *   WHATSAPP_VERIFY_TOKEN    — Your chosen webhook verify secret
 *   WHATSAPP_APP_SECRET      — (optional) App secret for signature validation
 *   ANTHROPIC_API_KEY        — Claude API key
 */

import { NextRequest, NextResponse } from "next/server";
import {
  sendWhatsAppMessage,
  markAsRead,
  validateSignature,
} from "@/lib/whatsapp/client";
import { handleMessage } from "@/lib/whatsapp/claude";
import type { WhatsAppWebhookBody } from "@/lib/whatsapp/types";

// ── GET: Webhook verification ────────────────────────────────

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken =
    process.env.WHATSAPP_VERIFY_TOKEN || "claudbot_verify";

  if (mode === "subscribe" && token === verifyToken) {
    console.log("[WhatsApp] Webhook verified");
    return new Response(challenge, { status: 200 });
  }

  console.warn("[WhatsApp] Webhook verification failed");
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// ── POST: Incoming messages ──────────────────────────────────

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  // Validate signature if app secret is configured
  const signature = request.headers.get("x-hub-signature-256");
  if (!validateSignature(rawBody, signature)) {
    console.warn("[WhatsApp] Invalid webhook signature");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: WhatsAppWebhookBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ status: "ok" }, { status: 200 });
  }

  // Process asynchronously — return 200 immediately to avoid Meta timeout
  processWebhook(body).catch((err) => {
    console.error("[WhatsApp] Error processing webhook:", err);
  });

  return NextResponse.json({ status: "ok" }, { status: 200 });
}

async function processWebhook(body: WhatsAppWebhookBody): Promise<void> {
  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      if (!value.messages) continue;

      for (const message of value.messages) {
        if (message.type !== "text" || !message.text?.body) continue;

        const senderId = message.from;
        const userText = message.text.body;

        console.log(`[WhatsApp] Message from ${senderId}: ${userText.slice(0, 100)}`);

        // Mark as read
        await markAsRead(message.id).catch(() => {});

        // Get Claude's reply
        const reply = await handleMessage(senderId, userText);

        // Send reply
        await sendWhatsAppMessage(senderId, reply);
      }
    }
  }
}
