# GitHub Copilot Instructions - Connected Energy.AI / LitigationForce.AI
# Auto-generated from CONSTITUTION.md - Do not edit directly
# Last synced: 2026-02-28

## Binding Constitution
Read and obey `CONSTITUTION.md` at the repository root. It is the single source of truth.

## Project
LitigationForce.AI is a Social Agent Orchestration System for litigation intelligence.
Python 3.11+, Pydantic v2, Neo4j, Anthropic Claude API.

## Code Generation Rules
- Use Black formatting (line-length 100)
- Use Ruff-compatible imports (isort via Ruff)
- Use mypy strict typing (all functions must have type annotations)
- Use Google-style docstrings
- Use async/await for all I/O operations
- Use Pydantic v2 BaseModel for all data structures
- Use structlog for logging (never print())
- Use tenacity for retry logic
- Use Field(default_factory=...) for mutable defaults
- Use SecretStr for API keys

## Architecture Context
- Agents inherit from BaseAgent (src/orchestration/base.py)
- Models go in src/models/ with Pydantic v2
- MCP connectors go in src/mcp/connectors.py
- Graph operations use Neo4j async driver (src/graph/)
- Ontology types in src/ontology/ (Veritas namespace)
- Settings via get_settings() singleton (src/config/settings.py)

## Safety
- simulation_mode = True always
- block_filing_directives = True always
- All outputs are Simulation / Not Legal Advice
- Never commit secrets (.env is gitignored)

## Naming
- Files: snake_case
- Classes: PascalCase
- Functions: snake_case
- Constants: UPPER_SNAKE
- Commits: type(scope): message

## Proven Patterns (from CONSTITUTION.md Article VIII)
- Use `X | None` not `Optional[X]`; `list[str]` not `List[str]` (Python 3.11)
- `callable` cannot use `|` — use `Callable` from typing
- Test data MUST respect Pydantic Field(max_length=N) constraints
- Framework shells are empty — business logic must initialize collections before iterating
- Intent parsers: account for articles ("create a budget" not just "create budget")

## Infrastructure (CONSTITUTION.md Article VII-A)
- Docker: `docker-compose up` → Neo4j + Redis + App + Worker
- MCP: .mcp.json (stdio litigation tools + HTTP external services)
- GitHub: `gh auth login` required for terminal PR/issue ops
- Makefile: `make quality`, `make docker-up`, `make setup`

## Key Reference Files
- CONSTITUTION.md - Universal rules
- docs/AGENTS.md - Agent definitions
- CLAUDE.md - Full AI assistant rulebook
- docs/PLATFORM_ARCHITECTURE.md - Architecture details
- .mcp.json - MCP server connections
- docker-compose.yml - Service definitions
