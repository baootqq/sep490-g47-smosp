// ============================================================
// SMOSP ERD v5 — DBML
// Cập nhật: 23/06/2026
//
// THAY ĐỔI:
// [FIX-15] Update account user và notification.
// ============================================================

// ── CLUSTER 1: AUTH & USER ──────────────────────────────────

Table role {
  id          uuid      [pk]
  name        varchar   [not null, unique, note: 'STUDENT / CM / ADMIN']
  description text
}

Table user_account {
  id            uuid      [pk]
  role_id       uuid      [not null, ref: > role.id]
  email         varchar   [unique, note: 'Student only — Google OAuth']
  username      varchar   [unique, note: 'CM / Admin only — seeded']
  password_hash varchar
  status        varchar   [not null, default: 'ACTIVE', note: 'ACTIVE / INACTIVE']
  display_name  varchar   [note: 'tên hiển thị trên UI — mọi role; init từ full_name (Student) hoặc username (CM/Admin)']
  notif_enabled boolean   [not null, default: true, note: 'bật/tắt nhận thông báo — UC-09']
  fcm_token     varchar   [note: 'Lưu token để push notification từ Firebase']
  created_at    timestamp [not null, default: `now()`]
  updated_at    timestamp [not null, default: `now()`]
}

Table oauth_identity {
  id           uuid      [pk]
  user_id      uuid      [not null, ref: > user_account.id]
  provider     varchar   [not null, note: 'google']
  provider_uid varchar   [not null]
  linked_at    timestamp [not null, default: `now()`]

  indexes {
    (provider, provider_uid) [unique]
  }
}

Table password_reset_token {
  id         uuid      [pk]
  user_id    uuid      [not null, ref: > user_account.id]
  token_hash varchar   [not null]
  expires_at timestamp [not null]
  used       boolean   [not null, default: false]
  created_at timestamp [not null, default: `now()`]
}

Table email_verification_token {
  id         uuid      [pk]
  user_id    uuid      [not null, ref: > user_account.id]
  token      varchar   [not null, unique]
  expires_at timestamp [not null, note: '15 minutes']
  used       boolean   [not null, default: false]
  created_at timestamp [not null, default: `now()`]
}

Table notification {
  id         uuid      [pk]
  user_id    uuid      [not null, ref: > user_account.id]
  type       varchar   [not null, note: 'SEMESTER_REFRESH / CURRICULUM_UPDATE / ROADMAP_UPDATE / CONTENT_ERROR / SYSTEM_ALERT']
  title      varchar   [not null]
  body       text
  metadata   jsonb
  is_read    boolean   [not null, default: false]
  created_at timestamp [not null, default: `now()`]
}

Table content_error_report {
  id          uuid      [pk]
  reporter_id uuid      [not null, ref: > user_account.id]
  entity_type varchar   [not null, note: 'course / resource / narrow_spec / specialization / roadmap / major ']
  entity_id   uuid      [not null]
  description text      [not null]
  status      varchar   [not null, default: 'PENDING', note: 'PENDING / RESOLVED / DISMISSED']
  processing_note text      [note: 'Ghi chú của Content Manager khi xử lý báo cáo'] 
  created_at  timestamp [not null, default: `now()`]
}

// ── CLUSTER 2: CATALOG & CURRICULUM ────────────────────────



Table major {
  id                uuid    [pk]
  code              varchar [not null, unique]
  name              varchar [not null]
  description       text
  image_url         varchar [note: 'Cloudinary storage URL']
  is_active         boolean [not null, default: true]
  tuition_per_term  decimal [note: 'VNĐ — ước tính học phí/kỳ, CM cập nhật; null nếu chưa cấu hình']
  price_per_credit  decimal [note: 'VNĐ — giá học lại/tín chỉ, CM cập nhật; null nếu chưa cấu hình']
  tuition_updated_at timestamp [note: 'timestamp lần CM cập nhật gần nhất — dùng để hiển thị disclaimer BR-47']
}

