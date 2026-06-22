# SMOSP Business Rules, Boundary Values & Data Constraints

---

## BUSINESS RULES (BR)

| ID | Name | Description | Applies to |
|----|------|-------------|-----------|
| BR-01 | Sensitive Data Plaintext Forbidden | Passwords, tokens, API keys phải được mã hóa trước khi lưu. Không được lưu plaintext ở DB, log, bất kỳ storage nào. | FT-01, FT-02, FT-12 |
| BR-02 | No Account Existence Disclosure | Register và password-reset endpoints trả về response giống nhau dù email tồn tại hay không. Không được để timing side-channel. | FT-01, FT-04 |
| BR-03 | RBAC — Server-Side Only | Mọi function chỉ accessible đúng role. Check trên server; UI hide/show KHÔNG phải security measure. | All authenticated FTs |
| BR-04 | Config Changes Non-Retroactive | Tag map, scoring weight, TW changes chỉ áp dụng cho các lần tính toán tương lai. Kết quả cũ frozen. | FT-18, FT-32, FT-34, FT-42 |
| BR-05 | Unpublished Content Hidden | Major/Specialization/Narrow Spec ở draft/unpublished: không visible kể cả qua URL trực tiếp. CM/Admin xem được trong management UI. | FT-05–07, FT-21, FT-24, FT-39 |
| BR-06 | Student Personal Data Never Auto-Overwritten | Standard Roadmap update by CM không tự update Personal Roadmap. Parse failure không overwrite profile cũ. Student được notify. | FT-08, FT-16, FT-22, FT-23 |
| BR-07 | TW Changes Must Be CM-Approved | Mọi TW change từ crawl pipeline cần CM approve trước khi ảnh hưởng recommendation engine. Không auto-apply. | FT-18, FT-42 |
| BR-08 | Recommendation Scoped to Student's Major | Compatibility Score, ranking, skill gap — chỉ scoped trong narrow specs thuộc Major đã khai báo của student. | FT-18, FT-19, FT-20 |
| BR-09 | Referenced Active Data Cannot Be Hard-Deleted | Skill/interest trong tag map, course trong roadmap, Major có active NS children → soft-delete only. | FT-30, FT-31, FT-32, FT-35, FT-38, FT-39 |
| BR-10 | Names Unique Within Same Level | Skill names, interest labels, course codes, Major/Spec names tại cùng hierarchy level phải unique. | FT-30, FT-31, FT-35, FT-38, FT-45 |
| BR-11 | Advisory Results Must Show Disclaimer | Holland results, transfer cost, market signals, summary report luôn hiển thị disclaimer "tư vấn, không chính thức". KHÔNG áp dụng cho Compatibility Score. | FT-26, FT-27, FT-28, FT-29 |
| BR-12 | Admin Actions Logged | Mọi admin action ảnh hưởng user account hay system data: log actor, action, target, timestamp. Log read-only, immutable. | FT-44–49 |
| BR-13 | Course Prerequisites Must Be Acyclic (DAG) | Prerequisite relationships tạo DAG. Hệ thống detect và reject cycle (direct hoặc indirect). | FT-36 |
| BR-15 | Transfer Analysis Advisory Only | Transfer analysis không kết nối hay thực thi action trên FAP của FPT. Advisory output only. | FT-27, FT-28, FT-29 |
| BR-17 | Recruitment Data from VietnamWorks Only (v1.0) | Mọi recruitment data cho TW calculation chỉ được từ VietnamWorks adapter trong v1.0. | FT-40, FT-41, FT-42, FT-47 |
| BR-19 | Account Locked After 5 Consecutive Failed Logins | Sau 5 lần sai liên tiếp: khóa 30 phút. Auto-unlock. Không cần Admin can thiệp. | FT-03 |
| BR-20 | At Least 1 Active Admin Always | Hệ thống chặn deactivation nếu sẽ còn 0 active Admin. Admin không thể self-deactivate. | FT-44 |
| BR-22 | Only Passed Courses Count as Completed | Chỉ courses có grade ≥ 5.0 mới count là completed cho tag map matching. | FT-16, FT-18 |
| BR-23 | Major Self-Reported, Not Validated | Hệ thống chấp nhận major student khai báo, không cross-check với FAP. Hiển thị disclaimer trên màn hình khai báo. | FT-14, FT-18 |
| BR-25 | Notify Students When Source NS Is Unpublished | Khi CM unpublish một NS, tất cả student có Personal Roadmap cloned từ NS đó phải được notify. Personal Roadmaps được bảo toàn. | FT-08, FT-22, FT-39 |
| BR-26 | Personal Roadmap Name Independent of NS Rename | Khi CM rename NS, tên Personal Roadmap do student đặt không bị thay đổi. | FT-23, FT-39 |
| BR-27 | Normalize Weights When TW Unavailable | Nếu NS chưa có TW (null): exclude market dimension, normalize 2 chiều còn lại lên 100%. Hiển thị note "no market data". | FT-18, FT-19 |
| BR-28 | Show All NS Regardless of Score | Tất cả published NS trong specialization của student hiển thị trong recommendation list, kể cả score=0. Khi all=0: hiển thị "complete your profile". | FT-19 |
| BR-29 | Alphabetical Tiebreaker | Equal Compatibility Scores sắp xếp theo tên NS (ascending). | FT-19 |
| BR-30 | Deleted Courses Flagged, Not Removed from Personal Roadmaps | Khi CM xóa course khỏi Standard Roadmap: course bị flag "removed from standard" trên Personal Roadmaps. Progress/notes của student được giữ nguyên. | FT-23, FT-35 |
| BR-31 | GPA Excludes Non-GPA Courses | `counts_toward_gpa = false` (OJT, GDQP, Vovinam...) không tính vào cumulative GPA. Vẫn được parse và store. Vẫn có thể count là completed nếu grade ≥ 5.0. | FT-16, FT-35 |
| BR-32 | Holland Questions Must Have Exactly 5 Likert Options | Mỗi Holland question: đúng 5 answer options, scale 1–5 (Strongly Disagree → Strongly Agree). | FT-25, FT-33 |
| BR-33 | All Holland Assessment Results Retained in History | Mỗi completed Holland session lưu với timestamp. Prior results không bị overwrite. Latest = active result. | FT-25, FT-26 |
| BR-34 | Holland Assessment Blocked If Any RIASEC Dimension < 5 Active Questions | Assessment không thể bắt đầu nếu bất kỳ dimension nào trong 6 RIASEC có ít hơn 5 active questions. | FT-25, FT-33 |
| BR-35 | Transfer Equivalency Determined by Course Code | Course chỉ được retain/equivalent nếu Subject Code match chính xác giữa source và target curriculum. Cùng tên ≠ equivalent. | FT-27 |
| BR-36 | Transfer Analysis Scope Rules | Trong cùng specialization: chỉ so sánh terms 4–9. Khác specialization cùng major: so sánh lại terms 1–3 theo code. Cross-major: full terms 1–9. System label scope rõ ràng. | FT-27, FT-28, FT-29 |
| BR-37 | Expired TW Proposals Auto-Rejected After 7 Days | Nếu CM không action trong 7 ngày (BV-39): system auto-reject, giữ TW hiện tại. Admin được notify. | FT-42 |
| BR-38 | Escalating Alerts for Consecutive Crawl Failures | 3 consecutive failures → standard alert. 7 ngày liên tiếp → emergency alert + auto-disable adapter. Admin phải manually re-enable. | FT-40, FT-41, FT-46 |
| BR-39 | All-Zero TW Batch Flagged as Anomaly | Nếu batch tạo TW=0 cho tất cả NS: flag anomaly, alert CM và Admin, block normal approval flow. CM không thể approve không có Admin confirmation. | FT-40, FT-42 |
| BR-40 | System Logs Retained 1 Year Before Archiving | Admin action logs, crawl logs, error logs: retain hot storage ≥ 365 ngày, rồi archive. Không xóa vĩnh viễn. | FT-41, FT-44 |
| BR-41 | AI Pipeline Atomic (Crawl–Normalize–TW Chain) | Nếu AI API fail hoặc hết quota mid-batch: discard toàn bộ partial batch. Không save partial results. Không tạo partial TW proposals. Notify CM re-run. | FT-40, FT-42 |
| BR-42 | Emergency Super-Admin Account | Deploy phải tạo 1 super-admin account không visible trong Admin UI, không thể deactivate qua UI. DevOps DB-level access. Không count vào BR-20 pool. | FT-44 |
| BR-43 | Staff Use Username, Not Email | CM và Admin login bằng username (không phải email). Staff không bắt buộc có email. Forgot-password: Admin-mediated reset (không phải self-service email flow). | FT-03, FT-04, FT-44, FT-45 |
| BR-44 | Session Invalidation on Deactivation | Khi Admin deactivate một user account: tất cả active sessions bị invalidate trong vòng 60 giây (BV-45). | FT-44 |
| BR-45 | Forced Password Change on First Login | Staff account mới (hoặc sau Admin password reset) phải đổi password trước khi truy cập bất kỳ feature nào khác. | FT-03, FT-12, FT-45 |
| BR-46 | Retake Fee Discount: Next Term Only | Giảm 50% phí retake chỉ áp dụng nếu student retake ngay kỳ học tiếp theo. Từ ≥2 kỳ sau = full price. | FT-27 |
| BR-47 | Transfer Cost Estimate Includes Data Currency Disclaimer | Mọi transfer cost estimate phải hiển thị ngày Admin cập nhật học phí/phí retake lần cuối, kèm disclaimer phí có thể thay đổi hàng năm. | FT-27 |
| BR-48 | AI Reason Failure Must Not Block Score Display | Nếu Gemini AI fail hoặc timeout (BV-47) khi generate NL explanation: hiển thị placeholder text. Compatibility Score và ranking không bị ảnh hưởng. | FT-19, FT-50 |
| BR-51 | Transfer Cost Breakdown Required | Phải tách hiển thị 3 dòng riêng: academic_cost (retake + new courses), admin_fee (cố định 2.500.000đ), total_cost. | FT-27 |

