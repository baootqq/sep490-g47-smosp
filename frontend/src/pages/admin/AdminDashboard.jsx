import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import Layout from '../../components/layout/Layout'
import './AdminDashboard.css'

/* ── Mock data — thay bằng GET /api/admin/dashboard ─────────── */
const MOCK = {
  metrics: {
    totalAccounts: 1248,   // COUNT(*) FROM user_account
    nsPublished: 12,       // COUNT(*) FROM narrow_spec WHERE is_published=true
    twPending: 5,          // COUNT(*) FROM trending_weight_proposal WHERE status='PENDING'
    systemAlerts: 2,       // COUNT(*) FROM notification WHERE type='SYSTEM_ALERT' AND is_read=false
  },
  users: [
    { id: '1', display: 'Nguyễn Văn A', sub: 'nguyenvana@gmail.com', role: 'STUDENT', status: 'ACTIVE' },
    { id: '2', display: 'cm_user01', sub: 'Content Manager', role: 'CM', status: 'ACTIVE' },
    { id: '3', display: 'Trần Thị B', sub: 'tranthibb@gmail.com', role: 'STUDENT', status: 'INACTIVE' },
    { id: '4', display: 'admin_root', sub: 'System Admin', role: 'ADMIN', status: 'ACTIVE' },
  ],
  alerts: [
    { id: 'a1', level: 'danger', text: 'Crawl batch 22/06 thất bại — VietnamWorks adapter timeout', action: 'Xem log', nav: '/admin/crawl-logs' },
    { id: 'a2', level: 'danger', text: 'Gemini API quota exceeded — CRAWL_NORMALIZE pipeline bị block', action: 'Cấu hình', nav: '/admin/ai-config' },
    { id: 'a3', level: 'warning', text: '5 TW proposals chưa xử lý sau 5 ngày (auto-reject sau 7 ngày)', action: 'Xem', nav: '/admin/crawl-logs' },
    { id: 'a4', level: 'warning', text: '3 content_error_report đã PENDING > 14 ngày', action: 'Xem', nav: '/admin/crawl-logs' },
  ],
  crawlLog: [
    { batchAt: '22/06/2026 · 02:00', status: 'FAILED', jobs: null },
    { batchAt: '15/06/2026 · 02:00', status: 'SUCCESS', jobs: 847 },
    { batchAt: '08/06/2026 · 02:00', status: 'SUCCESS', jobs: 912 },
  ],
  crawler: {
    adapters: [
      { key: 'vietnamworks', name: 'VietnamWorks', version: 'v1.0', enabled: true },
      { key: 'topdev', name: 'TopDev', version: 'chưa cài', enabled: false, disabled: true },
    ],
    cronSchedule: '0 2 */7 * *',
    nextRunDays: 7,
    scope: 'Tất cả NS',
  },
  aiConfig: {
    provider: 'Gemini',
    model: 'gemini-1.5-flash',
    apiKeyMasked: '••••••••k7X2',
    // purpose → { used, quota }
    tokenUsage: {
      CRAWL_NORMALIZE: { used: 892450, quota: 1000000 },
      RECOMMENDATION_EXPLAIN: { used: 124300, quota: 500000 },
    },
    // status từ last API call: OK | QUOTA_EXCEEDED | ERROR
    status: 'QUOTA_EXCEEDED',
  },
  transcriptPresets: [
    { id: 'p1', name: 'FPT Standard 2024', cols: 7, updatedAt: '10/05/2026', isDefault: true },
    { id: 'p2', name: 'FPT Legacy 2022', cols: 6, updatedAt: '02/01/2024', isDefault: false },
    { id: 'p3', name: 'FPT HCM 2023', cols: 7, updatedAt: '15/03/2024', isDefault: false },
  ],
  tuition: {
    year: '2025–2026',
    retakePricePerCredit: 1840000,
    adminFee: 2500000,
    updatedBy: 'Admin',
    updatedAt: '01/09/2025',
  },
  // Dữ liệu cho token usage chart (ai_api_usage_log, group by called_at::date, 7 ngày)
  tokenChart: {
    labels: ['20/06', '21/06', '22/06', '23/06', '24/06', '25/06', '26/06'],
    crawl: [102000, 98000, 145000, 0, 87000, 110000, 95000],
    explain: [18000, 22000, 19000, 0, 24000, 20000, 21300],
  },
}

/* ── Scroll reveal hook ──────────────────────────────────────── */
function useReveal(ref) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return visible
}

