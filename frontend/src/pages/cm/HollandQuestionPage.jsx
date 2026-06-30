import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import Layout from '../../components/layout/Layout'
import './HollandQuestionPage.css'

/* ── Mock data — thay bằng GET /api/cm/holland/questions ── */
const DIMS = ['R', 'I', 'A', 'S', 'E', 'C']
const DIM_NAMES = { R: 'Realistic', I: 'Investigative', A: 'Artistic', S: 'Social', E: 'Enterprising', C: 'Conventional' }

const MOCK_QUESTIONS = [
    { id: 'q1', dim: 'R', text: 'Tôi thích làm việc với máy móc, công cụ hoặc thiết bị điện tử hơn là làm việc với con người.', isActive: true },
    { id: 'q2', dim: 'R', text: 'Tôi thích các hoạt động ngoài trời, xây dựng hoặc sửa chữa vật dụng bằng tay.', isActive: true },
    { id: 'q3', dim: 'R', text: 'Tôi có xu hướng giải quyết vấn đề bằng hành động thực tế hơn là suy nghĩ lý thuyết.', isActive: true },
    { id: 'q4', dim: 'R', text: 'Tôi thích các công việc có kết quả cụ thể và đo lường được.', isActive: false },
    { id: 'q5', dim: 'I', text: 'Tôi thích tìm hiểu nguyên nhân đằng sau các hiện tượng phức tạp và đặt ra các câu hỏi nghiên cứu.', isActive: true },
    { id: 'q6', dim: 'I', text: 'Tôi tự tin giải quyết các bài toán logic, lập trình hoặc phân tích dữ liệu phức tạp.', isActive: true },
    { id: 'q7', dim: 'I', text: 'Tôi thích đọc các tài liệu khoa học và kỹ thuật chuyên sâu trong giờ rảnh.', isActive: true },
    { id: 'q8', dim: 'I', text: 'Tôi thường xuyên đặt câu hỏi về cách hoạt động của hệ thống xung quanh mình.', isActive: true },
    { id: 'q9', dim: 'I', text: 'Tôi cảm thấy hứng thú khi phải phân tích một vấn đề từ nhiều góc độ khác nhau.', isActive: true },
    { id: 'q10', dim: 'A', text: 'Tôi thích sáng tác, thiết kế hoặc biểu đạt ý tưởng qua các hình thức nghệ thuật.', isActive: true },
    { id: 'q11', dim: 'A', text: 'Tôi thích môi trường làm việc linh hoạt, sáng tạo, không bị ràng buộc bởi nhiều quy tắc.', isActive: true },
    { id: 'q12', dim: 'A', text: 'Tôi có xu hướng tiếp cận vấn đề theo cách độc đáo, không theo lối mòn.', isActive: false },
    { id: 'q13', dim: 'S', text: 'Tôi cảm thấy có ý nghĩa khi giúp đỡ, hướng dẫn hoặc hỗ trợ người khác giải quyết vấn đề.', isActive: true },
    { id: 'q14', dim: 'S', text: 'Tôi dễ dàng kết nối với người khác và thường được tìm đến để xin lời khuyên.', isActive: true },
    { id: 'q15', dim: 'S', text: 'Tôi thích làm việc nhóm và đóng góp vào môi trường hợp tác.', isActive: true },
    { id: 'q16', dim: 'E', text: 'Tôi thích thuyết phục người khác, dẫn dắt một nhóm hoặc khởi xướng các dự án mới.', isActive: true },
    { id: 'q17', dim: 'E', text: 'Tôi tự tin đứng trước đám đông, trình bày ý tưởng và đàm phán để đạt mục tiêu.', isActive: true },
    { id: 'q18', dim: 'E', text: 'Tôi có xu hướng nắm bắt cơ hội và hành động nhanh trong các tình huống không chắc chắn.', isActive: false },
    { id: 'q19', dim: 'C', text: 'Tôi làm việc hiệu quả hơn khi có quy trình rõ ràng, danh sách cụ thể và cấu trúc định sẵn.', isActive: true },
    { id: 'q20', dim: 'C', text: 'Tôi chú ý đến từng chi tiết và cảm thấy khó chịu khi có lỗi nhỏ trong tài liệu hoặc dữ liệu.', isActive: true },
    { id: 'q21', dim: 'C', text: 'Tôi thích công việc có tiêu chuẩn rõ ràng và kết quả dự đoán được.', isActive: true },
    { id: 'q22', dim: 'C', text: 'Tôi dễ dàng ghi nhớ và tuân thủ các quy định, hướng dẫn cụ thể.', isActive: true },
]

const MIN_PER_DIM = 5  // BV-26
const MAX_TOTAL = 60 // BV-27
const MIN_TOTAL = 30 // BV-27
const MAX_CHARS = 300 // BV-28

