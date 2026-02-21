/**
 * WhatsApp Cloud API client for sending messages and managing read receipts.
 */

const GRAPH_API_VERSION = "v21.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;
const MAX_MESSAGE_LENGTH = 4096;

export async function sendWhatsAppMessage(
  to: string,
  text: string,
): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.error("WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID is not set");
    return;
  }

  const chunks = splitMessage(text, MAX_MESSAGE_LENGTH - 96);

  for (const chunk of chunks) {
    const res = await fetch(
      `${GRAPH_API_BASE}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: chunk },
        }),
      },
    );

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`WhatsApp send failed (${res.status}): ${errorBody}`);
    }
  }
}

export async function markAsRead(messageId: string): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) return;

  await fetch(`${GRAPH_API_BASE}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    }),
  });
}

export function validateSignature(
  payload: string,
  signatureHeader: string | null,
): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) return true; // Skip validation if not configured

  if (!signatureHeader?.startsWith("sha256=")) return false;

  // Use Web Crypto API available in Next.js edge and Node.js runtimes
  const crypto = require("node:crypto");
  const expected = crypto
    .createHmac("sha256", appSecret)
    .update(payload)
    .digest("hex");

  return `sha256=${expected}` === signatureHeader;
}

function splitMessage(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      chunks.push(remaining);
      break;
    }

    let splitAt = remaining.lastIndexOf("\n\n", maxLength);
    if (splitAt < maxLength * 0.5) {
      splitAt = remaining.lastIndexOf("\n", maxLength);
    }
    if (splitAt < maxLength * 0.5) {
      splitAt = remaining.lastIndexOf(" ", maxLength);
    }
    if (splitAt < 1) splitAt = maxLength;

    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).trimStart();
  }

  return chunks;
}