---

## BOUNDARY VALUES (BV)

| ID | Constraint | Valid Range | Key Test Points | Enforcement |
|----|-----------|-------------|-----------------|-------------|
| BV-03 | Activation Link Expiry | 0 < elapsed ≤ 24h | 23h59m (valid), 24h01m (INVALID) | API |
| BV-04 | Password Reset Link Expiry | 0 < elapsed ≤ 60min | 59m (valid), 61m (INVALID) | API |
| BV-05 | Password Length | 8 ≤ len ≤ 128 chars | 7 (invalid), 8 (min), 128 (max), 129 (invalid) | UI / API |
| BV-06 | Max Failed Login Attempts | 0 ≤ failures ≤ 4 (allowed) | 4 (valid), 5 (LOCK) | API |
| BV-07 | Account Lockout Duration | lockout = 30 min | 29m59s (still locked), 30m00s (unlocked) | API |
| BV-08a | GPA Valid Range | 0.0 ≤ GPA ≤ 10.0 | -0.1 (invalid), 0.0, 10.0, 10.1 (invalid) | API / DB |
| BV-08b | Course Score Range | 0.0 ≤ score ≤ 10.0 | -0.1 (invalid), 0.0, 10.0, 10.1 (invalid) | API / DB |
| BV-09 | Transcript File Size | 0 < size ≤ 5MB | 0 bytes (invalid), 5MB (valid), 5MB+1b (invalid) | UI / API |
| BV-10 | Courses in Transcript | 1 ≤ count ≤ 150 | 0 (invalid), 1 (min), 150 (max), 151 (invalid) | API |
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
| BV-24 | Personal Roadmaps per Student | 0–5 | 0 (can clone), 5 (can still clone if 5th), 6 (BLOCKED) | API |
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
| BV-41 | AI Token Usage Warning | ≥ 80% monthly quota → warn; > 100% → block | 79% (ok), 80% (WARN), 100% (last valid), 101% (BLOCK) | API |
| BV-42 | Sample Transcript File Size (preset test) | 0 < size ≤ 5MB | 0 bytes (invalid), 5MB, 5MB+1b (invalid) | UI / API |
| BV-43 | Column Mapping Presets | 1–5 total; only 1 active | 0 (cannot parse), 1, 5, 6 (BLOCKED) | API |
| BV-44 | System Log Retention | ≥ 365 days in hot storage | 364 days (hot), 365 days (archive trigger), 366+ (cold, still retrievable) | System / DB |
| BV-45 | Session Invalidation Window | ≤ 60 seconds | 59s (valid), 60s (boundary), 61s (SLA violation) | System |
| BV-46 | Retake Course Fee per Credit (VND) | 500,000–5,000,000 | 499,999 (invalid), 500K, 5M, 5,000,001 (invalid) | API |
| BV-47 | Gemini Reason Generation Timeout | ≤ 10 seconds | 9s (waiting), 10s (boundary), 11s (TIMEOUT → fallback) | API |

