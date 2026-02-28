# AGENTS.md — LitigationForce.AI Master Agent Manifest

> **Connected Agents.AI** | Multi-Agent Litigation Intelligence Platform
>
> This file is the canonical reference for all AI agents, orchestration patterns, compliance gates, and governance standards in this repository. It is read by Cursor, GitHub Copilot, and any agent-aware tooling.

---

## READ FIRST (All Dev Tools)

**Constitution applies to all work in this platform.** Before any significant change, new capability, or agent output:

1. Read `docs/constitution.md` (human-in-the-loop, claim typing, audit, bias/safety, simulation disclaimer)
2. For new tools/agents/skills: follow `docs/NEW_CAPABILITY_CHECKLIST.md`
3. Repo status: read `docs/CONSOLIDATION_AND_REPO_STATUS.md` for canonical repos, merged/archived, routing
4. Master rules: `.cursor/rules/master-project-rules.mdc`, `.github/agents/my-agent.agent.md`

These apply regardless of which dev tool (Cursor, Claude Code, Copilot, Codex, etc.) you are using.

---

## Platform Identity

- **Platform**: LitigationForce.AI
- **Operator**: Connected Agents.AI
- **Repository**: CURSOR CLOUD AGENTS (master mono-repo)
- **Orchestration**: Blackbox Cloud Agent API (`cloud.blackbox.ai`)
- **Client**: `scripts/blackbox_client.py` (4000+ line orchestration client)
- **Compliance**: ABA Model Rule 1.1 Comment 8 | EDRM | Sedona 2023 | ISO/IEC 42001:2023
- **Claude Code Memory**: `CLAUDE.md` (project-level AI assistant guide)
- **Cross-System Index**: `docs/cross-system-index.md` (Notion, Linear, Drive, GitHub links)
- **Consolidation & Repo Status**: `docs/CONSOLIDATION_AND_REPO_STATUS.md` (canonical map, routing, merged)
- **Modules**: LexVault, Voice Agents, Litigation Swarm UI, Ontology (`docs/modules/`)

---

## Litigation Tracks

| Track                | Forum          | Focus                                   | Key Statutes                      |
| -------------------- | -------------- | --------------------------------------- | --------------------------------- |
| **A — California**   | CA state court | Contract breach, fraud, forum-selection | CA Civil Code                     |
| **B — Texas State**  | Harris County  | Trade secrets, co-conspirators, TRO     | TX TUTSA                          |
| **C — Federal RICO** | S.D. Texas     | Enterprise + pattern + predicates       | 18 U.S.C. §§ 1341-1962, FRCP 9(b) |

**Integration principle**: One evidence base, track-specific analysis and filings.

---

## Agent Inventory (18+ Agents, 7 Clusters)

### Cluster 1: Document Intelligence (Phase 1)

| Agent                   | Role                                | Input               | Output                                      |
| ----------------------- | ----------------------------------- | ------------------- | ------------------------------------------- |
| **OCR Extractor**       | Extract text from scanned documents | PDF/image evidence  | Raw text + quality score                    |
| **Document Classifier** | Categorize by type and relevance    | Raw text + metadata | Classification label + RICO relevance score |
| **Metadata Normalizer** | Standardize metadata across formats | Raw evidence        | Normalized evidence object                  |

### Cluster 2: Entity & Relationship (Phase 1)

| Agent                       | Role                                                     | Input                    | Output                      |
| --------------------------- | -------------------------------------------------------- | ------------------------ | --------------------------- |
| **Entity Extractor**        | Named entity recognition (persons, orgs, dates, amounts) | Normalized text          | Entity list with confidence |
| **Relationship Mapper**     | Map entity-to-entity relationships                       | Entities + context       | Relationship graph edges    |
| **Knowledge Graph Builder** | Build and maintain Neo4j graph                           | Entities + relationships | Neo4j graph updates         |

### Cluster 3: Legal Analysis (Phase 2)

