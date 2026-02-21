/**
 * Claude conversation handler for WhatsApp messages.
 *
 * Maintains per-sender conversation history in memory.
 * For production, replace with Redis or your existing PostgreSQL store.
 */

import Anthropic from "@anthropic-ai/sdk";

const MAX_HISTORY = 40; // 20 exchanges * 2 messages each

const SYSTEM_PROMPT = `You are ClaudBot, the AI assistant for LitigationForce — \
a litigation intelligence platform. You communicate via WhatsApp.

Guidelines:
- Keep responses concise and well-structured (WhatsApp is a mobile medium).
- Use *bold* and _italic_ for emphasis (WhatsApp supports these).
- Avoid Markdown that WhatsApp cannot render (no headers, code fences, or links with display text).
- If a user asks a legal question, always note that your response is informational and not legal advice.
- You can help with case research, document summaries, timeline analysis, and general litigation strategy.`;

const HELP_TEXT = `*ClaudBot — LitigationForce AI Assistant*

Send me any message and I'll respond using Claude.

Commands:
/help — Show this help message
/reset — Clear conversation history and start fresh`;

type Message = { role: "user" | "assistant"; content: string };

const conversations = new Map<string, Message[]>();

function getHistory(senderId: string): Message[] {
  if (!conversations.has(senderId)) {
    conversations.set(senderId, []);
  }
  return conversations.get(senderId)!;
}

function trimHistory(history: Message[]): void {
  while (history.length > MAX_HISTORY) {
    history.shift();
  }
}

export async function handleMessage(
  senderId: string,
  text: string,
): Promise<string> {
  const normalised = text.trim().toLowerCase();

  // Slash commands
  if (normalised === "/reset" || normalised === "/clear") {
    conversations.delete(senderId);
    return "Conversation cleared. Send me a new message to start fresh.";
  }
  if (normalised === "/help" || normalised === "/start") {
    return HELP_TEXT;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return "ClaudBot is not configured yet. ANTHROPIC_API_KEY is missing.";
  }

  const history = getHistory(senderId);
  history.push({ role: "user", content: text });
  trimHistory(history);

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-opus-4-6",
      max_tokens: parseInt(process.env.CLAUDE_MAX_TOKENS || "1024", 10),
      system: SYSTEM_PROMPT,
      messages: history,
    });

    const reply =
      response.content[0].type === "text"
        ? response.content[0].text
        : "I could not generate a response.";

    history.push({ role: "assistant", content: reply });
    return reply;
  } catch (err: any) {
    console.error("Claude API error:", err?.message || err);
    return "Sorry, I encountered an error. Please try again shortly.";
  }
}
