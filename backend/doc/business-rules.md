# SMOSP — Business Rules, Boundary Values & Data Constraints

---

## BUSINESS RULES (BR)

| ID | Name | Description | Applies to |
|----|------|-------------|-----------|
| BR-01 | Sensitive Data Plaintext Forbidden | Passwords, tokens, API keys must be encrypted before storage. Never stored in plaintext anywhere (DB, logs, any storage). | FT-01, FT-02, FT-12, FT-45, FT-47, FT-48 |
| BR-02 | No Account Existence Disclosure | Registration and password-reset endpoints return identical generic responses whether email exists or not. No timing side-channel. | FT-01, FT-04 |
| BR-03 | RBAC — Server-Side Only | Every function accessible only to designated roles. Check on server; UI hide/show is NOT a security measure. | All authenticated FTs (cross-cutting) |
| BR-04 | Config Changes Non-Retroactive | Tag map, scoring weight, or TW changes apply to future calculations only. Past results frozen. | FT-18, FT-32, FT-34, FT-42 |
| BR-05 | Unpublished Content Hidden from Students/Guests | Major, Specialization, Narrow Spec in draft/unpublished state: not visible even via direct URL. CM/Admin can view in management UI. | FT-05–07, FT-21, FT-24, FT-39 |
| BR-06 | Student Personal Data Never Auto-Overwritten | Standard Roadmap updates by CM do not auto-update cloned Personal Roadmaps. Student notified; student decides. Parse failure does not overwrite existing academic profile. | FT-08, FT-16, FT-22, FT-23 |
| BR-07 | TW Changes Must Be CM-Approved | Every Trending Weight change from crawl pipeline requires CM approval before affecting recommendation engine. No auto-apply. | FT-18, FT-42 |
| BR-08 | Recommendation Scoped to Student's Major | Compatibility Score, rankings, skill gap — all scoped to narrow specs within the student's declared Major only. | FT-18, FT-19, FT-20 |
| BR-09 | Referenced Active Data Cannot Be Hard-Deleted | Skill/interest in tag map, course in roadmap, Major with active NS children, NS with cloned Personal Roadmaps → soft-delete only. | FT-30, FT-31, FT-32, FT-35, FT-38, FT-39 |
| BR-10 | Names Unique Within Same Level | Skill names, interest labels, course codes, Major/Spec names at same hierarchy level, CM/Admin usernames must be unique. | FT-30, FT-31, FT-35, FT-38, FT-45 |
| BR-11 | Advisory Results Must Show Disclaimer | Holland results, transfer cost, market signals, summary report must always display "advisory only, not official" disclaimer. (Does NOT apply to Compatibility Score.) | FT-26, FT-27, FT-28, FT-29 |
| BR-12 | Admin Actions Logged | All admin actions affecting user accounts or system data: log actor identity, action, target, timestamp. Log is read-only, immutable. | FT-44, FT-45, FT-46, FT-47, FT-48, FT-49 |
| BR-13 | Course Prerequisites Must Be Acyclic (DAG) | Prerequisite relationships form a directed acyclic graph. System detects and rejects any cycle (direct or indirect). | FT-36 |
| BR-15 | Transfer Analysis Advisory Only — No Academic Actions | Transfer analysis feature never connects to or executes actions on FPT's FAP system. Advisory output only. | FT-27, FT-28, FT-29 |
| BR-17 | Recruitment Data from VietnamWorks Only (v1.0) | All recruitment data for TW calculation must come exclusively from VietnamWorks adapter in v1.0. | FT-40, FT-41, FT-42, FT-47 |
| BR-19 | Account Locked After 5 Consecutive Failed Logins | After 5 consecutive failures: lock for 30 minutes. Auto-unlock. No Admin intervention needed. | FT-03 |
| BR-20 | At Least 1 Active Admin Always | System blocks deactivation that would leave 0 active Admin accounts. Admin cannot self-deactivate. | FT-44 |
| BR-22 | Only Passed Courses Count as Completed | Only courses with grade ≥ 5.0 (out of 10) count toward completed course list for tag map matching. Applies equally to GPA-counting and non-GPA courses. | FT-16, FT-18 |
| BR-23 | Major Self-Reported, Not Validated | System accepts student-declared Major without cross-checking transcript or FAP. Disclaimer shown on declaration screen. | FT-14, FT-18 |
| BR-25 | Notify Students When Source NS Is Unpublished | When CM unpublishes a NS, all students with cloned Personal Roadmaps from that NS must be notified. Personal Roadmaps are preserved. | FT-08, FT-22, FT-39 |
| BR-26 | Personal Roadmap Name Independent of NS Rename | When CM renames a NS, student-set Personal Roadmap names are not changed. | FT-23, FT-39 |
| BR-27 | Normalize Weights When TW Unavailable | If NS has no TW (null), exclude market dimension and normalize remaining 2 dimensions to 100% proportionally. Display "no market data" note. | FT-18, FT-19 |
| BR-28 | Show All NS Regardless of Score | All published NS in student's specialization shown in recommendation list, including score=0 results. When all=0: show "complete your profile" message. | FT-19 |
| BR-29 | Alphabetical Tiebreaker | Equal Compatibility Scores sorted alphabetically by NS name (ascending). | FT-19 |
| BR-30 | Deleted Courses Flagged, Not Removed from Personal Roadmaps | When CM deletes a course from Standard Roadmap, the course is flagged "removed from standard" on Personal Roadmaps. Student's progress/notes preserved. | FT-23, FT-35 |
| BR-31 | GPA Excludes Non-GPA Courses | `counts_toward_gpa = false` courses (OJT, GDQP, Vovinam, etc.) not included in cumulative GPA. Still parsed and stored. Can still count as completed for tag map if grade ≥ 5.0. | FT-16, FT-35 |
| BR-32 | Holland Questions Must Have Exactly 5 Likert Options | Each Holland question: exactly 5 answer options, scale 1–5 (Strongly Disagree to Strongly Agree). | FT-25, FT-33 |
| BR-33 | All Holland Assessment Results Retained in History | Each completed Holland session stored with timestamp. Prior results never overwritten. Latest = active result. | FT-25, FT-26 |
| BR-34 | Holland Assessment Blocked If Any RIASEC Dimension < 5 Active Questions | Assessment cannot start if any of the 6 RIASEC dimensions has fewer than 5 active questions. | FT-25, FT-33 |
| BR-35 | Transfer Equivalency Determined by Course Code | A course is retained/equivalent only if Subject Code matches exactly between source and target curriculum. Same name ≠ equivalent. | FT-27 |
| BR-36 | Transfer Analysis Supports Within-Major and Cross-Major | Within same specialization: only terms 4–9 compared. Across specializations (same major): terms 1–3 re-compared by code. Cross-major: full terms 1–9 re-compared. System labels scope clearly, warns on cross-major. | FT-27, FT-28, FT-29 |
| BR-37 | Expired TW Proposals Auto-Rejected After 7 Days | If CM does not act on a TW proposal within 7 days (BV-39), system auto-rejects and keeps current TW. Admin notified. | FT-42 |
| BR-38 | Escalating Alerts for Consecutive Crawl Failures | 3 consecutive failures → standard alert to Admin. 7 days consecutive failure → emergency alert + auto-disable adapter. Admin must manually re-enable. | FT-40, FT-41, FT-46 |
| BR-39 | All-Zero TW Batch Flagged as Anomaly | If batch produces TW=0 for all NS: flag as anomalous, alert CM and Admin, block normal approval flow. CM cannot approve without Admin confirmation. | FT-40, FT-42 |
| BR-40 | System Logs Retained 1 Year Before Archiving | Admin action logs, crawl logs, error logs: retain in hot storage ≥ 365 days, then archive to cold storage. Never deleted permanently. | FT-41, FT-44 |
| BR-41 | AI Pipeline Atomic (Crawl–Normalize–TW Chain) | If AI API fails or runs out of quota mid-batch: discard entire partial batch. No partial results saved. No partial TW proposals created. Notify CM to re-run. | FT-40, FT-42 |
| BR-42 | Emergency Super-Admin Account | Deployment must create 1 super-admin account not visible in normal Admin UI, cannot be deactivated via UI, for emergency recovery only (DevOps DB-level access). Does not count toward BR-20 pool. | FT-44 |
| BR-43 | Staff Use Username, Not Email | CM and Admin login with username (not email). Staff have no mandatory email field. Forgot-password: Admin-mediated reset (not self-service email flow). | FT-03, FT-04, FT-44, FT-45 |
| BR-44 | Session Invalidation on Deactivation | When Admin deactivates a user account: all active sessions invalidated within 60 seconds (BV-45). | FT-44 |
| BR-45 | Forced Password Change on First Login | New Staff accounts (or after Admin password reset) must change password before accessing any other feature. | FT-03, FT-12, FT-45 |
| BR-46 | Retake Fee Discount: Next Term Only | 50% discount on retake fee applies only if student retakes the failed course in the immediately following term. ≥2 terms later = full price. | FT-27 |
| BR-47 | Transfer Cost Estimate Includes Data Currency Disclaimer | Every transfer cost estimate must show the date Admin last updated tuition/retake fees, plus disclaimer that fees may change annually. | FT-27 |
| BR-48 | AI Reason Failure Must Not Block Score Display | If Gemini AI fails or times out (BV-47) generating NL explanation: show placeholder text only. Compatibility Score and ranking display unaffected. | FT-19, FT-50 |