Table specialization {
  id          uuid    [pk]
  major_id    uuid    [not null, ref: > major.id]
  code        varchar [not null, unique]
  name        varchar [not null]
  description text
  image_url   varchar [note: 'Cloudinary storage URL']
  alpha_base  decimal [not null, default: 0.70, note: 'init default for new narrow_spec_weight_config; CM override per NS']
  is_active   boolean [not null, default: true]
}


Table narrow_spec {
  id                uuid      [pk]
  specialization_id uuid      [not null, ref: > narrow_spec.id]
  code              varchar   [not null, unique]
  name              varchar   [not null]
  description       text
  is_published      boolean   [not null, default: false]
  published_at      timestamp
}

Table course {
  id                uuid    [pk]
  code              varchar [not null, unique]
  name              varchar [not null]
  credits           int     [not null]
  description       text
  counts_toward_gpa boolean [not null, default: true]
  is_active         boolean [not null, default: true]
}

Table spec_course {
  id                uuid    [pk]
  specialization_id uuid    [not null, ref: > specialization.id]
  course_id         uuid    [not null, ref: > course.id]
  term_order        int     [not null]
  course_type       varchar [not null, note: 'GENERAL / CORE']

  indexes {
    (specialization_id, course_id) [unique]
  }
}

Table ns_course {
  id             uuid    [pk]
  narrow_spec_id uuid    [not null, ref: > narrow_spec.id]
  course_id      uuid    [not null, ref: > course.id]
  term_order     int     [not null]
  
  indexes {
    (narrow_spec_id, course_id) [unique]
  }
}

Table course_prerequisite {
  id              uuid [pk]
  course_id       uuid [not null, ref: > course.id]
  prerequisite_id uuid [not null, ref: > course.id]

  indexes {
    (course_id, prerequisite_id) [unique]
  }
}

Table learning_resource {
  id            uuid      [pk]
  course_id     uuid      [not null, ref: > course.id]
  title         varchar   [not null]
  url           text      [not null]
  resource_type varchar   [not null, note: 'LINK/ ARTICLE / DOCS / EXERCISE']
  display_order int       [not null, default: 0]
  created_at    timestamp [not null, default: `now()`]
}

Table skill {
  id                uuid      [pk]
  specialization_id uuid      [not null, ref: > specialization.id]
  name              varchar   [not null]
  is_active         boolean   [not null, default: true]
  created_at        timestamp [not null, default: `now()`]

  indexes {
    (specialization_id, name) [unique, note: 'skill name unique per specialization — BR-10']
  }
}

Table skill_alias {
  id       uuid    [pk]
  skill_id uuid    [not null, ref: > skill.id]
  alias    varchar [not null]
}

Table interest_option {
  id                uuid    [pk]
  specialization_id uuid    [not null, ref: > specialization.id]
  label             varchar [not null]
  is_active         boolean [not null, default: true]

  indexes {
    (specialization_id, label) [unique, note: 'label unique per specialization — BR-10']
  }
}

// ── CLUSTER 3: STUDENT PROFILE & ROADMAP ───────────────────

Table transcript_mapping_preset {
  id             uuid      [pk]
  preset_name    varchar   [not null]
  column_mapping jsonb     [not null, note: 'map Excel columns → system fields']
  is_default     boolean   [not null, default: false]
  created_at     timestamp [not null, default: `now()`]
}

Table student_profile {
  id                     uuid      [pk]
  user_id                uuid      [not null, unique, ref: - user_account.id]
  full_name              varchar
  student_code           varchar
  major_id               uuid      [ref: > major.id, note: 'self-declared (FT-14), not verified vs FAP — BR-23']
  specialization_id      uuid      [ref: > specialization.id]
  current_narrow_spec_id uuid      [ref: > narrow_spec.id]
  cumulative_gpa         decimal
  profile_updated_at     timestamp
}

