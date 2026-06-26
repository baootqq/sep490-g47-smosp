import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import Layout from '../../components/layout/Layout'
import './StudentDashboard.css'

/* ── Mock data — thay bằng API ──────────────────────────────── */
const MOCK = {
  name: 'Nguyễn Văn A',
  major: 'Công nghệ thông tin',
  narrowSpec: 'AI/ML Engineering',
  term: 6,
  gpa: 3.42,
  profileScore: 58,
  updatedAt: '15/06/2026',
  skills: { count: 20, newCount: 3 },
  interests: { count: 12 },
  suggestedSkills: [
    { label: 'PyTorch', type: 'blue' },
    { label: 'Statistics', type: 'blue' },
    { label: 'MLflow', type: 'green' },
    { label: 'Deep Learning', type: 'blue' },
  ],
  roadmap: { done: 18, studying: 5, total: 60, credits: 23 },
  holland: {
    scores: { R: 72, I: 85, A: 40, S: 60, E: 55, C: 68 },
    dims: [
      { label: 'R', val: 72 },
      { label: 'I', val: 85 },
      { label: 'A', val: 40 },
      { label: 'S', val: 60 },
      { label: 'E', val: 55 },
      { label: 'C', val: 68 },
    ],
    top: [
      { dim: 'Investigative', val: 85, primary: true },
      { dim: 'Realistic', val: 72, primary: true },
      { dim: 'Conventional', val: 68, primary: false },
    ],
  },
  recommendations: [
    { name: 'AI/ML Engineering', profileScore: 61, tw: 26 },
    { name: 'Backend Engineering', profileScore: 55, tw: 24 },
    { name: 'Cloud & DevOps', profileScore: 52, tw: 22 },
    { name: 'Frontend Dev', profileScore: 48, tw: 20 },
    { name: 'Embedded Systems', profileScore: 43, tw: 18 },
  ],
  twUpdatedAt: '20/06/2026',
  donutBreakdown: [22, 20, 16, 42],
}

/* ── Animated counter ───────────────────────────────────────── */
function useAnimCount(target, decimals = 0, duration = 900) {
  const [val, setVal] = useState(0)
  const animate = useCallback(() => {
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(parseFloat((target * ease).toFixed(decimals)))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, decimals, duration])
  return [val, animate]
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

/* ── Chart components ────────────────────────────────────────── */
function DonutChart({ breakdown }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current || !window.Chart) return
    const c = new window.Chart(ref.current, {
      type: 'doughnut',
      data: {
        labels: ['GPA', 'Kỹ năng', 'Sở thích', 'Chưa hoàn thiện'],
        datasets: [{
          data: breakdown,
          backgroundColor: ['#034EA2', '#F37021', '#51B848', 'rgba(255,255,255,0.12)'],
          borderWidth: 0,
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: false,
        cutout: '68%',
        animation: { animateRotate: true, duration: 1200 },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => `${c.label}: ${c.raw}%` } },
        },
      },
    })
    return () => c.destroy()
  }, [breakdown])
  return <canvas ref={ref} width={88} height={88} role="img" aria-label="Donut hồ sơ cá nhân" />
}

function HollandChart({ scores }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current || !window.Chart) return
    const c = new window.Chart(ref.current, {
      type: 'radar',
      data: {
        labels: ['R', 'I', 'A', 'S', 'E', 'C'],
        datasets: [{
          data: [scores.R, scores.I, scores.A, scores.S, scores.E, scores.C],
          backgroundColor: 'rgba(3,78,162,0.13)',
          borderColor: '#034EA2',
          borderWidth: 2.5,
          pointBackgroundColor: '#034EA2',
          pointRadius: 5,
          pointHoverRadius: 7,
        }],
      },
      options: {
        responsive: false,
        animation: { duration: 1100 },
        scales: {
          r: {
            min: 0, max: 100,
            ticks: { display: false },
            grid: { color: 'rgba(0,0,0,0.07)' },
            pointLabels: { font: { size: 12, family: 'Be Vietnam Pro', weight: '700' }, color: '#6b7280' },
          },
        },
        plugins: { legend: { display: false } },
      },
    })
    return () => c.destroy()
  }, [scores])
  return (
    <canvas
      ref={ref}
      width={140} height={140}
      role="img"
      aria-label={`Radar Holland: R:${scores.R} I:${scores.I} A:${scores.A} S:${scores.S} E:${scores.E} C:${scores.C}`}
    />
  )
}