| Agent                 | Role                                           | Input               | Output                                   |
| --------------------- | ---------------------------------------------- | ------------------- | ---------------------------------------- |
| **RICO Analyzer**     | Six-element RICO evaluation                    | Evidence + entities | RICO assessment with predicate acts      |
| **Contract Analyst**  | Contract clause extraction and breach analysis | Contract documents  | Clause matrix, breach indicators         |
| **Privilege Scanner** | Detect potentially privileged communications   | All evidence        | Privilege flags (conservative)           |
| **Defense Assessor**  | Anticipate and evaluate defense arguments      | Case analysis       | Defense matrix, counterargument strength |

### Cluster 4: Financial Analysis (Phase 2)

| Agent                     | Role                                | Input                   | Output                                                         |
| ------------------------- | ----------------------------------- | ----------------------- | -------------------------------------------------------------- |
| **Damages Modeler**       | Calculate damages across methods    | Financial evidence      | Damages report (before-after, yardstick, lost profits, treble) |
| **Financial Forensics**   | Trace financial flows and anomalies | Financial records       | Transaction maps, anomaly flags                                |
| **Settlement Calculator** | Model settlement ranges             | Case strength + damages | Settlement range with confidence intervals                     |

### Cluster 5: Communication Analysis (Phase 2)

| Agent                | Role                                           | Input                   | Output                                |
| -------------------- | ---------------------------------------------- | ----------------------- | ------------------------------------- |
| **Email Analyzer**   | Analyze email patterns, tone, and content      | Email evidence          | Communication patterns, key exchanges |
| **Timeline Builder** | Construct event timelines from evidence        | All evidence + entities | Chronological timeline with citations |
| **Pattern Detector** | Identify behavioral and communication patterns | All analysis            | Pattern scores, trend indicators      |

### Cluster 6: Evidence & Compliance (Phase 3)

| Agent                  | Role                        | Input                     | Output                                    |
| ---------------------- | --------------------------- | ------------------------- | ----------------------------------------- |
| **Evaluator Swarm**    | Four-gate quality assurance | Any agent output          | Pass/fail with remediation notes          |
| **Production Manager** | Manage document productions | Reviewed evidence         | Load files, Bates numbers, redaction logs |
| **Filing Generator**   | Draft litigation documents  | Case analysis + templates | Filing drafts for attorney review         |

### Cluster 7: Orchestration (Phase 3)

| Agent                  | Role                                   | Input                            | Output                                  |
| ---------------------- | -------------------------------------- | -------------------------------- | --------------------------------------- |
| **Orchestrator**       | Coordinate multi-agent workflows       | Task configuration               | Workflow execution, progress tracking   |
| **Deposition Planner** | Plan deposition strategy and questions | Case analysis + witness profiles | Deposition outlines, question sequences |
| **Risk Monitor**       | Continuous case risk assessment        | All case data                    | Risk alerts, mitigation recommendations |

### Cluster 8: Platform Operations (Sync & Buildout)

| Agent                      | Role                                         | Input          | Output                                             |
| -------------------------- | -------------------------------------------- | -------------- | -------------------------------------------------- |
| **Linear Buildout**        | Sync Linear → Repo; scaffold cases, backlogs | Linear API key | `docs/linear-exports/`, `cases/`, backlog markdown |
| **Platform Notifications** | Unified notifications (1P, Linear, git)      | Alert events   | Slack, audit log                                   |

---

## Evaluator Swarm Gate (Quality Assurance)

Every high-stakes output passes through four gates before reaching human review:

```
Agent Output
  ├── 1. Fact Checker ───────── Verify claims against evidence
  ├── 2. Citation Validator ─── Confirm legal citations are valid and current
  ├── 3. Logic Auditor ──────── Check reasoning for logical fallacies
  └── 4. Ethics Reviewer ────── Flag privilege risks, bias, ethical concerns
          │
          ▼
     ALL PASS? → Human Checkpoint (Attorney Review)
     ANY FAIL? → Remediation Loop (max 3 iterations) → Escalate if still failing
```

---

## Claim Typing Contract

Every assertion produced by any agent carries a type:

