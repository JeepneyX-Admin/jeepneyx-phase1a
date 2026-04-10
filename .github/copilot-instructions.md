# JeepneyX Project Instructions (Notion Source of Truth)

## Primary Rule
Notion is the source of truth for JeepneyX project scope, status, deliverables, and decisions.
When Notion access is unavailable, continue delivery work but queue exact sync details in `docs/PENDING-NOTION-SYNC.md`.

Project hub page:
- https://www.notion.so/32b19565438e8177991df340a541f67e

## Execution Mode
1. If Notion tools are available in the current session, use them to read and sync updates directly.
2. If Notion tools are unavailable or fail, continue implementation and log pending syncs in `docs/PENDING-NOTION-SYNC.md`.
3. Resolve pending sync entries at least once per work session and after each tool recovery.

## Always Do This During Work
1. At the start of each work session, check the relevant Notion page/database for latest requirements and status when tools are available.
2. After any sync trigger event, sync the same update to Notion in the appropriate page/database.
3. If code and Notion conflict, treat Notion as canonical and reconcile code/work plan accordingly.

## Sync Triggers
Sync to Notion whenever one or more of the following happens:
- Scope or requirement changed
- New deliverable page/file completed
- Status changed (in progress, blocked, done)
- Decision made that affects UX, architecture, content, deployment, or timeline
- Risk/blocker discovered or resolved
- Pull request merged to `main`
- Files under `content/`, `docs/`, or `Requirements/` are added/updated
- Client-facing page updates are completed (`index.html`, `company.html`, `contact.html`, `model.html`, `404.html`)
- `docs/jeepneyx-roadmap.html` is updated due to phase/status/payment milestone changes

## Roadmap HTML Sync Rule
`docs/jeepneyx-roadmap.html` must be updated using values from Notion section `Roadmap HTML — Update Rules`.
The mapping below mirrors the current Notion rules; if this file and Notion ever conflict, Notion is canonical.
Only apply the explicit changes listed for the matching event; keep other roadmap values unchanged.

Required event-to-HTML mapping:
- Phase 1A sign-off received: set Phase 1B badge to In Progress
- Phase 1B DNS live: set Phase 1B to Complete and progress bar to 30%
- Phase 2 downpayment received: set Phase 2 to In Progress (pulse indicator stays)
- Phase 2 complete: set Phase 2 to Complete and progress bar to 55%
- Phase 3 starts: set Phase 3 to In Progress and progress bar to 70%
- Phase 3 complete: set Phase 3 to Complete and progress bar to 80%
- Phase 4 starts: set Phase 4 to In Progress and progress bar to 90%
- Phase 4 complete: set all phases to Complete and progress bar to 100%

After updating `docs/jeepneyx-roadmap.html`, re-upload the file to Documents Drive folder:
- https://drive.google.com/drive/folders/1gRj5CqeHdic63y4q4cYIqjz8HsehFmJQ
Then log the deployment update in Communications Log as an Internal entry.

## What Must Be Synced To Notion
- Scope updates (new pages/features, removed features, requirement changes)
- Status updates (in progress, blocked, done)
- Deliverable updates (created files/pages, deployment/release changes)
- Decision logs (architecture, UX, content, client-approved changes)
- Risks and blockers (with owner and next action)

## Where To Sync (Project Hub Structure)
Use these pages/databases under the Project Hub as the default sync targets:
- Client View - JeepneyX Build Status
- Project Governance Notes
- Phase Tracker (database)
- Communications Log (database)
- Deliverables Log (database)
- Content Requirements Checklist (database)
- Contracts & Documents

## Build Workflow (Governance-Aligned)
When implementing a page/feature, follow this flow:
1. Check requirements in Deliverables Log, Content Requirements Checklist, and the phase detail in Phase Tracker.
2. Build using approved branding/content rules and migration-ready structure.
3. Self-review before sharing (responsive checks, CTA behavior, forms, and no fabricated placeholders).
4. Run Notion closeout updates after each meaningful session.