function RankingChart({ data }) {
  const ref = useRef(null)
  const finals = data.map((d) => d.profileScore + d.tw)
  useEffect(() => {
    if (!ref.current || !window.Chart) return
    const c = new window.Chart(ref.current, {
      type: 'bar',
      data: {
        labels: data.map((d) => d.name),
        datasets: [
          {
            label: 'Profile Score',
            data: data.map((d) => d.profileScore),
            backgroundColor: ['#F37021', '#034EA2', '#85B7EB', '#85B7EB', '#85B7EB'],
            borderRadius: 0,
            borderSkipped: false,
            stack: 's',
          },
          {
            label: 'Trending Weight',
            data: data.map((d) => d.tw),
            backgroundColor: [
              'rgba(243,112,33,0.30)', 'rgba(3,78,162,0.28)',
              'rgba(133,183,235,0.35)', 'rgba(133,183,235,0.35)', 'rgba(133,183,235,0.35)',
            ],
            borderSkipped: false,
            stack: 's',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1200, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => `${c.dataset.label}: ${Math.round(c.raw)}`,
              afterBody: (items) => [`Final Score: ${finals[items[0].dataIndex]}`],
            },
          },
        },
        scales: {
          x: {
            ticks: { font: { size: 12, family: 'Be Vietnam Pro', weight: '600' }, maxRotation: 0 },
            grid: { display: false },
            stacked: true,
          },
          y: {
            min: 0, max: 100,
            ticks: { font: { size: 11, family: 'Be Vietnam Pro' }, stepSize: 25 },
            grid: { color: 'rgba(0,0,0,0.04)' },
            stacked: true,
          },
        },
      },
    })
    return () => c.destroy()
  }, [data])
  return (
    <div className="sd-chart-wrap">
      <canvas
        ref={ref}
        role="img"
        aria-label={`Ranking: ${data.map((d) => `${d.name} ${d.profileScore + d.tw}`).join(', ')}`}
      >
        {data.map((d) => `${d.name}: ${d.profileScore + d.tw}`).join(', ')}
      </canvas>
    </div>
  )
}

