import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import Layout from '../../components/layout/Layout'
import './HollandTestPage.css'

const QUESTIONS = [
    { id: 'q1', dim: 'R', text: 'Tôi thích làm việc với máy móc, công cụ hoặc thiết bị điện tử hơn là làm việc với con người.' },
    { id: 'q2', dim: 'I', text: 'Tôi thích tìm hiểu nguyên nhân đằng sau các hiện tượng phức tạp và đặt ra các câu hỏi nghiên cứu.' },
    { id: 'q3', dim: 'A', text: 'Tôi thích sáng tác, thiết kế hoặc biểu đạt ý tưởng qua các hình thức nghệ thuật.' },
    { id: 'q4', dim: 'S', text: 'Tôi cảm thấy có ý nghĩa khi giúp đỡ, hướng dẫn hoặc hỗ trợ người khác giải quyết vấn đề.' },
    { id: 'q5', dim: 'E', text: 'Tôi thích thuyết phục người khác, dẫn dắt một nhóm hoặc khởi xướng các dự án mới.' },
    { id: 'q6', dim: 'C', text: 'Tôi làm việc hiệu quả hơn khi có quy trình rõ ràng, danh sách cụ thể và cấu trúc định sẵn.' },
    { id: 'q7', dim: 'R', text: 'Tôi thích các hoạt động ngoài trời, xây dựng hoặc sửa chữa vật dụng bằng tay.' },
    { id: 'q8', dim: 'I', text: 'Tôi tự tin giải quyết các bài toán logic, lập trình hoặc phân tích dữ liệu phức tạp.' },
    { id: 'q9', dim: 'A', text: 'Tôi thích môi trường làm việc linh hoạt, sáng tạo, không bị ràng buộc bởi nhiều quy tắc.' },
    { id: 'q10', dim: 'S', text: 'Tôi dễ dàng kết nối với người khác và thường được tìm đến để xin lời khuyên.' },
    { id: 'q11', dim: 'E', text: 'Tôi tự tin đứng trước đám đông, trình bày ý tưởng và đàm phán để đạt mục tiêu.' },
    { id: 'q12', dim: 'C', text: 'Tôi chú ý đến từng chi tiết và cảm thấy khó chịu khi có lỗi nhỏ trong tài liệu hoặc dữ liệu.' },
]

const LIKERT = [
    { value: 1, label: 'Hoàn toàn không đồng ý' },
    { value: 2, label: 'Không đồng ý' },
    { value: 3, label: 'Trung lập' },
    { value: 4, label: 'Đồng ý' },
    { value: 5, label: 'Hoàn toàn đồng ý' },
]

const DIM_NAMES = { R: 'Realistic', I: 'Investigative', A: 'Artistic', S: 'Social', E: 'Enterprising', C: 'Conventional' }

