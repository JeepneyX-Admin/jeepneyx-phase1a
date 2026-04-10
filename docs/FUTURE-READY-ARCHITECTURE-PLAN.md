# JeepneyX Future-Ready Architecture Plan
**Bridging Phase 1A (Static) to Phases 2-4 (Backend + Framework Integration)**

*Last updated: April 10, 2026*

---

## Executive Summary

Phase 1A has established a solid foundation: proofed content, brand identity, and inquiry capture flow. However, to scale to phases 2-4 without rework, we must now implement an architecture that:

1. **Decouples presentation from data** – Move from static HTML to a component-driven model that works for both current static pages and future framework-based pages
2. **Prepares API contracts** – Define REST endpoints and data models now that backend development will implement in Phase 2
3. **Centralizes configuration** – Eliminate Tailwind duplication and enable cross-phase consistency
4. **Automates quality gates** – Prevent regressions as we scale from 5 to 50+ pages
5. **Enables incremental migration** – Phase 2 phases can adopt a framework (Next.js/Node + React, Laravel, etc.) while Phase 1A remains static

**Target Outcome**: By end of Phase 1A wrap-up, Phase 2 kickoff can begin backend API + component library setup in parallel with framework selection, enabling "no-turnaround builds" across all phases.

---

## Recommendations by Layer

### 1. Frontend Architecture: Component Library + Templating Strategy

**What**: Create a reusable component abstraction layer that works for both static HTML pages and future framework components.

**Why**: 
- Phase 1A repeats navbar, footer, forms across 5 pages → prevents DRY violations
- Phase 2+ will add 15+ pages with forms, CTAs, product cards → framework must reuse same logic
- Centralized components reduce QA burden and enable consistent branding at scale

**When**: Implement in Phase 1A wrap-up (weeks 1-2 of final sprint) before Phase 2 starts

**How**:
```
components/
├── nav-component.html          # Navbar (replaces inline nav code)
├── footer-component.html       # Footer (replaces inline footer code)
├── form-inquiry.html           # Shared inquiry form template
├── cta-button.html             # Reusable CTA button with variants
├── product-card.html           # Future: product card template (Phase 2 prep)
├── hero-section.html           # Hero template with variants
└── README.md                   # Component usage guide + Figma links
```

**Phase 1A Action**: 
- Refactor index.html, company.html, contact.html to use `<link rel="import">` or `{% raw %}{{ include() }}{% endraw %}` placeholders
- Create `components/form-inquiry.html` with Formspree integration
- Document component API (props, states, variants) in README

**Phase 2 Compatibility**:
- If choosing React: Components become `.jsx` with same props interface
- If choosing Vue: Components become `.vue` with same slot structure
- Backend: Form/CTA endpoints extracted to OpenAPI spec (documented below)

**Effort**: 2-4 hours (Phase 1A), 4-8 hours (Phase 2 framework migration)

---

### 2. Configuration: Centralized Tailwind + Theme System

**What**: Move duplicated Tailwind CDN config from 5 HTML pages to a centralized `assets/config/theme.js` module.

**Why**:
- Current state: Each page repeats `<head><script>tailwindConfig = {...}</script></head>` (copy-paste drift risk)
- Scale problem: 20+ pages with drift → inconsistent spacing, colors, typography
- Framework problem: Phase 2+ needs single source of truth for design tokens

**When**: Week 2 of Phase 1A wrap-up (before Phase 2 brand/design decisions)

**How**:
```javascript
// assets/config/theme.js
export const themeConfig = {
  colors: {
    primary: '#39FF14',      // Neon lime - primary CTAs
    primaryHover: '#30D911',
    dark: '#1e7a00',         // Brand-900: text on light backgrounds
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      900: '#111827'
    }
  },
  typography: {
    h1: 'font-size: 2.5rem; font-weight: 700; line-height: 1.2',
    body: 'font-size: 1rem; font-weight: 400; line-height: 1.6'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  }
};

// assets/js/apply-theme.js - Apply theme on page load
(function() {
  const { themeConfig } = require('./config/theme.js');
  window.tailwindConfig = themeConfig; // For Tailwind
  applyColorTokens(themeConfig);       // For CSS variables
})();
```