## Client Request Intake Protocol (Issue-First)
When a client asks for a new feature, bug fix, or update through chat/email/call:
1. Treat direct message as intake only.
2. Create or update a GitHub Issue before implementation begins.
3. Ensure the issue includes:
	- request type (feature, bug, update)
	- problem statement or requested outcome
	- acceptance criteria
	- priority/phase context
4. Implement from `development` branch.
5. Deliver to production only through PR `development` -> `main`.
6. Reflect final status/decision in Notion or queue it in `docs/PENDING-NOTION-SYNC.md` if Notion is unavailable.

## Session Closeout (Required)
After each major build session, update:
1. Deliverables Log entry for all items touched.
2. Communications Log only when there is major build communication or client interaction (not routine internal coding notes).
3. Phase Tracker only if overall phase status changed.
4. Content Requirements Checklist for newly received client content.
5. Client View when client-visible status/progress changed.

## Communications Log Conventions
Log only major communication for the build:
- Always log client interactions (`Direction`: `Sent to Client` or `Received from Client`).
- Use `Direction: Internal` only for major milestones (deployment push, sign-off, phase change, or major blocker/decision).
- Do not log routine internal coding sessions.

Subject conventions:
- Client communication: `[Client] - [topic] [date]`
- Deployment update: `[Page/Phase] - review build pushed`
- Major decision: `[ARCH DECISION] - [title]`

## Database Governance (Strict)
1. Do not create new Notion databases or data sources unless the user explicitly asks and approves.
2. Do not change database schema, property names, or dropdown options unless the user explicitly asks and approves.
3. Use only existing databases and existing option values when logging updates.
4. Do not recreate previously removed governance databases; use current consolidated logs only.

## Database Fields And Allowed Dropdown Values

### Phase Tracker
- `Status`: Complete, In Progress, Pending Client, Proposed, Future
- `Signed Agreement`: Yes, No, Not Required

### Communications Log
- `Action Required`: Yes - Waiting for Client, Yes - DevLab to Act, No Action Needed
- `Channel`: Viber, Email, In Person, Phone, Other
- `Direction`: Sent to Client, Received from Client, Internal
- `Phase`: Phase 1A, Phase 1B, Phase 2, Phase 3, Phase 4, General
- `Resolved` (checkbox): __YES__ or __NO__

### Deliverables Log
- `Status`: Delivered, In Progress, Pending Build, Pending Client Content
- `Type`: HTML Page, Asset, Document, Config, Integration
- `Phase`: Phase 1A, Phase 1B, Phase 2, Phase 3, Phase 4

Note: If review-specific labels are needed (for example "Pushed to Review" or "Client Approved"), keep `Status` within allowed values and record those milestones in `Notes` plus Communications Log Internal entries.

### Content Requirements Checklist
- `Status`: Received, Pending from Client, Not Required
- `Priority`: High, Medium, Low
- `Category`: Branding, Legal & Compliance, Products, About & Company, Media, Testimonials, Social, Services
- `Phase`: Phase 1A, Phase 2, Phase 3

## Contracts Tracking (GDrive + Notion)
1. Store original contract/payment artifacts in Google Drive (Documents folder).
2. Mirror contract/payment tracking status in Notion under `Contracts & Documents` and relevant logs.
3. For each contract/payment update, include:
	- reference ID (for example: JX-001)
	- artifact location (GDrive link or path)
	- amount and status (received/pending)
	- date and next action owner

## Update Protocol
For each major task completed, record a concise Notion update containing:
- Date/time
- What changed
- Why it changed
- Current status
- Next action and owner (if any)

If direct sync is not possible, append this entry to `docs/PENDING-NOTION-SYNC.md` using the same fields.

## Completion Gate
A task is not fully documented until:
1. Implementation/update is done in repository assets and files.
2. Matching update is recorded in Notion, or queued in `docs/PENDING-NOTION-SYNC.md` when Notion access is unavailable.
3. If Notion access remains unavailable for 3 consecutive attempts in one session, keep delivery unblocked and leave an explicit pending entry.

## Escalation Rule
If Notion access is unavailable:
1. Continue implementation without blocking delivery.
2. Add a pending sync entry in `docs/PENDING-NOTION-SYNC.md`.
3. Complete the Notion sync at the earliest possible step.
