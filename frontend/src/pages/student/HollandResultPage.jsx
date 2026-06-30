import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import Layout from '../../components/layout/Layout'
import './HollandResultPage.css'

const MOCK = {
    session: { completedAt: '20/06/2026', totalQuestions: 48 },
    scores: { R: 72, I: 85, A: 40, S: 60, E: 55, C: 68 },
    topDims: ['I', 'R', 'C'],
    personalityType: 'I – R – C',
    careerLabel: 'Investigative · Realistic · Conventional',
    description: 'Bạn thiên về phân tích dữ liệu, giải quyết vấn đề kỹ thuật và xây dựng hệ thống có cấu trúc chặt chẽ. Kiểu tính cách này phù hợp với các vai trò đòi hỏi tư duy logic, nghiên cứu độc lập và sự chính xác trong công việc kỹ thuật.',
    dimensions: [
        { dim: 'I', name: 'Investigative', score: 85, desc: 'Phân tích, nghiên cứu, giải quyết vấn đề trừu tượng và tư duy khoa học' },
        { dim: 'R', name: 'Realistic', score: 72, desc: 'Thực tế, kỹ thuật, làm việc với máy móc, phần mềm và công cụ' },
        { dim: 'C', name: 'Conventional', score: 68, desc: 'Có tổ chức, theo quy trình, chú ý đến chi tiết và tính nhất quán' },
        { dim: 'S', name: 'Social', score: 60, desc: 'Giao tiếp, hỗ trợ, dạy học và làm việc với con người' },
        { dim: 'E', name: 'Enterprising', score: 55, desc: 'Lãnh đạo, thuyết phục, kinh doanh và khởi xướng dự án' },
        { dim: 'A', name: 'Artistic', score: 40, desc: 'Sáng tạo, biểu đạt nghệ thuật, không thích quy tắc cứng nhắc' },
    ],
}

function useReveal(ref) {
    const [v, setV] = useState(false)
    useEffect(() => {
        if (!ref.current) return
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect() } },
            { threshold: 0.08 }
        )
        obs.observe(ref.current)
        return () => obs.disconnect()
    }, [ref])
    return v
}