export default function HollandTestPage() {
    const navigate = useNavigate()
    const username = localStorage.getItem('username') || 'Sinh viên'

    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState({})
    const [animDir, setAnimDir] = useState(null)
    const [animating, setAnimating] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const total = QUESTIONS.length
    const q = QUESTIONS[current]
    const answered = Object.keys(answers).length
    const pct = Math.round((answered / total) * 100)
    const currAns = answers[q?.id]

    const jump = useCallback((idx) => {
        if (animating || idx === current) return
        const dir = idx > current ? 'next' : 'prev'
        setAnimDir(dir)
        setAnimating(true)
        setTimeout(() => { setCurrent(idx); setAnimDir(null); setAnimating(false) }, 260)
    }, [animating, current])

    function handleAnswer(val) {
        const newAns = { ...answers, [q.id]: val }
        setAnswers(newAns)
        if (current < total - 1) setTimeout(() => jump(current + 1), 320)
    }

    function handleSubmit() {
        if (answered < total) return
        setSubmitted(true)
        /* TODO: POST /api/student/holland/submit */
    }

    const handleLogout = async () => { await logout(); navigate('/login') }

    if (submitted) return (
        <Layout role="student" user={{ name: username }}
            breadcrumbs={[{ label: 'Đánh giá Holland RIASEC' }, { label: 'Làm bài test' }]}
            onLogout={handleLogout} onLogoClick={() => navigate('/')} onGoHome={() => navigate('/')}>
            <div className="ht-submitted">
                <div className="ht-submitted-icon">✓</div>
                <h2 className="ht-submitted-title">Bài test đã hoàn thành</h2>
                <p className="ht-submitted-desc">Hệ thống đang tính toán kết quả Holland RIASEC của bạn.<br />Kết quả sẽ sẵn sàng trong vài giây.</p>
                <button className="ht-btn-navy" onClick={() => navigate('/student/holland')} type="button">Xem kết quả</button>
            </div>
        </Layout>
    )

    return (
        <Layout role="student" user={{ name: username }}
            breadcrumbs={[{ label: 'Đánh giá Holland RIASEC' }, { label: 'Làm bài test' }]}
            onLogout={handleLogout} onLogoClick={() => navigate('/')} onGoHome={() => navigate('/')}>
            <div className="ht-page">

                {/* Progress header */}
                <div className="ht-prog-header">
                    <div className="ht-prog-meta">
                        <span className="ht-prog-num">{current + 1}</span>
                        <span className="ht-prog-of">/ {total}</span>
                        <span className="ht-prog-dim-pill">
                            <span className="ht-prog-dim-dot" />
                            {q.dim} — {DIM_NAMES[q.dim]}
                        </span>
                        <span className="ht-prog-pct">{pct}% hoàn thành</span>
                    </div>
                    <div className="ht-prog-bar-bg">
                        <div className="ht-prog-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="ht-seg-row">
                        {QUESTIONS.map((item, i) => (
                            <button
                                key={item.id}
                                className={`ht-seg${i === current ? ' cur' : answers[item.id] ? ' done' : ''}`}
                                onClick={() => jump(i)}
                                type="button"
                                aria-label={`Câu ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Question card */}
                <div className={`ht-q-wrap${animDir ? ` ht-q-exit-${animDir}` : ''}`}>
                    <div className="ht-q-card">
                        <div className="ht-q-dim-row">
                            <div className="ht-q-dim-chip">{q.dim}</div>
                            <div className="ht-q-dim-name">{DIM_NAMES[q.dim]}</div>
                        </div>
                        <p className="ht-q-text">{q.text}</p>
                        <div className="ht-likert-row">
                            {LIKERT.map(opt => (
                                <button
                                    key={opt.value}
                                    className={`ht-lk-btn${currAns === opt.value ? ' sel' : ''}`}
                                    onClick={() => handleAnswer(opt.value)}
                                    type="button"
                                >
                                    <span className="ht-lk-num">{opt.value}</span>
                                    <span className="ht-lk-lbl">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="ht-likert-axis">
                            <span>Hoàn toàn không đồng ý</span>
                            <span>Hoàn toàn đồng ý</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="ht-nav-row">
                    <button className="ht-btn-ghost-nav" onClick={() => jump(current - 1)} disabled={current === 0 || animating} type="button">← Câu trước</button>
                    <span className="ht-nav-hint">
                        {answered === total ? `Đã trả lời đủ ${total} câu` : `Còn ${total - answered} câu chưa trả lời`}
                    </span>
                    {current < total - 1
                        ? <button className="ht-btn-navy" onClick={() => jump(current + 1)} disabled={animating} type="button">Câu tiếp →</button>
                        : <button className={`ht-btn-submit${answered < total ? ' disabled' : ''}`} onClick={handleSubmit} disabled={answered < total} type="button">Nộp bài ({answered}/{total})</button>
                    }
                </div>

                {/* Overview */}
                <div className="ht-overview">
                    <div className="ht-ov-title">Tổng quan bài làm</div>
                    <div className="ht-ov-grid">
                        {QUESTIONS.map((item, i) => (
                            <div
                                key={item.id}
                                className={`ht-ov-cell${i === current ? ' cur' : answers[item.id] ? ' done' : ''}`}
                                onClick={() => jump(i)}
                                title={`Câu ${i + 1} — ${DIM_NAMES[item.dim]}`}
                            >
                                <div className="ht-ov-n">{i + 1}</div>
                                <div className="ht-ov-d">{item.dim}</div>
                                {answers[item.id] && <div className="ht-ov-a">{answers[item.id]}</div>}
                            </div>
                        ))}
                    </div>
                    <div className="ht-ov-legend">
                        <div className="ht-leg"><div className="ht-leg-sq ht-leg-sq--done" />Đã trả lời</div>
                        <div className="ht-leg"><div className="ht-leg-sq ht-leg-sq--cur" />Đang xem</div>
                        <div className="ht-leg"><div className="ht-leg-sq ht-leg-sq--todo" />Chưa trả lời</div>
                    </div>
                </div>

            </div>
        </Layout>
    )
}