const BLANK_FORM = { text: '', dim: '', isActive: true }

export default function HollandQuestionPage() {
    const navigate = useNavigate()
    const username = localStorage.getItem('username') || 'Content Manager'

    const [questions, setQuestions] = useState(MOCK_QUESTIONS)
    const [filterDim, setFilterDim] = useState('ALL')
    const [filterStatus, setFilterStatus] = useState('ALL')
    const [editingId, setEditingId] = useState(null)   // null = none, 'NEW' = adding new
    const [form, setForm] = useState(BLANK_FORM)
    const [formError, setFormError] = useState('')

    /* ── Derived stats ── */
    const totalActive = questions.filter(q => q.isActive).length
    const dimStats = DIMS.map(d => ({
        dim: d,
        active: questions.filter(q => q.dim === d && q.isActive).length,
        total: questions.filter(q => q.dim === d).length,
    }))
    const lowDims = dimStats.filter(s => s.active < MIN_PER_DIM)

    /* ── Filtered list ── */
    const filtered = questions.filter(q => {
        const matchDim = filterDim === 'ALL' || q.dim === filterDim
        const matchStatus = filterStatus === 'ALL' || (filterStatus === 'active' ? q.isActive : !q.isActive)
        return matchDim && matchStatus
    })

    /* ── Toggle active (UC-46) ── */
    function toggleActive(id) {
        const q = questions.find(x => x.id === id)
        if (!q) return
        if (q.isActive) {
            // Check BV-26 before deactivating
            const dimActive = questions.filter(x => x.dim === q.dim && x.isActive).length
            if (dimActive <= MIN_PER_DIM) {
                alert(`Cảnh báo BV-26: Chiều ${q.dim} sẽ còn ${dimActive - 1} câu active (dưới ngưỡng tối thiểu ${MIN_PER_DIM}). Bạn vẫn muốn tắt?`)
            }
        }
        setQuestions(prev => prev.map(x => x.id === id ? { ...x, isActive: !x.isActive } : x))
    }

    /* ── Save form (UC-44 add / UC-45 edit) ── */
    function saveForm() {
        setFormError('')
        if (!form.text.trim()) { setFormError('Nội dung câu hỏi không được để trống.'); return }
        if (!form.dim) { setFormError('Phải chọn chiều RIASEC.'); return }
        if (form.text.length > MAX_CHARS) { setFormError(`Câu hỏi không được vượt quá ${MAX_CHARS} ký tự (BV-28).`); return }

        if (editingId === 'NEW') {
            if (totalActive >= MAX_TOTAL) { setFormError(`Đã đạt giới hạn tối đa ${MAX_TOTAL} câu (BV-27).`); return }
            const newQ = { id: `q${Date.now()}`, ...form }
            setQuestions(prev => [...prev, newQ])
        } else {
            setQuestions(prev => prev.map(x => x.id === editingId ? { ...x, ...form } : x))
        }
        cancelEdit()
    }

    function startEdit(q) {
        setEditingId(q.id)
        setForm({ text: q.text, dim: q.dim, isActive: q.isActive })
        setFormError('')
    }

    function startAdd() {
        setEditingId('NEW')
        setForm(BLANK_FORM)
        setFormError('')
    }

    function cancelEdit() {
        setEditingId(null)
        setForm(BLANK_FORM)
        setFormError('')
    }

    const handleLogout = async () => { await logout(); navigate('/login') }

    return (
        <Layout role="cm" user={{ name: username }}
            breadcrumbs={[{ label: 'Ngân hàng câu hỏi Holland' }]}
            onLogout={handleLogout} onLogoClick={() => navigate('/')} onGoHome={() => navigate('/')}>
            <div className="hq-page">

                {/* ── Header row ── */}
                <div className="hq-header">
                    <div>
                        <h1 className="hq-title">Ngân hàng câu hỏi Holland RIASEC</h1>
                        <p className="hq-subtitle">FT-40 · UC-44 / 45 / 46 · Mỗi chiều tối thiểu {MIN_PER_DIM} câu (BV-26)</p>
                    </div>
                    <div className="hq-header-actions">
                        <button className="hq-btn-config" onClick={() => navigate('/cm/holland-config')} type="button">
                            ⚙ Cấu hình trọng số
                        </button>
                        <button className="hq-btn-add" onClick={startAdd} type="button">+ Thêm câu hỏi</button>
                    </div>
                </div>

                {/* ── Dim stat bar ── */}
                <div className="hq-dim-bar">
                    {dimStats.map(s => (
                        <div
                            key={s.dim}
                            className={`hq-dim-chip${s.active < MIN_PER_DIM ? ' warn' : ''}`}
                            onClick={() => setFilterDim(filterDim === s.dim ? 'ALL' : s.dim)}
                            title={`${s.active} active / ${s.total} tổng`}
                        >
                            <span className="hq-dim-letter">{s.dim}</span>
                            <span className="hq-dim-count">{s.active}/{s.total}</span>
                            {s.active < MIN_PER_DIM && <span className="hq-dim-warn">⚠</span>}
                        </div>
                    ))}
                    <div className="hq-total-chip">
                        <span className="hq-total-num">{totalActive}</span>
                        <span className="hq-total-lbl">câu active</span>
                    </div>
                </div>

                {/* Low dim warning */}
                {lowDims.length > 0 && (
                    <div className="hq-alert">
                        Chiều {lowDims.map(d => d.dim).join(', ')} đang có ít hơn {MIN_PER_DIM} câu active — bài test Holland có thể không đủ điều kiện chạy (BV-26).
                    </div>
                )}

                {/* ── ADD / EDIT form ── */}
                {editingId && (
                    <div className="hq-form-card">
                        <div className="hq-form-title">{editingId === 'NEW' ? 'Thêm câu hỏi mới' : 'Chỉnh sửa câu hỏi'}</div>

                        <div className="hq-form-row">
                            <label className="hq-form-label">Chiều RIASEC <span className="hq-req">*</span></label>
                            <div className="hq-dim-select-row">
                                {DIMS.map(d => (
                                    <button
                                        key={d}
                                        className={`hq-dim-pick${form.dim === d ? ' sel' : ''}`}
                                        onClick={() => setForm(p => ({ ...p, dim: d }))}
                                        type="button"
                                        title={DIM_NAMES[d]}
                                    >
                                        {d}
                                    </button>
                                ))}
                                {form.dim && <span className="hq-dim-pick-name">{DIM_NAMES[form.dim]}</span>}
                            </div>
                        </div>

                        <div className="hq-form-row">
                            <label className="hq-form-label">Nội dung câu hỏi <span className="hq-req">*</span></label>
                            <textarea
                                className="hq-textarea"
                                maxLength={MAX_CHARS}
                                value={form.text}
                                onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
                                placeholder="Nhập nội dung câu hỏi theo dạng nhận định (tối đa 300 ký tự)..."
                                rows={3}
                            />
                            <div className="hq-char-count">{form.text.length} / {MAX_CHARS}</div>
                        </div>

                        {editingId !== 'NEW' && (
                            <div className="hq-form-row hq-form-row--inline">
                                <label className="hq-form-label">Trạng thái</label>
                                <label className="hq-toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))}
                                        className="hq-toggle-input"
                                    />
                                    <span className="hq-toggle-track" />
                                    <span className="hq-toggle-text">{form.isActive ? 'Active' : 'Inactive'}</span>
                                </label>
                            </div>
                        )}

                        {formError && <div className="hq-form-error">{formError}</div>}

                        <div className="hq-form-actions">
                            <button className="hq-btn-ghost" onClick={cancelEdit} type="button">Hủy</button>
                            <button className="hq-btn-save" onClick={saveForm} type="button">
                                {editingId === 'NEW' ? 'Tạo câu hỏi' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Filters ── */}
                <div className="hq-filter-row">
                    <select className="hq-select" value={filterDim} onChange={e => setFilterDim(e.target.value)}>
                        <option value="ALL">Tất cả chiều</option>
                        {DIMS.map(d => <option key={d} value={d}>{d} — {DIM_NAMES[d]}</option>)}
                    </select>
                    <select className="hq-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <span className="hq-filter-count">{filtered.length} câu hỏi</span>
                </div>

                {/* ── Question list ── */}
                <div className="hq-list">
                    {filtered.length === 0 && (
                        <div className="hq-empty">Không có câu hỏi nào phù hợp bộ lọc.</div>
                    )}
                    {filtered.map((q, idx) => (
                        <div key={q.id} className={`hq-row${!q.isActive ? ' hq-row--inactive' : ''}`}>
                            <div className="hq-row-left">
                                <span className="hq-row-dim">{q.dim}</span>
                                <span className="hq-row-idx">{idx + 1}</span>
                                <p className="hq-row-text">{q.text}</p>
                            </div>
                            <div className="hq-row-right">
                                <span className={`hq-status-tag${q.isActive ? ' active' : ' inactive'}`}>
                                    {q.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <button className="hq-btn-sm" onClick={() => startEdit(q)} type="button">Sửa</button>
                                <button
                                    className={`hq-btn-sm${q.isActive ? ' hq-btn-sm--danger' : ''}`}
                                    onClick={() => toggleActive(q.id)}
                                    type="button"
                                >
                                    {q.isActive ? 'Tắt' : 'Bật'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </Layout>
    )
}