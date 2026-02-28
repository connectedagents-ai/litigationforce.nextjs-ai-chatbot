# Platform Integration Map — LitigationForce.AI

> **SIMULATION / NOT LEGAL ADVICE**
> Constitution governs all agents, outputs, and human checkpoints.
> Last updated: 2026-02-28

This is the **single source of truth** for how all platform modules, databases,
coding tools, and external services connect. Read this before building any
new integration or agent.

---

## Master Data Flow

```
SOURCES (external)
  Box / Google Drive / Gmail / iCloud / IMAP / Local FS / Notion
        ↓
[OmniSync] — dedup + rename + organize
  src/ingestion/omni_sync.py
        ↓
[LexVault] — immutable SHA-256 store + provenance
  MATTERS/{matter_id}/raw/
        ↓
[LexVaultAdapter] — walk raw/ + extract text + verify SHA-256
  src/ingestion/lex_vault_adapter.py
        ↓
[RAGSink] — embed + upsert to Neo4j + optional Qdrant
  src/ingestion/rag_sink.py
        ↓
[VectorIndexManager] — Neo4j native vector index (CREATE VECTOR INDEX)
  src/graph/vector_index.py
        ↓
[GraphRAGRetriever] — vector seed + graph hop + LLM synthesis
  src/graph/graph_rag.py
        ↓
[LangGraph Pipeline] — 7-node state machine with human gate
  src/orchestration/langgraph_pipeline.py
        ↓
[LLM Adapters] — Claude (primary) + Ollama (private fallback)
  src/runtime/llm_adapters.py
        ↓
[Evaluator Swarm] — 4-gate quality check (fact/citation/logic/ethics)
  CURSOR CLOUD AGENTS / Blackbox API
        ↓
[Human Gate] — Constitution-mandated human approval checkpoint
        ↓
[Output] — Memo / Damages Model / Timeline / Filing Draft
  (SIMULATION — attorney review required before any use)
        ↓
[Sync back] — Airtable + Excel + LexVault derivatives/summaries/
```

---

## Module Index

| Module | Code Location | Purpose | Status |
|--------|--------------|---------|--------|
| OmniSync | `src/ingestion/omni_sync.py` | Multi-source sync, dedup, rename | ✅ Built |
| LexVaultAdapter | `src/ingestion/lex_vault_adapter.py` | LexVault → ingestion bridge | ✅ Built |
| RAGSink | `src/ingestion/rag_sink.py` | Ingestion → Neo4j/Qdrant | ✅ Built |
| VectorIndexManager | `src/graph/vector_index.py` | Neo4j native vector index | ✅ Built |
| GraphRAGRetriever | `src/graph/graph_rag.py` | Hybrid RAG | ✅ Built |
| LangGraph Pipeline | `src/orchestration/langgraph_pipeline.py` | Orchestration state machine | ✅ Built |
| LLM Adapters | `src/runtime/llm_adapters.py` | Claude + Ollama adapters | ✅ Built |
| MCP Server | `src/mcp/server.py` | Connector hub for coding tools | Existing |
| Neo4j Client | `src/graph/client.py` | Graph DB connection | Existing |
| Ingestion Engine | `src/ingestion/pipeline.py` | Multi-source pipeline base | Existing |
| Ingestion Orchestration | `src/ingestion/orchestration.py` | Scheduled pipeline runner | Existing |
| Litigation Orchestrator | `src/orchestration/litigation_orchestrator.py` | Legacy orchestrator | Existing |
| Genie Desktop | `docs/GENIE_DESKTOP_ARCHITECTURE.md` | Local client architecture | Designed |

---

## Data Stores

| Store | URL/Connection | Primary Use | Driver |
|-------|---------------|-------------|--------|
| Neo4j 5.26 | `bolt://localhost:7687` | Graph + vector index (PRIMARY) | `neo4j>=6.0.0` |
| Qdrant | `http://localhost:6333` | Secondary vector (optional) | `qdrant-client>=1.12.0` |
| Redis 7 | `redis://localhost:6379` | Cache + LangGraph checkpoint | `redis>=7.1.0` |
| Airtable | API | Cases, Parties, Docs, Deadlines | `pyairtable` |
| Box | `api.box.com` | LexVault primary storage (1.8TB) | `box-sdk-gen` |
| Ollama | `http://localhost:11434` | Private/local LLM | `ollama>=0.4.0` |

---

## Coding Tools Integration

