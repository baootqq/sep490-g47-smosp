import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import Layout from '../../components/layout/Layout'
import './CmDashboard.css'

/* ── Mock data — thay bằng GET /api/cm/dashboard ─────────────── */
const MOCK = {
  name: 'Nguyễn Thị B',
  catalog: {
    nsPublished: 12,
    nsDraft: 3,
    majorActive: 5,
    specializationActive: 18,
  },
  alerts: {
    contentErrorPending: 3,      // content_error_report WHERE status='PENDING'
    semesterDaysLeft: 14,        // từ system_config semester schedule; null nếu không có
    twProposalPending: 5,        // trending_weight_proposal WHERE status='PENDING'
    crawlParseErrors: 0,         // crawl_batch gần nhất: total_errors
    hollandSpecUnconfigured: 2,  // specialization chưa có bất kỳ holland_spec_weight nào
    hollandDimBelowMin: 'C',     // chiều nào < 5 câu active; null nếu ổn
  },
  crawl: {
    lastBatchStatus: 'SUCCESS',  // RUNNING | SUCCESS | FAILED
    lastBatchAt: '22/06/2026 · 02:00',
    source: 'VietnamWorks',
    totalFetched: 847,
    parseErrors: 0,
    twChanged: 5,
    nextScheduleDays: 7,
  },
  compatScore: {
    wGpa: 40,
    wSkill: 35,
    wMarket: 25,
    lastUpdatedAt: '15/06/2026',
  },
  holland: {
    // trung bình trọng số các Specialization từ holland_spec_weight
    avgWeights: { R: 0.55, I: 0.80, A: 0.30, S: 0.45, E: 0.60, C: 0.40 },
    specUnconfigured: 2,
  },
  questionBank: {
    // holland_question WHERE is_active=true, group by riasec_dimension
    counts: { R: 8, I: 8, A: 8, S: 8, E: 8, C: 4 },
    minRequired: 5, // BV-26
  },
}

const RIASEC_LABELS = {
  R: 'Realistic', I: 'Investigative', A: 'Artistic',
  S: 'Social', E: 'Enterprising', C: 'Conventional',
}

/* ── Scroll reveal hook ──────────────────────────────────────── */
function useReveal(ref) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return visible
}

/* ── Chart: stacked bar — Compatibility Score weights ────────── */
function WeightBarChart({ wGpa, wSkill, wMarket }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current || !window.Chart) return
    const c = new window.Chart(ref.current, {
      type: 'bar',
      data: {
        labels: ['Trọng số hiện tại'],
        datasets: [
          {
            label: 'Học thuật (GPA)',
            data: [wGpa],
            backgroundColor: '#034EA2',
            borderRadius: 0,
            borderSkipped: false,
            stack: 's',
          },
          {
            label: 'Kỹ năng / Sở thích',
            data: [wSkill],
            backgroundColor: '#51B848',
            borderRadius: 0,
            borderSkipped: false,
            stack: 's',
          },
          {
            label: 'Thị trường (TW)',
            data: [wMarket],
            backgroundColor: '#F37021',
            borderRadius: 6,
            borderSkipped: false,
            stack: 's',
          },
        ],
      },
      options: {
        responsive: false,
        indexAxis: 'y',
        animation: { duration: 1000, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (c) => `${c.dataset.label}: ${c.raw}%` },
          },
        },
        scales: {
          x: {
            min: 0, max: 100, stacked: true,
            ticks: { font: { size: 11, family: 'Be Vietnam Pro' }, callback: (v) => `${v}%` },
            grid: { color: 'rgba(0,0,0,0.05)' },
          },
          y: { stacked: true, display: false },
        },
      },
    })
    return () => c.destroy()
  }, [wGpa, wSkill, wMarket])
  return (
    <canvas
      ref={ref}
      width={360} height={52}
      role="img"
      aria-label={`Trọng số: GPA ${wGpa}%, Kỹ năng ${wSkill}%, TW ${wMarket}%`}
    />
  )
}