| Type               | Definition                             | Required Gates                                       |
| ------------------ | -------------------------------------- | ---------------------------------------------------- |
| `FACT`             | Directly supported by cited evidence   | Fact Checker                                         |
| `INFERENCE`        | Logically derived from facts           | Fact Checker + Logic Auditor                         |
| `OPINION`          | Expert or analytical judgment          | Ethics Reviewer                                      |
| `LEGAL_CONCLUSION` | Application of legal standard to facts | Citation Validator + Logic Auditor + Ethics Reviewer |

---

## Human Checkpoints (Non-Negotiable)

These outputs ALWAYS require attorney sign-off before use:

| Checkpoint                  | Trigger                               | Approver             |
| --------------------------- | ------------------------------------- | -------------------- |
| **Privilege Determination** | Any `potentially_privileged` flag     | Supervising Attorney |
| **Production Review**       | Before any document leaves the system | Litigation Lead      |
| **Filing Review**           | Before any court submission           | Attorney of Record   |
| **Expert Narrative**        | Before any expert report finalization | Engaging Attorney    |

---

## Blackbox Cloud API Integration

### Endpoints

| Method  | Endpoint                | Purpose                              |
| ------- | ----------------------- | ------------------------------------ |
| `POST`  | `/api/tasks`            | Create Multi-Agent Task (2-5 agents) |
| `POST`  | `/api/tasks`            | Create Single Agent Task             |
| `GET`   | `/api/tasks/:id`        | Get Task Details                     |
| `GET`   | `/api/tasks`            | Get Task List                        |
| `GET`   | `/api/tasks/:id/status` | Get Task Status                      |
| `GET`   | `/api/tasks/:id/logs`   | Stream Task Logs (SSE)               |
| `PATCH` | `/api/tasks/:id`        | Cancel Task                          |

### Available Agents & Recommended Models

| Agent        | Recommended Model                        | Strength                           |
| ------------ | ---------------------------------------- | ---------------------------------- |
| **Claude**   | `blackboxai/anthropic/claude-sonnet-4.5` | Complex reasoning, legal analysis  |
| **BLACKBOX** | `blackboxai/blackbox-pro`                | Code generation, fast execution    |
| **Codex**    | `gpt-5.2-codex`                          | Structured data, schema validation |
| **Gemini**   | `gemini-2.0-flash-exp`                   | Fast processing, large context     |

### Presets (from `config/blackbox-agents.yaml`)

| Preset            | Agents | Use Case                             |
| ----------------- | ------ | ------------------------------------ |
| `fast`            | 2      | Quick tasks, simple edits            |
| `diverse`         | 3      | Broad perspective, standard analysis |
| `thorough`        | 4      | Critical legal analysis, RICO        |
| `max_coverage`    | 5      | Maximum validation and comparison    |
| `rico_specialist` | 3      | RICO-specific pattern analysis       |
| `discovery`       | 3      | Document review and discovery        |
| `filing`          | 2      | Filing document generation           |

---

## Vendor & Tool Ecosystem

| Vendor / Tool         | Category                  | Integration                           |
| --------------------- | ------------------------- | ------------------------------------- |
| **Blackbox Cloud**    | Multi-agent orchestration | Primary API (`cloud.blackbox.ai`)     |
| **Relativity**        | eDiscovery platform       | Evidence import/export, review        |
| **Everlaw**           | Cloud discovery           | Document review, productions          |
| **Clio**              | Case management           | Matter data, time tracking            |
| **Spellbook**         | Contract AI               | Contract analysis augmentation        |
| **LexisNexis**        | Legal research            | Citation validation, case law         |
| **Briefpoint.ai**     | Discovery automation      | Discovery response generation         |
| **Neo4j**             | Knowledge graph           | Entity/relationship mapping           |
| **Attio CRM**         | Relationship management   | Entity profiles, metadata             |
| **Power BI / Fabric** | Analytics                 | Litigation dashboards, visualizations |

---

## Compliance Standards