**Phase 1A Action**:
```html
<!-- index.html, company.html, contact.html, model.html, 404.html -->
<!-- Replace inline tailwindConfig with: -->
<script src="assets/js/apply-theme.js"></script>
```

**Phase 2+ Benefit**:
- React/Vue components import: `import { themeConfig } from '@/config/theme';`
- Designers modify one file → all pages (static + framework) update automatically
- Design System Storybook integration becomes trivial

**Effort**: 3-4 hours (Phase 1A)

---

### 3. API Design: REST Endpoints + Data Contracts

**What**: Document the API contracts that backend will implement in Phase 2, even though Phase 1A uses static forms.

**Why**:
- Prevents misalignment between frontend expectations and backend implementation
- Enables parallel Phase 2 work: backend builds APIs while frontend builds UI
- Defines data models (Vehicle, Quote, Inquiry, etc.) upfront

**When**: Weeks 2-3 of Phase 1A wrap-up (before Phase 2 backend kickoff)

**How**: Create `docs/API-SPECIFICATION.md` (OpenAPI 3.0 format or Swagger YAML):

```yaml
# docs/api-specification.openapi.yaml
openapi: 3.0.0
info:
  title: JeepneyX API
  version: 2.0.0
servers:
  - url: https://api.jeepneyx.com/v1

paths:
  /inquiries:
    post:
      summary: Create inquiry (Phase 1A → Formspree; Phase 2+ → Database)
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/InquiryRequest'
      responses:
        201:
          description: Inquiry created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/InquiryResponse'

  /vehicles:
    get:
      summary: List vehicles (Phase 2+: filters, pagination)
      parameters:
        - name: category
          in: query
          schema:
            type: string
            enum: ["commercial", "transport", "custom"]
        - name: page
          in: query
          schema:
            type: integer
      responses:
        200:
          description: List of vehicles

  /vehicles/{id}:
    get:
      summary: Get vehicle details
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: Vehicle details

components:
  schemas:
    InquiryRequest:
      type: object
      properties:
        name:
          type: string
        email:
          type: string
          format: email
        message:
          type: string
        vehicleId:
          type: string
          nullable: true
      required: [name, email, message]

    InquiryResponse:
      type: object
      properties:
        id:
          type: string
        createdAt:
          type: string
          format: date-time
        status:
          type: string
          enum: ["received", "acknowledged", "pending_response"]
```

**Phase 1A Action**:
- Document current Formspree endpoint behavior
- Add placeholder endpoints for Phase 2 data requirements
- Generate API documentation @ `docs/api-docs.html` (Swagger UI)

**Phase 2 Action**:
- Backend team uses this spec to implement Node/Laravel APIs
- Frontend team uses spec to build data fetching layer (React hooks, Vue composables)
- Contract errors caught before integration

**Effort**: 4-6 hours (Phase 1A documentation)

---

### 4. Backend Framework Selection: Recommendation

**What**: Choose backend + frontend framework stack for Phase 2+ that minimizes rework and maximizes team velocity.

**Recommendation**:
```
Option A (Recommended): Node.js + Express + Next.js + React
├─ Why: Full-stack JavaScript, component reuse, fastest to market
├─ Frontend: Migrate Phase 1A HTML → Next.js pages + React components
├─ Backend: Express APIs, PostgreSQL, Sequelize ORM
├─ Database: PostgreSQL with Sequelize migrations
├─ DevOps: Docker, Vercel or AWS deployment
├─ Time to Phase 2 MVP: 2-3 weeks (infrastructure + API setup)

Option B: Laravel + Vue (if you want PHP backend)
├─ Why: Mature framework, strong Laravel community, Vue learning curve low
├─ Frontend: Static pages → Blade templates + Vue components (gradual)
├─ Backend: Laravel Eloquent ORM, built-in admin panel (Nova), queues
├─ Database: PostgreSQL or MySQL with Eloquent migrations
├─ DevOps: Traditional hosting or Laravel Forge
├─ Time to Phase 2 MVP: 2-3 weeks

Option C: Python Django + React
├─ Why: Strong data/ML potential if JeepneyX adds analytics, Python-friendly for devs
├─ Frontend: Next.js + React (decoupled from Django)
├─ Backend: Django REST Framework APIs, PostgreSQL
├─ Database: PostgreSQL with Django ORM
├─ DevOps: Heroku, DigitalOcean, or AWS
├─ Time to Phase 2 MVP: 2-3 weeks
```

