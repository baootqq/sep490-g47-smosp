# SMOSP — UC Summary (Backend Reference)
> 100 UCs (UC-16 deleted) | Chỉ backend — bỏ qua UI state, animation, layout
> Format: UC-ID | Actor | Endpoint(s) | Key BE constraints

---

## CLUSTER 1 — Auth & User

| UC | Name | Actor | Endpoint | Key BE Constraints |
|----|------|-------|----------|--------------------|
| UC-04 | Register Account via Email | Guest | `POST /api/auth/register` | BR-01 (hash pw), BR-02 (generic response), BV-05 (pw 8–128 chars); tạo account INACTIVE, gửi activation LINK (token = UUID, BV-03: ≤24h) |
| UC-05 | Authenticate via Google OAuth | Guest | `POST /api/auth/google` | NAC-02-03 (chỉ tạo Student role); tự động tạo active account nếu email chưa có |
| UC-06 | Log In | All | `POST /api/auth/login` | Student dùng email, CM/Admin dùng username (NAC-03-05); BR-19 (lock sau 5 lần sai, BV-06/07: 30 phút); phát JWT access + DB-stored UUID refresh token (Option B) |
| UC-07 | Reset Password | Student | `POST /api/auth/password/forgot` `POST /api/auth/password/reset` | BR-02 (luôn trả success dù email không tồn tại); BV-04 (link ≤60min); invalidate link sau dùng (NAC-04-01); invalidate all sessions sau reset |
| UC-08 | Change Password | All | `PUT /api/auth/password/change` | NAC-12-01 (pw mới ≠ pw cũ); NAC-12-02 (block OAuth-only account); invalidate all OTHER sessions (giữ session hiện tại) |
| UC-09 | Update Account Preferences | All | `GET /api/me` `PUT /api/me/preferences` | Áp dụng notification prefs ngay cho các thông báo tiếp theo |
| UC-10 | View Notification Inbox | All | `GET /api/notifications` `PATCH /api/notifications/{id}/read` `PATCH /api/notifications/read-all` | NAC-53-01 (chỉ hiển thị notification của chính user đó); ordered newest first |
| UC-30 | Submit Content Error Report | Student | `POST /api/content-error-reports` | NAC-09-03 (description bắt buộc, không empty); gửi notification đến CM sau khi tạo |
| UC-31 | View My Submitted Reports | Student | `GET /api/content-error-reports` (Student) | Chỉ trả report của student đó |
| UC-32 | View My Report Detail | Student | `GET /api/content-error-reports/{id}` (Student) | 403 nếu report không thuộc về student đó |
| UC-33 | Edit Submitted Report | Student | `PUT /api/content-error-reports/{id}` | Chỉ edit được khi status = PENDING |
| UC-34 | Cancel Submitted Report | Student | `DELETE /api/content-error-reports/{id}` | Chỉ cancel được khi status = PENDING |
| UC-84 | View Content Error Reports | CM | `GET /api/content-error-reports` (CM) | Filter by status; CM xem tất cả report |
| UC-85 | View Content Error Report Detail | CM | `GET /api/content-error-reports/{id}` (CM) | — |
| UC-86 | Add Processing Note to Report | CM | `PATCH /api/content-error-reports/{id}/note` | NAC-56-01 (CM chỉ được update note/status, không sửa nội dung gốc) |
| UC-87 | Update Content Error Report Status | CM | `PATCH /api/content-error-reports/{id}/status` | Trạng thái: PENDING → RESOLVED / DISMISSED |
| UC-88 | Delete Invalid Report | Admin | `DELETE /api/content-error-reports/{id}` (CM) | — |
| UC-97 | Auto-Unlock Account | System JOB | *(scheduled)* | Auto-unlock sau 30 phút (BV-07); không cần Admin trigger |
| **FCM** | Register Device Token | All | `POST /api/me/fcm-token` | Lưu FCM token cho push notification |