---

## DATA CONSTRAINTS (DC)

| ID | Constraint | Chi tiết | Enforcement |
|----|-----------|----------|-------------|
| DC-01 | GPA Decimal Precision | GPA lưu và hiển thị đúng 3 chữ số thập phân, làm tròn half-up. Course score: 1 chữ số thập phân theo Quy chế FPT. | API / DB |
| DC-02 | Compatibility Score Display Precision | Hiển thị 1 chữ số thập phân (ví dụ 85.4). Internal calculation giữ nhiều hơn để chính xác. | UI |
| DC-03 | Weight Distribution Must Sum to 100% | **Inner profile weights**: W_gpa + W_skill + W_int = 1.0 luôn luôn. Default: W_gpa=0.40, W_skill=0.35, W_int=0.25. Nếu CM đổi 1 weight, system auto-adjust 2 còn lại theo tỷ lệ, hoặc yêu cầu nhập manual đủ 100%. ⚠️ Lưu ý: bản business-rules.md gốc mô tả DC-03 theo model phẳng cũ ("academic 40 / skill+interest 35 / market 25"). Theo Hierarchical WSM hiện tại, 3 số 40/35/25 là **W_gpa/W_skill/W_int** (đều thuộc Profile_Score), còn market (TW) được xử lý riêng qua α ở tầng 2 — KHÔNG phải weight thứ 3 trong tổng. | API / DB |

