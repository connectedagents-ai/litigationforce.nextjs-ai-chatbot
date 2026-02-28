# Genie Desktop — Architecture Definition

> **SIMULATION / NOT LEGAL ADVICE**
> Platform: LitigationForce.AI | Operator: Connected Agents.AI
> Constitution applies to all Genie Desktop functionality.

---

## What Is Genie Desktop?

**Genie** (Generative Execution Network for Intelligence & Engagement) is the
local AI development and research hub for the LitigationForce.AI platform.

It is **not a single app** — it is the **integration layer** between:
- The user's local coding tools (Claude Code, Cursor, Windsurf, GitHub Copilot)
- The LitigationForce.AI backend (Neo4j, LangGraph, GraphRAG, LexVault)
- The CURSOR CLOUD AGENTS mono-repo (Blackbox, MCP servers, agent clusters)
- Voice input (apps/voice-agent)

Think of Genie Desktop as **mission control** — the local surface that binds
all tools, databases, LLMs, and agents under one voice/keyboard/UI interface
governed by the Constitution.

---

## Platform Naming Hierarchy

```
Connected Agents.AI (Operator)
└── LitigationForce.AI (Product / Platform)
    ├── Genie Desktop (Local Client / Dev Environment)
    │   ├── Claude Code (AI coding tool — CLI)
    │   ├── Cursor (AI IDE)
    │   ├── Windsurf (AI IDE)
    │   ├── GitHub Copilot (AI coding assistant)
    │   └── Voice Agent (apps/voice-agent)
    ├── CURSOR CLOUD AGENTS (Master Mono-Repo)
    │   ├── Blackbox Cloud API (18+ agent clusters)
    │   ├── MCP Router (connector hub)
    │   └── Evaluator Swarm (4-gate QA)
    ├── LexVault (Secure Document Vault)
    │   ├── Box (1.8TB enterprise storage)
    │   ├── OmniSync (multi-source sync)
    │   └── RAG Pipeline (vector + graph)
    ├── Ingestion Engine (src/ingestion/)
    │   ├── LexVaultAdapter
    │   ├── OmniSync (Box, Gmail, GDrive, IMAP, local)
    │   └── RAGSink → Neo4j vector + graph
    ├── LangGraph Pipeline (src/orchestration/langgraph_pipeline.py)
    │   ├── 7 nodes: intake → extraction → graph_index → rag_analysis
    │   │            → evaluation → human_gate → drafting
    │   └── LLM Adapters: Claude (primary) + Ollama (private fallback)
    └── Data Stores
        ├── Neo4j (graph + vector index — primary)
        ├── Qdrant (secondary vector — optional)
        ├── Redis (cache + LangGraph checkpoint)
        ├── Airtable (cases, documents, parties, deadlines)
        └── Excel (export / offline analysis)
```

---

## Genie Desktop — Functional Modules

### Module 1: Coding Tool Integration

Genie Desktop connects all coding tools to the LitigationForce platform through:

| Tool | Integration Method | Config File |
|------|--------------------|-------------|
| Claude Code | `claude` CLI + MCP server | `.claude/mcp.json` |
| Cursor | `.cursor/rules/` + MCP | `.cursor/mcp.json` |
| Windsurf | `.windsurfrules` + MCP | `~/.codeium/windsurf/mcp_config.json` |
| GitHub Copilot | VS Code extension + MCP | `.vscode/settings.json` |
| Codex (OpenAI) | API via Blackbox router | `config/blackbox-agents.yaml` |

**Shared MCP server** (`src/mcp/server.py`) exposes:
- `litigation_search(query, case_id)` — GraphRAG search
- `ingest_documents(matter_id, source)` — OmniSync trigger
- `run_agent(agent_name, params)` — Blackbox agent dispatch
- `human_approve(case_id, action)` — Constitution-gated approval
- `lexvault_browse(matter_id, path)` — LexVault file browser
- `voice_command(text)` — Voice command passthrough

### Module 2: Matter Sidebar

Case-scoped navigation tree:
```
MATTERS/
├── tesla_v_bailey_001/
│   ├── [Docs] 2,847 indexed
│   ├── [Entities] 143 persons, 67 orgs
│   ├── [RICO] 4 predicate acts mapped
│   ├── [Pipeline] LangGraph status
│   └── [Queries] Recent RAG searches
└── winchill_fraud_003/
    └── ...
```

### Module 3: Voice Command Interface

Voice commands are processed by `apps/voice-agent/` and routed to the
appropriate MCP tool or agent cluster.

**Voice Command Vocabulary** (full spec below):

#### Category A — Search & Retrieval
```
"Genie, search [query] in [matter_id]"
"Genie, find documents about [topic]"
"Genie, who is [person_name]?"
"Genie, show me RICO connections for [entity]"
"Genie, find damages evidence in [matter_id]"
"Genie, what are the predicate acts?"
```

#### Category B — Ingestion & Sync
```
"Genie, ingest [matter_id] from all sources"
"Genie, sync [matter_id] from Box"
"Genie, sync email from [account]"
"Genie, run OmniSync for [matter_id]"
"Genie, dedup [matter_id]"
"Genie, rename [matter_id] to ontology standard"
```