| Standard                          | Scope                 | Key Requirement                                                       |
| --------------------------------- | --------------------- | --------------------------------------------------------------------- |
| **ABA Model Rule 1.1, Comment 8** | Technology competence | Understand AI tools; document limitations                             |
| **ABA Model Rules 5.1/5.3**       | Supervision           | Attorney review of all AI outputs                                     |
| **ABA Standard 303**              | Professional identity | Bias awareness, experiential learning                                 |
| **EDRM**                          | Discovery workflow    | TAR validation, transparency, defensibility                           |
| **Sedona 2023 AI Commentary**     | AI in litigation      | Transparency, explainability, human oversight, adversarial disclosure |
| **ISO/IEC 42001:2023**            | AI management         | Policy → controls → logs → audits                                     |
| **GDPR Article 22**               | Automated decisions   | Human-in-loop for legal effect decisions                              |
| **CCPA**                          | Privacy               | Data minimization, access controls                                    |
| **FRCP Rule 9(b)**                | Fraud particularity   | Who, what, when, where, how, why                                      |
| **FRE 502**                       | Privilege waiver      | Clawback protocols, conservative flagging                             |
| **FRE 901**                       | Authentication        | Chain-of-custody, hash verification                                   |
| **FRCP 26(b)(1)**                 | Proportionality       | Scope-appropriate discovery                                           |
| **FRCP 37(e)**                    | Preservation          | Litigation hold enforcement                                           |

---

## Cursor Rules Index

| Rule File                   | Scope                                                                | Always Apply      |
| --------------------------- | -------------------------------------------------------------------- | ----------------- |
| `master-project-rules.mdc`  | All files — governance, workflow, structure                          | Yes               |
| `security-evidence.mdc`     | Cases, scripts, config — security and privilege (highest precedence) | Yes               |
| `codacy.mdc`                | All files — code quality analysis after edits                        | Yes               |
| `after_each_chat.mdc`       | All sessions — chat-end summary generation                           | Yes               |
| `blackbox-api.mdc`          | Scripts, config, examples — API integration patterns                 | No (glob-matched) |
| `litigation-compliance.mdc` | Agents, cases, docs — legal standards enforcement                    | No (glob-matched) |
| `agent-development.mdc`     | Agents, cases — agent spec patterns, evaluator gates                 | No (glob-matched) |
| `python-standards.mdc`      | Scripts — Python coding standards                                    | No (glob-matched) |

### Cursor Skills (Ontology, Lists, Connections)

| Skill                  | Path                                             | Purpose                                                       |
| ---------------------- | ------------------------------------------------ | ------------------------------------------------------------- |
| ontology-schema-syntax | `.cursor/skills/ontology-schema-syntax/SKILL.md` | Ontology, taxonomy, JSON schemas, naming conventions          |
| lists-todos-projects   | `.cursor/skills/lists-todos-projects/SKILL.md`   | Lists, to-dos, projects, hierarchy, cross-system mapping      |
| names-and-connections  | `.cursor/skills/names-and-connections/SKILL.md`  | Entity names, relationships, cross-system connection maps     |
| linear-buildout        | `.cursor/skills/linear-buildout/SKILL.md`        | Linear → Repo full buildout (teams, projects, issues, cases/) |

Constitution: `docs/constitution.md`.

### Rule Precedence (Highest to Lowest)

1. Security & privilege (`security-evidence.mdc`)
2. Compliance (`litigation-compliance.mdc`)
3. Master project (`master-project-rules.mdc`)
4. Domain-specific (`blackbox-api.mdc`, `agent-development.mdc`, `python-standards.mdc`)
5. Tool-specific (`codacy.mdc`)
6. Session (`after_each_chat.mdc`)

---

## Repository Map