Table transcript {
  id           uuid      [pk]
  student_id   uuid      [not null, ref: > student_profile.id]
  preset_id    uuid      [ref: > transcript_mapping_preset.id]
  file_name    varchar   [not null]
  file_path    text      [not null]
  parse_status varchar   [not null, default: 'PENDING', note: 'PENDING / SUCCESS / FAILED']
  parse_error  text
  uploaded_at  timestamp [not null, default: `now()`]
  parsed_at    timestamp
}

Table student_course_grade {
  id              uuid    [pk]
  transcript_id   uuid    [not null, ref: > transcript.id]
  course_id       uuid    [ref: > course.id, note: 'null if course_code_raw cannot be mapped']
  course_code_raw varchar [not null]
  grade           decimal
  status          varchar [not null, note: 'PASSED / FAILED / STUDYING']
}

Table course_skill_map {
  id        uuid [pk]
  course_id uuid [not null, ref: > course.id]
  skill_id  uuid [not null, ref: > skill.id]

  indexes {
    (course_id, skill_id) [unique]
  }
}

Table student_skill {
  id          uuid      [pk]
  student_id  uuid      [not null, ref: > student_profile.id]
  skill_id    uuid      [not null, ref: > skill.id]
  declared_at timestamp [not null, default: `now()`]

  indexes {
    (student_id, skill_id) [unique]
  }
}

Table student_interest {
  id                 uuid      [pk]
  student_id         uuid      [not null, ref: > student_profile.id]
  interest_option_id uuid      [not null, ref: > interest_option.id]
  declared_at        timestamp [not null, default: `now()`]

  indexes {
    (student_id, interest_option_id) [unique]
  }
}

Table personal_roadmap {
  id             uuid      [pk]
  student_id     uuid      [not null, ref: > student_profile.id]
  narrow_spec_id uuid      [not null, ref: > narrow_spec.id, note: 'source NS at clone time — BR-25']
  name           varchar   [not null]
  cloned_at      timestamp [not null, default: `now()`]
  updated_at     timestamp [not null, default: `now()`]
}

Table personal_roadmap_item {
  id                        uuid      [pk]
  roadmap_id                uuid      [not null, ref: > personal_roadmap.id]
  course_id                 uuid      [not null, ref: > course.id]
  progress_status           varchar   [not null, default: 'PLANNED', note: 'PLANNED / IN_PROGRESS / COMPLETED']
  is_removed_from_standard  boolean   [not null, default: false, note: 'BR-30: flag when course removed from Standard — do NOT delete from Personal Roadmap']
  updated_at                timestamp [not null, default: `now()`]

  indexes {
    (roadmap_id, course_id) [unique]
  }
}

Table roadmap_bookmark {
  id         uuid      [pk]
  roadmap_id uuid      [not null, ref: > personal_roadmap.id]
  course_id  uuid      [not null, ref: > course.id]
  created_at timestamp [not null, default: `now()`]

  indexes {
    (roadmap_id, course_id) [unique]
  }
}

Table roadmap_note {
  id         uuid      [pk]
  roadmap_id uuid      [not null, ref: > personal_roadmap.id]
  course_id  uuid      [not null, ref: > course.id]
  note       text      [not null]
  updated_at timestamp [not null, default: `now()`]

  indexes {
    (roadmap_id, course_id) [unique]
  }
}

