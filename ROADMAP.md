# AgencyOS (Clientoq) — Full Roadmap, Sitemap & Pipelines

## 1. Project Overview

**Name:** Clientoq — "the quietly confident business canvas for agencies"
**Type:** Full-stack monorepo (pnpm workspace + Turbo)
**Tech Stack:** Next.js 16.2.9, React 19, Tailwind CSS 4, NestJS 10, Prisma ORM, PostgreSQL

---

## 2. Sitemap

### 2.1 Web App Routes (`apps/web/src/app/`)

| Route | File | Description |
|-------|------|-------------|
| `/` | `page.tsx` | Landing page + full SPA dashboard with tabbed navigation |
| `/about` | `about/page.tsx` | About page |
| `/contact` | `contact/page.tsx` | Contact page |
| `/demo` | `demo/page.tsx` | Demo page |
| `/faq` | `faq/page.tsx` | FAQ page |
| `/features` | `features/page.tsx` | Features showcase |
| `/how-it-works` | `how-it-works/page.tsx` | How it works page |
| `/join-waitlist` | `join-waitlist/page.tsx` | Waitlist signup |
| `/pricing` | `pricing/page.tsx` | Pricing tiers |
| `/privacy-policy` | `privacy-policy/page.tsx` | Privacy policy |
| `/refund-and-cancellation` | `refund-and-cancellation/page.tsx` | Refund policy |
| `/security` | `security/page.tsx` | Security info |
| `/terms-of-service` | `terms-of-service/page.tsx` | Terms of service |

### 2.2 API Endpoints (`apps/api/src/`)

#### Auth Controller (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/auth/me` | Get authenticated user |

#### CRM Controller (`/api/crm`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/crm/leads` | List leads |
| POST | `/api/crm/leads` | Create lead |
| PUT | `/api/crm/leads/:id` | Update lead |
| POST | `/api/crm/leads/:id/activities` | Add lead activity |

#### Clients Controller (`/api/clients`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clients` | List clients |
| POST | `/api/clients` | Create client |
| GET | `/api/clients/:id` | Get client detail with projects, invoices, WhatsApp |

#### Projects Controller (`/api/projects`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Project detail with milestones, tasks |
| POST | `/api/projects/:id/milestones` | Add milestone |
| PUT | `/api/projects/milestones/:milestoneId` | Update milestone |
| POST | `/api/projects/:id/tasks` | Create task |
| PUT | `/api/projects/tasks/:taskId` | Update task |
| POST | `/api/projects/tasks/:taskId/comments` | Add comment |
| POST | `/api/projects/tasks/:taskId/checklists` | Add checklist item |
| PUT | `/api/projects/tasks/checklists/:checklistId` | Toggle checklist |

#### Finance Controller (`/api/finance`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/finance/invoices` | List invoices |
| POST | `/api/finance/invoices` | Create invoice |
| GET | `/api/finance/expenses` | List expenses |
| POST | `/api/finance/expenses` | Create expense |
| POST | `/api/finance/payments` | Record payment |

#### Finance Webhook Controller (`/api/finance/webhooks`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/finance/webhooks/razorpay` | Razorpay payment webhook |

#### WhatsApp Controller (`/api/whatsapp`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/whatsapp/conversations` | List conversations |
| GET | `/api/whatsapp/conversations/:id/messages` | Get messages |
| POST | `/api/whatsapp/messages` | Send message |

#### WhatsApp Webhook Controller (`/api/whatsapp/webhooks`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/whatsapp/webhooks` | Webhook verification |
| POST | `/api/whatsapp/webhooks` | Handle incoming messages |

#### AI Controller (`/api/ai`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | AI assistant chat |

#### Automations Controller (`/api/automations`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/automations` | List automations |
| POST | `/api/automations/trigger` | Trigger automation |

#### Analytics Controller (`/api/analytics`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Dashboard KPI data |

---

