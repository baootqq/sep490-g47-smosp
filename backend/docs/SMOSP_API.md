# SMOSP API Reference — v3 (154 endpoints)
> Base URL: `/api` | Auth: JWT Bearer | Package: `com.sep490_g47.smosp`
> Cập nhật từ SMOSP_API_Management_v3.xlsx

---

## CLUSTER 1 — Auth & User (26 endpoints)

### Authentication
| # | Method | Endpoint | Actor | Description | UC | Status |
|---|--------|----------|-------|-------------|-----|--------|
| 1 | POST | `/api/auth/register` | Student | Đăng ký bằng email + password | UC-04 | ✅ Done |
| 2 | POST | `/api/auth/verify-email` | Student | Xác thực email qua **LINK**: token ở query param, click link → kích hoạt INACTIVE→ACTIVE (BV-03: link ≤24h) | UC-04 | ✅ Done |
| 3 | POST | `/api/auth/verify-email/resend` | Student | Gửi lại **LINK** xác thực mới — body: `{email}`. Vô hiệu token cũ, phát token mới | UC-04 | ✅ Done |
| 4 | POST | `/api/auth/login` | All | Đăng nhập email/username + password | UC-06 | ✅ Done |
| 5 | POST | `/api/auth/google` | Student | Đăng nhập Google OAuth | UC-05 | ✅ Done |
| 6 | POST | `/api/auth/logout` | All | Đăng xuất | UC-06 | ✅ Done |
| 7 | POST | `/api/auth/refresh` | All | Refresh JWT token | — | ✅ Done |
| 8 | POST | `/api/auth/password/forgot` | Student | Gửi mã reset password qua email | UC-07 | ✅ Done |
| 9 | POST | `/api/auth/password/reset` | Student | Đặt lại mật khẩu bằng token | UC-07 | ✅ Done |
| 10 | PUT | `/api/auth/password/change` | All | Đổi mật khẩu khi đã login | UC-08 | 🔄 Doing |

### Account & Notification
| # | Method | Endpoint | Actor | Description | UC | Status |
|---|--------|----------|-------|-------------|-----|--------|
| 11 | GET | `/api/me` | All | Thông tin tài khoản hiện tại | UC-09 | 🔄 Doing |
| 12 | PUT | `/api/me/preferences` | All | Cập nhật tùy chọn tài khoản | UC-09 | 🔄 Doing |
| 12.1 | POST | `/api/me/fcm-token` | All | Đăng ký FCM token (push notification) | — | 📋 To Do |
| 13 | GET | `/api/notifications` | All | Danh sách thông báo theo role | UC-10 | 🔄 Doing |
| 14 | PATCH | `/api/notifications/{id}/read` | All | Đánh dấu 1 thông báo đã đọc | UC-10 | 🔄 Doing |
| 15 | PATCH | `/api/notifications/read-all` | All | Đánh dấu tất cả đã đọc | UC-10 | 🔄 Doing |
| 16 | POST | `/api/content-error-reports` | Student | Gửi báo lỗi nội dung | UC-30 | 🔄 Doing |
| 16.1 | GET | `/api/content-error-reports` | Student | Danh sách báo lỗi đã gửi (của chính mình) | UC-31 | 📋 To Do |
| 16.2 | GET | `/api/content-error-reports/{id}` | Student | Xem chi tiết báo lỗi đã gửi | UC-32 | 📋 To Do |
| 16.3 | PUT | `/api/content-error-reports/{id}` | Student | Chỉnh sửa báo lỗi (chưa được xử lý) | UC-33 | 📋 To Do |
| 16.4 | DELETE | `/api/content-error-reports/{id}` | Student | Hủy/xóa báo lỗi đã gửi | UC-34 | 📋 To Do |
| 17 | GET | `/api/content-error-reports` | CM | Xem danh sách báo lỗi | UC-84 | 🔄 Doing |
| 17.1 | GET | `/api/content-error-reports/{id}` | CM | Xem chi tiết 1 báo cáo lỗi | UC-85 | 📋 To Do |
| 17.2 | PATCH | `/api/content-error-reports/{id}/note` | CM | Thêm ghi chú xử lý vào báo cáo | UC-86 | 📋 To Do |
| 17.3 | DELETE | `/api/content-error-reports/{id}` | CM | Xóa báo cáo không hợp lệ | UC-88 | 📋 To Do |
| 18 | PATCH | `/api/content-error-reports/{id}/status` | CM | Cập nhật trạng thái xử lý | UC-87 | 🔄 Doing |

---

## CLUSTER 2 — Catalog & Curriculum (31 endpoints)