/* ── Token usage chart (Chart.js stacked bar) ────────────────── */
function TokenUsageChart({ data }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current || !window.Chart) return
    const c = new window.Chart(ref.current, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'CRAWL_NORMALIZE',
            data: data.crawl,
            backgroundColor: '#034EA2',
            borderRadius: 0,
            borderSkipped: false,
            stack: 's',
          },
          {
            label: 'RECOMMENDATION_EXPLAIN',
            data: data.explain,
            backgroundColor: '#51B848',
            borderRadius: 4,
            borderSkipped: false,
            stack: 's',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => `${c.dataset.label}: ${c.raw.toLocaleString('vi-VN')} tokens`,
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: { font: { size: 11, family: 'Be Vietnam Pro' } },
            grid: { display: false },
          },
          y: {
            stacked: true,
            ticks: {
              font: { size: 11, family: 'Be Vietnam Pro' },
              callback: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v,
            },
            grid: { color: 'rgba(0,0,0,0.04)' },
          },
        },
      },
    })
    return () => c.destroy()
  }, [data])
  return (
    <div className="ad-chart-wrap">
      <canvas
        ref={ref}
        role="img"
        aria-label="Token usage 7 ngày gần nhất"
      />
    </div>
  )
}

/* ── Helpers ─────────────────────────────────────────────────── */
const ROLE_LABELS = { STUDENT: 'Student', CM: 'CM', ADMIN: 'Admin' }

function roleCls(role) {
  return { STUDENT: 'ad-rb-student', CM: 'ad-rb-cm', ADMIN: 'ad-rb-admin' }[role] ?? ''
}

function fmtCurrency(n) {
  return n.toLocaleString('vi-VN') + ' ₫'
}

function fmtPct(used, quota) {
  return Math.round((used / quota) * 100)
}