**Decision Process**:
1. **Team expertise**: What language do your developers know?
2. **Market speed**: Option A (Node/Next) is fastest for 2-3 week MVP cycles
3. **Scalability**: All three scale to 50+ pages; choose based on infrastructure comfort
4. **Long-term**: Consider if JeepneyX needs analytics (Python), real-time features (Node), or admin dashboard (Laravel)

**Phase 1A Action**:
- Document framework decision in `docs/PHASE-2-TECH-STACK.md`
- Create placeholder repo structure for Phase 2 with boilerplate
- Add to Notion Phase 2 section for client visibility

**Effort**: 2-4 hours (decision + documentation)

---

### 5. CI/CD + Quality Gates: Automate Prevention

**What**: Implement automated quality checks to catch regressions as page count scales from 5 to 50+.

**Why**:
- Current state: No HTML linting, no accessibility checks, no link validation → Phase 2+ will have broken links, accessibility issues
- "No turnaround builds" principle requires automated QA before merge
- GitHub Actions free for public repos

**When**: Week 1-2 of Phase 1A wrap-up (before Phase 2 traffic)

**How**: Create `.github/workflows/quality-gates.yml`

```yaml
name: Quality Gates

on: [pull_request]

jobs:
  lint-html:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Lint HTML
        run: |
          npm install -g html-validate
          find . -name "*.html" -not -path "./node_modules/*" | xargs html-validate

  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Audit Accessibility (axe)
        run: |
          npm install -g @axe-core/cli
          # Run on key pages
          axe index.html --tags wcag2aa
          axe company.html --tags wcag2aa
          axe contact.html --tags wcag2aa

  link-checker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check Links
        run: |
          npm install -g hyperlink
          hyperlink *.html components/ --root .

  deploy-preview:
    runs-on: ubuntu-latest
    needs: [lint-html, accessibility, link-checker]
    if: success()
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Preview
        run: |
          # Deploy to staging URL via Netlify or similar
          echo "Preview: https://preview-{% raw %}${{ github.event.pull_request.number }}{% endraw %}.jeepneyx-dev.com"
```

**Phase 1A Action**:
- Create workflow in `.github/workflows/quality-gates.yml`
- Test on a dummy PR to verify jobs pass
- Add as required check in main branch protection settings

**Phase 2+ Benefit**:
- All 50+ pages must pass lint, accessibility, links before merge
- Catches typos, broken CTAs, WCAG violations automatically
- Prevents "oops forgot to update footer link" bugs at scale

**Effort**: 2-3 hours (Phase 1A setup)

---

### 6. Database Schema Design (Phase 2 Prep)

**What**: Sketch the data models now so backend and frontend alignment happens early.

**Why**: Prevents "I thought 'status' was an enum, not a string" integration bugs

**When**: Weeks 2-3 of Phase 1A wrap-up (inform Phase 2 database setup)

**How**: Create `docs/DATA-MODELS.md`