### Catalog Browse (Public — no auth required)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 19 | GET | `/api/majors` | All | Danh sách major | UC-01 |
| 20 | GET | `/api/majors/{id}/specializations` | All | Specialization theo major | UC-01 |
| 21 | GET | `/api/specializations/{id}/narrow-specs` | All | Narrow spec theo specialization | UC-02 |
| 22 | GET | `/api/narrow-specs/{id}` | All | Chi tiết narrow spec + danh sách môn | UC-02 |
| 23 | POST | `/api/catalog/search` | All | Tìm kiếm/lọc danh mục 3 cấp | UC-03 |

### Catalog Management (CM)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 24 | POST | `/api/majors` | CM | Tạo major | UC-56 |
| 25 | PUT | `/api/majors/{id}` | CM | Sửa major | UC-57 |
| 26 | DELETE | `/api/majors/{id}` | CM | Xóa major | UC-62 |
| 26.1 | PATCH | `/api/majors/{id}/status` | CM | Cập nhật trạng thái major (active/inactive) | UC-62 |
| 27 | POST | `/api/specializations` | CM | Tạo specialization | UC-58 |
| 28 | PUT | `/api/specializations/{id}` | CM | Sửa specialization | UC-59 |
| 29 | DELETE | `/api/specializations/{id}` | CM | Xóa specialization | UC-63 |
| 29.1 | PATCH | `/api/specializations/{id}/status` | CM | Cập nhật trạng thái specialization | UC-63 |
| 30 | POST | `/api/narrow-specs` | CM | Tạo narrow spec | UC-64 |
| 31 | PUT | `/api/narrow-specs/{id}` | CM | Sửa narrow spec | UC-65 |
| 32 | DELETE | `/api/narrow-specs/{id}` | CM | Xóa narrow spec | UC-66 |
| 33 | PATCH | `/api/narrow-specs/{id}/publish` | CM | Publish/unpublish narrow spec | UC-66,67 |

### Course Management (CM)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 34 | GET | `/api/courses` | CM | Danh sách môn (có filter) | UC-49 |
| 35 | GET | `/api/courses/{id}` | All | Chi tiết môn + learning resources | UC-24 |
| 36 | POST | `/api/courses` | CM | Tạo môn | UC-48 |
| 37 | PUT | `/api/courses/{id}` | CM | Sửa môn | UC-49 |
| 38 | DELETE | `/api/courses/{id}` | CM | Xóa môn | UC-50 |
| 39 | PUT | `/api/courses/{id}/prerequisites` | CM | Cấu hình môn tiên quyết | UC-52 |

### Curriculum Mapping (CM)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 40 | GET | `/api/specializations/{id}/courses` | CM | Môn chung của specialization | UC-60 |
| 41 | PUT | `/api/specializations/{id}/courses` | CM | Cấu hình môn chung + term order | UC-60 |
| 42 | GET | `/api/narrow-specs/{id}/courses` | CM | Môn chuyên sâu narrow spec | UC-65 |
| 43 | PUT | `/api/narrow-specs/{id}/courses` | CM | Cấu hình môn chuyên sâu + term order | UC-65 |

### Learning Resource (CM)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 44 | POST | `/api/courses/{id}/resources` | CM | Thêm tài nguyên cho môn | UC-53 |
| 45 | PUT | `/api/resources/{id}` | CM | Sửa tài nguyên | UC-54 |
| 46 | DELETE | `/api/resources/{id}` | CM | Xóa tài nguyên | UC-55 |
| 47 | PUT | `/api/courses/{id}/resources/order` | CM | Sắp xếp thứ tự hiển thị | UC-53 |

---

## CLUSTER 3 — Student Profile & Roadmap (32 endpoints)

### Profile
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 48 | GET | `/api/students/me` | Student | Xem hồ sơ cá nhân | UC-11 |
| 49 | PUT | `/api/students/me` | Student | Cập nhật thông tin (họ tên, mã SV) | UC-11 |
| 50 | PUT | `/api/students/me/spec` | Student | Khai báo spec đang theo | UC-11 |

### Transcript
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 51 | POST | `/api/students/me/transcripts` | Student | Upload file XLSX | UC-12 |
| 52 | GET | `/api/students/me/transcripts` | Student | Danh sách transcript đã upload | UC-12 |
| 53 | GET | `/api/students/me/transcripts/latest` | Student | Transcript mới nhất + kết quả parse | UC-12 |
| 54 | GET | `/api/students/me/grades` | Student | Điểm từng môn đã parse | UC-12 |