| Tool | Integration | Reads From | Key Files |
|------|-------------|------------|-----------|
| **Claude Code** | MCP server + CLI | `CLAUDE.md`, `AGENTS.md` | `.claude/mcp.json` |
| **Cursor** | `.cursor/rules/` + MCP | `.cursor/rules/*.mdc` | `.cursor/mcp.json` |
| **Windsurf** | `.windsurfrules` + MCP | `.windsurfrules` | MCP config |
| **GitHub Copilot** | VS Code MCP extension | `AGENTS.md` | `.vscode/settings.json` |
| **Blackbox.ai** | Cloud API | `config/blackbox-agents.yaml` | `scripts/blackbox_client.py` |
| **Codex** | OpenAI API via Blackbox | `config/inference-models.yaml` | Blackbox router |

All tools read `AGENTS.md` as the canonical agent manifest and are governed
by the Constitution (`docs/constitution.md`).

---

## External Services

| Service | Purpose | Auth | Sync Direction |
|---------|---------|------|---------------|
| Box | LexVault primary storage | OAuth 2.0 | Bidirectional |
| Google Drive | Secondary document store | OAuth 2.0 | In → LexVault |
| Gmail | Email ingestion | OAuth 2.0 | In → LexVault |
| Google Photos | Photo evidence | OAuth 2.0 | In → LexVault |
| Notion | Case wikis + docs | Notion API | Read + write |
| Airtable | Structured data tables | API key | Bidirectional |
| Linear | Project tracking | API key | Read |
| GitHub | Code repos + Actions | PAT + SYNC_PAT | Bidirectional |
| Blackbox.ai | 18+ agent clusters | `bb_*` API key | Out (agent dispatch) |
| Vercel | Web deployments | CLI | Out (deploy) |
| Replit | SwarmRICO deployments | CLI | Out (deploy) |
| Attio CRM | Entity/relationship CRM | API key | Bidirectional |

---

## GitHub Repos Map

| Repo | Purpose | Branch Strategy | Constitution? |
|------|---------|----------------|--------------|
| `Connected-Energy-AI/LitigationForce.AI` | ADK platform code | `main` + feature branches | ✅ CLAUDE.md |
| `connectedagents-ai/CURSOR-CLOUD-AGENTS` | Master mono-repo | `main` | ✅ CLAUDE.md + AGENTS.md |
| `connectedagents-ai/connected-agents-platform` | Universal platform modules | `main` | Sync target |
| `connectedagents-ai/file-management-toolkit` | File management tools | `main` | Sync target |
| `connectedagents-ai/adk-python` | Google ADK fork/mirror | `main` | Sync target |

**Auto-sync**: `.github/workflows/sync-constitution.yml` propagates `CONSTITUTION.md`,
`AGENTS.md`, `.cursor/rules/master-project-rules.mdc` from CURSOR-CLOUD-AGENTS
to all satellite repos daily + on push.

---

## OmniSync — Multi-Source Dedup & Rename

### Supported Sources

| Adapter | Class | Auth Required | Status |
|---------|-------|--------------|--------|
| Box | `BoxAdapter` | Box OAuth / App token | Stub (token needed) |
| Gmail | `GmailAdapter` | Google OAuth | Stub (token needed) |
| Google Drive | `GoogleDriveAdapter` | Google OAuth | Stub (token needed) |
| Google Photos | `GooglePhotosAdapter` | Google OAuth | Stub (token needed) |
| IMAP Email | `ImapAdapter` | Host + credentials | Stub (aioimaplib needed) |
| Local FS | `LocalFSAdapter` | None | ✅ Working |

### Dedup Strategy

| Tier | Method | Action |
|------|--------|--------|
| 1 — Exact | SHA-256 match | Discard duplicate |
| 2 — Near-exact | File size ±1% + fuzzy name | Flag in privilege_log for review |
| 3 — Semantic | Vector cosine > 0.95 | Create graph edge: (A)-[:NEAR_DUPLICATE_OF]->(B) |

### Rename Convention

```
{MATTER}_{DOCTYPE}_{DATE}_{CUSTODIAN}_{SEQ}.{ext}

tesla_contract_20220916_rbailey_001.pdf
tesla_email_20230115_ablair_042.eml
tesla_financial_2023Q3_voltstreet_001.xlsx
```

### LexVault Folder Structure (standard)

```
/MATTERS/
  /{matter_id}/
    /raw/                    ← immutable source (SHA-256 locked at ingestion)
    /derivatives/
      /ocr/                  ← extracted text (LexVaultAdapter writes)
      /metadata/             ← JSON sidecar (LexVaultAdapter reads + writes)
      /embeddings/           ← embedding metadata (RAGSink writes)
      /summaries/            ← AI summaries (LangGraph drafting writes)
    /productions/            ← Bates-stamped production sets
    /filings/                ← Draft filings (attorney review required)
    /work_product/           ← Attorney work product (RESTRICTED)
    /privilege_log/          ← Privilege determinations
    /audit/                  ← Immutable audit trail (JSONL)
```