```
CURSOR CLOUD AGENTS/
├── AGENTS.md                          ← YOU ARE HERE (master manifest)
├── README.md                          ← Project overview
├── requirements.txt                   ← Python dependencies
├── .cursor/rules/                     ← Cursor AI rules
│   ├── master-project-rules.mdc       ← Core governance
│   ├── blackbox-api.mdc               ← API integration rules
│   ├── litigation-compliance.mdc      ← Legal standards enforcement
│   ├── security-evidence.mdc          ← Security & privilege (highest precedence)
│   ├── agent-development.mdc          ← Agent spec patterns
│   ├── python-standards.mdc           ← Python coding standards
│   ├── codacy.mdc                     ← Code quality automation
│   └── after_each_chat.mdc            ← Session summary automation
├── .cursor/agents/                   ← Cursor agent specs (orchestration, platform ops)
│   ├── master-orchestrator.md        ← Universal coordinator
│   ├── platform-architect.md         ← UI/design/KG overseer
│   ├── linear-buildout-agent.md       ← Linear → Repo sync and scaffold
│   ├── knowledge-graph-builder.md
│   └── entity-extractor.md
├── agents/                            ← Agent specifications
│   ├── README.md                      ← Agent library index
│   ├── AGENT_REGISTRY.md              ← Complete 93-agent inventory across all platforms
│   ├── RICO_Litigation_Intelligence_Agent_v2.md
│   └── claude-code-build/             ← Full Claude Code agent build-out
│       ├── README.md                  ← Build structure and deployment modes
│       ├── workers/                   ← 6 Claude Code worker definitions
│       │   ├── orchestrator.md        ← Master Orchestrator (7.0)
│       │   ├── rico-analyzer.md       ← RICO Analyzer (3.1)
│       │   ├── privilege-scanner.md   ← Privilege Scanner (3.3)
│       │   ├── evaluator-swarm.md     ← Evaluator Swarm (6.1-6.4)
│       │   ├── filing-generator.md    ← Filing Generator (6.6)
│       │   └── damages-modeler.md     ← Damages Modeler (4.1)
│       ├── skills/                    ← Claude Code SKILL.md definitions
│       │   ├── rico-analysis/SKILL.md
│       │   ├── evidence-ingest/SKILL.md
│       │   └── evaluator-gate/SKILL.md
│       ├── workflows/                 ← Orchestration & decision logic
│       │   ├── WORKFLOW_HIERARCHY.md  ← 3-tier architecture (UI → Case → RICO rollup)
│       │   └── case-agents.yaml      ← Per-case, per-defendant agent configs + decision tree
│       ├── workers/                   ← (continued)
│       │   ├── platform-architect.md  ← UI/Design/KG overseer (1.0)
│       │   ├── timeline-webapp.md     ← Timeline search + visualization (98K+ files)
│       │   └── reverse-verifier.md    ← End-to-end output verification
│       ├── tools/
│       │   └── tool-registry.yaml     ← 50+ tools organized by category
│       ├── knowledge/
│       │   └── knowledge-sources.yaml ← All knowledge sources (repo, Notion, Linear, external)
│       ├── replit-integration/         ← Replit codebase integration
│       │   └── REPLIT_AGENTS.md       ← 33 agent classes from Verital-Legal-Tech
│       └── plugins/
│           └── plugin-manifest.yaml   ← 33 Claude plugins + 8 MCP servers + integrations
├── cases/                             ← Case workspaces
│   ├── Tesla/                         ← Reference multi-track case
│   │   ├── AGENT_IMPLEMENTATION.md
│   │   ├── AGENTIC_WORKFLOW_CONFIG.yaml
│   │   ├── FILING_TEMPLATES/
│   │   └── ...
│   └── Winchill/
├── config/                            ← Configuration
│   ├── blackbox-agents.yaml           ← Model catalog & presets
│   ├── inference-models.yaml          ← 397 inference models
│   ├── playbooks.yaml                 ← Per-agent prompt templates & gate config
│   ├── production-pipeline.yaml       ← COMPLETE pipeline: 85 sheets → agents → evidence → output
│   ├── file-routing.yaml              ← Context-aware file routing (MIME + filename + screen + matter)
│   └── mcp-servers/                   ← MCP router configs
├── data/                              ← Case data and simulation data
│   ├── Connected_Solar_vs_All_Master.xlsx ← MASTER CASE FILE (85+ sheets, 7 cases, $270M)
│   └── synthetic/                     ← Simulation data
│       ├── corpus/                    ← Sample documents for pipeline testing
│       └── gold/                      ← Attorney-labeled regression test data
├── docs/                              ← Documentation
│   ├── architecture.md                ← System design
│   ├── PRD_LitigationForceAI_v2.0_Enhanced.md ← Product requirements
│   ├── TECH_SPEC_AI_Agents_Civil_RICO.md
│   ├── standards-compliance.md        ← ABA/EDRM/Sedona/ISO
│   ├── security.md                    ← Provenance & privilege
│   ├── evals.md                       ← Evaluation harness & metrics
│   ├── ui-demo.md                     ← UI/UX walkthrough
│   ├── APPLICATION_FLOW.md            ← Upload → Ingestion → Pipeline → 85-sheet Master Case File
│   ├── DATA_TABLES_AND_EVIDENCE_UI.md ← All data tables, file viewers, presentations, recordings
│   ├── PRODUCT_SCREENS_COMPLETE.md    ← Every screen, tab, setting, dashboard, output format
│   ├── VISUAL_SYSTEM_ARCHITECTURE.md  ← Dashboard combinations, exhibits, weighting, 14 visual types
│   ├── AGENT_ARCHITECTURE_MASTER.md   ← Taxonomy, patterns, orchestration, execution modes
│   ├── LITIGATION_REQUIREMENTS_MASTER.md ← End-to-end litigation requirements + RICO
│   ├── cross-system-index.md          ← Notion/Linear/Drive/GitHub links
│   ├── modules/                       ← System module specifications
│   │   ├── lexvault.md                ← Secure case file system & knowledge layer
│   │   ├── voice-agents.md            ← Legal Scribe, deposition transcriber, voice assistant
│   │   ├── litigation-swarm-ui.md     ← Web application UI/UX, design system, deployments
│   │   └── ontology.md                ← Naming conventions, schema standards, taxonomy
│   ├── mcp-router.md                  ← Tool discovery
│   ├── blackbox-multi-agent-integration.md
│   └── schemas/                       ← JSON Schema definitions
│       ├── evidence-object.schema.json
│       ├── claim-object.schema.json
│       ├── timeline-event.schema.json
│       ├── pattern-score.schema.json
│       ├── bundle-package.schema.json
│       ├── reviewer-annotation.schema.json
│       └── audit-event.schema.json
├── examples/                          ← Sample configurations
│   ├── blackbox-tasks/
│   └── demo-output/                   ← Demo bundle (case overview, defendants, damages, narrative)
├── mcp/                               ← MCP prompt templates
├── scripts/                           ← Python tooling
│   ├── blackbox_client.py             ← 4000+ line orchestration client
│   ├── run_eval.sh                    ← Evaluation harness runner
│   └── validate_schemas.sh            ← JSON schema validator
├── tests/                             ← Test suite
│   ├── conftest.py                    ← Shared fixtures
│   ├── unit/                          ← Unit tests
│   ├── integration/                   ← Integration tests
│   └── fixtures/                      ← Test data
├── replit-app/                         ← FULL Replit codebase (72 files, plug-and-play)
│   ├── src/agents/                    ← 33 agent classes (litigation, AI, analysis, investigation)
│   ├── src/models/                    ← Pydantic v2 models (litigation, social, graph, evaluation)
│   ├── src/orchestration/             ← LitigationOrchestrator (7-phase pipeline)
│   ├── src/mcp/                       ← MCP server (8 connector types)
│   ├── src/ontology/                  ← Legal tech ontology (entity, document, case)
│   ├── src/graph/                     ← Neo4j integration (client, queries, analysis)
│   ├── src/scrapers/                  ← 6 platform scrapers (Twitter, LinkedIn, etc.)
│   ├── src/evaluations/               ← Social evaluator pipeline
│   ├── examples/                      ← Workflow examples (litigation, scraping, investigation)
│   ├── pyproject.toml                 ← Dependencies and build config
│   └── CLAUDE.md                      ← 412-line project memory
├── .codacy/                           ← Code quality config
│   ├── cli.sh                         ← Codacy CLI installer
│   └── tools-configs/                 ← Linter configurations
└── tmp/                               ← Auto-generated summaries
```