### Skill & Interest Declaration
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 55 | GET | `/api/students/me/skill-options` | Student | Skill khả dụng theo specialization | UC-13 |
| 56 | GET | `/api/students/me/skill-options/search` | Student | Tìm skill (kèm alias) | UC-13 |
| 57 | GET | `/api/students/me/skill-suggestions` | Student | Skill gợi ý từ môn đã Passed | UC-13 |
| 58 | GET | `/api/students/me/skills` | Student | Skill đã khai báo | UC-13 |
| 59 | PUT | `/api/students/me/skills` | Student | Cập nhật skill khai báo | UC-13 |
| 60 | GET | `/api/students/me/interest-options` | Student | Interest khả dụng theo specialization | UC-14 |
| 61 | GET | `/api/students/me/interests` | Student | Interest đã khai báo | UC-14 |
| 62 | PUT | `/api/students/me/interests` | Student | Cập nhật interest khai báo | UC-14 |

### Personal Roadmap
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 63 | GET | `/api/narrow-specs/{id}/roadmap` | Student | Standard roadmap (spec + ns course) | UC-18 |
| 64 | GET | `/api/students/me/roadmaps` | Student | Danh sách personal roadmap | UC-20 |
| 65 | POST | `/api/students/me/roadmaps` | Student | Clone roadmap (max 5) | UC-19 |
| 66 | GET | `/api/students/me/roadmaps/{id}` | Student | Chi tiết 1 personal roadmap | UC-21 |
| 67 | PUT | `/api/students/me/roadmaps/{id}` | Student | Đổi tên roadmap | UC-22 |
| 68 | DELETE | `/api/students/me/roadmaps/{id}` | Student | Xóa roadmap | UC-23 |
| 69 | POST | `/api/students/me/roadmaps/{id}/sync-transcript` | Student | Auto-mark môn từ transcript | UC-22 |
| 70 | PATCH | `/api/students/me/roadmaps/{id}/items/{courseId}/progress` | Student | Cập nhật progress môn | UC-22 |
| 71 | POST | `/api/students/me/roadmaps/{id}/bookmarks/{courseId}` | Student | Bookmark môn | UC-22 |
| 72 | DELETE | `/api/students/me/roadmaps/{id}/bookmarks/{courseId}` | Student | Bỏ bookmark | UC-22 |
| 73 | PUT | `/api/students/me/roadmaps/{id}/notes/{courseId}` | Student | Thêm/sửa note | UC-22 |
| 74 | DELETE | `/api/students/me/roadmaps/{id}/notes/{courseId}` | Student | Xóa note | UC-22 |

### Transfer Impact Analysis
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 74.1 | POST | `/api/students/me/transfer-analysis/specialization` | Student | Tạo phân tích chuyển chuyên ngành (SPECIALIZATION transfer) | UC-28 |
| 75 | POST | `/api/students/me/transfer-analysis/narrow-specialization` | Student | Tạo phân tích chuyển ngành hẹp (NARROW_SPEC transfer) | UC-27 |
| 76 | GET | `/api/students/me/transfer-analysis` | Student | Danh sách lần phân tích đã chạy | UC-27,28,29 |
| 77 | GET | `/api/students/me/transfer-analysis/{id}` | Student | Xem chi tiết kết quả | UC-27,28,29 |
| 78 | DELETE | `/api/students/me/transfer-analysis/{id}` | Student | Xóa phiên phân tích | UC-27,28,29 |

---

## CLUSTER 4 — Configuration & Recommendation (20 endpoints)

### Skill/Interest Config (CM)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 79 | GET | `/api/cm/specializations/{id}/skills` | CM | Skill theo specialization | UC-35 |
| 80 | POST | `/api/cm/skills` | CM | Tạo skill | UC-35 |
| 81 | PUT | `/api/cm/skills/{id}` | CM | Sửa skill | UC-36 |
| 82 | DELETE | `/api/cm/skills/{id}` | CM | Xóa skill (soft-delete) | UC-37 |
| 83 | PUT | `/api/cm/skills/{id}/aliases` | CM | Cấu hình alias | UC-36 |
| 84 | PUT | `/api/cm/skills/{id}/course-map` | CM | Map skill ↔ môn học | UC-36 |
| 85 | GET | `/api/cm/specializations/{id}/interests` | CM | Interest theo specialization | UC-38 |
| 86 | POST | `/api/cm/interests` | CM | Tạo interest option | UC-38 |
| 87 | PUT | `/api/cm/interests/{id}` | CM | Sửa interest option | UC-39 |
| 88 | DELETE | `/api/cm/interests/{id}` | CM | Xóa interest option (soft-delete) | UC-40 |

