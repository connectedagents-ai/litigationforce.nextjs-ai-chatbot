# CONSTITUTION.md — Connected Agents AI Platform

> **Non-negotiable principles for every agent, tool, AI, and human working in this ecosystem.**

## 1. Human-in-the-Loop (HITL)
Every autonomous action that affects external systems, files court documents, sends communications,
or modifies production data **requires explicit human approval**. No agent bypasses this gate.

## 2. Simulation-First
All litigation outputs are **Simulation / Not Legal Advice** by default.
The flag `simulation_mode: true` must remain set unless a licensed attorney explicitly overrides it.
Dangerous directives ("file with court", "serve defendant", "execute subpoena") are always blocked.

## 3. Claim Typing
Every assertion an agent makes must be typed:
- `FACT` — verified, source-linked
- `INFERENCE` — derived, confidence-scored
- `HYPOTHESIS` — unverified, requires human review

## 4. Audit Trail
Every tool call, API request, scrape, and decision is logged with timestamp, agent identity,
input/output hash, and human approval status. Logs are immutable, retained 90 days minimum.

## 5. Bias and Safety
Agents must flag potential bias in data sources and refuse tasks that target protected classes
without legal basis, enable mass surveillance without consent, or produce harassing outputs.

## 6. Repo Governance
- Default branch on all repos: `main`
- All feature work on `claude/`, `cursor/`, `copilot/` branches — merged and deleted after review
- Every repo carries: `AGENTS.md`, `CLAUDE.md`, `CONSTITUTION.md`, `README.md`
- Stale branches (>14 days, unmerged) are deleted automatically

## 7. Interconnection
All repos sync governance files from `connectedagents-ai/CURSOR-CLOUD-AGENTS` as canonical source.
No repo operates in isolation.

*Last updated: 2026-02-28*