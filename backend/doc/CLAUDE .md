# SMOSP — Claude Code Context
> SEP490_GR47 | FPT University Hanoi | Last updated: 17/06/2026

---

## 1. PROJECT IDENTITY

| Field | Value |
|-------|-------|
| Full name | A Student Major Orientation Support Platform Based on the Analysis of Personal Profiles and Recruitment Data |
| Short name | SMOSP |
| Group | SEP490_GR47 |
| Supervisor | Tạ Đình Tiến — tientd17@fpt.edu.vn |
| Package root | `com.sep490_g47.smosp` |
| DB name | `smosp` |
| Email (SMTP) | `sep490gr47@gmail.com` via Gmail App Password |

---

## 2. TEAM

| Member | Role | Owned Areas |
|--------|------|-------------|
| BaoTQ | Tech Lead / Full-Stack | Architecture, BE lead, FE-06 (recommendation), FE-14 (crawler/TW) |
| DieuVQ | BA / PM | Requirements, documentation |
| QuyenND | D1 Full-Stack | Auth, student profile, recommendation |
| GiangVT | D2 Frontend Lead | UI components, screens |
| HuyenLTT | QA / Dev | Crawler scheduler, system config (Iter 3) |

---

## 3. TECH STACK

| Layer | Technology | Notes |
|-------|-----------|-------|
| Backend | Java 17, Spring Boot 3.2.x, Maven | Modular Monolith (10 modules) |
| Auth | jjwt 0.12.6, Google OAuth 2.0 | JWT access + refresh tokens |
| API Docs | springdoc-openapi **v2.8.9+** | ⚠️ v2.3.0 breaks on Spring Boot 3.5.x (`NoSuchMethodError`) |
| ORM | JPA/Hibernate + MapStruct | |
| DB | PostgreSQL 17.10 | |
| File Storage | Firebase | |
| AI | Gemini (default, swappable) | utility only — normalize + NL explain |
| Frontend | React JS 19.2.6, ESLint | |
| Testing | JUnit 5, Mockito, MockMvc, JaCoCo ≥70%, Jest, Playwright (E2E) | |
| Quality | Checkstyle (Java), ESLint (React) | |
| Deploy | Vercel (FE) + Docker (BE) | |
| IDE | IntelliJ IDEA | |
| Diagramming | dbdiagram.io (DBML), draw.io, StarUML | |

---

## 4. MODULE STRUCTURE

```
com.sep490_g47.smosp
├── auth              ← FE-01: JWT, Google OAuth, register/login/reset
├── student-profile   ← FE-04–08: profile, transcript, skills, recommendation, roadmap
├── recommendation    ← FE-05: Compatibility Score (Hierarchical WSM engine)
├── catalog           ← FE-02, FE-12–13: Major/Spec/NS browse + CM management
├── roadmap           ← FE-06: Standard + Personal Roadmap, bookmarks, notes
├── holland           ← FE-07: Holland RIASEC assessment (transfer flow only)
├── configuration     ← FE-09–11: Skill/interest/tag-map/question-bank config
├── content-manager   ← FE-13–14: Crawler execution + Trending Weight approval
├── admin             ← FE-14–15: User management + system config
└── crawler           ← Background: VietnamWorks adapter + Gemini AI normalize pipeline
```

---

## 5. BRANCHING & COMMIT STRATEGY

```
main          ← production-ready, always stable
develop       ← integration branch (target for PRs)
feature/xxx   ← new features (from develop)
fix/xxx       ← bug fixes (from develop)
hotfix/xxx    ← critical fixes (from main)
```

**Commit format (Conventional Commits):**
```
type(scope): short description

Types: feat | fix | docs | refactor | test | chore
Example: feat(auth): add Google OAuth login
```

**PR rules:**
- Standard features → 1 reviewer, merge within 24h
- **High-risk** FE-06, FE-08, FE-14 → **2 reviewers required**
- Merge strategy: squash & merge
- Delete branch after merge
- Self-merge: strictly prohibited

---

## 6. CODING CONVENTIONS

- **Error messages:** English (code-level, logs, exceptions)
- **UI messages:** Vietnamese
- **No hardcoded credentials or secrets in source code**
- **No N+1 queries** (reviewers verify)
- Test coverage: JaCoCo ≥ 70% for business logic classes

---

## 7. ITERATION PLAN

| Iter | Weeks | FE Targets |
|------|-------|------------|
| Iter 1 | W6–7 | FE-01, FE-05, FE-03, FE-15, FE-11, FE-13 |
| Iter 2 | W8–9 | FE-02, FE-06, FE-07, FE-09, FE-10, FE-12 |
| Iter 3 | W10–11 | FE-08, FE-14, FE-16 + background jobs |

---

## 8. CURRENT CODING STATUS (branch: `feature/auth-module`)

### ✅ DONE (committed WIP)

| Component | Details |
|-----------|---------|
| Entities | Role, UserAccount, OauthIdentity, EmailVerificationToken, PasswordResetToken |
| Repositories | 4 interfaces |
| DTOs | RegisterRequest, LoginRequest, PasswordResetRequest, NewPasswordRequest, AuthResponse, MessageResponse |
| Services | JwtService, EmailService, AuthService |
| Security | UserDetailsServiceImpl, JwtAuthFilter, SecurityConfig |
| Controller | AuthController |
| Config | DataSeeder, GlobalExceptionHandler |


Current code uses token link. Must refactor to:

2. `POST /api/auth/verify-email` body=`{email, code}` → activates account
3. `POST /api/auth/verify-email/resend` body=`{email}` → sends new code

> **Field type:** `EmailVerificationToken.code = String` (preserves leading zeros, direct `.equals()`)