/* ── Main ────────────────────────────────────────────────────── */
export default function StudentDashboard() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'Sinh viên'
  const p = MOCK /* TODO: useState + useEffect → API */

  /* Refs */
  const heroRef = useRef(null)
  const profileRef = useRef(null)
  const hollandRef = useRef(null)
  const rankingRef = useRef(null)

  const heroVisible = useReveal(heroRef)
  const profileVisible = useReveal(profileRef)
  const hollandVisible = useReveal(hollandRef)
  const rankingVisible = useReveal(rankingRef)

  /* Animated counters — chạy khi hero visible */
  const [gpaVal, animGpa] = useAnimCount(p.gpa, 2, 1200)
  const [skVal, animSk] = useAnimCount(p.skills.count, 0, 900)
  const [intVal, animInt] = useAnimCount(p.interests.count, 0, 900)
  const [pctVal, animPct] = useAnimCount(p.profileScore, 0, 900)

  useEffect(() => {
    if (heroVisible) { animGpa(); animSk(); animInt(); animPct() }
  }, [heroVisible])

  /* Progress bar — chạy khi profileRef visible */
  const [progWidth, setProgWidth] = useState('0%')
  useEffect(() => {
    if (profileVisible)
      setTimeout(() => setProgWidth(`${Math.round((p.roadmap.credits / p.roadmap.total) * 100)}%`), 200)
  }, [profileVisible])

  /* Holland dim bars — chạy khi hollandRef visible */
  const [hollandBarsReady, setHollandBarsReady] = useState(false)
  useEffect(() => {
    if (hollandVisible) setTimeout(() => setHollandBarsReady(true), 200)
  }, [hollandVisible])

  const TERMS = Array.from({ length: 9 }, (_, i) =>
    i + 1 < p.term ? 'done' : i + 1 === p.term ? 'cur' : 'todo'
  )

  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <Layout
      role="student"
      user={{ name: username }}
      breadcrumbs={[{ label: 'Dashboard' }]}
      onLogout={handleLogout}
      onLogoClick={() => navigate('/')}
      onGoHome={() => navigate('/')}
    >
      <div className="sd-page">

        {/* ── HERO ──────────────────────────────────────── */}
        <div ref={heroRef} className={`sd-reveal sd-hero${heroVisible ? ' sd-visible' : ''}`}>
          <div className="sd-hero-left">
            <div>
              <h1>Xin chào, {username}!</h1>
              <p className="sd-hero-meta">
                Chuyên ngành: <strong>{p.major}</strong>
                &nbsp;·&nbsp;
                Chuyên ngành hẹp: <span className="sd-spec-hl">{p.narrowSpec}</span>
                <br />
                Cập nhật lần cuối: {p.updatedAt}&nbsp;·&nbsp;Kỳ {p.term} / 9
              </p>
            </div>
          </div>

          <div className="sd-hero-right">
            <div className="sd-hbox">
              <div className="sd-hval">{gpaVal.toFixed(2)}</div>
              <div className="sd-hlbl">GPA hiện tại</div>
              <div className="sd-hsub">/ 4.0</div>
            </div>
            <div className="sd-hbox">
              <div className="sd-hlbl" style={{ marginBottom: 6 }}>Hồ sơ</div>
              <div className="sd-donut-wrap">
                <DonutChart breakdown={p.donutBreakdown} />
                <div className="sd-donut-pct">{pctVal}%</div>
              </div>
              <div className="sd-donut-legend">
                {[['#034EA2', 'GPA'], ['#F37021', 'Kỹ năng'], ['#51B848', 'Sở thích']].map(([color, label]) => (
                  <div key={label} className="sd-dl-row">
                    <div className="sd-dl-dot" style={{ background: color }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── PROFILE ───────────────────────────────────── */}
        <div
          ref={profileRef}
          className={`sd-reveal${profileVisible ? ' sd-visible' : ''}`}
          style={{ transitionDelay: '80ms' }}
        >
          <div className="sd-sec-title">Hồ sơ cá nhân</div>
          <div className="sd-row-2">

            {/* Card kỹ năng */}
            <div className="sd-card">
              <div className="sd-ctitle">Kỹ năng &amp; sở thích</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div>
                  <div className="sd-skill-big">{skVal}</div>
                  <div className="sd-skill-sub">kỹ năng đã khai báo</div>
                </div>
                <span className="sd-chip-blue">+{p.skills.newCount} mới</span>
              </div>
              <div className="sd-divider" />
              <div className="sd-skill-big" style={{ fontSize: 38 }}>{intVal}</div>
              <div className="sd-skill-sub">sở thích đã chọn</div>
              <div className="sd-suggest-lbl" style={{ marginTop: 22 }}>Gợi ý thêm từ transcript</div>
              <div className="sd-tags">
                {p.suggestedSkills.map((s) => (
                  <span key={s.label} className={`sd-tag ${s.type === 'green' ? 'sd-tag-green' : 'sd-tag-blue'}`}>
                    {s.label}
                  </span>
                ))}
              </div>
              {/* margin-top:auto trong CSS đẩy nút xuống đáy */}
              <button className="sd-btn-fill-blue" onClick={() => navigate('/student/profile')}>
                Cập nhật hồ sơ
              </button>
            </div>

            {/* Card lộ trình */}
            <div className="sd-card">
              <div className="sd-ctitle">Lộ trình học tập — {p.narrowSpec}</div>
              <div className="sd-prog-label">
                <span>Tổng tiến độ</span>
                <span>{p.roadmap.credits} / {p.roadmap.total} tín chỉ</span>
              </div>
              <div className="sd-prog-track">
                <div className="sd-prog-fill" style={{ width: progWidth }} />
              </div>
              <div className="sd-status-grid">
                <div className="sd-sc sd-sc-done">
                  <div className="sd-sc-num">{p.roadmap.done}</div>
                  <div className="sd-sc-sub">Đã qua</div>
                </div>
                <div className="sd-sc sd-sc-cur">
                  <div className="sd-sc-num">{p.roadmap.studying}</div>
                  <div className="sd-sc-sub">Đang học</div>
                </div>
                <div className="sd-sc sd-sc-todo">
                  <div className="sd-sc-num">{p.roadmap.total - p.roadmap.done - p.roadmap.studying}</div>
                  <div className="sd-sc-sub">Chưa học</div>
                </div>
              </div>
              <div className="sd-term-lbl">Tiến độ theo kỳ</div>
              <div className="sd-term-grid">
                {TERMS.map((state, i) => (
                  <div key={i} className={`sd-term-cell sd-term-${state}`} title={`Kỳ ${i + 1}`}>
                    K{i + 1}
                  </div>
                ))}
              </div>
              <div className="sd-term-legend">
                <div className="sd-tleg"><div className="sd-tdot" style={{ background: '#034EA2' }} />Đã xong</div>
                <div className="sd-tleg"><div className="sd-tdot" style={{ background: '#F37021' }} />Đang học</div>
                <div className="sd-tleg"><div className="sd-tdot" style={{ background: '#f0f2f7', border: '0.5px solid #d1d5db' }} />Chưa học</div>
              </div>
              {/* margin-top:auto trong CSS đẩy nút xuống đáy */}
              <button className="sd-btn-fill-navy" onClick={() => navigate('/student/roadmap')}>
                Xem lộ trình cá nhân
              </button>
            </div>

          </div>
        </div>

        {/* ── HOLLAND ───────────────────────────────────── */}
        <div
          ref={hollandRef}
          className={`sd-reveal${hollandVisible ? ' sd-visible' : ''}`}
          style={{ transitionDelay: '100ms' }}
        >
          <div className="sd-sec-title">Đánh giá Holland RIASEC</div>
          <div className="sd-holland-card">
            <div className="sd-h-chart-side">
              <HollandChart scores={p.holland.scores} />
              <div className="sd-h-scores">
                {p.holland.top.map((item) => (
                  <div key={item.dim} className={`sd-hs-cell ${item.primary ? 'sd-hs-primary' : 'sd-hs-secondary'}`}>
                    <div className="sd-hs-num">{item.val}</div>
                    <div className="sd-hs-sub">{item.dim}</div>
                  </div>
                ))}
              </div>
              <button className="sd-btn-outline" onClick={() => navigate('/student/holland')}>
                Làm lại đánh giá
              </button>
            </div>

            <div>
              <div className="sd-h-type-badge">Kiểu nhân cách: I – R</div>
              <div className="sd-h-desc">
                Bạn thuộc kiểu <strong>Investigative – Realistic</strong>: yêu thích phân tích dữ liệu,
                giải quyết vấn đề phức tạp và làm việc với hệ thống kỹ thuật. Kiểu này phù hợp cao với{' '}
                <strong>AI/ML Engineering</strong> và <strong>Research Engineering</strong> tại FPT University.
              </div>
              <div className="sd-h-dims">
                {p.holland.dims.map((d, idx) => {
                  const barColor = d.val >= 80 ? '#034EA2' : d.val >= 60 ? '#85B7EB' : '#e4e6ee'
                  return (
                    <div key={d.label} className="sd-hdim">
                      <div className="sd-hdim-bar-wrap">
                        <div
                          className="sd-hdim-bar"
                          style={{
                            height: hollandBarsReady ? `${(d.val / 100) * 72}px` : '0px',
                            background: barColor,
                            transitionDelay: `${idx * 60}ms`,
                          }}
                        />
                      </div>
                      <div className="sd-hdim-lbl">{d.label}</div>
                      <div className="sd-hdim-val">{d.val}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── RANKING ───────────────────────────────────── */}
        <div
          ref={rankingRef}
          className={`sd-reveal${rankingVisible ? ' sd-visible' : ''}`}
          style={{ transitionDelay: '100ms' }}
        >
          <div className="sd-sec-title">Ranking chuyên ngành hẹp</div>
          <div className="sd-rank-card">
            <div className="sd-r-header">
              <div className="sd-r-title">Top 5 chuyên ngành hẹp phù hợp</div>
              <div className="sd-r-actions">
                <div className="sd-tw-badge">Dữ liệu TW cập nhật {p.twUpdatedAt}</div>
                <button className="sd-btn-refresh" onClick={() => navigate('/student/recommendation')}>
                  Gợi ý lại
                </button>
              </div>
            </div>
            <div className="sd-r-legend">
              <div className="sd-rleg">
                <div className="sd-rleg-sq" style={{ background: '#F37021' }} />
                Được gợi ý
              </div>
            </div>
            <RankingChart data={p.recommendations} />
          </div>
        </div>

      </div>
    </Layout>
  )
}