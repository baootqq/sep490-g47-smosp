# SMOSP — API Tracker (139 Endpoints)
> All endpoints use base path `/api` | JWT required unless marked [public]

---

## Summary

| Cluster | Total | Simple | Medium | Complex | Est (h) |
|---------|-------|--------|--------|---------|---------|
| CLUSTER 1 — Auth & User | 18 | 3 | 15 | 0 | 66 |
| CLUSTER 2 — Catalog & Curriculum | 29 | 9 | 20 | 0 | 98 |
| CLUSTER 3 — Student Profile & Roadmap | 31 | 11 | 12 | 8 | 134 |
| CLUSTER 4 — Configuration & Recommendation | 20 | 8 | 9 | 3 | 76 |
| CLUSTER 5 — Holland Assessment | 11 | 3 | 7 | 1 | 42 |
| CLUSTER 6 — Crawler, TW & System Config | 30 | 12 | 12 | 6 | 120 |
| **TOTAL** | **139** | **46** | **75** | **18** | **536** |

---

## CLUSTER 1 — Auth & User

### Authentication

| # | Method | Endpoint | Actor | UC | Level | Status |
|---|--------|----------|-------|----|-------|--------|
| 1 | POST | `/api/auth/register` | Student | UC-04 | Medium | ✅ Done |
| 2 | POST | `/api/auth/verify-email` | Student | UC-04 | Medium | ⚠️ Doing 
| 3 | POST | `/api/auth/verify-email/resend` | Student | UC-04 | Medium | ⚠️ Doing (0%) |
| 4 | POST | `/api/auth/login` | All | UC-06 | Medium | ✅ Done |
| 5 | POST | `/api/auth/google` | Student | UC-05 | Medium | ❌ Doing (0%) |
| 6 | POST | `/api/auth/logout` | All | UC-06 | Medium | ❌ Doing (0%) |
| 7 | POST | `/api/auth/refresh` | All | UC-06 | Medium | ⚠️ Doing (90% — open decision) |
| 8 | POST | `/api/auth/password/forgot` | Student | UC-07 | Medium | ⚠️ Doing (90%) |
| 9 | POST | `/api/auth/password/reset` | Student | UC-07 | Medium | ❌ Doing (0%) |
| 10 | PUT | `/api/auth/password/change` | All | UC-08 | Medium | ❌ Doing (0%) |

### Account & Notifications

| # | Method | Endpoint | Actor | UC | Level | Status |
|---|--------|----------|-------|----|-------|--------|
| 11 | GET | `/api/me` | All | UC-09 | Simple | To Do |
| 12 | PUT | `/api/me/preferences` | All | UC-09 | Medium | To Do |
| 13 | GET | `/api/notifications` | All | UC-51 | Simple | To Do |
| 14 | PATCH | `/api/notifications/{id}/read` | All | UC-51 | Medium | To Do |
| 15 | PATCH | `/api/notifications/read-all` | All | UC-51 | Medium | To Do |
| 16 | POST | `/api/content-error-reports` | Student | UC-22 | Medium | To Do |
| 17 | GET | `/api/content-error-reports` | CM | UC-54 | Simple | To Do |
| 18 | PATCH | `/api/content-error-reports/{id}/status` | CM | UC-54 | Medium | To Do |

---

## CLUSTER 2 — Catalog & Curriculum

### Catalog Browse (public)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 19 | GET | `/api/majors` [public] | All | UC-01 | Simple |
| 20 | GET | `/api/majors/{id}/specializations` [public] | All | UC-01 | Simple |
| 21 | GET | `/api/specializations/{id}/narrow-specs` [public] | All | UC-01 | Simple |
| 22 | GET | `/api/narrow-specs/{id}` [public] | All | UC-02 | Simple |
| 23 | GET | `/api/catalog/search` [public] | All | UC-03 | Simple |