---

## CLUSTER 2 — Catalog & Curriculum

| UC | Name | Actor | Endpoint | Key BE Constraints |
|----|------|-------|----------|--------------------|
| UC-01 | Browse Major Catalog | Guest | `GET /api/majors` `GET /api/majors/{id}/specializations` | NAC-05-02 (chỉ trả published); no auth required |
| UC-02 | View Narrow Specialization Detail | Guest | `GET /api/specializations/{id}/narrow-specs` `GET /api/narrow-specs/{id}` | BR-05 (unpublished → 404/403, không lộ data); include course list + TW |
| UC-03 | Search and Filter Catalog | Guest | `POST /api/catalog/search` | NAC-07-02 (không trả unpublished); NAC-07-03 (không lộ internal ID trong response) |
| UC-24 | View Course Detail | Student | `GET /api/courses/{id}` | Kèm learning resources; BR-05 apply nếu NS chưa publish |
| UC-48 | Create Course | CM | `POST /api/courses` | BR-10 (course code unique); BR-13 (prerequisite phải acyclic DAG) |
| UC-49 | Update Course | CM | `PUT /api/courses/{id}` `GET /api/courses` | BR-10 (unique check khi đổi code) |
| UC-50 | Update Course Status | CM | `DELETE /api/courses/{id}` | BR-09 (soft-delete nếu đang dùng trong roadmap) |
| UC-51 | Configure Course Term Order | CM | *(gộp trong UC-65/60)* | BV-17 (1–6 terms), BV-18 (5–10 courses/NS), BV-19 (10–20 credits/term) |
| UC-52 | Configure Course Prerequisites | CM | `PUT /api/courses/{id}/prerequisites` | BR-13 (reject cycle — detect DAG violation); BV-22 (max 5 prerequisites/course) |
| UC-53 | Attach Learning Resource | CM | `POST /api/courses/{id}/resources` `PUT /api/courses/{id}/resources/order` | BV-23 (max 10 resources/course) |
| UC-54 | Update Learning Resource | CM | `PUT /api/resources/{id}` | — |
| UC-55 | Delete Learning Resource | CM | `DELETE /api/resources/{id}` | Hard delete (không reference ở bảng khác) |
| UC-56 | Create Major | CM | `POST /api/majors` | BR-10 (name unique); discipline_group sets α_base default cho NS mới |
| UC-57 | Update Major | CM | `PUT /api/majors/{id}` | — |
| UC-58 | Create Specialization | CM | `POST /api/specializations` | BV-13 (max 10 specs/major) |
| UC-59 | Update Specialization | CM | `PUT /api/specializations/{id}` | — |
| UC-60 | Assign Term 1–4 Courses for Specialization | CM | `GET /api/specializations/{id}/courses` `PUT /api/specializations/{id}/courses` | Terms 1–4 là môn chung của specialization |
| UC-61 | Configure Specialization Course Prerequisites | CM | *(gộp trong UC-52)* | BR-13 (DAG check) |
| UC-62 | Update Major Status | CM | `PATCH /api/majors/{id}/status` | BR-09 (không deactivate nếu có active NS children) |
| UC-63 | Update Specialization Status | CM | `PATCH /api/specializations/{id}/status` | BR-09 tương tự |
| UC-64 | Create Narrow Specialization | CM | `POST /api/narrow-specs` | BV-14 (max 15 NS/spec); α_base init từ discipline_group của Major |
| UC-65 | Update Narrow Specialization | CM | `PUT /api/narrow-specs/{id}` `GET /api/narrow-specs/{id}/courses` `PUT /api/narrow-specs/{id}/courses` | BR-26 (đổi tên NS không đổi tên Personal Roadmap của student) |
| UC-66 | Publish Narrow Specialization | CM | `PATCH /api/narrow-specs/{id}/publish` | Validate trước khi publish: phải có BV-17 terms, BV-18 courses, BV-19 credits |
| UC-67 | Unpublish Narrow Specialization | CM | `PATCH /api/narrow-specs/{id}/publish` | BR-25 (notify tất cả student có Personal Roadmap từ NS này); Personal Roadmaps KHÔNG bị xóa |