---

## Quick Start

```bash
# Set API key
export BLACKBOX_API_KEY="bb_YOUR_KEY"

# Multi-agent RICO analysis
python scripts/blackbox_client.py rico \
  --prompt "Identify predicate acts in Tesla evidence bundle" \
  --track federal_rico \
  --wait

# Multi-agent comparison
python scripts/blackbox_client.py compare --task-id <TASK_ID>

# Single-agent quick task
python scripts/blackbox_client.py single \
  --prompt "Draft litigation hold letter" \
  --agent claude \
  --model claude-sonnet-4.5

# Chat completion
python scripts/blackbox_client.py legal-chat \
  --message "What are the elements of civil RICO?" \
  --type rico

# List all available models
python scripts/blackbox_client.py models
```

---

---

## Genie Desktop — Coding Tool Integration

> Full architecture spec: `docs/GENIE_DESKTOP_ARCHITECTURE.md` (in LitigationForce.AI repo)

**Genie** (Generative Execution Network for Intelligence & Engagement) is the
local integration layer binding all coding tools to the LitigationForce.AI platform.

### Coding Tool Hierarchy

| Tool | Role | Integration | Reads |
|------|------|-------------|-------|
| **Claude Code** (PRIMARY) | AI coding + research CLI | MCP server | `CLAUDE.md`, `AGENTS.md` |
| **Cursor** | AI IDE | `.cursor/rules/` + MCP | `.cursor/rules/*.mdc` |
| **Windsurf** | AI IDE | `.windsurfrules` + MCP | `.windsurfrules` |
| **GitHub Copilot** | IDE assistant | VS Code MCP | `AGENTS.md` |
| **Blackbox.ai** | Cloud agent clusters | Cloud API | `config/blackbox-agents.yaml` |