### Catalog Management (CM)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 24 | POST | `/api/majors` | CM | UC-31 | Medium |
| 25 | PUT | `/api/majors/{id}` | CM | UC-31 | Medium |
| 26 | DELETE | `/api/majors/{id}` | CM | UC-31 | Medium |
| 27 | POST | `/api/specializations` | CM | UC-31 | Medium |
| 28 | PUT | `/api/specializations/{id}` | CM | UC-31 | Medium |
| 29 | DELETE | `/api/specializations/{id}` | CM | UC-31 | Medium |
| 30 | POST | `/api/narrow-specs` | CM | UC-32 | Medium |
| 31 | PUT | `/api/narrow-specs/{id}` | CM | UC-32 | Medium |
| 32 | DELETE | `/api/narrow-specs/{id}` | CM | UC-32 | Medium |
| 33 | PATCH | `/api/narrow-specs/{id}/publish` | CM | UC-32 | Medium |

### Course Management (CM)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 34 | GET | `/api/courses` | CM | UC-28 | Simple |
| 35 | GET | `/api/courses/{id}` [public] | All | UC-18 | Simple |
| 36 | POST | `/api/courses` | CM | UC-28 | Medium |
| 37 | PUT | `/api/courses/{id}` | CM | UC-28 | Medium |
| 38 | DELETE | `/api/courses/{id}` | CM | UC-28 | Medium |
| 39 | PUT | `/api/courses/{id}/prerequisites` | CM | UC-29 | Medium |

### Curriculum Mapping (CM)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 40 | GET | `/api/specializations/{id}/courses` | CM | UC-29 | Simple |
| 41 | PUT | `/api/specializations/{id}/courses` | CM | UC-29 | Medium |
| 42 | GET | `/api/narrow-specs/{id}/courses` | CM | UC-29 | Simple |
| 43 | PUT | `/api/narrow-specs/{id}/courses` | CM | UC-29 | Medium |

### Learning Resources (CM)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 44 | POST | `/api/courses/{id}/resources` | CM | UC-30 | Medium |
| 45 | PUT | `/api/resources/{id}` | CM | UC-30 | Medium |
| 46 | DELETE | `/api/resources/{id}` | CM | UC-30 | Medium |
| 47 | PUT | `/api/courses/{id}/resources/order` | CM | UC-30 | Medium |

---

## CLUSTER 3 — Student Profile & Roadmap

### Profile

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 48 | GET | `/api/students/me` | Student | UC-10 | Simple |
| 49 | PUT | `/api/students/me` | Student | UC-10 | Medium |
| 50 | PUT | `/api/students/me/spec` | Student | UC-10 | Medium |

### Transcript

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 51 | POST | `/api/students/me/transcripts` | Student | UC-11 | Complex |
| 52 | GET | `/api/students/me/transcripts` | Student | UC-11 | Complex |
| 53 | GET | `/api/students/me/transcripts/latest` | Student | UC-11 | Complex |
| 54 | GET | `/api/students/me/grades` | Student | UC-11 | Simple |

### Skill & Interest Declaration

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 55 | GET | `/api/students/me/skill-options` | Student | UC-12 | Simple |
| 56 | GET | `/api/students/me/skill-options/search` | Student | UC-12 | Simple |
| 57 | GET | `/api/students/me/skill-suggestions` | Student | UC-12 | Simple |
| 58 | GET | `/api/students/me/skills` | Student | UC-12 | Simple |
| 59 | PUT | `/api/students/me/skills` | Student | UC-12 | Medium |
| 60 | GET | `/api/students/me/interest-options` | Student | UC-12 | Simple |
| 61 | GET | `/api/students/me/interests` | Student | UC-12 | Simple |
| 62 | PUT | `/api/students/me/interests` | Student | UC-12 | Medium |