### Tag Map (CM)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 89 | GET | `/api/cm/narrow-specs/{id}/tag-map` | CM | Xem tag map của narrow spec | UC-41,42,43 |
| 90 | PUT | `/api/cm/narrow-specs/{id}/tag-map` | CM | Cấu hình tag map (skill/interest + weight + direct/shared) | UC-41,42,43 |

### Weight Config (CM)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 91 | GET | `/api/cm/narrow-specs/{id}/weight-config` | CM | Xem trọng số (α, W_gpa/skill/int) | UC-89 |
| 92 | PUT | `/api/cm/narrow-specs/{id}/weight-config` | CM | Cập nhật trọng số | UC-89 |
| 93 | GET | `/api/cm/narrow-specs/{id}/weight-config/audit` | CM | Lịch sử thay đổi trọng số | UC-89 |

### Recommendation (Student)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 94 | POST | `/api/students/me/recommendation/run` | Student | Trigger tính Compatibility Score | UC-15 |
| 95 | GET | `/api/students/me/recommendation/latest` | Student | Kết quả ranking mới nhất | UC-15 |
| 96 | GET | `/api/students/me/recommendation/latest/items/{nsId}` | Student | Chi tiết 1 narrow spec + skill gap | UC-17 |
| 97 | GET | `/api/students/me/recommendation/latest/items/{nsId}/explanation` | Student | AI explanation (lazy load, Gemini) | UC-15 |
| 98 | GET | `/api/students/me/recommendation/latest/compare` | Student | So sánh side-by-side nhiều NS | UC-15 |

---

## CLUSTER 5 — Holland Assessment (14 endpoints)

### Student
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 99 | POST | `/api/students/me/holland/sessions` | Student | Bắt đầu session (kèm triggered_by) | UC-25 |
| 100 | GET | `/api/students/me/holland/sessions/current` | Student | Session đang làm + câu hỏi | UC-25 |
| 101 | POST | `/api/students/me/holland/sessions/current/responses` | Student | Submit câu trả lời | UC-25 |
| 102 | POST | `/api/students/me/holland/sessions/current/submit` | Student | Nộp bài + tính RIASEC | UC-25 |
| 103 | GET | `/api/students/me/holland/sessions/latest/result` | Student | Kết quả Holland | UC-26 |
| 103.1 | GET | `/api/students/me/holland/spec-ranking` | Student | Xếp hạng Specialization theo điểm Holland | UC-92 |

### Question Bank (CM)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 104 | GET | `/api/cm/holland/questions` | CM | Danh sách câu hỏi | UC-44,45,46 |
| 105 | POST | `/api/cm/holland/questions` | CM | Tạo câu hỏi + options | UC-44,45,46 |
| 106 | PUT | `/api/cm/holland/questions/{id}` | CM | Sửa câu hỏi | UC-44,45,46 |
| 107 | DELETE | `/api/cm/holland/questions/{id}` | CM | Xóa câu hỏi (deactivate only) | UC-44,45,46 |
| 108 | PATCH | `/api/cm/holland/questions/{id}/toggle` | CM | Bật/tắt câu hỏi | UC-44,45,46 |
| 109 | PUT | `/api/cm/holland/questions/{id}/options` | CM | Cấu hình option + dimension + weight | UC-47 |
| 109.1 | GET | `/api/cm/holland/spec-weights` | CM | Danh sách trọng số RIASEC → Specialization | UC-91 |
| 109.2 | PUT | `/api/cm/holland/spec-weights/{specId}` | CM | Sửa trọng số RIASEC → Specialization | UC-91 |

---

## CLUSTER 6 — Crawler, Trending Weight & System Config (31 endpoints)

### Crawler Execution (CM)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 110 | POST | `/api/cm/crawler/run` | CM | Trigger chạy crawler thủ công | UC-93 |
| 111 | GET | `/api/cm/crawler/batches` | CM | Danh sách batch crawl | UC-68 |
| 112 | GET | `/api/cm/crawler/batches/{id}` | CM | Chi tiết batch + thống kê | UC-68 |
| 113 | GET | `/api/cm/crawler/batches/{id}/errors` | CM | Parse error log của batch | UC-68 |

### Trending Weight Approval (CM)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 114 | GET | `/api/cm/trending-weights/proposals` | CM | Đề xuất TW chờ duyệt (before/after) | UC-69 |
| 115 | PATCH | `/api/cm/trending-weights/proposals/{id}/approve` | CM | Approve 1 đề xuất | UC-69 |
| 116 | PATCH | `/api/cm/trending-weights/proposals/{id}/reject` | CM | Reject 1 đề xuất | UC-69 |
| 117 | GET | `/api/cm/trending-weights/current` | CM | TW đang hiệu lực mỗi NS | UC-69 |
| 118 | GET | `/api/cm/trending-weights/{nsId}/history` | CM | Lịch sử TW của 1 NS | UC-69 |
| 119 | POST | `/api/cm/trending-weights/{nsId}/rollback` | CM | Rollback về version trước | UC-70 |