## 3. Core Modules & Features

### 3.1 CRM Pipeline
- Lead capture with pipeline stages: **New → Contacted → Qualified → Proposal Sent → Negotiation → Won/Lost**
- Activity logging
- Multi-tenant with role-based access (SuperAdmin, Owner, Manager, Employee, Client)

### 3.2 Client Management
- Client profiles, contacts, company details, GST numbers

### 3.3 Project Management
- Kanban boards, milestones, tasks with assignees
- Checklists, comments, progress tracking

### 3.4 Finance & Billing
- Invoicing with line items, tax calculation (18% GST)
- Expense tracking, payment recording

### 3.5 WhatsApp Hub
- WhatsApp Business integration via Meta API webhooks
- Conversation tracking, automated replies

### 3.6 Automations
- Rule-based triggers (Lead Created, Invoice Due, etc.)
- Actions: WhatsApp, Task creation

### 3.7 AI Assistant
- Keyword-based responses for proposals, invoices, tasks, email drafts, client summaries

### 3.8 Analytics Dashboard
- Revenue/expense KPIs, 6-month trend charts, activity feeds

---

## 4. Data Model

### 4.1 Multi-tenancy
- **Organizations** with Users
- Role-based access control
- Comprehensive audit logging
- Daily metrics aggregation
- Notification system

---

## 5. Build & Deployment Pipelines

### 5.1 Build System
- **Turbo** (`turbo.json`) — Build orchestration
- **pnpm** workspaces — Dependency management

### 5.2 Docker
- `Dockerfile.api` — NestJS API container
- `Dockerfile.web` — Next.js web container
- `docker-compose.yml` — Multi-container setup

### 5.3 Database
- `prisma.config.ts` — Prisma configuration
- `packages/database/prisma/schema.prisma` — Database schema

---

## 6. Project Structure

```
AgencyOS/
├── apps/
│   ├── api/                    # NestJS backend
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts
│   │       ├── auth/           # Auth controller, service, guard, DTOs
│   │       ├── crm/            # Leads & activities
│   │       ├── clients/        # Client management
│   │       ├── projects/       # Projects, tasks, milestones
│   │       ├── finance/        # Invoices, expenses, payments
│   │       ├── whatsapp/       # WhatsApp messaging & webhooks
│   │       ├── ai/             # AI assistant
│   │       ├── automations/    # Automation rules
│   │       ├── analytics/      # Dashboard data
│   │       └── mail/           # Email service
│   └── web/                    # Next.js frontend
│       └── src/
│           ├── app/            # App Router pages
│           ├── components/     # Header, Footer
│           └── lib/api.ts     # API client with mock fallback
├── packages/
│   ├── database/              # Prisma client & schema
│   └── shared/                 # Shared constants (roles, statuses)
├── Plans/                     # Design docs, PRD, TRD
├── turbo.json
├── pnpm-workspace.yaml
├── docker-compose.yml
├── Dockerfile.api
└── Dockerfile.web
```

---

## 7. Planning Documents (`Plans/`)

| File | Description |
|------|-------------|
| `AI CODING AGENT.docx` | AI coding guidelines |
| `App Flow.docx` | Application flow documentation |
| `BACKEND SCHEMA.docx` | Database schema design |
| `DESIGN.md` | Warp-inspired design system (colors, typography, components) |
| `IMPLEMENTATION PLAN.docx` | Implementation roadmap |
| `PRD.docx` | Product Requirements Document |
| `Security-First Vibe Coding Rules.docx` | Security guidelines |
| `TRD.docx` | Technical Requirements Document |
| `UI UX DESIGN.docx` | UI/UX design specifications |

---

## 8. Future Roadmap — Planned Features

### Phase 1: User & Access Management
| Feature | Description |
|---------|-------------|
| User Invite System | Invite team members via email, set initial roles |
| Role Management UI | Visual interface to assign/change roles (SuperAdmin, Owner, Manager, Employee, Client) |
| User Profiles | Avatar, bio, timezone, notification preferences |

