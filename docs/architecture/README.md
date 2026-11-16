# Vulgis architecture

_Owner: Steve. Last updated: 2026-11-16._

This folder holds the architecture overview and the Architecture Decision Records (ADRs).
`CLAUDE.md` describes the code in detail; this overview describes the system and where it is going.

## Current state (prototype)

- **Client only.** A React 18 single-page app built with Vite 5. All data (articles, events,
  simulated readers and their ratings) is bundled into the client. There is no server, database
  or authentication.
- **Persistence:** the reader's own ratings and settings live in the browser's localStorage.
- **Hosting:** static files on Cloudflare Pages (vulgis.com), built from M's fork of the repository.
- **Data-access seam:** `src/services/api.js` and `src/services/community.js` are the only modules
  that read articles and ratings, so a real API can replace them.

## Target state

A production platform serving millions of users on AWS or Azure (provider not chosen), with a
responsive interface for desktop and mobile. **No target architecture has been proposed or
approved yet.** It will be proposed as ADRs and approved by M and Daniel before it is built.

## Architecture Decision Records

See `adr/README.md` for the index and template.