```markdown
# JeepneyX Data Models

## Inquiry
```sql
CREATE TABLE inquiries (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  vehicleId UUID FOREIGN KEY (nullable),
  source ENUM('contact_form', 'product_page', 'direct_quote') NOT NULL,
  status ENUM('new', 'acknowledged', 'quoted', 'closed') DEFAULT 'new',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  closedAt TIMESTAMP (nullable)
);
```

## Vehicle
```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,           -- e.g., "JEX-E101"
  category ENUM('commercial', 'transport', 'custom') NOT NULL,
  description TEXT,
  price DECIMAL(12, 2),
  specs JSONB,                          -- Flexible: engine, capacity, etc.
  imageUrl VARCHAR(512),
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## Quote (Phase 2+)
```sql
CREATE TABLE quotes (
  id UUID PRIMARY KEY,
  inquiryId UUID FOREIGN KEY NOT NULL,
  vehicleId UUID FOREIGN KEY,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  validUntil DATE,
  status ENUM('draft', 'sent', 'accepted', 'rejected') DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT NOW(),
  acceptedAt TIMESTAMP (nullable)
);
```

## User/Admin (Phase 3+)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(512),
  role ENUM('admin', 'dealer', 'support') NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT NOW()
);
```
```

**Phase 1A Action**:
- Draft schema in `docs/DATA-MODELS.md` (SQL DDL syntax)
- Share with client in Notion for approval before Phase 2

**Phase 2 Action**:
- Backend team uses schema to set up PostgreSQL
- API endpoints match table structures (POST /inquiries → INSERT into inquiries table)

**Effort**: 3-4 hours (Phase 1A documentation)

---

### 7. Deployment Strategy: Evolution from GitHub Pages to App Server

**What**: Plan migration from static GitHub Pages (Phase 1A) to containerized app server (Phase 2+) without downtime.

**Why**:
- Phase 1A: static site on GitHub Pages (free, simple)
- Phase 2+: Node/Laravel server + PostgreSQL database (requires app hosting)
- Client requirement: "No downtime" deployment

**When**: Weeks 3-4 of Phase 1A wrap-up (infrastructure decision before Phase 2 starts)

**How**: Create `docs/DEPLOYMENT-STRATEGY.md`

```markdown
# Deployment Strategy

## Phase 1A: Static Site (Current)
- Hosting: GitHub Pages (gh-pages branch)
- Domain: jeepneyx.com → GitHub Pages CNAME
- CI/CD: GitHub Actions (deploy-production.yml, deploy-development-preview.yml)
- Cost: Free

## Phase 2: Hybrid Static + API Backend
- Hosting: 
  - Option 1: Vercel (Next.js) + Vercel Postgres
  - Option 2: Heroku + PostgreSQL add-on (deprecated)
  - Option 3: AWS (ECS + RDS)
  - Option 4: DigitalOcean App Platform + Managed DB
- API Server: Node/Express or Laravel
- Database: PostgreSQL
- Domain: Keep jeepneyx.com → Route to app server via DNS
- CI/CD: GitHub Actions → Deploy to chosen platform
- Cost: ~$50-200/month (app hosting + database)

## Migration Plan (Zero Downtime)

1. **Week 1**: Set up infrastructure (app server, database, staging environment)
2. **Week 2**: Deploy Phase 2 pages to staging URL (staging.jeepneyx.com)
3. **Week 3**: User acceptance testing on staging
4. **Week 4**: Blue-green deployment:
   - Blue (current): GitHub Pages (static)
   - Green (new): App Server + Next.js / Laravel
   - DNS switch: jeepneyx.com → App Server (instant cutover)
   - Fallback: Revert DNS to GitHub Pages if error

## Recommended: Vercel + Next.js
- Advantage: GitHub integration, automatic deployments per PR, built-in edge caching
- Next.js compatibility: Easy move from static HTML
- Cost: ~$20/month for Vercel Pro
- Timeline: 2 weeks to full migration

```

**Phase 1A Action**:
- Choose hosting platform (Vercel recommended for Next.js)
- Create infrastructure-as-code template (if AWS)
- Reserve domain configuration for Phase 2

**Phase 2 Action**:
- Execute migration using documented plan
- Test staging → production cutover

**Effort**: 4-6 hours (Phase 1A planning); 8-12 hours (Phase 2 execution)

---

### 8. Testing & PR Workflow: Enforce Quality

**What**: Document PR checklist + test requirements so Phase 2 maintains quality at scale.

**Why**: Phase 2+ will have multiple developers adding 15+ pages → need clear acceptance criteria