#### Category C — Agent Commands
```
"Genie, run RICO analysis on [matter_id]"
"Genie, extract entities from [document]"
"Genie, build timeline for [matter_id]"
"Genie, model damages for [matter_id]"
"Genie, check privilege on [document]"
"Genie, run evaluator swarm"
```

#### Category D — Pipeline Control
```
"Genie, start pipeline for [matter_id]"
"Genie, show pipeline status"
"Genie, approve analysis for [matter_id]"    ← human gate
"Genie, pause pipeline"
"Genie, resume pipeline from [stage]"
```

#### Category E — Coding Tool Commands
```
"Genie, open Claude Code for [task]"
"Genie, run tests"
"Genie, commit changes"
"Genie, sync constitution to all repos"
"Genie, create PR for [branch]"
"Genie, check GitHub Actions"
```

#### Category F — Data Management
```
"Genie, export [matter_id] to Excel"
"Genie, sync Airtable for [matter_id]"
"Genie, show index stats for [matter_id]"
"Genie, rebuild vector index for [matter_id]"
"Genie, audit trail for [document]"
```

### Module 4: Pipeline Dashboard

Live view of the LangGraph state machine:
```
[intake] ✓  →  [extraction] ✓  →  [graph_index] ✓
    →  [rag_analysis] ⟳  →  [evaluation] ○  →  [human_gate] ○  →  [drafting] ○
```

Shows: node status, token usage, elapsed time, queued questions, human gate status.

### Module 5: Constitution Gate

Every action that hits a Constitution checkpoint triggers a UI modal:
```
┌─────────────────────────────────────────────┐
│  HUMAN CHECKPOINT REQUIRED                  │
│  Action: Privilege determination            │
│  Matter: tesla_v_bailey_001                 │
│  Document: tesla_email_20230115_ablair.eml  │
│                                             │
│  ⚠ SIMULATION / NOT LEGAL ADVICE           │
│                                             │
│  [Approve]  [Reject]  [Request Review]      │
└─────────────────────────────────────────────┘
```

---

## Coding Tool Setup — Step by Step

### Claude Code (Primary)

```bash
# 1. Install
npm install -g @anthropic-ai/claude-code

# 2. Configure MCP server
cat > ~/.claude/mcp.json <<EOF
{
  "mcpServers": {
    "litigation": {
      "command": "python",
      "args": ["-m", "src.mcp.server"],
      "cwd": "/path/to/LitigationForce.AI"
    }
  }
}
EOF

# 3. Start in the repo
cd ~/LitigationForce.AI
claude

# The AI reads CLAUDE.md + AGENTS.md automatically
# Constitution governs all outputs
```

### Cursor

```bash
# 1. Install Cursor from cursor.sh
# 2. Open LitigationForce.AI folder
# 3. Cursor reads .cursor/rules/ automatically
# 4. Add MCP in Cursor Settings > MCP > Add Server:
#    Command: python -m src.mcp.server
#    CWD: /path/to/LitigationForce.AI
```

### Windsurf

```bash
# 1. Install Windsurf from codeium.com/windsurf
# 2. Open LitigationForce.AI folder
# 3. Windsurf reads .windsurfrules automatically
# 4. Add MCP in settings
```

### GitHub Copilot

```bash
# Enable in VS Code settings:
# "github.copilot.advanced": {
#   "mcp": true,
#   "mcpServers": [{ "command": "python -m src.mcp.server" }]
# }
```

---

## Genie Desktop — Planned App Architecture (Phase 2)

When built as a standalone app:

```
Genie Desktop (Electron + React)
├── main process (Node.js)
│   ├── IPC bridge to Python backend
│   ├── Claude Code CLI wrapper
│   ├── Voice agent listener (Whisper / system mic)
│   └── File watcher (LexVault new file detection)
└── renderer (React)
    ├── MatterSidebar
    ├── RAGSearchBar
    ├── PipelineDashboard
    ├── ConstitutionGate modal
    ├── VoiceCommandStatus
    └── AuditTrailViewer
```

Tech stack:
- Frontend: Electron + React + Tailwind
- Backend: Python (FastAPI + LangGraph + LexVault adapter)
- Voice: OpenAI Whisper (local) or Deepgram API
- State: Redux (UI) + LangGraph checkpointer (agent state)

---

## Environment Variables for Genie Desktop

```env
# Coding tools
ANTHROPIC_API_KEY=sk-ant-...
BLACKBOX_API_KEY=bb_...
GITHUB_TOKEN=ghp_...

# LexVault
LEX_VAULT_ROOT=/mnt/box/MATTERS
BOX_ACCESS_TOKEN=...

# Email sync
GMAIL_ACCOUNTS=you@firm.com,client@co.com
IMAP_HOST=mail.firm.com
IMAP_USER=...
IMAP_PASSWORD=...

# Data stores
NEO4J_URI=bolt://localhost:7687
NEO4J_PASSWORD=...
REDIS_URL=redis://localhost:6379/0
QDRANT_URL=http://localhost:6333

# Airtable
AIRTABLE_API_KEY=...
AIRTABLE_BASE_ID=...
AIRTABLE_SYNC=true

# Local LLM (private mode)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
OLLAMA_ENABLED=false  # true to use Ollama instead of/alongside Claude

# Simulation safety (non-negotiable)
SIMULATION_MODE=true
```