---

## CORE ALGORITHM — Hierarchical Weighted Sum Model (WSM) 2 tầng
> ⚠️ KHÔNG dùng công thức 70/30 hardcode cũ nữa. Theo Report 1 v1.0.8, thuật toán
> đã đổi sang Hierarchical WSM 2 tầng để xử lý đa ngành (IT data-rich vs
> Law/Languages/DigitalArt data-sparse). ERD confirm: `recommendation_item`
> có cột `alpha_actual`, `alpha_base`; `narrow_spec_weight_config.alpha_base`.

### Tầng 1 — Profile Score (vi mô)
```
Profile_Score = W_gpa × S_gpa + W_skill × S_skill + W_int × S_int
Ràng buộc: W_gpa + W_skill + W_int = 1.0
Default:   W_gpa = 0.40,  W_skill = 0.35,  W_int = 0.25
```

### Tầng 2 — Final Score (vĩ mô)
```
Final_Score = α_actual × Profile_Score + (1 − α_actual) × Trending_Weight
```
> α (alpha) = trọng số động giữa hồ sơ cá nhân và tín hiệu thị trường.
> α càng cao → tin vào profile nhiều hơn; α càng thấp → market quan trọng hơn.

### Trending Weight (cấp Narrow Specialization, KHÔNG phải cấp skill)
```
Trending_Weight (TW) = 0.5×Sacc + 0.3×Svol + 0.2×Junior_ratio   [scaled 0–100]
  Sacc        = tốc độ tăng trưởng job (so sánh 2 chu kỳ crawl) — score 0–1
  Svol        = khối lượng job hiện tại (min-max normalize về [0,1])
  Junior_ratio= tỉ lệ job phù hợp fresh grad (jobLevel ∈ {Intern, Fresher/Entry}) — 0–1
```

### Rule 1 — α_base theo nhóm ngành (CM cấu hình qua UI slider + audit)
| Nhóm ngành | α_base | Lý do |
|-----------|--------|-------|
| IT (SE, AI, IS) | 0.70 | Data thị trường dồi dào |
| Business / Marketing | 0.75 | Job VNW nhiều, GPA + interest cân bằng |
| Ngôn ngữ (Languages) | 0.85 | Job thưa, giảm vai trò market |
| Luật (Law) | 0.90 | Job VNW rất ít, gần như chỉ profile |
| Digital Art | 0.95 | Interest-driven, GPA ít ý nghĩa |

### Rule 2 — Auto-fallback (linear interpolation chống nhiễu data sparsity)
| Điều kiện Svol | α_actual |
|----------------|----------|
| Svol ≥ 100 (đủ data) | α_actual = α_base |
| 0 < Svol < 100 (thưa nhẹ) | α_actual = 1.0 − (Svol / 100) × (1 − α_base) |
| Svol = 0 (mất data) | α_actual = 1.0 (loại bỏ 100% market signal — BR-27) |

### Rule 3 — Explainability (BẮT BUỘC khi α_actual ≠ α_base)
> Output phải kèm chuỗi: *"Do dữ liệu tuyển dụng công khai cho chuyên ngành này
> hiện tại không đủ độ tin cậy thống kê, gợi ý này được đánh giá chủ yếu/hoàn toàn
> dựa trên hồ sơ năng lực cá nhân của bạn."*

### Nguyên tắc cốt lõi
- **Rule-based**, KHÔNG phải AI. Transparent, giải thích được từng bước.
- **KHÔNG dùng AHP** — đã đánh giá và loại bỏ vì over-engineering cho SEP490.
- **Holland KHÔNG tham gia** gợi ý chuyên ngành hẹp (chỉ dùng cho transfer ngành rộng).
- **Gemini chỉ làm 2 việc**: (1) normalize crawl data, (2) sinh NL explanation cho output. KHÔNG tham gia scoring.

## BACKGROUND JOB CHAIN (atomic)
```
JOB-01 (Crawl) → JOB-02 (AI Normalize) → JOB-03 (TW Calc) → JOB-04 (Notify) → JOB-05 (Token Monitor)
BR-41: Atomic all-or-nothing — failure ở bất kỳ stage nào → halt toàn bộ pipeline
```
