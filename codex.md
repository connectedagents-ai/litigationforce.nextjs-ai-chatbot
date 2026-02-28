# OpenAI Codex / ChatGPT Instructions - Connected Energy.AI / LitigationForce.AI
# Auto-generated from CONSTITUTION.md - Do not edit directly
# Last synced: 2026-02-28

## Binding Constitution
Read and obey `CONSTITUTION.md` at the repository root. It is the single source of truth
for all AI agents operating in this ecosystem.

## Project Overview
LitigationForce.AI is a Social Agent Orchestration System for litigation intelligence,
social media analysis, and investigative research. Built on Python 3.11+, Pydantic v2,
Neo4j, and Anthropic Claude API.

## What You Must Know
1. Read CONSTITUTION.md for universal rules
2. Read docs/AGENTS.md for agent definitions and communication patterns
3. Read docs/PLATFORM_ARCHITECTURE.md for the dual-deployment architecture
4. Read CLAUDE.md for the comprehensive AI assistant rulebook

## Code Standards
- Black formatter (line-length 100)
- Ruff linter (rules: E, F, I, N, W, UP)
- mypy strict (disallow_untyped_defs=true)
- Google-style docstrings
- pytest + pytest-asyncio (mode=auto)
- 80% coverage minimum

## Architecture
- Agent base class: src/orchestration/base.py
- All models: src/models/ (Pydantic v2 with Field constraints)
- MCP server: src/mcp/ (connectors + policy enforcement)
- Graph DB: src/graph/ (Neo4j async)
- Ontology: src/ontology/ (Veritas LegalTech)
- Runtime: src/runtime/ (portable agent kernel, LLM adapters)
- Config: src/config/settings.py (@lru_cache singleton)

## Safety (CRITICAL)
- simulation_mode = True (NEVER change)
- block_filing_directives = True (NEVER change)
- All outputs are Simulation / Not Legal Advice

## Infrastructure (CONSTITUTION.md Article VII-A)
- Docker: `docker-compose up` → Neo4j + Redis + App + Worker
- MCP: .mcp.json (1 stdio litigation server + 6 HTTP external)
- GitHub: `gh auth login` for terminal PR ops; `make quality` for pre-commit
- All MCP connectors are simulation stubs until explicitly switched

## Proven Patterns (from CONSTITUTION.md Article VIII)
- Use `X | None` not `Optional[X]`; `list[str]` not `List[str]` (Python 3.11)
- `callable` cannot use `|` — use `Callable` from typing
- Test data MUST respect Pydantic Field(max_length=N) constraints
- Framework shells are empty — business logic must initialize collections
- Intent parsers: account for articles ("create a budget" not just "create budget")

## Autonomous Control (CONSTITUTION.md Article IX)
- AutonomousControlOrchestrator: src/orchestration/autonomous_control.py
- Loop: Inventory → Health Check → Ingest → Configure → Sync → Capture

## Design System (CONSTITUTION.md Article X)
- Full spec: docs/DESIGN_SYSTEM.md
- Deloitte-grade institutional + modern legal tech
- Dark mode default; Orbitron/Inter/JetBrains Mono/Source Serif Pro
- No hardcoded colors; use design tokens