### ❌ MISSING — Not yet implemented

| # | Endpoint | UC | Description |
|---|----------|-----|-------------|
| 5 | `POST /api/auth/google` | UC-05 | Google OAuth login/register |
| 6 | `POST /api/auth/logout` | UC-06 | Invalidate refresh token |
| 7 | `POST /api/auth/refresh` | UC-06 | Issue new access token via refresh token |
| 8 | `POST /api/auth/password/forgot` | UC-07 | Send reset link to email |
| 9 | `POST /api/auth/password/reset` | UC-07 | Apply new password via token |
| 10 | `PUT /api/auth/password/change` | UC-08 | Change password while authenticated |

### 🔴 OPEN DECISION — Refresh Token Architecture

| Option | Approach | Trade-off |
|--------|----------|-----------|
| A | Stateless JWT refresh | Simple, no DB lookup, but cannot revoke |
| B | DB-stored UUID tokens | SRS AC-01-04 compliant (invalidate within 2s), requires DB table |

**SRS requires:** AC-01-04 — logout invalidates refresh token within 2 seconds → **Option B** is SRS-compliant.
Decision must be made before implementing `POST /api/auth/refresh`.

### ➡️ NEXT STEPS (in order)
1. Refactor verify-email → 6-digit code
2. Implement remaining 6 auth endpoints
3. Commit → PR into `develop`
4. Begin **Catalog module** (Major, Specialization, NarrowSpecialization, Course entities)

---

## 9. CORE ARCHITECTURAL DECISIONS ⚠️ DO NOT CHANGE

### Recommendation Algorithm (FE-05 / FT-18–19)
**2-tier Hierarchical Weighted Sum Model:**
```
Profile_Score = W_gpa × S_gpa + W_skill × S_skill + W_int × S_int
               (W_gpa + W_skill + W_int = 1.0, CM-configured)

Final_Score   = α_actual × Profile_Score + (1 − α_actual) × Trending_Weight
```

**α_base by discipline group (CM-configured per NS):**
| Group | α_base |
|-------|--------|
| IT (SE, AI, IS) | 0.70 |
| Business/Marketing | 0.75 |
| Languages | 0.85 |
| Law | 0.90 |
| Digital Art | 0.95 |

**Auto-fallback (when job data is sparse):**
```
S_vol ≥ 100       → α_actual = α_base
0 < S_vol < 100   → α_actual = 1.0 − (S_vol / 100) × (1 − α_base)
S_vol = 0         → α_actual = 1.0  (ignore market signal entirely)
```
When fallback activates → mandatory explainability text in output.

### Trending Weight (sole market concept)
```
TW = 0.5 × Sacc + 0.3 × Svol + 0.2 × Junior_ratio    (0–100 scale)
```
- Sacc = growth rate (compare 2 crawl cycles)
- Svol = normalized job volume (min-max to [0,1])
- Junior_ratio = ratio of Intern/Fresher/Entry jobs
- Defined at **narrow specialization level** (not skill level)
- Renamed from "Market Weight" / "Market Trend Score" — those terms are retired

### Gemini AI (utility only, NOT scoring)
- Role 1: batch-normalize raw crawl data (groups of 50 jobs/call)
- Role 2: generate NL explanation for top-1 recommendation result
- Provider-swappable per LI-03 via FE-16 (System Config)
- AI failure = fallback (placeholder text), never blocks score display (BR-48)

### Crawler (Adapter Pattern)
- VietnamWorks only in v1.0
- API: `POST https://ms.vietnamworks.com/job-search/v1.0/search`
- New sources added via new adapters (no core engine changes)
- Executor: Content Manager (not Admin)

### Holland Assessment (FE-07)
- ONLY activated when student considers **broad major transfer** (e.g., SE → AI)
- NOT part of narrow specialization recommendation
- MBTI deferred to FE-18 (advanced / stretch goal)

### Tag Map
- CM-configured table: `skill/interest → narrow_spec`
- Mandatory input for recommendation engine
- Cross-major mapping: **prohibited**
- CM selects broad major first before configuring

### Background Job Pipeline (BR-41 — ATOMIC)
```
JOB-01 (Crawl, cron)
  → fires CrawlCompleted event
  → JOB-02 (AI Normalize, Gemini batch-50)
    → fires NormalizeCompleted event
    → JOB-03 (TW Calculation, pipeline end)
```
JOB-01/02/03 are an **atomic pipeline chain** — if any step fails, discard entire batch (no partial saves).

JOB-04: Notification Dispatch (event-driven)
JOB-05: Gemini API Token Quota Monitor (daily)

---

## 10. ACTORS

| Actor | Login | Key Responsibilities |
|-------|-------|---------------------|
| Student | Google OAuth (@fpt.edu.vn) | Profile, transcript, recommendation, roadmap, Holland (transfer) |
| Content Manager | username + password (seeded) | Catalog, skills, tag map, question bank, curriculum, crawler execute, TW approval |
| Admin | username + password (seeded) | User management, crawl schedule config, AI API config, transcript mapping preset |
| Guest | None | Browse catalog (public) |

> Admin does NOT execute crawler and does NOT view batch logs — that is CM's responsibility.

---

## 11. CONTEXT FILES

| File | Contents |
|------|---------|
| `docs/erd.md` | Full DBML database schema (ERD v4) |
| `docs/api.md` | All 139 API endpoints with status |
| `docs/business-rules.md` | All BR (48), BV (47), DC (3) |
| `docs/features.md` | All 51 FTs with AC/NAC/BV highlights |
| `docs/uc-summary.md` | All 56 UCs — summary table + complexity |
| `docs/fe-list.md` | 16 Major Features (FE-01 to FE-16) |