**When**: Week 3 of Phase 1A wrap-up

**How**: Create `.github/PR-CHECKLIST.md`

```markdown
# PR Checklist (Required for Merge to main)

## Code Quality
- [ ] HTML validates (no `html-validate` errors)
- [ ] Accessibility passes (WCAG 2.0 AA on key interactive elements)
- [ ] All links verified (no 404s)
- [ ] No console errors / warnings
- [ ] Mobile responsive (tested on 375px, 768px, 1200px widths)

## Content
- [ ] Spell-check passed
- [ ] All copy matches approved client content
- [ ] Product images (if applicable) are final / approved
- [ ] No placeholder text (Lorem ipsum, TBD, etc.)

## Branding
- [ ] Colors match theme.config.js (no hardcoded hex codes)
- [ ] Typography follows design system (h1-h6, body, captions)
- [ ] CTA buttons use brand colors + hover states
- [ ] Brand logo placement consistent with home page

## Notion Sync
- [ ] PR includes link to GitHub PR in Notion Deliverables Log
- [ ] Linked GitHub Issue is marked resolved in Notion + Communications Log

## Testing (Phase 2+)
- [ ] Unit tests written (80%+ coverage)
- [ ] Integration tests for forms / API calls passed
- [ ] E2E tests (Playwright) for critical user flows passed

## Deployment
- [ ] GitHub Actions workflows all green (quality gates + preview deploy)
- [ ] Preview URL shared in PR description
- [ ] Staging tested by PM/client (if applicable)
```

**Phase 1A Action**:
- Create `.github/PR-CHECKLIST.md`
- Reference in PULL_REQUEST_TEMPLATE.md (GitHub auto-suggestion)
- Add to copilot-instructions.md

**Phase 2+ Action**:
- Every PR must check all boxes before merge allowed
- Automate checks via GitHub branch protection rules

**Effort**: 2-3 hours (Phase 1A documentation)

---

## Phase 2 Kick-Off Checklist (Must Complete by End of Phase 1A)

**Infrastructure:**
- [ ] Backend framework selected (Node/Express, Laravel, Django) + rationale documented
- [ ] Hosting platform chosen (Vercel, Heroku, AWS, DigitalOcean) + cost model approved
- [ ] Dev/staging environments set up (staging URL live)
- [ ] PostgreSQL database created + schema initialized

**Design & API:**
- [ ] API specification (OpenAPI YAML) complete + client reviewed
- [ ] Data models (SQL schema) documented + client approved
- [ ] Component library strategy defined (React, Vue, Web Components)
- [ ] Design System Figma file shared with development team

**Code Architecture:**
- [ ] Centralized theme/config strategy implemented (Phase 1A: `assets/config/theme.js`)
- [ ] Component templates created (`components/form-inquiry.html`, `components/cta-button.html`, etc.)
- [ ] Boilerplate repo structure ready (e.g., `jeepneyx-phase2` repo initialized)
- [ ] Tailwind config unified across all pages (no duplication)

**Automation:**
- [ ] GitHub Quality Gates workflow live (lint, accessibility, links)
- [ ] GitHub PR template with checklist active
- [ ] GitHub branch protection enforcing PR review + status checks
- [ ] GitHub issue templates + labels active (issue-first intake workflow live)

**Governance:**
- [ ] Phase 2 Technical Specification document created + approved
- [ ] Deployment strategy documented + approved
- [ ] PR workflow & checklist documented + team trained
- [ ] Notion Phase 2 section updated with deliverables, milestones, and resource assignments

---

## Risk Register