---

## CLUSTER 3 — Student Profile & Roadmap

| UC | Name | Actor | Endpoint | Key BE Constraints |
|----|------|-------|----------|--------------------|
| UC-11 | Update Personal Information | Student | `GET /api/students/me` `PUT /api/students/me` `PUT /api/students/me/spec` | BR-23 (Major self-reported, không validate với FAP); 4 fields bắt buộc: họ tên, major, specialization, kỳ học |
| UC-12 | Upload Academic Transcript | Student | `POST /api/students/me/transcripts` `GET /api/students/me/transcripts` `GET /api/students/me/transcripts/latest` `GET /api/students/me/grades` | BV-09 (≤5MB), BV-10 (1–150 courses), BV-11 (max 3 uploads/hour), BV-12 (grade ≥5.0 = PASSED); BR-06 (không overwrite nếu parse fail); BR-31 (GPA excludes non-GPA courses); DC-01 (GPA 3 decimal places) |
| UC-13 | Declare Skills | Student | `GET /api/students/me/skill-options` `GET /api/students/me/skill-options/search` `GET /api/students/me/skill-suggestions` `PUT /api/students/me/skills` `GET /api/students/me/skills` | NAC-17-01 (chỉ hiển thị skill thuộc Specialization của student); skill suggestion từ môn đã PASSED qua course_skill_map (NAC-51-01: không tự động add, chỉ gợi ý) |
| UC-14 | Declare Work Interests | Student | `GET /api/students/me/interest-options` `GET /api/students/me/interests` `PUT /api/students/me/interests` | NAC-17-01 tương tự — chỉ interest thuộc Specialization của student |
| UC-15 | View Ranked Recommendations | Student | `POST /api/students/me/recommendation/run` `GET /api/students/me/recommendation/latest` `GET /api/students/me/recommendation/latest/compare` | BR-08 (scope = Specialization của student); BR-27 (nếu TW=null → normalize 2 chiều còn lại); BR-28 (hiển thị ALL NS kể cả score=0); BR-29 (alphabet tiebreaker); DC-02 (display 1 decimal); NAC-18-01 (chỉ dùng approved TW) |
| UC-17 | View Skill Gap Analysis | Student | `GET /api/students/me/recommendation/latest/items/{nsId}` | So sánh skill đã khai báo với tag map của NS đó |
| UC-18 | View Standard Academic Roadmap | Student | `GET /api/narrow-specs/{id}/roadmap` | Merge spec_course (terms 1–4) + ns_course (terms 4–9) |
| UC-19 | Create Personal Roadmap | Student | `POST /api/students/me/roadmaps` | BV-24 (max 5 roadmaps/student); clone từ Standard Roadmap tại thời điểm clone |
| UC-20 | View Personal Roadmap List | Student | `GET /api/students/me/roadmaps` | — |
| UC-21 | View Personal Roadmap Detail | Student | `GET /api/students/me/roadmaps/{id}` | BR-30 (courses bị xóa khỏi Standard → flag `is_removed_from_standard`, không xóa khỏi Personal) |
| UC-22 | Update Personal Roadmap Detail | Student | `PUT /api/students/me/roadmaps/{id}` `POST /api/students/me/roadmaps/{id}/sync-transcript` `PATCH /api/students/me/roadmaps/{id}/items/{courseId}/progress` `POST/DELETE /api/students/me/roadmaps/{id}/bookmarks/{courseId}` `PUT/DELETE /api/students/me/roadmaps/{id}/notes/{courseId}` | BR-06 (student tự quyết định, không auto-overwrite); BV-25 (note ≤500 chars); sync-transcript: auto-mark từ transcript, không force |
| UC-23 | Delete Personal Roadmap | Student | `DELETE /api/students/me/roadmaps/{id}` | Hard delete Personal Roadmap (không ảnh hưởng Standard) |
| UC-27 | View NS Change Cost Report | Student | `POST /api/students/me/transfer-analysis/narrow-specialization` `GET /api/students/me/transfer-analysis` `GET /api/students/me/transfer-analysis/{id}` `DELETE /api/students/me/transfer-analysis/{id}` | `transfer_type = NARROW_SPEC`; BR-35 (match bằng course code); BR-15 (advisory only, không kết nối FAP); BR-46 (50% discount nếu retake ngay kỳ sau); BR-47 (hiển thị ngày update học phí); BV-34 (warn nếu extra terms ≥4); split cost: academic_cost + admin_fee(2.5M) + total_cost |
| UC-28 | View Specialization Change Cost Report | Student | `POST /api/students/me/transfer-analysis/specialization` | `transfer_type = SPECIALIZATION`; BR-36 (cùng major: so sánh terms 4–9; khác major: full terms 1–9) |
| UC-29 | View Major Change Cost Report | Student | *(gộp vào UC-28 với scope khác)* | BR-36 cross-major: warn rõ ràng |
| UC-92 | View Specialization Ranking by Holland | Student | `GET /api/students/me/holland/spec-ranking` | Tính từ RIASEC scores × holland_spec_weight; BR-11 (disclaimer advisory) |

