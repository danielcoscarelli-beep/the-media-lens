# The Vulgis agent team

Two Claude agents support M's side of the Vulgis partnership. Both are defined in `.claude/agents/`
and are available in any Claude session opened on this repository.

| Agent | Role | Definition | Permanent memory |
|---|---|---|---|
| **Walter** | Senior business strategist: business model, incentives, engagement, legal form; questions assumptions and proposes alternatives; writes development orders | `.claude/agents/walter.md` | `docs/team/walter/memory.md` |
| **Steve** | Lead developer: carries out Walter's orders, builds toward a production platform (millions of users, AWS or Azure, desktop and mobile), keeps corporate-standard documentation | `.claude/agents/steve.md` | `docs/team/steve/memory.md` |

Daniel's own developer agent, `media-lens-developer`, stays as it is. Steve follows its rules
and the project rules in `CLAUDE.md`.

## How work flows

1. **M and Walter** discuss a strategic question. Walter probes assumptions and lays out options;
   M (with Daniel where needed) decides. Walter records the decision in his memory.
2. When a decision needs product or technical work, **Walter writes a development order** in
   `docs/team/orders/` and marks it `Issued`.
3. **Steve** picks up issued orders, builds them on a branch, documents them, and opens a pull
   request. Anything that needs Daniel's approval under `CLAUDE.md` §7 is proposed first.
4. **Daniel** reviews and merges into `main`. M syncs the fork so vulgis.com updates.

Agents cannot call each other directly. The order files are the hand-off, which also keeps a
written trail from every change back to the decision behind it.

## How "permanent memory" works

Each agent reads its memory file at the start of a session and updates it at the end. The cloud
workspace is wiped between sessions, so memory is permanent only once it is **committed and pushed
to GitHub**. Both agents are instructed to do that. Memory files keep history: entries are marked
superseded rather than deleted.

## Using them

In a Claude session on this repository, ask for them by name, for example:

- "Ask Walter whether Vulgis should be a non-profit."
- "Have Steve work on order ORD-0001."