Table transfer_impact_session {
  id                      uuid      [pk]
  student_id              uuid      [not null, ref: > student_profile.id]
  transfer_type           varchar   [not null, note: 'NARROW_SPEC / SPECIALIZATION']

  // NARROW_SPEC: from + to NS đủ
  // SPECIALIZATION: from NS + to Spec + to NS (NS cụ thể trong Spec mục tiêu)
  from_narrow_spec_id     uuid      [ref: > narrow_spec.id]
  to_narrow_spec_id       uuid      [ref: > narrow_spec.id]
  from_specialization_id  uuid      [ref: > specialization.id]
  to_specialization_id    uuid      [ref: > specialization.id, 
                                     note: 'NOT NULL khi transfer_type=SPECIALIZATION']

  courses_retained        jsonb     [note: 'đã học & đạt — miễn phí']
  courses_retake          jsonb     [note: 'đã học nhưng trượt — tính giá học lại']
  courses_new             jsonb     [note: 'chưa từng học — tính full cost']
  courses_wasted          jsonb     [note: 'đã học nhưng không dùng trong target curriculum']

  // Tách cost để hiển thị riêng dòng (BR-51)
  academic_cost           decimal   [not null, default: 0, 
                                     note: 'Σ retake cost + new courses cost']
  admin_fee               decimal   [not null, default: 2500000, 
                                     note: 'phí hành chính cố định BR-51']
  total_cost              decimal   [not null, default: 0, 
                                     note: 'academic_cost + admin_fee']

  // Tách ra khỏi difficulty_indicators để query được (BV-34)
  estimated_extra_terms   int       [not null, default: 0, 
                                     note: 'số kỳ bổ sung ước tính — BV-34 warn nếu ≥ 4']

  difficulty_indicators   jsonb     [note: 'các chỉ số khó khác ngoài term count']
  market_signals          jsonb     [note: 'job count, salary range, TW của NS mục tiêu']

  created_at              timestamp [not null, default: `now()`]
}

// ── CLUSTER 4: CONFIGURATION & RECOMMENDATION ──────────────

Table tag_map {
  id             uuid      [pk]
  narrow_spec_id uuid      [not null, ref: > narrow_spec.id]
  source_type    varchar   [not null, note: 'SKILL / INTEREST']
  source_id      uuid      [not null, note: 'FK → skill.id or interest_option.id']
  mapping_type   varchar   [not null, default: 'SHARED', note: 'DIRECT / SHARED']
  weight         decimal   [not null, default: 1.0]
  updated_at     timestamp [not null, default: `now()`]

  indexes {
    (narrow_spec_id, source_type, source_id) [unique]
  }
}

Table narrow_spec_weight_config {
  id             uuid      [pk]
  narrow_spec_id uuid      [not null, unique, ref: - narrow_spec.id]
  alpha_base     decimal   [not null, note: 'init from discipline_group; CM override per NS']
  w_gpa          decimal   [not null, default: 0.400]
  w_skill        decimal   [not null, default: 0.350]
  w_int          decimal   [not null, default: 0.250]
  updated_by     uuid      [not null, ref: > user_account.id]
  updated_at     timestamp [not null, default: `now()`]
}


Table narrow_spec_weight_config_audit {
  id             uuid      [pk]
  narrow_spec_id uuid      [not null, ref: > narrow_spec.id]
  alpha_base_old decimal
  alpha_base_new decimal
  w_gpa_old      decimal
  w_gpa_new      decimal
  w_skill_old    decimal
  w_skill_new    decimal
  w_int_old      decimal
  w_int_new      decimal
  changed_by     uuid      [not null, ref: > user_account.id]
  changed_at     timestamp [not null, default: `now()`]
  note           text
}

Table recommendation_result {
  id            uuid      [pk]
  student_id    uuid      [not null, ref: > student_profile.id]
  calculated_at timestamp [not null, default: `now()`]
}