### Phase 2: Notifications
| Feature | Description |
|---------|-------------|
| In-App Notification Center | Bell icon with dropdown, mark read/unread, notification history |
| Email Notifications | Triggered emails for assigned tasks, invoice due, lead updates |
| Push Notifications | Browser push notifications for real-time alerts |

### Phase 3: Time Tracking
| Feature | Description |
|---------|-------------|
| Time Logs | Log hours per task with start/end time or duration |
| Timesheets | Weekly/monthly timesheet view per user |
| Hourly Billing | Link time logs to invoices for hourly-rate billing |

### Phase 4: Document Management
| Feature | Description |
|---------|-------------|
| File Uploads | Upload contracts, briefs, assets per project/client |
| Document Storage | Organized file browser with folders by client/project |
| Contract Management | Store, version, and track client contracts |

### Phase 5: Calendar & Scheduling
| Feature | Description |
|---------|-------------|
| Deadline Calendar | Visual calendar of upcoming milestones and task deadlines |
| Resource Planning | Team availability and workload view |
| Meeting Scheduler | Schedule meetings with client booking link |

### Phase 6: Proposals & Quotes
| Feature | Description |
|---------|-------------|
| Proposal Builder | Drag-and-drop proposal/quote builder with templates |
| E-Signatures | DocuSign/Letterbird integration for client signing |
| Version History | Track proposal revisions and compare versions |

### Phase 7: Reporting
| Feature | Description |
|---------|-------------|
| Custom Reports | Build custom reports with filters and grouping |
| PDF/CSV Export | Export any table or report to PDF or CSV |
| Scheduled Reports | Auto-email reports on a schedule (weekly/monthly) |

### Phase 8: Integrations
| Feature | Description |
|---------|-------------|
| Slack | Send notifications to Slack channels |
| Stripe (Full) | Full payment processing, subscriptions, refunds |
| GitHub | Link tasks to PRs and commits |
| Google Calendar | Sync deadlines to Google Calendar |
| Outlook | Calendar and email integration |

### Phase 9: Search & Organization
| Feature | Description |
|---------|-------------|
| Global Search | Search across clients, projects, invoices, leads, tasks |
| Cross-Entity Tags | Tag system that works across all entities |
| Favorites/Star | Star frequently accessed clients/projects |

### Phase 10: Settings & Configuration
| Feature | Description |
|---------|-------------|
| Organization Branding | Logo, colors, email templates per org |
| GST/Tax Configuration | Configurable tax rates beyond 18% GST |
| Invoice Templates | Multiple invoice templates (modern, classic, minimal) |
| Audit Log Viewer | Searchable UI for audit log entries |

### Phase 11: Data Management
| Feature | Description |
|---------|-------------|
| CSV Import | Import leads, clients, and expenses via CSV upload |
| Data Backup | Manual and scheduled database backups |
| Data Export | Full account data export (GDPR compliance) |

### Phase 12: Mobile & PWA
| Feature | Description |
|---------|-------------|
| PWA Optimization | Full offline-capable Progressive Web App |
| Responsive Dashboard | Fully usable mobile dashboard view |
| Mobile Notifications | Native mobile push notifications |

---

## 9. Feature Priority Matrix

| Priority | Features |
|----------|----------|
| **P0 (Critical)** | User Invite, Global Search, Email Notifications, In-App Notifications |
| **P1 (High)** | Time Tracking, Invoice Templates, Audit Log Viewer, CSV Import |
| **P2 (Medium)** | File Uploads, Custom Reports, PDF Export, Role Management UI |
| **P3 (Low)** | Slack Integration, GitHub Integration, Calendar, E-Signatures |
| **P4 (Nice to Have)** | Mobile App, Stripe Subscriptions, Meeting Scheduler |