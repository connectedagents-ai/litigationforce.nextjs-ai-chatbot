# CLAUDE.md — AI Assistant Guide for CURSOR CLOUD AGENTS

This document provides context and conventions for Claude Code, Claude Co-worker, and any AI assistant working with this repository.

## READ FIRST

**Constitution applies.** Read `docs/constitution.md` before significant changes. For new capabilities: `docs/NEW_CAPABILITY_CHECKLIST.md`. Repo status: `docs/CONSOLIDATION_AND_REPO_STATUS.md`. Master rules: `.cursor/rules/master-project-rules.mdc`.

**Full ecosystem map**: `MANAGE.md` — all repos, MCPs, agents, tools, apps, LLMs, verification commands. Read this to understand and manage the entire platform.

## Project Overview

**CURSOR CLOUD AGENTS** is the master mono-repo for the **LitigationForce.AI** platform, operated by **Connected Agents.AI**. It orchestrates 18+ specialized AI agents across three concurrent litigation tracks via the Blackbox Cloud Agent API (`cloud.blackbox.ai`).

**IMPORTANT DISCLAIMER**: All litigation-related outputs are **Simulation / Not Legal Advice**. This system is designed for litigation support — all findings require human review before use in legal proceedings.

## Architecture

```
CURSOR CLOUD AGENTS/
├── .cursor/rules/          # 8 Cursor AI rule files (governance, security, compliance)
├── agents/                 # Agent specifications and playbooks
├── cases/                  # Case workspaces (Tesla, Winchill, multi-matter)
│   └── {CaseName}/
│       ├── AGENT_IMPLEMENTATION.md
│       ├── AGENTIC_WORKFLOW_CONFIG.yaml
│       └── FILING_TEMPLATES/
├── config/                 # YAML/JSON configuration
│   ├── blackbox-agents.yaml       # Model catalog & presets
│   ├── inference-models.yaml      # 397 inference models
│   ├── playbooks.yaml             # Per-agent prompt templates
│   └── mcp-servers/               # MCP router configs
├── data/synthetic/         # Simulation corpus and gold labels
├── docs/                   # Architecture, specs, compliance, schemas, playbooks
├── examples/               # Sample task configs and bundles
├── mcp/                    # MCP prompt templates
├── scripts/                # Python tooling (blackbox_client.py)
├── tests/                  # Test suite
└── tmp/                    # Auto-generated session summaries
```

## Core Components

### 1. Blackbox Cloud Agent API (`scripts/blackbox_client.py`)

4000+ line orchestration client covering all 7 API endpoints:

| Method  | Endpoint                | Purpose                              |
| ------- | ----------------------- | ------------------------------------ |
| `POST`  | `/api/tasks`            | Create Multi-Agent Task (2-5 agents) |
| `POST`  | `/api/tasks`            | Create Single Agent Task             |
| `GET`   | `/api/tasks/:id`        | Get Task Details                     |
| `GET`   | `/api/tasks`            | Get Task List                        |
| `GET`   | `/api/tasks/:id/status` | Get Task Status                      |
| `GET`   | `/api/tasks/:id/logs`   | Stream Task Logs (SSE)               |
| `PATCH` | `/api/tasks/:id`        | Cancel Task                          |

Chat Completion: `POST https://api.blackbox.ai/chat/completions`

### 2. Agent System (18+ Agents, 7 Clusters)

| Cluster                | Phase | Agents                                                               |
| ---------------------- | ----- | -------------------------------------------------------------------- |
| Document Intelligence  | 1     | OCR Extractor, Document Classifier, Metadata Normalizer              |
| Entity & Relationship  | 1     | Entity Extractor, Relationship Mapper, KG Builder                    |
| Legal Analysis         | 2     | RICO Analyzer, Contract Analyst, Privilege Scanner, Defense Assessor |
| Financial Analysis     | 2     | Damages Modeler, Financial Forensics, Settlement Calculator          |
| Communication Analysis | 2     | Email Analyzer, Timeline Builder, Pattern Detector                   |
| Evidence & Compliance  | 3     | Evaluator Swarm (4 gates), Production Manager, Filing Generator      |
| Orchestration          | 3     | Orchestrator, Deposition Planner, Risk Monitor                       |

### 3. Evaluator Swarm Gate (Quality Assurance)

Every high-stakes output passes four gates:

1. **Fact Checker** — verify claims against evidence
2. **Citation Validator** — confirm legal citations
3. **Logic Auditor** — check reasoning chains
4. **Ethics Reviewer** — flag privilege risks, bias

### 4. Claim Typing Contract

| Type               | Gate Required                                        |
| ------------------ | ---------------------------------------------------- |
| `FACT`             | Fact Checker                                         |
| `INFERENCE`        | Fact Checker + Logic Auditor                         |
| `OPINION`          | Ethics Reviewer                                      |
| `LEGAL_CONCLUSION` | Citation Validator + Logic Auditor + Ethics Reviewer |

### 5. Ontology, Lists & Connections

When creating ontology schemas, lists, to-dos, projects, or entity names/connections, follow:

- `.cursor/skills/ontology-schema-syntax/SKILL.md` — taxonomy, JSON schemas, naming
- `.cursor/skills/lists-todos-projects/SKILL.md` — lists, to-dos, projects
- `.cursor/skills/names-and-connections/SKILL.md` — entity names, relationships

Constitution: `docs/constitution.md`.

### 6. Multi-Track Litigation