Table recommendation_item {
  id                       uuid    [pk]
  result_id                uuid    [not null, ref: > recommendation_result.id]
  narrow_spec_id           uuid    [not null, ref: > narrow_spec.id]
  gpa_score                decimal [not null, note: '0–100']
  skill_score              decimal [not null, note: '0–100']
  interest_score           decimal [not null, note: '0–100']
  w_gpa_snapshot           decimal [not null, note: 'snapshot at calculation time']
  w_skill_snapshot         decimal [not null]
  w_int_snapshot           decimal [not null]
  profile_score            decimal [not null]
  trending_weight_snapshot decimal [note: 'null if TW not yet available']
  alpha_actual             decimal [not null]
  final_score              decimal [not null]
  rank                     int     [not null]
  fallback_applied         boolean [not null, default: false, note: 'true when S_vol < 100 — explainability text required']
  ai_explanation           text    [note: 'Gemini NL — lazy: top-1 auto; others on-demand']
  explanation_cached       boolean [not null, default: false]
}

// ── CLUSTER 5: HOLLAND ─────────────────────────────────────

Table holland_question {
  id               uuid    [pk]
  question_text    text    [not null]
  riasec_dimension varchar [not null, note: 'R / I / A / S / E / C']
  is_active        boolean [not null, default: true]
  display_order    int     [not null, default: 0]
}

Table holland_answer_option {
  id               uuid    [pk]
  option_text      text    [not null, note: 'e.g. 1-Hoàn toàn không đồng ý']
  weight           decimal [not null, note: 'Likert 1–5 — BR-32']
  note: 'Master Data: Only 5 shared records needed for the entire questionnaire'
}

Table holland_session {
  id            uuid      [pk]
  student_id    uuid      [not null, ref: > student_profile.id]
  status        varchar   [not null, default: 'IN_PROGRESS', note: 'IN_PROGRESS / COMPLETED']
  riasec_scores jsonb     [note: '{R:x, I:x, A:x, S:x, E:x, C:x}']
  completed_at  timestamp
  created_at    timestamp [not null, default: `now()`]
  // triggered_by enum note: TRANSFER_CONSIDERATION / MANUAL (open: FE-08 may only trigger TRANSFER_CONSIDERATION)
}

Table holland_response {
  id               uuid [pk]
  session_id       uuid [not null, ref: > holland_session.id]
  question_id      uuid [not null, ref: > holland_question.id]
  answer_option_id uuid [not null, ref: > holland_answer_option.id]

  indexes {
    (session_id, question_id) [unique]
  }
}

Table holland_result {
  id                        uuid      [pk]
  session_id                uuid      [not null, unique, ref: - holland_session.id]
  top_dimensions            varchar   [not null, note: 'e.g. ICR — top 3 RIASEC']
  career_label              text
  context_specialization_id uuid      [ref: > specialization.id, note: 'nullable if no transfer context']
  created_at                timestamp [not null, default: `now()`]
}

// CM cấu hình: mỗi chiều RIASEC đóng góp bao nhiêu điểm vào mỗi Specialization
Table holland_spec_weight {
  id               uuid    [pk]
  specialization_id uuid   [not null, ref: > specialization.id]
  riasec_dimension  varchar [not null, note: 'R / I / A / S / E / C']
  weight            decimal [not null, note: '0.0–1.0 — đóng góp của chiều này vào score của spec']
  updated_by        uuid    [ref: > user_account.id]
  updated_at        timestamp [not null, default: `now()`]

  indexes {
    (specialization_id, riasec_dimension) [unique]
  }
}


// ── CLUSTER 6: CRAWLER, TW & SYSTEM CONFIG ─────────────────

Table crawler_source {
  id            uuid      [pk]
  name          varchar   [not null]
  adapter_key   varchar   [not null, unique, note: 'vietnamworks — v1.0 only (EX-04)']
  is_enabled    boolean   [not null, default: true]
  schedule_cron varchar
  last_run_at   timestamp
}

Table crawl_batch {
  id                    uuid      [pk]
  source_id             uuid      [not null, ref: > crawler_source.id]
  triggered_by          uuid      [ref: > user_account.id, note: 'CM if manual; null if scheduled']
  scope_narrow_spec_id  uuid      [ref: > narrow_spec.id, note: 'null = crawl all NS; set = crawl specific NS']
  status                varchar   [not null, default: 'RUNNING', note: 'RUNNING / SUCCESS / FAILED']
  total_fetched         int       [not null, default: 0]
  total_parsed          int       [not null, default: 0]
  total_errors          int       [not null, default: 0]
  started_at            timestamp [not null, default: `now()`]
  finished_at           timestamp
}