All tools are governed by the Constitution. `AGENTS.md` is the canonical manifest
read by every tool. Never configure a tool without verifying it reads `AGENTS.md`.

### MCP Server Tools (available to all coding tools)

| Tool | Method | What It Does |
|------|--------|-------------|
| `litigation_search` | `(query, case_id)` | GraphRAG search → answer |
| `ingest_documents` | `(matter_id, source)` | OmniSync trigger |
| `run_agent` | `(agent_name, params)` | Blackbox agent dispatch |
| `human_approve` | `(case_id, action)` | Constitution-gated approval |
| `lexvault_browse` | `(matter_id, path)` | LexVault file explorer |
| `voice_command` | `(text)` | Route voice commands |
| `omni_sync` | `(matter_id, sources)` | Multi-source dedup + ingest |
| `pipeline_status` | `(matter_id)` | LangGraph state |

### Voice Command Vocabulary

Voice commands via `apps/voice-agent/`. Intent → MCP Tool routing:

**Search & Retrieval**
- `"Genie, search [query] in [matter_id]"` → `litigation_search`
- `"Genie, who is [person]?"` → `litigation_search` (entity focus)
- `"Genie, show RICO connections for [entity]"` → `graph_rag.find_rico_connections`

**Sync & Ingestion**
- `"Genie, ingest [matter_id] from all sources"` → `omni_sync` (all adapters)
- `"Genie, sync [matter_id] from Box"` → `omni_sync` (BoxAdapter only)
- `"Genie, sync email from [account]"` → `omni_sync` (GmailAdapter/ImapAdapter)
- `"Genie, dedup [matter_id]"` → `omni_sync` (dedup_only mode)
- `"Genie, rename [matter_id] to ontology standard"` → `omni_sync` (rename_only)

**Agent Commands**
- `"Genie, run RICO analysis on [matter_id]"` → `run_agent` → Blackbox RICO cluster
- `"Genie, run evaluator swarm"` → Evaluator Swarm (4 gates)
- `"Genie, model damages for [matter_id]"` → Damages Modeler agent

**Pipeline Control**
- `"Genie, start pipeline for [matter_id]"` → LangGraph `build_litigation_pipeline()`
- `"Genie, approve [matter_id]"` → `human_approve` → human gate pass
- `"Genie, show pipeline status"` → `pipeline_status`

**Coding & DevOps**
- `"Genie, open Claude Code for [task]"` → `claude` CLI spawn
- `"Genie, sync constitution to all repos"` → trigger `sync-constitution.yml`
- `"Genie, run tests"` → `pytest` via MCP shell tool
- `"Genie, commit changes"` → git commit helper