---

## CLUSTER 4 — Configuration & Recommendation

| UC | Name | Actor | Endpoint | Key BE Constraints |
|----|------|-------|----------|--------------------|
| UC-35 | Create Skill | CM | `POST /api/cm/skills` | BR-10 (name unique per specialization — skill.specialization_id) |
| UC-36 | Update Skill | CM | `PUT /api/cm/skills/{id}` `PUT /api/cm/skills/{id}/aliases` `PUT /api/cm/skills/{id}/course-map` | Alias update không tạo bản mới, replace toàn bộ alias list |
| UC-37 | Update Skill Status | CM | `DELETE /api/cm/skills/{id}` | BR-09 (soft-delete nếu đang trong tag map) |
| UC-38 | Create Work Interest | CM | `POST /api/cm/interests` | BR-10 (label unique per specialization) |
| UC-39 | Update Work Interest | CM | `PUT /api/cm/interests/{id}` | — |
| UC-40 | Update Work Interest Status | CM | `DELETE /api/cm/interests/{id}` | BR-09 (soft-delete nếu đang trong tag map) |
| UC-41 | Create Tag Map Entry | CM | `PUT /api/cm/narrow-specs/{id}/tag-map` | NAC-32-02 (NS phải có ít nhất 1 mapping); source phải thuộc cùng Specialization với NS |
| UC-42 | Update Tag Map Entry | CM | `PUT /api/cm/narrow-specs/{id}/tag-map` | BR-04 (không hồi tố lên Compatibility Score cũ) |
| UC-43 | Delete Tag Map Entry | CM | `PUT /api/cm/narrow-specs/{id}/tag-map` | NAC-32-02 (reject nếu xóa mục cuối cùng) |
| UC-89 | Configure Compatibility Score Weight Distribution | CM | `GET /api/cm/narrow-specs/{id}/weight-config` `PUT /api/cm/narrow-specs/{id}/weight-config` `GET /api/cm/narrow-specs/{id}/weight-config/audit` | DC-03 (W_gpa + W_skill + W_int = 1.0); BR-04 (non-retroactive); ghi audit log mỗi lần thay đổi |

---

## CLUSTER 5 — Holland Assessment