### Personal Roadmap

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 63 | GET | `/api/narrow-specs/{id}/roadmap` | Student | UC-16 | Simple |
| 64 | GET | `/api/students/me/roadmaps` | Student | UC-17 | Simple |
| 65 | POST | `/api/students/me/roadmaps` | Student | UC-16 | Medium |
| 66 | GET | `/api/students/me/roadmaps/{id}` | Student | UC-17 | Simple |
| 67 | PUT | `/api/students/me/roadmaps/{id}` | Student | UC-17 | Medium |
| 68 | DELETE | `/api/students/me/roadmaps/{id}` | Student | UC-17 | Medium |
| 69 | POST | `/api/students/me/roadmaps/{id}/sync-transcript` | Student | UC-17 | Complex |
| 70 | PATCH | `/api/students/me/roadmaps/{id}/items/{courseId}/progress` | Student | UC-17 | Medium |
| 71 | POST | `/api/students/me/roadmaps/{id}/bookmarks/{courseId}` | Student | UC-17 | Medium |
| 72 | DELETE | `/api/students/me/roadmaps/{id}/bookmarks/{courseId}` | Student | UC-17 | Medium |
| 73 | PUT | `/api/students/me/roadmaps/{id}/notes/{courseId}` | Student | UC-17 | Medium |
| 74 | DELETE | `/api/students/me/roadmaps/{id}/notes/{courseId}` | Student | UC-17 | Medium |

### Transfer Impact

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 75 | POST | `/api/students/me/transfer-analysis` | Student | UC-21 | Complex |
| 76 | GET | `/api/students/me/transfer-analysis` | Student | UC-21 | Complex |
| 77 | GET | `/api/students/me/transfer-analysis/{id}` | Student | UC-21 | Complex |
| 78 | DELETE | `/api/students/me/transfer-analysis/{id}` | Student | UC-21 | Complex |

---

## CLUSTER 4 — Configuration & Recommendation

### Skill/Interest Config (CM)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 79 | GET | `/api/cm/specializations/{id}/skills` | CM | UC-23 | Simple |
| 80 | POST | `/api/cm/skills` | CM | UC-23 | Medium |
| 81 | PUT | `/api/cm/skills/{id}` | CM | UC-23 | Medium |
| 82 | DELETE | `/api/cm/skills/{id}` | CM | UC-23 | Medium |
| 83 | PUT | `/api/cm/skills/{id}/aliases` | CM | UC-23 | Medium |
| 84 | PUT | `/api/cm/skills/{id}/course-map` | CM | UC-23 | Medium |
| 85 | GET | `/api/cm/specializations/{id}/interests` | CM | UC-24 | Simple |
| 86 | POST | `/api/cm/interests` | CM | UC-24 | Medium |
| 87 | PUT | `/api/cm/interests/{id}` | CM | UC-24 | Medium |
| 88 | DELETE | `/api/cm/interests/{id}` | CM | UC-24 | Medium |

### Tag Map (CM)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 89 | GET | `/api/cm/narrow-specs/{id}/tag-map` | CM | UC-25 | Complex |
| 90 | PUT | `/api/cm/narrow-specs/{id}/tag-map` | CM | UC-25 | Complex |

### Weight Config (CM)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 91 | GET | `/api/cm/narrow-specs/{id}/weight-config` | CM | UC-55 | Simple |
| 92 | PUT | `/api/cm/narrow-specs/{id}/weight-config` | CM | UC-55 | Medium |
| 93 | GET | `/api/cm/narrow-specs/{id}/weight-config/audit` | CM | UC-55 | Simple |

### Recommendation (Student)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 94 | POST | `/api/students/me/recommendation/run` | Student | UC-13 | Complex |
| 95 | GET | `/api/students/me/recommendation/latest` | Student | UC-13 | Simple |
| 96 | GET | `/api/students/me/recommendation/latest/items/{nsId}` | Student | UC-14 | Simple |
| 97 | GET | `/api/students/me/recommendation/latest/items/{nsId}/explanation` | Student | UC-13 | Simple |
| 98 | GET | `/api/students/me/recommendation/latest/compare` | Student | UC-13 | Simple |

---

## CLUSTER 5 — Holland Assessment

### Student

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 99 | POST | `/api/students/me/holland/sessions` | Student | UC-19 | Medium |
| 100 | GET | `/api/students/me/holland/sessions/current` | Student | UC-19 | Simple |
| 101 | POST | `/api/students/me/holland/sessions/current/responses` | Student | UC-19 | Medium |
| 102 | POST | `/api/students/me/holland/sessions/current/submit` | Student | UC-19 | Complex |
| 103 | GET | `/api/students/me/holland/sessions/latest/result` | Student | UC-20 | Simple |