### Crawler Source Config (Admin)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 120 | GET | `/api/admin/crawler/sources` | Admin | Danh sách adapter source | UC-75 |
| 121 | PUT | `/api/admin/crawler/sources/{id}` | Admin | Cấu hình source (cron, enable) | UC-75 |
| 122 | PATCH | `/api/admin/crawler/sources/{id}/toggle` | Admin | Enable/disable adapter | UC-76 |

### System Config (Admin)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 123 | GET | `/api/admin/system-config` | Admin | Xem toàn bộ config | UC-78 |
| 124 | PUT | `/api/admin/system-config` | Admin | Cập nhật config (AI provider, token limit...) | UC-78 |
| 125 | GET | `/api/admin/ai-usage` | Admin | Thống kê token usage | UC-78 |
| 126 | GET | `/api/admin/system-stats` | Admin | Thống kê tổng quan hệ thống | UC-90 |

### Transcript Mapping Preset (Admin)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 127 | GET | `/api/admin/transcript-presets` | Admin | Danh sách preset mapping | UC-79 |
| 128 | POST | `/api/admin/transcript-presets` | Admin | Tạo preset | UC-79 |
| 129 | PUT | `/api/admin/transcript-presets/{id}` | Admin | Sửa preset | UC-79 |
| 130 | DELETE | `/api/admin/transcript-presets/{id}` | Admin | Xóa preset | UC-79 |
| 131 | PATCH | `/api/admin/transcript-presets/{id}/activate` | Admin | Kích hoạt preset mặc định | UC-81 |

### Tuition Config (Admin)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 132 | GET | `/api/admin/tuition-configs` | Admin | Danh sách cấu hình học phí | UC-82,83 |
| 133 | POST | `/api/admin/tuition-configs` | Admin | Tạo cấu hình học phí theo major/năm | UC-82,83 |
| 134 | PUT | `/api/admin/tuition-configs/{id}` | Admin | Sửa học phí | UC-82,83 |

### User Management (Admin)
| # | Method | Endpoint | Actor | Description | UC |
|---|--------|----------|-------|-------------|-----|
| 135 | GET | `/api/admin/users` | Admin | Danh sách user (filter role/status) | UC-71,72,73 |
| 136 | PATCH | `/api/admin/users/{id}/status` | Admin | Active/deactivate tài khoản | UC-71,72,73 |
| 137 | POST | `/api/admin/users/{id}/reset-password` | Admin | Reset password cho Staff | UC-71,72,73 |
| 138 | POST | `/api/admin/staff` | Admin | Tạo tài khoản CM/Admin | UC-74 |

---

## Summary
| Cluster | Total | Simple | Medium | High |
|---------|-------|--------|--------|------|
| CLUSTER 1 — Auth & User | 26 | 16 | 10 | 0 |
| CLUSTER 2 — Catalog & Curriculum | 31 | 9 | 22 | 0 |
| CLUSTER 3 — Student Profile & Roadmap | 32 | 14 | 12 | 5 |
| CLUSTER 4 — Config & Recommendation | 20 | 8 | 9 | 3 |
| CLUSTER 5 — Holland Assessment | 14 | 3 | 7 | 0 |
| CLUSTER 6 — Crawler, TW & System Config | 31 | 12 | 13 | 6 |
| **TỔNG** | **154** | **62** | **73** | **14** |

---

## Notes
- Auth module (endpoints 1–9): **COMPLETE** — branch `feature/auth-module`
- Endpoint 10 (`/api/auth/password/change`): 60% done
- Endpoints 11–18: Account & Notification module — **IN PROGRESS** (current sprint)
- Student login: dùng `email`; CM/Admin login: dùng `username` (NAC-03-05 — CM/Admin KHÔNG được login bằng email)
- Student đăng ký: **2 cách** — (1) form email+password + activation link (FT-01), HOẶC (2) Google OAuth (FT-02)
- Google OAuth: chỉ tạo Student account (NAC-02-03), không bắt đặt password (NAC-02-01)
- Email verify: dùng **LINK** (token ở query param), click link để kích hoạt — KHÔNG phải 6-digit code
- CM/Admin: pre-seeded, active ngay, không qua email verify (NAC-03-04); quên pass → Admin reset thủ công (BR-43)