function RadarChart({ scores, visible }) {
    const ref = useRef(null)
    const inst = useRef(null)
    useEffect(() => {
        if (!ref.current || !window.Chart) return
        inst.current?.destroy()
        inst.current = new window.Chart(ref.current, {
            type: 'radar',
            data: {
                labels: ['R', 'I', 'A', 'S', 'E', 'C'],
                datasets: [{
                    data: visible ? [scores.R, scores.I, scores.A, scores.S, scores.E, scores.C] : [0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(133,183,235,0.15)',
                    borderColor: '#85B7EB',
                    borderWidth: 2,
                    pointBackgroundColor: '#85B7EB',
                    pointRadius: 5, pointHoverRadius: 7,
                }],
            },
            options: {
                responsive: false,
                animation: { duration: visible ? 1200 : 0, easing: 'easeOutQuart' },
                scales: {
                    r: {
                        min: 0, max: 100,
                        ticks: { display: false },
                        grid: { color: 'rgba(255,255,255,0.08)' },
                        angleLines: { color: 'rgba(255,255,255,0.1)' },
                        pointLabels: { font: { size: 14, family: 'Be Vietnam Pro', weight: '700' }, color: 'rgba(255,255,255,0.75)' },
                    }
                },
                plugins: { legend: { display: false } },
            },
        })
        return () => { inst.current?.destroy() }
    }, [visible])
    return <canvas ref={ref} width={300} height={240} role="img" aria-label="Biểu đồ radar Holland RIASEC" />
}

export default function HollandResultPage() {
    const navigate = useNavigate()
    const username = localStorage.getItem('username') || 'Sinh viên'
    const d = MOCK

    const heroRef = useRef(null)
    const dimRef = useRef(null)
    const heroVisible = useReveal(heroRef)
    const dimVisible = useReveal(dimRef)

    const [barsReady, setBarsReady] = useState(false)
    useEffect(() => { if (dimVisible) setTimeout(() => setBarsReady(true), 100) }, [dimVisible])

    const handleLogout = async () => { await logout(); navigate('/login') }

    return (
        <Layout role="student" user={{ name: username }}
            breadcrumbs={[{ label: 'Đánh giá Holland RIASEC' }]}
            onLogout={handleLogout} onLogoClick={() => navigate('/')} onGoHome={() => navigate('/')}>
            <div className="hr-page">

                {/* ── HERO ── */}
                <div ref={heroRef} className={`hr-reveal hr-hero${heroVisible ? ' hr-visible' : ''}`}>
                    <div className="hr-hero-left">
                        <div className="hr-tag">Kết quả gần nhất · {d.session.completedAt} · {d.session.totalQuestions} câu</div>
                        <div className="hr-type">
                            {d.topDims.map((dim, i) => (
                                <span key={dim}>{i > 0 && <span className="hr-type-sep"> – </span>}
                                    <span className={i < 2 ? 'hr-type-hl' : ''}>{dim}</span>
                                </span>
                            ))}
                        </div>
                        <div className="hr-sublabel">{d.careerLabel}</div>
                        <p className="hr-desc">{d.description}</p>
                        <div className="hr-actions">
                            <button className="hr-btn-white" onClick={() => navigate('/student/holland/test')} type="button">Làm lại bài test</button>
                            <button className="hr-btn-ghost" onClick={() => navigate('/student/transfer')} type="button">Phân tích chuyển ngành →</button>
                        </div>
                    </div>

                    <div className="hr-hero-right">
                        <RadarChart scores={d.scores} visible={heroVisible} />
                        <div className="hr-score-row">
                            {d.dimensions.slice(0, 4).map((item, i) => (
                                <div key={item.dim} className={`hr-score-badge${i < 3 ? ' top' : ''}`}>
                                    <div className="hr-score-num">{item.score}</div>
                                    <div className="hr-score-dim">{item.dim} · {item.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── DIM BREAKDOWN ── */}
                <div ref={dimRef} className={`hr-reveal${dimVisible ? ' hr-visible' : ''}`} style={{ transitionDelay: '80ms' }}>
                    <div className="hr-sec-title">Chi tiết từng chiều RIASEC</div>
                    <div className="hr-dim-grid">
                        {d.dimensions.map((item, idx) => {
                            const isTop = d.topDims.includes(item.dim)
                            return (
                                <div key={item.dim} className={`hr-dim-card${isTop ? ' hr-dim-card--top' : ''}`}>
                                    <div className="hr-dim-hd">
                                        <div className={`hr-dim-letter${isTop ? ' top' : ''}`}>{item.dim}</div>
                                        <div className="hr-dim-name">{item.name}</div>
                                        <div className="hr-dim-score">{item.score}</div>
                                    </div>
                                    <div className="hr-dim-bar-bg">
                                        <div className={`hr-dim-bar${isTop ? ' top' : ''}`}
                                            style={{ width: barsReady ? `${item.score}%` : '0%', transitionDelay: `${idx * 60}ms` }} />
                                    </div>
                                    <p className="hr-dim-desc">{item.desc}</p>
                                </div>
                            )
                        })}
                    </div>

                    {/* CTA band */}
                    <div className="hr-cta-band">
                        <div className="hr-cta-card">
                            <div className="hr-cta-title">Phân tích chuyển ngành</div>
                            <p className="hr-cta-desc">So sánh mức độ phù hợp với chuyên ngành mục tiêu dựa trên hồ sơ Holland và điểm học thuật của bạn.</p>
                            <button className="hr-cta-link" onClick={() => navigate('/student/transfer')} type="button">Xem phân tích →</button>
                        </div>
                        <div className="hr-cta-card">
                            <div className="hr-cta-title">Làm lại bài test Holland</div>
                            <p className="hr-cta-desc">Kết quả có thể thay đổi theo thời gian. Nên thực hiện lại sau mỗi học kỳ để cập nhật hồ sơ tính cách.</p>
                            <button className="hr-cta-link hr-cta-link--ghost" onClick={() => navigate('/student/holland/test')} type="button">Bắt đầu bài test →</button>
                        </div>
                    </div>
                </div>

            </div>
        </Layout>
    )
}