---

## Ontology / Schema Alignment

All data in the platform uses the same ontology taxonomy:

| Layer | Schema | Location |
|-------|--------|----------|
| LexVault metadata | Document metadata fields | `docs/modules/lexvault.md` |
| Airtable tables | Cases, Documents, Parties, Deadlines, Claims, Events, Analysis | `src/config/settings.py` |
| Neo4j nodes | Document, Matter, Entity, Relationship | `src/graph/` |
| Pydantic models | SocialProfile, LitigationParty, Evidence, etc. | `src/models/` |
| Palantir Foundry | Object/Link Types | `src/ontology/` |
| Excel export | Master index sheet | OmniSync `excel_export_path` |

**Single ontology principle**: A `matter_id` in LexVault = `case_id` in
Airtable = `Matter.matter_id` in Neo4j = `case_id` in vector index metadata.
One identifier governs all stores.

---

## Voice Command → System Routing

```
Voice Input (Whisper/Deepgram)
    ↓
apps/voice-agent/ (intent parser)
    ↓
MCP Router (src/mcp/server.py)
    ↓ ┌──────────────────────────────────────┐
      │ "search [query]"  → GraphRAGRetriever│
      │ "ingest [matter]" → OmniSync         │
      │ "run [agent]"     → Blackbox API     │
      │ "approve"         → Human Gate       │
      │ "open claude code"→ claude CLI       │
      │ "pipeline status" → LangGraph state  │
      └──────────────────────────────────────┘
    ↓
Response → TTS (voice) or UI (text)
```

---

## GitHub Actions Automation

| Workflow | Trigger | What It Does |
|----------|---------|-------------|
| `sync-constitution.yml` | Push to main (governance files) + daily 06:00 UTC | Sync CONSTITUTION.md, AGENTS.md, Cursor rules to all satellite repos |
| `check-github-accounts.yml` | Manual / PR | Audit GitHub account access, repo permissions, Copilot seat assignment |
| (future) `run-evaluator-swarm.yml` | Push to main | Run Evaluator Swarm on changed agent outputs |
| (future) `ingest-new-evidence.yml` | File upload webhook | Trigger OmniSync → RAGSink on new LexVault uploads |
| (future) `airtable-sync.yml` | Scheduled daily | Sync Neo4j → Airtable master tables |

---

## Quick-Start Commands

```bash
# 1. Start all services
docker compose -f docker-compose.rag.yml up -d

# 2. Initial setup (installs deps, pulls Ollama model, creates vector index)
./scripts/setup_rag.sh

# 3. Ingest a matter from LexVault
python -c "
import asyncio
from src.ingestion.lex_vault_adapter import LexVaultAdapter, LexVaultConfig
from pathlib import Path

async def main():
    config = LexVaultConfig(vault_root=Path('/mnt/box/MATTERS'))
    adapter = LexVaultAdapter(config)
    result = await adapter.ingest_matter('tesla_v_bailey_001')
    print(result)

asyncio.run(main())
"

# 4. Run OmniSync from all sources
python -c "
import asyncio
from src.ingestion.omni_sync import OmniSync
sync = OmniSync.from_env('tesla_v_bailey_001')
asyncio.run(sync.run_full_sync('tesla_v_bailey_001'))
"

# 5. GraphRAG query
python -c "
import asyncio
from src.graph.client import Neo4jClient
from src.graph.graph_rag import GraphRAGRetriever
async def main():
    client = Neo4jClient()
    await client.connect()
    r = GraphRAGRetriever(client)
    await r.ensure_ready()
    result = await r.retrieve_and_synthesize(
        query='What RICO predicates connect defendant to the scheme?',
        case_id='tesla_v_bailey_001',
    )
    print(result.answer)
asyncio.run(main())
"

# 6. Run full LangGraph pipeline
python -c "
import asyncio
from src.orchestration.langgraph_pipeline import build_litigation_pipeline, LitigationState
async def main():
    app = build_litigation_pipeline()
    state = LitigationState(
        case_id='tesla_v_bailey_001',
        documents=[{'doc_id': 'doc:001', 'text': 'Sample complaint text...', 'metadata': {}}],
        questions=['What are the key RICO predicates?'],
        entities=[], claims=[], timeline=[], indexed_doc_ids=[], rag_results=[],
        evaluation_passed=False, evaluation_findings=[], human_approved=False,
        human_notes=None, final_output=None, audit_log=[],
        started_at='', completed_at=None, error=None, disclaimer='',
    )
    result = await app.ainvoke(state)
    print(result['final_output'])
asyncio.run(main())
"
```