### Question Bank (CM)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 104 | GET | `/api/cm/holland/questions` | CM | UC-26 | Simple |
| 105 | POST | `/api/cm/holland/questions` | CM | UC-26 | Medium |
| 106 | PUT | `/api/cm/holland/questions/{id}` | CM | UC-26 | Medium |
| 107 | DELETE | `/api/cm/holland/questions/{id}` | CM | UC-26 | Medium |
| 108 | PATCH | `/api/cm/holland/questions/{id}/toggle` | CM | UC-26 | Medium |
| 109 | PUT | `/api/cm/holland/questions/{id}/options` | CM | UC-26 | Medium |

---

## CLUSTER 6 — Crawler, TW & System Config

### Crawler Execution (CM)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 110 | POST | `/api/cm/crawler/run` | CM | UC-33 | Complex |
| 111 | GET | `/api/cm/crawler/batches` | CM | UC-33 | Simple |
| 112 | GET | `/api/cm/crawler/batches/{id}` | CM | UC-33 | Simple |
| 113 | GET | `/api/cm/crawler/batches/{id}/errors` | CM | UC-33 | Simple |

### Trending Weight Approval (CM)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 114 | GET | `/api/cm/trending-weights/proposals` | CM | UC-34 | Simple |
| 115 | PATCH | `/api/cm/trending-weights/proposals/{id}/approve` | CM | UC-34 | Medium |
| 116 | PATCH | `/api/cm/trending-weights/proposals/{id}/reject` | CM | UC-34 | Medium |
| 117 | GET | `/api/cm/trending-weights/current` | CM | UC-34 | Simple |
| 118 | GET | `/api/cm/trending-weights/{nsId}/history` | CM | UC-34 | Simple |
| 119 | POST | `/api/cm/trending-weights/{nsId}/rollback` | CM | UC-50 | Medium |

### Crawler Source Config (Admin)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 120 | GET | `/api/admin/crawler/sources` | Admin | UC-39 | Simple |
| 121 | PUT | `/api/admin/crawler/sources/{id}` | Admin | UC-39 | Medium |
| 122 | PATCH | `/api/admin/crawler/sources/{id}/toggle` | Admin | UC-39 | Medium |
| 123 | POST | `/api/admin/crawler/sources/{id}/test` | Admin | UC-39 | Medium |

### System Config (Admin)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 124 | GET | `/api/admin/system-config` | Admin | UC-38 | Simple |
| 125 | PUT | `/api/admin/system-config` | Admin | UC-38 | Medium |
| 126 | GET | `/api/admin/ai-usage` | Admin | UC-40 | Simple |
| 127 | GET | `/api/admin/system-stats` | Admin | UC-56 | Simple |

### Transcript Mapping Preset (Admin)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 128 | GET | `/api/admin/transcript-presets` | Admin | UC-41 | Complex |
| 129 | POST | `/api/admin/transcript-presets` | Admin | UC-41 | Complex |
| 130 | PUT | `/api/admin/transcript-presets/{id}` | Admin | UC-41 | Complex |
| 131 | DELETE | `/api/admin/transcript-presets/{id}` | Admin | UC-41 | Complex |
| 132 | POST | `/api/admin/transcript-presets/{id}/test` | Admin | UC-41 | Complex |

### Tuition Config (Admin)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 133 | GET | `/api/admin/tuition-configs` | Admin | UC-53 | Simple |
| 134 | POST | `/api/admin/tuition-configs` | Admin | UC-53 | Medium |
| 135 | PUT | `/api/admin/tuition-configs/{id}` | Admin | UC-53 | Medium |

### User Management (Admin)

| # | Method | Endpoint | Actor | UC | Level |
|---|--------|----------|-------|----|-------|
| 136 | GET | `/api/admin/users` | Admin | UC-35 | Simple |
| 137 | PATCH | `/api/admin/users/{id}/status` | Admin | UC-36 | Medium |
| 138 | POST | `/api/admin/users/{id}/reset-password` | Admin | UC-36 | Medium |
| 139 | POST | `/api/admin/staff` | Admin | UC-37 | Medium |