---

## OmniSync — Multi-Source Document/Email/Photo Sync

> Code: `src/ingestion/omni_sync.py` (LitigationForce.AI)

OmniSync connects all document management apps, photo libraries, and email
accounts, then:
1. Discovers new/changed files across all sources
2. Deduplicates (SHA-256 exact + vector near-duplicate)
3. Renames to LexVault naming convention: `{MATTER}_{DOCTYPE}_{DATE}_{CUSTODIAN}_{SEQ}.{ext}`
4. Organizes into LexVault folder structure (`MATTERS/{matter_id}/raw/`)
5. Extracts text + indexes into Neo4j via RAGSink
6. Syncs unified metadata to Airtable tables

### Source Adapters

| Source | Adapter | Auth |
|--------|---------|------|
| Box (LexVault primary) | `BoxAdapter` | Box OAuth token |
| Gmail | `GmailAdapter` | Google OAuth |
| Google Drive | `GoogleDriveAdapter` | Google OAuth |
| Google Photos | `GooglePhotosAdapter` | Google Photos API |
| IMAP (Outlook, firm email) | `ImapAdapter` | Host + credentials |
| Local filesystem | `LocalFSAdapter` | None |

### Quick Start

```bash
# From env vars (simplest)
export LEX_VAULT_ROOT=/mnt/box/MATTERS
export BOX_ACCESS_TOKEN=...
export GMAIL_ACCOUNTS=you@firm.com,client@co.com
export AIRTABLE_SYNC=true

python -c "
import asyncio
from src.ingestion.omni_sync import OmniSync
sync = OmniSync.from_env('tesla_v_bailey_001')
asyncio.run(sync.run_full_sync('tesla_v_bailey_001'))
"
```

---

## Context Window & Codebase Efficiency Rules

The following rules prevent context bloat, wasted tokens, and codebase confusion.
These apply to all dev tools (Claude Code, Cursor, Windsurf, Copilot).

### Hard Rules (enforced by Constitution)

1. **One canonical answer per question** — never duplicate definitions across files.
   If it's in `PLATFORM_INTEGRATION_MAP.md`, don't re-explain in `CLAUDE.md`.
2. **Reference, don't repeat** — use `> See: docs/X.md` rather than copying content.
3. **Matter-scoped context** — always pass `case_id/matter_id` to limit vector searches.
   Never search the whole index when a case filter is available.
4. **Top-K limits** — default `top_k=8` for RAG; never exceed 20 without justification.
5. **Chunk size** — embed at most 2000 chars per chunk; overlap 200 chars.
6. **Session summaries** — every Claude Code / Cursor session writes a summary to
   `tmp/session-YYYY-MM-DD.md` (after_each_chat.mdc rule).

### Auto-Managed by GitHub Actions

- `sync-constitution.yml` — keeps AGENTS.md, CONSTITUTION.md, Cursor rules in sync.
  You never need to manually push governance files to satellite repos.
- Context drift prevention: satellite repos can't diverge > 1 day from source.

### Tools That Help

| Problem | Tool / Rule |
|---------|-------------|
| Context too long | Always set `case_id` filter in RAG queries |
| Duplicated definitions | `PLATFORM_INTEGRATION_MAP.md` is the source of truth |
| Can't find a file | Check `docs/cross-system-index.md` |
| Don't know which agent | Check this `AGENTS.md` Cluster table |
| Don't know which MCP tool | Check `docs/PLATFORM_INTEGRATION_MAP.md` MCP section |
| Need voice command | Check Voice Command Vocabulary above |
| Need to sync all repos | Run `gh workflow run sync-constitution.yml` |
| Confused about naming | LexVault convention: `{MATTER}_{DOCTYPE}_{DATE}_{CUSTODIAN}_{SEQ}.{ext}` |

---

_Maintained by Connected Agents.AI — LitigationForce.AI Platform_
_SIMULATION / NOT LEGAL ADVICE — All outputs require attorney review_