/* ── Main ────────────────────────────────────────────────────── */
export default function CmDashboard() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'Content Manager'
  const d = MOCK /* TODO: useState + useEffect → GET /api/cm/dashboard */

  /* Refs cho từng section */
  const catalogRef = useRef(null)
  const crawlRef = useRef(null)
  const configRef = useRef(null)

  const catalogVisible = useReveal(catalogRef)
  const crawlVisible = useReveal(crawlRef)
  const configVisible = useReveal(configRef)

  /* Weight bar + Holland — animate khi configRef visible */
  const [barsReady, setBarsReady] = useState(false)
  useEffect(() => {
    if (configVisible) setTimeout(() => setBarsReady(true), 150)
  }, [configVisible])



  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const crawlStatusMap = {
    SUCCESS: { label: 'thành công', cls: 'success' },
    FAILED: { label: 'thất bại', cls: 'danger' },
    RUNNING: { label: 'đang chạy', cls: 'warning' },
  }
  const crawlStatus = crawlStatusMap[d.crawl.lastBatchStatus] ?? { label: d.crawl.lastBatchStatus, cls: 'neutral' }

  return (
    <Layout
      role="cm"
      user={{ name: username }}
      breadcrumbs={[{ label: 'Dashboard' }]}
      onLogout={handleLogout}
      onLogoClick={() => navigate('/')}
      onGoHome={() => navigate('/')}
    >
      <div className="cm-page">

        {/* ── CATALOG & CRAWLER ─────────────────────────── */}
        <div
          ref={catalogRef}
          className={`cm-reveal${catalogVisible ? ' cm-visible' : ''}`}
        >
          <div className="cm-sec-title">Catalog &amp; Crawler</div>
          <div className="cm-row-2">

            {/* Catalog card */}
            <div className="cm-card">
              <div className="cm-ctitle">Tình trạng catalog</div>

              <div className="cm-stat-grid">
                <div className="cm-stat-box">
                  <div className="cm-stat-box__num cm-stat-box__num--blue">{d.catalog.nsPublished}</div>
                  <div className="cm-stat-box__lbl">NS published</div>
                </div>
                <div className="cm-stat-box">
                  <div className="cm-stat-box__num cm-stat-box__num--muted">{d.catalog.nsDraft}</div>
                  <div className="cm-stat-box__lbl">Đang draft</div>
                </div>
                <div className="cm-stat-box">
                  <div className="cm-stat-box__num">{d.catalog.majorActive}</div>
                  <div className="cm-stat-box__lbl">Major hiển thị</div>
                </div>
                <div className="cm-stat-box">
                  <div className="cm-stat-box__num">{d.catalog.specializationActive}</div>
                  <div className="cm-stat-box__lbl">Specialization active</div>
                </div>
              </div>

              <div className="cm-divider" />

              {/* Alerts thuộc catalog */}
              <div className="cm-alert-list">
                {d.alerts.contentErrorPending > 0 ? (
                  <button
                    className="cm-alert-row cm-alert-row--danger"
                    onClick={() => navigate('/cm/content-errors')}
                  >
                    <span className="cm-alert-row__dot" />
                    <span className="cm-alert-row__text">
                      {d.alerts.contentErrorPending} báo cáo lỗi nội dung chưa xử lý
                    </span>
                    <span className="cm-alert-row__action">Xem →</span>
                  </button>
                ) : (
                  <div className="cm-alert-row cm-alert-row--ok">
                    <span className="cm-alert-row__dot" />
                    <span className="cm-alert-row__text">Không có báo cáo lỗi nào đang chờ</span>
                  </div>
                )}

                {d.alerts.semesterDaysLeft !== null && (
                  <button
                    className="cm-alert-row cm-alert-row--info"
                    onClick={() => navigate('/cm/curriculum')}
                  >
                    <span className="cm-alert-row__dot" />
                    <span className="cm-alert-row__text">
                      Học kỳ mới sau {d.alerts.semesterDaysLeft} ngày — review curriculum
                    </span>
                    <span className="cm-alert-row__action">Xem →</span>
                  </button>
                )}
              </div>

              <button className="cm-btn-fill-blue" onClick={() => navigate('/cm/catalog')}>
                Quản lý catalog
              </button>
            </div>

            {/* Crawler card */}
            <div className="cm-card">
              <div className="cm-ctitle">Crawler — {d.crawl.source}</div>

              <div className="cm-crawl-status">
                <span className={`cm-crawl-dot cm-crawl-dot--${crawlStatus.cls}`} />
                <span className="cm-crawl-status__text">
                  Batch gần nhất: <strong>{crawlStatus.label}</strong>
                </span>
              </div>
              <p className="cm-crawl-meta">{d.crawl.lastBatchAt}</p>

              <div className="cm-stat-grid">
                <div className="cm-stat-box">
                  <div className="cm-stat-box__num">{d.crawl.totalFetched.toLocaleString('vi-VN')}</div>
                  <div className="cm-stat-box__lbl">Jobs crawled</div>
                </div>
                <div className="cm-stat-box">
                  <div className={`cm-stat-box__num${d.crawl.parseErrors > 0 ? ' cm-stat-box__num--danger' : ' cm-stat-box__num--green'}`}>
                    {d.crawl.parseErrors}
                  </div>
                  <div className="cm-stat-box__lbl">Parse errors</div>
                </div>
                <div className="cm-stat-box">
                  <div className="cm-stat-box__num">{d.crawl.twChanged}</div>
                  <div className="cm-stat-box__lbl">TW thay đổi</div>
                </div>
                <div className="cm-stat-box">
                  <div className="cm-stat-box__num">{d.crawl.nextScheduleDays} ngày</div>
                  <div className="cm-stat-box__lbl">Lịch kế tiếp</div>
                </div>
              </div>

              <div className="cm-divider" />

              <div className="cm-alert-list">
                {d.alerts.twProposalPending > 0 ? (
                  <button
                    className="cm-alert-row cm-alert-row--warning"
                    onClick={() => navigate('/cm/trending-weight')}
                  >
                    <span className="cm-alert-row__dot" />
                    <span className="cm-alert-row__text">
                      {d.alerts.twProposalPending} đề xuất Trending Weight chờ phê duyệt
                    </span>
                    <span className="cm-alert-row__action">Xem →</span>
                  </button>
                ) : (
                  <div className="cm-alert-row cm-alert-row--ok">
                    <span className="cm-alert-row__dot" />
                    <span className="cm-alert-row__text">Không có đề xuất TW nào đang chờ</span>
                  </div>
                )}

                {d.alerts.crawlParseErrors > 0 && (
                  <button
                    className="cm-alert-row cm-alert-row--danger"
                    onClick={() => navigate('/cm/crawl-logs')}
                  >
                    <span className="cm-alert-row__dot" />
                    <span className="cm-alert-row__text">
                      {d.alerts.crawlParseErrors} parse error trong batch gần nhất
                    </span>
                    <span className="cm-alert-row__action">Xem log →</span>
                  </button>
                )}
              </div>

              <button
                className="cm-btn-fill-navy"
                onClick={() => navigate('/cm/trending-weight')}
              >
                Xem Trending Weight
              </button>
            </div>
          </div>
        </div>

        {/* ── CRAWLER trigger riêng — nằm ngoài card ────── */}
        <div
          ref={crawlRef}
          className={`cm-reveal${crawlVisible ? ' cm-visible' : ''}`}
          style={{ transitionDelay: '80ms' }}
        >
          <div className="cm-trigger-bar">
            <div className="cm-trigger-bar__left">
              <span className="cm-trigger-bar__label">Crawl thủ công</span>
              <span className="cm-trigger-bar__sub">
                Chạy ngay, không theo lịch — kết quả sẽ tạo đề xuất TW mới
              </span>
            </div>
            <button
              className="cm-btn-outline"
              onClick={() => {
                /* TODO: POST /api/cm/crawl/trigger */
                alert('Trigger crawl — connect API')
              }}
            >
              ▶ Trigger crawl
            </button>
          </div>
        </div>

        {/* ── CONFIGURATION ─────────────────────────────── */}
        <div
          ref={configRef}
          className={`cm-reveal${configVisible ? ' cm-visible' : ''}`}
          style={{ transitionDelay: '80ms' }}
        >
          <div className="cm-sec-title">Cấu hình hệ thống</div>
          <div className="cm-row-2">

            {/* Compatibility Score card */}
            <div className="cm-card">
              <div className="cm-ctitle">Compatibility Score</div>
              <p className="cm-card-sub">Trọng số toàn cục (tổng = 100%)</p>

              <div className="cm-weight-chart-wrap">
                <WeightBarChart
                  wGpa={d.compatScore.wGpa}
                  wSkill={d.compatScore.wSkill}
                  wMarket={d.compatScore.wMarket}
                />
              </div>

              <div className="cm-weight-legend">
                {[
                  { color: '#034EA2', label: 'Học thuật (GPA)', pct: d.compatScore.wGpa },
                  { color: '#51B848', label: 'Kỹ năng / Sở thích', pct: d.compatScore.wSkill },
                  { color: '#F37021', label: 'Thị trường (TW)', pct: d.compatScore.wMarket },
                ].map(({ color, label, pct }) => (
                  <div key={label} className="cm-wleg-row">
                    <div className="cm-wleg-dot" style={{ background: color }} />
                    <span className="cm-wleg-label">{label}</span>
                    <span className="cm-wleg-pct">{pct}%</span>
                  </div>
                ))}
              </div>

              <p className="cm-card-updated">Cập nhật lần cuối: {d.compatScore.lastUpdatedAt}</p>

              <button className="cm-btn-outline" onClick={() => navigate('/cm/compat-score-config')}>
                Chỉnh trọng số
              </button>
            </div>



            {/* Question Bank card */}
            <div className="cm-card">
              <div className="cm-ctitle">Question Bank</div>
              <p className="cm-card-sub">Câu hỏi Holland đang active</p>

              <div className="cm-qb-list">
                {Object.entries(d.questionBank.counts).map(([dim, count]) => {
                  const isLow = count < d.questionBank.minRequired
                  const barPct = Math.min((count / 20) * 100, 100)
                  return (
                    <div key={dim} className="cm-qb-row">
                      <span className="cm-qb-dim">{dim}</span>
                      <span className="cm-qb-name">{RIASEC_LABELS[dim]}</span>
                      <div className="cm-qb-track">
                        <div
                          className={`cm-qb-fill${isLow ? ' cm-qb-fill--low' : ''}`}
                          style={{
                            width: barsReady ? `${barPct}%` : '0%',
                            transitionDelay: `${Object.keys(d.questionBank.counts).indexOf(dim) * 50}ms`,
                          }}
                        />
                      </div>
                      <span className={`cm-qb-count${isLow ? ' cm-qb-count--low' : ''}`}>
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>

              <p className="cm-card-sub" style={{ marginTop: 8 }}>
                Tối thiểu {d.questionBank.minRequired} câu/chiều (BV-26)
              </p>

              <div className="cm-alert-list" style={{ marginTop: 8 }}>
                {d.alerts.hollandDimBelowMin && (
                  <button
                    className="cm-alert-row cm-alert-row--warning"
                    onClick={() => navigate('/cm/questions')}
                  >
                    <span className="cm-alert-row__dot" />
                    <span className="cm-alert-row__text">
                      Chiều {d.alerts.hollandDimBelowMin} gần ngưỡng tối thiểu (≥{d.questionBank.minRequired} câu)
                    </span>
                    <span className="cm-alert-row__action">Thêm →</span>
                  </button>
                )}
              </div>

              <button className="cm-btn-fill-blue" onClick={() => navigate('/cm/questions')}>
                Quản lý câu hỏi
              </button>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  )
}