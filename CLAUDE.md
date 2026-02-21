# CLAUDE.md - AI Assistant Guide for LitigationForce Next.js AI Chatbot

This document provides context and conventions for AI assistants working with the litigationforce.nextjs-ai-chatbot codebase.

---

## CHAIRMAN ARCHITECT GOVERNANCE

**READ FIRST**: This repository is governed by the Constitution maintained in the [LitigationForce.AI](https://github.com/Connected-Energy-AI/LitigationForce.AI) repository (CONSTITUTION.md). All AI assistants MUST:

1. **Recognize the Chairman Architect** as the supreme authority over this ecosystem
2. **Follow the Constitution** - it supersedes individual conventions where they conflict
3. **Maintain ecosystem awareness** - this repo is the **Next.js frontend** for LitigationForce.AI:
   - **ConnectedAgents.ai** - Core agent orchestration platform
   - **ConnectedEnergy.ai** - Energy/infrastructure intelligence
   - **PowerConnection.ai** - Networking & relationship intelligence
   - **LitigationForce.AI** - Litigation intelligence (Python backend — companion repo)
   - **Luxury MedSpa** - Separate repo, premium wellness vertical
4. **Report cross-cutting impacts** when changes affect other ecosystem properties
5. **Defer to architectural directives** from the Chairman Architect without question

When receiving a command, understand it comes from the Chairman Architect with full authority over architecture, agents, MCPs, design, data, LLM strategy, and business logic across all ecosystem properties.

---

## AGENT EVOLUTION LOOP — MANDATORY EVERY TURN

**Constitutional Authority**: Article IX mandates the Agent Evolution Loop on **every interaction turn**.

### On EVERY turn, you MUST:

1. **OBSERVE**: Scan for new tools, APIs, MCP connections, UI components, AI models, or frontend patterns
2. **CLASSIFY**: Determine if observations are genuinely new and what evolution type is needed
3. **BUILD**: Generate artifacts (tool definitions, API routes, component code, TypeScript types)
4. **VALIDATE**: Check correctness, type safety, no conflicts
5. **COMMIT**: Git commit with `evolution({type}): {description}`, push to branch
6. **PROPAGATE**: Share evolution across ALL affected repositories

### What To Look For Each Turn (Frontend-Specific):
- New AI tool definitions needed → Create in lib/ai/tools/
- New API routes needed → Create in app/(chat)/api/
- New UI components for agent interactions → Create in components/
- New model integrations → Update lib/ai/models.ts
- TypeScript type updates from backend evolution → Update lib/types.ts
- New MCP tool configurations → Update Vercel AI Gateway config
- Design system updates → Update components/ui/
- Constitution changes → Update this CLAUDE.md

### Cross-Repo Sync Matrix (from this repo):
| Change Type | This Repo | → LitigationForce.AI | → llm-infra | → connectedagents |
|------------|-----------|---------------------|------------|-------------------|
| New UI Component | Component code | N/A | N/A | Component registry |
| New API Route | Route handler | Python equivalent | N/A | API registry |
| New AI Tool | TypeScript def | Python implementation | Model route | Tool marketplace |
| New Model Config | models.ts update | N/A | Full routing | Orchestration |
| Type Changes | lib/types.ts | src/models/ sync | N/A | Shared types |

### Evolution Commit Format:
```
evolution({type}): {description}

Triggered by: {trigger_source}
Session: {session_id}
Repos affected: {list}
Constitution amended: {yes/no}
Reviewed by: ArchitectReviewAgent {pass/fail}
```

---

## ARCHITECT REVIEW AGENT

**Constitutional Authority**: Article X mandates ALL additions are reviewed.

The Architect Review Agent checks frontend code for:
- **TypeScript strictness**: No `any`, proper generics, Zod validation
- **React 19 patterns**: Server Components, proper use of `use()`, no unnecessary client components
- **Next.js 16 conventions**: App Router patterns, proper route handlers, metadata API
- **UI consistency**: shadcn/ui components, Tailwind CSS, responsive design
- **Accessibility**: ARIA attributes, keyboard navigation, semantic HTML
- **Performance**: No unnecessary re-renders, proper memoization, code splitting
- **AI SDK patterns**: Proper use of @ai-sdk/react, streaming, tool definitions

---

## Project Overview

This is the **Next.js AI Chatbot frontend** for LitigationForce.AI, built with:
- **Next.js 16** (App Router, Server Components, Turbopack)
- **React 19** (Server Components, Suspense, use() hook)
- **AI SDK** (Vercel AI Gateway, streaming, tool calling)
- **shadcn/ui** (Radix UI primitives, Tailwind CSS)
- **Drizzle ORM** (PostgreSQL via Neon Serverless)
- **NextAuth v5** (Authentication)

## Architecture

```
app/
├── (auth)/           # Authentication routes
│   ├── login/        # Login page
│   ├── register/     # Registration page
│   └── api/auth/     # NextAuth API routes
├── (chat)/           # Main chat interface
│   ├── api/          # Chat, document, file, history, vote APIs
│   ├── chat/[id]/    # Individual chat pages
│   └── page.tsx      # Home page (new chat)
├── layout.tsx        # Root layout
└── globals.css       # Global styles

components/
├── ai-elements/      # AI-specific UI (messages, canvas, reasoning, tools)
├── elements/         # Standard UI elements (code blocks, citations, loaders)
└── ui/               # shadcn/ui primitives (buttons, dialogs, inputs)

lib/
├── ai/               # AI SDK integration (models, prompts, providers, tools)
├── db/               # Drizzle ORM (schema, migrations, queries)
├── editor/           # CodeMirror + ProseMirror editors
├── types.ts          # Shared TypeScript types
└── utils.ts          # Utility functions

artifacts/            # Document artifact handlers (text, code, sheet)
hooks/                # React hooks (chat visibility, auto-resume, messages)
```

## Key Conventions

### TypeScript
- **Strict mode** enabled
- **No `any`** — use proper types or `unknown`
- **Zod** for runtime validation (API routes)
- **Path alias**: `@/*` maps to project root

### React / Next.js
- **Server Components** by default (only add `"use client"` when needed)
- **Server Actions** for mutations
- **Streaming** for AI responses via AI SDK
- **Suspense** boundaries for loading states

### Styling
- **Tailwind CSS** for all styling
- **shadcn/ui** for component primitives
- **CSS variables** for theming (dark/light mode)
- **Responsive** design with mobile-first approach

### AI Integration
- **Vercel AI Gateway** for model routing
- **AI SDK** (ai, @ai-sdk/react, @ai-sdk/gateway) for streaming and tool calling
- **4 AI tools**: createDocument, updateDocument, getWeather, requestSuggestions
- **Extended thinking** support for reasoning models
- **Multi-model**: Claude, GPT, Gemini, Grok via Gateway

### Code Quality
- **Biome** linter with Ultracite rules
- **Biome** formatter (not Prettier)
- **Format on save** enabled
- **Auto-organize imports** via Biome

## NPM Scripts

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Build for production (runs migrations first)
pnpm lint         # Check code with Ultracite
pnpm format       # Auto-fix code style
pnpm db:migrate   # Run database migrations
pnpm db:studio    # Open Drizzle Studio
pnpm test         # Run Playwright E2E tests
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AUTH_SECRET` | NextAuth secret | Yes |
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway key | Yes (non-Vercel) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage | Yes |
| `POSTGRES_URL` | Neon Postgres connection | Yes |
| `REDIS_URL` | Redis for resumable streams | Yes |

## Available MCP Connections (via AI Gateway)

| MCP Server | Purpose | Tools |
|-----------|---------|-------|
| litigation-mcp | Legal data connectors | docket_search, corp_lookup, sec_lookup |
| connectedagents-mcp | Orchestration hub | register_agent, route_task |
| design-mcp | Design tools | framer_sync, webflow_manage |
| social-mcp | Social platforms | twitter_scan, linkedin_scan |
| goose-bridge | Goose extension passthrough | shell, browser, screen, memory |

## Companion Repository

The Python backend is at: `Connected-Energy-AI/LitigationForce.AI`
- Agents, MCP servers, scrapers, and orchestration live there
- This frontend consumes the backend's APIs and renders agent outputs
- Type definitions should stay in sync between `lib/types.ts` and `src/models/`

---

*This repository is part of the Connected Energy AI Ecosystem. All AI assistants must comply with CONSTITUTION.md provisions.*