| UC | Name | Actor | Endpoint | Key BE Constraints |
|----|------|-------|----------|--------------------|
| UC-25 | Take Holland Assessment | Student | `POST /api/students/me/holland/sessions` `GET /api/students/me/holland/sessions/current` `POST /api/students/me/holland/sessions/current/responses` `POST /api/students/me/holland/sessions/current/submit` | BR-34 (block start nếu bất kỳ RIASEC dimension nào < 5 active questions); BV-30a (max 3 retakes), BV-30b (min 30 ngày giữa retakes); BV-31 (timeout 60min inactivity, save progress); khi submit: tính RIASEC scores → tạo holland_result |
| UC-26 | View Holland Assessment History | Student | `GET /api/students/me/holland/sessions/latest/result` | BR-33 (all results retained, không overwrite) |
| UC-44 | Create Holland Question | CM | `POST /api/cm/holland/questions` | NAC-33-02 (phải assign ít nhất 1 RIASEC dimension); BR-32 (exactly 5 Likert options 1–5 — shared master data từ `holland_answer_option`) |
| UC-45 | Update Holland Question | CM | `PUT /api/cm/holland/questions/{id}` | Chỉ apply cho assessments tương lai (BR-04) |
| UC-46 | Update Holland Question Status | CM | `PATCH /api/cm/holland/questions/{id}/toggle` | NAC-33-01 (chỉ deactivate, không delete); `DELETE /api/cm/holland/questions/{id}` = deactivate |
| UC-47 | Configure Assessment Scoring Weight | CM | `PUT /api/cm/holland/questions/{id}/options` | BV-29 (weight 0.1–10.0); NAC-34-02 (không cho weight = 0 hoặc âm) |
| UC-91 | Configure Holland Spec Weights | CM | `GET /api/cm/holland/spec-weights` `PUT /api/cm/holland/spec-weights/{specId}` | Mỗi RIASEC dimension đóng góp bao nhiêu % vào score của Specialization |

---

## CLUSTER 6 — Crawler, TW & System Config