/* ── Main ────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'Admin'
  const d = MOCK /* TODO: useState + useEffect → GET /api/admin/dashboard */

  /* Refs */
  const metricsRef = useRef(null)
  const usersRef = useRef(null)
  const configRef = useRef(null)

  const metricsVisible = useReveal(metricsRef)
  const usersVisible = useReveal(usersRef)
  const configVisible = useReveal(configRef)

  /* Token bar animation */
  const [barsReady, setBarsReady] = useState(false)
  useEffect(() => {
    if (configVisible) setTimeout(() => setBarsReady(true), 150)
  }, [configVisible])

  /* User filter state */
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const filteredUsers = d.users.filter((u) => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter
    const matchSearch = !search || u.display.toLowerCase().includes(search.toLowerCase()) || u.sub.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchStatus && matchSearch
  })

  const handleLogout = async () => { await logout(); navigate('/login') }

  const aiStatusMap = {
    OK: { label: 'Hoạt động bình thường', cls: 'success' },
    QUOTA_EXCEEDED: { label: 'Quota exceeded', cls: 'danger' },
    ERROR: { label: 'Lỗi kết nối', cls: 'danger' },
  }
  const aiStatus = aiStatusMap[d.aiConfig.status] ?? { label: d.aiConfig.status, cls: 'neutral' }

  return (
    <Layout
      role="admin"
      user={{ name: username }}
      breadcrumbs={[{ label: 'Dashboard' }]}
      onLogout={handleLogout}
      onLogoClick={() => navigate('/')}
      onGoHome={() => navigate('/')}
    >
      <div className="ad-page">

        {/* ── METRIC CARDS — FT-59 / UC-90 ─────────────── */}
        <div
          ref={metricsRef}
          className={`ad-reveal${metricsVisible ? ' ad-visible' : ''}`}
        >
          <div className="ad-sec-title">Tổng quan hệ thống</div>
          <div className="ad-metrics">
            {[
              { num: d.metrics.totalAccounts.toLocaleString('vi-VN'), lbl: 'Tổng tài khoản', nav: '/admin/users', cls: 'blue' },
              { num: d.metrics.nsPublished, lbl: 'NS đang published', nav: '/admin/catalog', cls: 'green' },
              { num: d.metrics.twPending, lbl: 'TW proposals pending', nav: '/cm/trending-weight', cls: 'orange' },
              { num: d.metrics.systemAlerts, lbl: 'System alerts', nav: '/admin/alerts', cls: 'red' },
            ].map(({ num, lbl, nav, cls }) => (
              <button
                key={lbl}
                className="ad-metric-card"
                onClick={() => navigate(nav)}
                type="button"
              >
                <div className={`ad-metric-num ad-metric-num--${cls}`}>{num}</div>
                <div className="ad-metric-lbl">{lbl}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── ROW 1: User Management + System Alerts ────── */}
        <div
          ref={usersRef}
          className={`ad-reveal${usersVisible ? ' ad-visible' : ''}`}
          style={{ transitionDelay: '60ms' }}
        >
          <div className="ad-row-2">

            {/* User Management — FT-51, 52, 53 */}
            <div className="ad-card">
              <div className="ad-ch">
                <div className="ad-ch-left">
                  <span className="ad-ctitle">Quản lý người dùng</span>
                  <span className="ad-cmeta">FT-51 · 52 · 53</span>
                </div>
                <button
                  className="ad-btn-primary"
                  onClick={() => navigate('/admin/users/create')}
                  type="button"
                >
                  + Tạo tài khoản
                </button>
              </div>

              <div className="ad-cb">


                {/* Table */}
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>Tên / định danh</th>
                      <th>Role</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="ad-user-name">{u.display}</div>
                          <div className="ad-user-sub">{u.sub}</div>
                        </td>
                        <td>
                          <span className={`ad-role-badge ${roleCls(u.role)}`}>
                            {ROLE_LABELS[u.role]}
                          </span>
                        </td>
                        <td>
                          <span className={`ad-status-indicator ad-status-indicator--${u.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                            {u.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="ad-table-footer">
                  Hiển thị {filteredUsers.length} / {d.metrics.totalAccounts.toLocaleString('vi-VN')} tài khoản
                </p>
              </div>

              <button className="ad-btn-nav" onClick={() => navigate('/admin/users')} type="button">
                Xem toàn bộ danh sách →
              </button>
            </div>

            {/* System Alerts + Crawl Log — FT-11, FT-48 */}
            <div className="ad-card">
              <div className="ad-ch">
                <div className="ad-ch-left">
                  <span className="ad-ctitle">System alerts</span>
                  <span className="ad-cmeta">FT-11 · UC-96</span>
                </div>
              </div>

              <div className="ad-cb">
                <div className="ad-alert-list">
                  {d.alerts.map((a) => (
                    <button
                      key={a.id}
                      className={`ad-alert-row ad-alert-row--${a.level}`}
                      onClick={() => navigate(a.nav)}
                      type="button"
                    >
                      <span className="ad-alert-dot" />
                      <span className="ad-alert-text">{a.text}</span>
                      <span className="ad-alert-action">{a.action} →</span>
                    </button>
                  ))}
                </div>

                <div className="ad-divider" />
                <div className="ad-sub-title">Crawl log gần nhất — FT-48</div>

                {d.crawlLog.map((log, i) => (
                  <div key={i} className="ad-srow">
                    <span className="ad-srow-lbl">
                      <span className={`ad-dot ad-dot--${log.status === 'SUCCESS' ? 'green' : 'red'}`} />
                      {log.batchAt}
                    </span>
                    <span className={`ad-srow-val${log.status === 'FAILED' ? ' ad-srow-val--danger' : ' ad-srow-val--success'}`}>
                      {log.status === 'SUCCESS' ? `SUCCESS · ${log.jobs.toLocaleString('vi-VN')} jobs` : 'FAILED'}
                    </span>
                  </div>
                ))}
              </div>

              <button className="ad-btn-nav" onClick={() => navigate('/admin/crawl-logs')} type="button">
                Xem toàn bộ crawl log →
              </button>
            </div>

          </div>
        </div>

        {/* ── ROW 2: Crawler Config + AI API + Transcript & Học phí ── */}
        <div
          ref={configRef}
          className={`ad-reveal${configVisible ? ' ad-visible' : ''}`}
          style={{ transitionDelay: '80ms' }}
        >
          <div className="ad-row-3">

            {/* Crawler Config — FT-54, 55 */}
            <div className="ad-card">
              <div className="ad-ch">
                <div className="ad-ch-left">
                  <span className="ad-ctitle">Crawler config</span>
                  <span className="ad-cmeta">FT-54 · 55</span>
                </div>
              </div>

              <div className="ad-cb">
                <div className="ad-sub-title">Adapter sources</div>

                {d.crawler.adapters.map((adapter) => (
                  <div key={adapter.key} className="ad-adapter-row">
                    <div className="ad-adapter-info">
                      <span className="ad-adapter-name">
                        {adapter.name}
                        {adapter.disabled && (
                          <span className="ad-adapter-planned"> (planned)</span>
                        )}
                      </span>
                      <span className="ad-adapter-sub">{adapter.key} · {adapter.version}</span>
                    </div>
                    <button
                      className="ad-btn-ghost-sm"
                      disabled={adapter.disabled}
                      type="button"
                    >
                      Test
                    </button>
                    <div
                      className={`ad-toggle${adapter.enabled ? ' ad-toggle--on' : ' ad-toggle--off'}`}
                      role="switch"
                      aria-checked={adapter.enabled}
                      aria-label={`${adapter.name} ${adapter.enabled ? 'đang bật' : 'đang tắt'}`}
                    >
                      <div className="ad-toggle-knob" />
                    </div>
                  </div>
                ))}

                <div className="ad-divider" />
                <div className="ad-sub-title">Lịch crawl tự động</div>

                <div className="ad-srow">
                  <span className="ad-srow-lbl">Cron schedule</span>
                  <code className="ad-code">{d.crawler.cronSchedule}</code>
                </div>
                <div className="ad-srow">
                  <span className="ad-srow-lbl">Chạy tiếp theo</span>
                  <span className="ad-srow-val">{d.crawler.nextRunDays} ngày nữa</span>
                </div>
                <div className="ad-srow">
                  <span className="ad-srow-lbl">Scope mặc định</span>
                  <span className="ad-srow-val ad-srow-val--muted">{d.crawler.scope}</span>
                </div>
              </div>

              <button className="ad-btn-nav" onClick={() => navigate('/admin/crawler-config')} type="button">
                Cấu hình crawler →
              </button>
            </div>

            {/* AI API Config — FT-56 */}
            <div className="ad-card">
              <div className="ad-ch">
                <div className="ad-ch-left">
                  <span className="ad-ctitle">AI API config</span>
                  <span className="ad-cmeta">FT-56 · UC-78</span>
                </div>
              </div>

              <div className="ad-cb">
                <div className="ad-sub-title">Provider hiện tại</div>

                <div className="ad-srow">
                  <span className="ad-srow-lbl">Provider</span>
                  <span className="ad-srow-val">{d.aiConfig.provider} (default)</span>
                </div>
                <div className="ad-srow">
                  <span className="ad-srow-lbl">Model</span>
                  <code className="ad-code">{d.aiConfig.model}</code>
                </div>
                <div className="ad-srow">
                  <span className="ad-srow-lbl">API key</span>
                  <span className="ad-srow-val ad-srow-val--muted">{d.aiConfig.apiKeyMasked}</span>
                </div>
                <div className="ad-srow">
                  <span className="ad-srow-lbl">Status</span>
                  <span className={`ad-status-badge ad-status-badge--${aiStatus.cls}`}>
                    {aiStatus.label}
                  </span>
                </div>

                <div className="ad-divider" />
                <div className="ad-sub-title">Token usage 7 ngày — ai_api_usage_log</div>

                {/* Chart */}
                <TokenUsageChart data={d.tokenChart} />

                {/* Legend */}
                <div className="ad-token-legend">
                  {[
                    { color: '#034EA2', label: 'CRAWL_NORMALIZE', key: 'CRAWL_NORMALIZE' },
                    { color: '#51B848', label: 'RECOMMENDATION_EXPLAIN', key: 'RECOMMENDATION_EXPLAIN' },
                  ].map(({ color, label, key }) => {
                    const { used, quota } = d.aiConfig.tokenUsage[key]
                    const pct = fmtPct(used, quota)
                    return (
                      <div key={key} className="ad-token-leg-row">
                        <div className="ad-token-leg-dot" style={{ background: color }} />
                        <span className="ad-token-leg-lbl">{label}</span>
                        <div className="ad-token-bar-bg">
                          <div
                            className="ad-token-bar-fill"
                            style={{
                              width: barsReady ? `${pct}%` : '0%',
                              background: pct >= 80 ? '#F37021' : color,
                            }}
                          />
                        </div>
                        <span className="ad-token-pct">{pct}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <button className="ad-btn-nav" onClick={() => navigate('/admin/ai-config')} type="button">
                Đổi provider / API key →
              </button>
            </div>

            {/* Transcript Preset + Retake Price — FT-57, 58 */}
            <div className="ad-card">
              <div className="ad-ch">
                <div className="ad-ch-left">
                  <span className="ad-ctitle">Cấu hình transcript</span>
                  <span className="ad-cmeta">FT-57 · 58</span>
                </div>
                <button
                  className="ad-btn-primary"
                  onClick={() => navigate('/admin/transcript-presets/create')}
                  type="button"
                >
                  + Preset
                </button>
              </div>

              <div className="ad-cb">
                <div className="ad-sub-title">Column mapping presets</div>

                {d.transcriptPresets.map((p) => (
                  <div key={p.id} className="ad-preset-row">
                    <div className="ad-preset-info">
                      <span className="ad-preset-name">{p.name}</span>
                      <span className="ad-preset-sub">{p.cols} cột · {p.updatedAt}</span>
                    </div>
                    {p.isDefault
                      ? <span className="ad-default-badge">Mặc định</span>
                      : (
                        <button
                          className="ad-btn-ghost-sm"
                          onClick={() => navigate(`/admin/transcript-presets/${p.id}/test`)}
                          type="button"
                        >
                          Test
                        </button>
                      )
                    }
                  </div>
                ))}
              </div>

              <button className="ad-btn-nav" onClick={() => navigate('/admin/transcript-presets')} type="button">
                Cấu hình transcript →
              </button>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  )
}