Table raw_job {
  id               uuid    [pk]
  batch_id         uuid    [not null, ref: > crawl_batch.id]
  external_id      varchar
  title_raw        text
  raw_payload      jsonb   [not null]
  normalize_status varchar [not null, default: 'PENDING', note: 'PENDING / SUCCESS / FAILED']
  normalize_error  text
}

Table job_normalized {
  id             uuid    [pk]
  raw_id         uuid    [not null, ref: > raw_job.id]
  narrow_spec_id uuid    [ref: > narrow_spec.id, note: 'null if AI cannot map']
  title          varchar
  job_level      varchar [note: 'Intern / Fresher / Junior / Senior']
  salary_range   varchar
  location       varchar
  posted_date    date
}

Table narrow_spec_career {
  id               uuid      [pk]
  narrow_spec_id   uuid      [not null, ref: > narrow_spec.id]
  batch_id         uuid      [not null, ref: > crawl_batch.id]
  job_title        varchar   [not null]
  occurrence_count int       [not null, default: 1]
  extracted_at     timestamp [not null, default: `now()`]
}

Table trending_weight_proposal {
  id             uuid      [pk]
  batch_id       uuid      [not null, ref: > crawl_batch.id]
  narrow_spec_id uuid      [not null, ref: > narrow_spec.id]
  sacc           decimal   [not null, note: 'growth rate score 0–1']
  svol           decimal   [not null, note: 'volume score 0–1']
  junior_ratio   decimal   [not null, note: 'fresher/junior ratio 0–1']
  proposed_tw    decimal   [not null, note: 'TW = 0.5*sacc + 0.3*svol + 0.2*junior_ratio, scaled 0–100']
  current_tw     decimal   [note: 'current TW — shown as before/after for CM review']
  status         varchar   [not null, default: 'PENDING', note: 'PENDING / APPROVED / REJECTED']
  reviewed_by    uuid      [ref: > user_account.id]
  reviewed_at    timestamp

  indexes {
    (batch_id, narrow_spec_id) [unique]
  }
}

Table trending_weight_current {
  id                        uuid      [pk]
  narrow_spec_id            uuid      [not null, unique, ref: - narrow_spec.id]
  trending_weight           decimal   [not null, note: '0–100']
  approved_from_proposal_id uuid      [ref: > trending_weight_proposal.id]
  effective_from            timestamp [not null, default: `now()`]
}

Table trending_weight_history {
  id              uuid      [pk]
  narrow_spec_id  uuid      [not null, ref: > narrow_spec.id]
  trending_weight decimal   [not null]
  sacc            decimal
  svol            decimal
  junior_ratio    decimal
  approved_by     uuid      [not null, ref: > user_account.id]
  batch_id        uuid      [ref: > crawl_batch.id]
  effective_from  timestamp [not null, default: `now()`]
  note            text      [note: '"ROLLBACK" if this was a rollback action']
}

Table system_config {
  id           uuid      [pk]
  config_key   varchar   [not null, unique]
  config_value text      [not null]
  description  text
  updated_at   timestamp [not null, default: `now()`]
}

Table ai_api_usage_log {
  id           uuid      [pk]
  provider     varchar   [not null, note: 'gemini (default, swappable per LI-03)']
  purpose      varchar   [not null, note: 'CRAWL_NORMALIZE / RECOMMENDATION_EXPLAIN']
  reference_id uuid      [note: 'recommendation_item.id or crawl_batch.id — trace on quota exceeded']
  token_count  int       [not null]
  called_at    timestamp [not null, default: `now()`]
}