| Track            | Forum         | Focus                                                      |
| ---------------- | ------------- | ---------------------------------------------------------- |
| A — California   | CA state      | Contract breach, fraud                                     |
| B — Texas State  | Harris County | Trade secrets, co-conspirators                             |
| C — Federal RICO | S.D. Texas    | Enterprise + pattern + predicates (18 U.S.C. §§ 1341-1962) |

## Key Conventions

### Python Style

- **Python**: 3.10+ (for `X | Y` union syntax)
- **Type hints**: Required on all public functions
- **Docstrings**: Google-style format
- **Enums**: Inherit from `(str, Enum)` for JSON compatibility
- **Data models**: `@dataclass` with `field(default_factory=...)` for mutables

### Naming Conventions

| Element   | Convention         | Example                     |
| --------- | ------------------ | --------------------------- |
| Files     | snake_case         | `blackbox_client.py`        |
| Classes   | PascalCase         | `LitigationForceClient`     |
| Functions | snake_case         | `create_multi_agent_task()` |
| Constants | UPPER_SNAKE        | `DEFAULT_POLL_INTERVAL`     |
| Enums     | UPPER_SNAKE values | `ClaimType.FACT`            |
| YAML keys | snake_case         | `selected_agents`           |

### Commit Message Format

```
type(scope): description
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `security`, `compliance`

### Simulation Mode

All outputs must include the simulation disclaimer. The system blocks dangerous directives:

- "file with court", "serve defendant", "execute subpoena" are blocked
- Filing generation produces drafts only — attorney review is mandatory
- Privilege determinations always require human checkpoint

## Configuration

### Environment Variables

| Variable           | Description                     | Required       |
| ------------------ | ------------------------------- | -------------- |
| `BLACKBOX_API_KEY` | Blackbox Cloud API key (`bb_*`) | Yes            |
| `GITHUB_TOKEN`     | GitHub PAT for repo access      | For repo tasks |

### Available Models

| Agent    | Recommended                              | Strength          |
| -------- | ---------------------------------------- | ----------------- |
| Claude   | `blackboxai/anthropic/claude-sonnet-4.5` | Complex reasoning |
| BLACKBOX | `blackboxai/blackbox-pro`                | Fast execution    |
| Codex    | `gpt-5.2-codex`                          | Structured output |
| Gemini   | `gemini-2.0-flash-exp`                   | Large context     |

## Related Systems

| System             | Purpose                                                                   | Access                                   |
| ------------------ | ------------------------------------------------------------------------- | ---------------------------------------- |
| Notion             | Master operating docs, RICO case matrix, agent instructions               | Notion MCP                               |
| Linear             | Project tracking (6 teams, 22+ projects)                                  | Linear MCP                               |
| GitHub             | `connectedagents-ai/adk-python`, `Connected-Energy-AI/LitigationForce.AI` | GitHub MCP                               |
| LitigationForce.AI | ADK-based codebase (scrapers, models, MCP server)                         | `~/Documents/LitigationForce-Parent/`    |
| Codex agent-os     | Agent operating system skills                                             | `~/.codex/worktrees/542b/`               |
| **Platform Core**  | Universal modules, ontology, constitution, economics, voice, MCP          | `~/Documents/connected-agents-platform/` |
| Vercel             | Deployments (litigationforce.com, smithwick.ai, talianventures.com)       | Vercel dashboard                         |
| Replit             | SwarmRICO, Verital-Legal-Tech deployments                                 | Replit dashboard                         |
| Neo4j              | Knowledge graph for entity/relationship mapping                           | Via MCP/API                              |
| Attio CRM          | Entity profiles, relationship metadata                                    | Via MCP/API                              |

## Compliance Standards

- ABA Model Rule 1.1 Comment 8 (technology competence)
- ABA Model Rules 5.1/5.3 (supervision of AI outputs)
- EDRM (defensible discovery workflow)
- Sedona 2023 AI Commentary (transparency, explainability, human oversight)
- ISO/IEC 42001:2023 (AI management systems)
- FRCP Rule 9(b), FRE 502/901, FRCP 26(b)(1)/37(e)

## Cursor Rules (8 files in `.cursor/rules/`)

| Rule                        | Scope                | Precedence  |
| --------------------------- | -------------------- | ----------- |
| `security-evidence.mdc`     | Security & privilege | 1 (highest) |
| `litigation-compliance.mdc` | Legal standards      | 2           |
| `master-project-rules.mdc`  | Core governance      | 3           |
| `blackbox-api.mdc`          | API integration      | 4           |
| `agent-development.mdc`     | Agent specs          | 4           |
| `python-standards.mdc`      | Python code          | 4           |
| `codacy.mdc`                | Code quality         | 5           |
| `after_each_chat.mdc`       | Session summaries    | 6           |

## Security

1. **Never commit secrets** — use environment variables (`BLACKBOX_API_KEY`, `GITHUB_TOKEN`)
2. **Raw evidence is immutable** — only derivatives are created, SHA-256 hashed
3. **Privilege detection is conservative** — flag for review, never auto-release
4. **Human checkpoint required** for filings, productions, privilege determinations
5. **Audit trail on every operation** — structured JSON with hashes

## CLI Quick Start

```bash
export BLACKBOX_API_KEY="bb_YOUR_KEY"

# RICO analysis (multi-agent)
python scripts/blackbox_client.py rico --prompt "Identify predicate acts" --track federal_rico --wait

# Chat completion
python scripts/blackbox_client.py legal-chat -m "Elements of civil RICO?" --type rico

# List models
python scripts/blackbox_client.py models
```