| Risk | Impact | Mitigation | Owner |
|------|--------|------------|-------|
| **Config Drift**: Tailwind duplicated across pages, Phase 2 devs update 1 but forget 3 others | HIGH: Inconsistent branding, expensive QA loop | Implement centralized `theme.js` now (Phase 1A) | Dev Lead |
| **API Contract Mismatch**: Frontend expects `vehicleId`, backend provides `productId` | HIGH: Integration fails, rework required | Document OpenAPI spec + client review now (Phase 1A) | Architect |
| **Framework Churn**: Phase 2 starts, team realizes React is slower than Vue for this project | HIGH: Major rework, project delay | Prototype framework choice with 1-week spike before Phase 2 | Tech Lead |
| **Database N+1 Queries**: Phase 2 launches with unoptimized queries, slows as data grows | MEDIUM: Performance regression Phase 3+ | Document N+1 risks in API spec; code review checklist includes query analysis | Backend Lead |
| **Accessibility Debt**: Phase 2 adds 30 pages without WCAG testing, client demands retrofit | MEDIUM: Compliance risk, rework required | Implement accessibility automation in CI gates now (Phase 1A) | QA Lead |
| **Deployment Downtime**: Blue-green deployment isn't tested, cutover fails at 11pm | MEDIUM: Client sees error page, reputation risk | Document & dry-run migration plan before Phase 2 go-live | DevOps Lead |
| **Commit Hygiene**: Phase 2 history also gets cleanup noise; main branch becomes unreadable | LOW: Auditability issue, not blocking | Add precommit hook (Phase 1A) to prevent accidental commits | Dev Lead |

---

## Implementation Timeline

```
Phase 1A Wrap-Up (Weeks 1-4)
├── Week 1: Centralized theme config + component templates (4 hrs)
├── Week 2: API spec + data models + deployment strategy (8 hrs)
├── Week 3: Quality gates CI/CD + PR checklist (4 hrs)
└── Week 4: Framework selection + boilerplate repo + Notion sync (4 hrs)
        → Total: ~20 hours prep work for Phase 1A team
        → Unlocks: Phase 2 can start with infrastructure + backend in parallel

Phase 2 Start (Week 5)
├── Infrastructure setup (app server, DB, staging): 2-3 weeks
├── API development (base endpoints): 2-3 weeks (parallel)
├── Framework boilerplate (Next.js / Laravel): 1-2 weeks
└── Phase 2 pages (3-5 pages): 1-2 weeks
        → Estimated Phase 2 MVP: 4-6 weeks

Phase 3 (Months 3-4)
├── Scale to 15-20 pages
├── Product filtering, quote workflows
└── Admin dashboard (if applicable)

Phase 4 (Months 5-6)
├── Advanced features (payment gateway, e-commerce, real-time updates if needed)
├── Performance optimization
└── Launch-readiness audit
```

---

## Specific Code Examples

### Example 1: Centralized Theme Config
**File: `assets/config/theme.js`**
```javascript
export const tokenConfig = {
  colors: {
    brand: {
      primary: '#39FF14',       // Neon lime - CTAs
      primaryHover: '#30D911',
      dark: '#1e7a00',          // Text on light backgrounds
      light: '#e6ff80'          // Light background variant
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },
  spacing: {
    'xs': '0.25rem',
    'sm': '0.5rem',
    'md': '1rem',
    'lg': '1.5rem',
    'xl': '2rem',
    '2xl': '3rem',
    '4xl': '6rem'
  },
  typography: {
    fontFamily: {
      sans: 'system-ui, -apple-system, sans-serif',
      mono: 'Menlo, Monaco, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
      '4xl': '2.5rem'
    }
  }
};
```

**Usage in HTML (Phase 1A):**
```html
<script src="assets/config/theme.js"></script>
<script>
  window.tailwindConfig = tokenConfig;
</script>
```

**Usage in React (Phase 2+):**
```jsx
import { tokenConfig } from '@/config/theme';

export function CTAButton({ children }) {
  return (
    <button className="btn-primary">
      {children}
    </button>
  );
}
```

---