---

## BOUNDARY VALUES (BV)

| ID | Constraint | Valid Range | Key Test Points | Enforcement |
|----|-----------|-------------|-----------------|-------------|
| BV-03 | Activation Link Expiry  | 0 < elapsed ≤ 24h | 23h59m (valid), 24h00m (valid), 24h01m (INVALID) | API |
| BV-04 | Password Reset Link Expiry | 0 < elapsed ≤ 60min | 59m (valid), 60m (valid), 61m (INVALID) | API |
| BV-05 | Password Length | 8 ≤ len ≤ 128 chars | 7 (invalid), 8 (min), 128 (max), 129 (invalid) | UI / API |
| BV-06 | Max Failed Login Attempts | 0 ≤ failures ≤ 4 (allowed) | 4 (valid), 5 (LOCK) | API |
| BV-07 | Account Lockout Duration | lockout = 30 min | 29m59s (still locked), 30m00s (unlocked) | API |
| BV-08a | GPA Valid Range | 0.0 ≤ GPA ≤ 10.0 | -0.1 (invalid), 0.0, 10.0, 10.1 (invalid) | API / DB |
| BV-08b | Course Score Range | 0.0 ≤ score ≤ 10.0 | -0.1 (invalid), 0.0, 10.0, 10.1 (invalid) | API / DB |
| BV-09 | Transcript File Size | 0 < size ≤ 5MB | 0 bytes (invalid), 1 byte, 5MB, 5MB+1b (invalid) | UI / API |
| BV-10 | Courses in Transcript | 1 ≤ count ≤ 150 | 0 (invalid), 1, 150, 151 (invalid) | API |
| BV-11 | Transcript Upload Rate | 0–3 uploads/hour | 3 (valid), 4 (INVALID — "try again later") | API |
| BV-12 | Minimum Passing Grade | score ≥ 5.0 → completed | 4.9 (NOT completed), 5.0 (completed) | API |
| BV-13 | Specializations per Major | 1–10 | 0 (cannot publish), 1, 10, 11 (invalid) | API |
| BV-14 | Narrow Specs per Specialization | 1–15 | 0 (cannot publish), 1, 15, 16 (invalid) | API |
| BV-15a | Entity Name Length | 1–100 chars | 0 (invalid), 1, 100, 101 (invalid) | UI / API |
| BV-15b | Entity Description Length | 0–500 chars | 0 (valid/optional), 500, 501 (invalid) | UI / API |
| BV-16a | Academic Weight Default | 0%–100% | -1% (invalid), 0%, 100%, 101% (invalid) | API / DB |
| BV-17 | Term Count per Narrow Spec | 1–6 (terms 4–9) | 0 (cannot publish), 1, 6, 7 (invalid) | API |
| BV-18 | Courses per Narrow Spec (specialized) | 5–10 | 4 (cannot publish), 5, 10, 11 (invalid) | API |
| BV-19 | Credits per Term | 10–20 credits | 9 (invalid), 10, 20, 21 (invalid) | API |
| BV-20 | Credits per Course | 1–10 credits | 0 (invalid), 1, 10, 11 (invalid) | API |
| BV-21 | Course Code Length | 1–20 chars, alphanumeric | 0 (invalid), 1, 20, 21 (invalid) | UI / API |
| BV-22 | Prerequisites per Course | 0–5 | 0 (valid/none), 5, 6 (invalid) | API |
| BV-23 | Learning Resources per Course | 0–10 | 0 (valid/none), 10, 11 (invalid) | API |
| BV-24 | Personal Roadmaps per Student | 0–5 | 0 (can clone), 5 (can still clone), 6 (BLOCKED) | API |
| BV-25 | Personal Roadmap Note Length | 0–500 chars | 0 (valid/empty), 500, 501 (BLOCKED) | UI / API |
| BV-26 | Min Questions per RIASEC Dimension | 5–20 | 4 (cannot activate test), 5, 20, 21 (invalid) | API |
| BV-27 | Total Assessment Questions | 30–60 | 29 (cannot activate), 30, 60, 61 (invalid) | API |
| BV-28 | Question Content Length | 1–300 chars | 0 (invalid), 1, 300, 301 (invalid) | UI / API |
| BV-29 | Assessment Scoring Weight | 0.1–10.0, 2 decimal | 0 (NAC-34-02), 0.1, 10.0, 10.1 (invalid) | API / DB |
| BV-30a | Max Assessment Retakes | 0–3 prior completions allowed | 3 (can retake), 4 (BLOCKED) | API |
| BV-30b | Min Interval Between Retakes | ≥ 30 days | 29 days (BLOCKED), 30 days (allowed) | API |
| BV-31 | Assessment Session Timeout | ≤ 60 min inactivity | 59m (still active), 60m (warning), 61m (timeout, progress saved) | API |
| BV-33 | Tuition Fee per Term (VND) | 28,000,000–33,000,000 | 27,999,999 (invalid), 28M, 33M, 33,000,001 (invalid) | API |
| BV-34 | High Transfer Cost Warning | extra terms < 4 (no warning) | 3 extra terms (ok), 4 extra terms (WARN "high cost") | UI |
| BV-35 | Crawl Interval | 1–30 days | 0 (invalid), 1, 30, 31 (warn "data may get stale") | API |
| BV-36 | Stale Crawl Warning | ≤ 30 days since last success | 29 days (ok), 30 days (warn), 31 days (STALE alert) | UI / API |
| BV-37 | Job Listings per Crawl Batch | 1–10,000 | 0 (invalid/error), 1, 10000, 10001 (stop + warn) | API |
| BV-38 | Min TW Change to Trigger Proposal | ≥ 5% change | 4.9% (no proposal), 5.0% (proposal created) | API |
| BV-39 | TW Approval Window | 0–7 days | 6 days (pending), 7 days (reminder), 8 days (AUTO-REJECT) | API |
| BV-40a | Crawl Failure Alert Threshold | ≤ 2 consecutive (no alert) | 2 (log only), 3 (STANDARD ALERT) | System / API |
| BV-40b | Crawl Failure Emergency Threshold | < 7 days continuous failure | 6 days (standard alerts only), 7 days (EMERGENCY + auto-disable) | System / API |
| BV-41 | AI Token Usage Warning | ≥ 80% of monthly quota → warn; > 100% → block | 79% (ok), 80% (WARN), 100% (last valid), 101% (BLOCK) | API |
| BV-42 | Sample Transcript File Size (preset test) | 0 < size ≤ 5MB | 0 bytes (invalid), 5MB, 5MB+1b (invalid) | UI / API |
| BV-43 | Column Mapping Presets | 1–5 total; only 1 active | 0 (cannot parse), 1, 5, 6 (BLOCKED) | API |
| BV-44 | System Log Retention | ≥ 365 days in hot storage | 364 days (hot), 365 days (archive trigger), 366+ (cold, still retrievable) | System / DB |
| BV-45 | Session Invalidation Window | ≤ 60 seconds | 59s (valid), 60s (boundary), 61s (SLA violation) | System |
| BV-46 | Retake Course Fee per Credit (VND) | 500,000–5,000,000 | 499,999 (invalid), 500K, 5M, 5,000,001 (invalid) | API |
| BV-47 | Gemini Reason Generation Timeout | ≤ 10 seconds | 9s (waiting), 10s (boundary), 11s (TIMEOUT → fallback) | API |

---

## DATA CONSTRAINTS (DC)

| ID | Constraint | Details | Enforcement |
|----|-----------|---------|-------------|
| DC-01 | GPA Decimal Precision | GPA stored and displayed with exactly 3 decimal places. Round half-up. Course score: 1 decimal place (per FPT Quy chế). | API / DB |
| DC-02 | Compatibility Score Display Precision | Displayed with 1 decimal place (e.g., 85.4). Internal calculation may use more precision. | UI |
| DC-03 | Weight Distribution Must Sum to 100% | W_gpa + W_skill + W_int = 1.0 always. If CM changes one weight, system auto-adjusts others proportionally (or requires manual entry of all three summing to 100%). | API / DB |