| UC | Name | Actor | Endpoint | Key BE Constraints |
|----|------|-------|----------|--------------------|
| UC-68 | Review Crawl Batch and Error Log | CM | `GET /api/cm/crawler/batches` `GET /api/cm/crawler/batches/{id}` `GET /api/cm/crawler/batches/{id}/errors` | BR-40 (logs retained ≥365 days); NAC-41-01 (log read-only qua API) |
| UC-69 | Review Trending Weight Proposal | CM | `GET /api/cm/trending-weights/proposals` `PATCH /api/cm/trending-weights/proposals/{id}/approve` `PATCH /api/cm/trending-weights/proposals/{id}/reject` `GET /api/cm/trending-weights/current` `GET /api/cm/trending-weights/{nsId}/history` | BR-07 (never auto-apply); BV-38 (proposal chỉ tạo khi TW thay đổi ≥5%); BV-39 (7 ngày → auto-reject); BR-39 (all-zero batch → block, cần Admin confirm) |
| UC-70 | Rollback Trending Weight | CM | `POST /api/cm/trending-weights/{nsId}/rollback` | Chỉ rollback về version ngay trước; ghi log với note="ROLLBACK" |
| UC-71 | View and Search User List | Admin | `GET /api/admin/users` | Filter by role/status |
| UC-72 | Update User Account Status | Admin | `PATCH /api/admin/users/{id}/status` | BR-20 (không deactivate nếu còn 0 Admin); BR-44 (invalidate all sessions trong 60s — BV-45) |
| UC-73 | Reset Temporary Password | Admin | `POST /api/admin/users/{id}/reset-password` | BR-45 (Staff phải đổi pw ngay lần login tiếp); BR-43 (chỉ áp dụng cho Staff) |
| UC-74 | Create Staff Account | Admin | `POST /api/admin/staff` | BR-43 (không email bắt buộc, dùng username); BR-45 (temp pw, buộc đổi lần đầu); BR-42 (super-admin không visible qua API này) |
| UC-75 | Configure Crawl Schedule | Admin | `GET /api/admin/crawler/sources` `PUT /api/admin/crawler/sources/{id}` | BV-35 (interval 1–30 ngày) |
| UC-76 | Update Crawler Adapter Status | Admin | `PATCH /api/admin/crawler/sources/{id}/toggle` | BR-38 (manual re-enable sau emergency auto-disable) |
| UC-77 | Test Crawler Adapter Connection | Admin | *(gộp trong UC-76 flow)* | — |
| UC-78 | Configure AI API Provider | Admin | `GET /api/admin/system-config` `PUT /api/admin/system-config` `GET /api/admin/ai-usage` | BV-41 (≥80% quota → warn, >100% → block); LI-03 (swappable provider) |
| UC-79 | Create Column Mapping Preset | Admin | `POST /api/admin/transcript-presets` | BV-43 (max 5 presets) |
| UC-80 | Test Column Mapping Preset | Admin | *(test với sample file — BV-42)* | BV-42 (≤5MB sample) |
| UC-81 | Activate Column Mapping Preset | Admin | `PATCH /api/admin/transcript-presets/{id}/activate` | BV-43 (chỉ 1 preset active tại 1 thời điểm) |
| UC-82 | Create Retake Credit Price | Admin | `POST /api/admin/tuition-configs` | BV-33 (tuition 28M–33M VND); BV-46 (retake 500K–5M/credit) |
| UC-83 | Update Retake Credit Price | Admin | `PUT /api/admin/tuition-configs/{id}` | BR-47 (transfer analysis phải hiển thị ngày cập nhật) |
| UC-90 | View System Overview Dashboard | Admin | `GET /api/admin/system-stats` | Aggregate từ các module, không tính lại; NAC-58-01 (1 module lỗi không block cả dashboard) |
| UC-93 | Execute Crawl Batch | System/CM | `POST /api/cm/crawler/run` | BR-41 (atomic: JOB-01→02→03); BV-37 (1–10,000 jobs/batch); BR-38 (3 fails → alert, 7 ngày → emergency + auto-disable) |
| UC-94 | Notify Student of Roadmap Change | System | *(event-driven)* | Trigger khi CM update/unpublish Standard Roadmap; chỉ notify student có Personal Roadmap từ NS đó (BR-25, NAC-08-02) |
| UC-95 | Notify CM of Operational Alert | System | *(event-driven)* | Semester reminder + TW proposals ready |
| UC-96 | Notify Admin of System Anomaly | System | *(event-driven)* | AI errors, crawl failures, suspicious activity |
| UC-98 | Auto-Reject Expired TW Proposal | System JOB | *(scheduled)* | BR-37 (7 ngày → auto-reject, notify Admin) |
| UC-99 | Escalate Crawl Failure Alert | System JOB | *(scheduled)* | BR-38: 3 consecutive → standard alert; 7 days → emergency + auto-disable |
| UC-100 | Archive Old System Logs | System JOB | *(scheduled)* | BR-40 (≥365 days hot → archive cold storage) |

---

## UC-16 — DELETED
> Đã xóa khỏi scope. Không implement.

---

## System JOBs — Không có endpoint, event-driven hoặc scheduled

| JOB | Trigger | Mô tả |
|-----|---------|-------|
| JOB-01 | Cron / CM manual | Crawl VietnamWorks → raw_job |
| JOB-02 | After JOB-01 | Gemini AI normalize → job_normalized |
| JOB-03 | After JOB-02 | Tính TW → trending_weight_proposal (PENDING) |
| JOB-04 | Event-driven | Notification dispatch |
| JOB-05 | Daily | Monitor Gemini token quota (BV-41) |
| Auto-unlock | Scheduled | BR-19/BV-07: unlock sau 30 phút |
| Auto-reject TW | Scheduled | BR-37/BV-39: reject proposal sau 7 ngày |
| Archive logs | Scheduled | BR-40: sau 365 ngày hot storage |