### Example 2: Component Template (Reusable Form)
**File: `components/form-inquiry.html`**
```html
<!-- Standalone inquiry form component (works in static HTML + framework) -->
<form id="inquiry-form" action="https://formspree.io/f/xvzwknyr" method="POST" class="form-inquiry">
  <div class="form-group">
    <label for="name">Name *</label>
    <input 
      type="text" 
      id="name" 
      name="name" 
      required 
      aria-label="Your full name"
      class="focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
    />
  </div>

  <div class="form-group">
    <label for="email">Email *</label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      required 
      aria-label="Your email address"
      class="focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
    />
  </div>

  <div class="form-group">
    <label for="message">Message *</label>
    <textarea 
      id="message" 
      name="message" 
      required 
      rows="5"
      aria-label="Your inquiry message"
      class="focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
    ></textarea>
  </div>

  <label class="consent-checkbox">
    <input type="checkbox" name="consent" required />
    I agree to receive follow-up communications.
  </label>

  <button type="submit" class="btn-primary">
    Send Inquiry
  </button>
</form>
```

**Usage in Phase 1A (Static HTML):**
```html
<!-- contact.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Contact | JeepneyX</title>
  <script src="assets/js/apply-theme.js"></script>
</head>
<body>
  <iframe src="components/form-inquiry.html" frameborder="0"></iframe>
  <!-- OR use fetch + inject: -->
  <div id="form-container"></div>
  <script>
    fetch('components/form-inquiry.html')
      .then(r => r.text())
      .then(html => document.getElementById('form-container').innerHTML = html);
  </script>
</body>
</html>
```

**Usage in Phase 2 (React):**
```jsx
import { InquiryForm } from '@/components/InquiryForm';

export default function ContactPage() {
  return <InquiryForm onSubmitSuccess={() => alert('Sent!')} />;
}
```

---

### Example 3: API Specification (OpenAPI Excerpt)
**File: `docs/api-specification.openapi.yaml`**
```yaml
openapi: 3.0.0
info:
  title: JeepneyX API
  description: Backend API for JeepneyX (Phases 2-4)
  version: 2.0.0
  contact:
    name: JeepneyX Dev Team

servers:
  - url: https://api.jeepneyx.com/v1
    description: Production API
  - url: https://staging-api.jeepneyx.com/v1
    description: Staging API

paths:
  /inquiries:
    post:
      operationId: createInquiry
      summary: Create a new vehicle inquiry
      tags: [Inquiries]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  minLength: 1
                  maxLength: 255
                email:
                  type: string
                  format: email
                message:
                  type: string
                  minLength: 10
                vehicleId:
                  type: string
                  format: uuid
                  nullable: true
              required: [name, email, message]
      responses:
        201:
          description: Inquiry created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                    format: uuid
                  createdAt:
                    type: string
                    format: date-time
                  status:
                    type: string
                    enum: ['new', 'acknowledged', 'quoted']
                    default: 'new'
        400:
          description: Invalid request (validation error)
        500:
          description: Server error

    get:
      operationId: listInquiries
      summary: List inquiries (admin/dealer only)
      tags: [Inquiries]
      security:
        - bearerAuth: []
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: ['new', 'acknowledged', 'quoted', 'closed']
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        200:
          description: List of inquiries
        401:
          description: Unauthorized

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

---

## Next Steps

1. **Immediate (This Week)**:
   - [ ] Approve this architecture plan in team sync
   - [ ] Create session task for Theme Config setup
   - [ ] Assign API Spec owner

2. **Short-term (Next 2 Weeks)**:
   - [ ] Implement centralized theme + component templates
   - [ ] Document API specification + data models
   - [ ] Set up GitHub Quality Gates CI workflow
   - [ ] Create PR checklist + branch protection rules

3. **Medium-term (Before Phase 2 Kickoff)**:
   - [ ] Select backend framework + hosting platform
   - [ ] Create Phase 2 boilerplate repository
   - [ ] Run migration dry-run (GitHub Pages → App Server)
   - [ ] Update Notion Phase 2 section with architecture decisions

4. **Sync to Notion**:
   - [ ] Add architecture plan summary to Notion Project Hub
   - [ ] Link this document in Phase 2 section
   - [ ] Update Communications Log with architecture decision
   - [ ] Create Notion database entry for Phase 2 tech stack

---

**Questions? Contact the architect or open a GitHub Discussion in the repository.**
