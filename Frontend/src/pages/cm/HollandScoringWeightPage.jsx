import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import Layout from '../../components/layout/Layout'
import './HollandScoringWeightPage.css'

/* ── Mock data ── */
/* UC-47: Trọng số 5 mức Likert (từ holland_answer_option) */
const INIT_LIKERT = [
    { value: 1, label: 'Hoàn toàn không đồng ý', weight: 1.0 },
    { value: 2, label: 'Không đồng ý', weight: 2.0 },
    { value: 3, label: 'Trung lập', weight: 3.0 },
    { value: 4, label: 'Đồng ý', weight: 4.0 },
    { value: 5, label: 'Hoàn toàn đồng ý', weight: 5.0 },
]

/* UC-91: Trọng số RIASEC per Specialization (từ holland_spec_weight) */
const DIMS = ['R', 'I', 'A', 'S', 'E', 'C']
const DIM_NAMES = { R: 'Realistic', I: 'Investigative', A: 'Artistic', S: 'Social', E: 'Enterprising', C: 'Conventional' }

const INIT_SPEC_WEIGHTS = [
    { specId: 'se', specName: 'Software Engineering', majorName: 'CNTT', weights: { R: 0.8, I: 0.9, A: 0.2, S: 0.3, E: 0.4, C: 0.7 } },
    { specId: 'is', specName: 'Information Systems', majorName: 'CNTT', weights: { R: 0.5, I: 0.7, A: 0.2, S: 0.5, E: 0.5, C: 0.8 } },
    { specId: 'mkt', specName: 'Marketing', majorName: 'QTKD', weights: { R: 0.2, I: 0.4, A: 0.6, S: 0.8, E: 0.9, C: 0.5 } },
    { specId: 'fin', specName: 'Finance', majorName: 'QTKD', weights: { R: 0.3, I: 0.7, A: 0.1, S: 0.4, E: 0.6, C: 0.9 } },
    { specId: 'da', specName: 'Digital Art & Design', majorName: 'TKDH', weights: { R: 0.4, I: 0.3, A: 1.0, S: 0.5, E: 0.5, C: 0.2 } },
    { specId: 'law', specName: 'Legal Studies', majorName: 'Luật', weights: { R: 0.1, I: 0.6, A: 0.2, S: 0.6, E: 0.5, C: 0.9 } },
    { specId: 'eng', specName: 'English Studies', majorName: 'NN Anh', weights: { R: 0.1, I: 0.5, A: 0.7, S: 0.9, E: 0.6, C: 0.4 } },
]

/* ── helpers ── */
function isAllZero(weights) {
    return Object.values(weights).every(v => v === 0)
}

function clamp(v) {
    const n = parseFloat(v)
    if (isNaN(n)) return 0
    return Math.min(1, Math.max(0, Math.round(n * 10) / 10))
}

export default function HollandScoringWeightPage() {
    const navigate = useNavigate()
    const username = localStorage.getItem('username') || 'Content Manager'

    const [likert, setLikert] = useState(INIT_LIKERT)
    const [specWeights, setSpecWeights] = useState(INIT_SPEC_WEIGHTS)
    const [likertDirty, setLikertDirty] = useState(false)
    const [specDirty, setSpecDirty] = useState(false)
    const [likertSaved, setLikertSaved] = useState(false)
    const [specSaved, setSpecSaved] = useState(false)
    const [specErrors, setSpecErrors] = useState({})  // { specId: message }
    const [editCell, setEditCell] = useState(null) // { specId, dim }
    const [editVal, setEditVal] = useState('')

    /* ── Likert weight change ── */
    function updateLikert(idx, raw) {
        const n = parseFloat(raw)
        if (raw !== '' && (isNaN(n) || n <= 0)) return  // BV-29: > 0
        const updated = likert.map((item, i) => i === idx ? { ...item, weight: raw === '' ? '' : n } : item)
        setLikert(updated)
        setLikertDirty(true)
        setLikertSaved(false)
    }

    function saveLikert() {
        const invalid = likert.some(item => item.weight === '' || item.weight <= 0)
        if (invalid) { alert('Trọng số phải lớn hơn 0 (BV-29).'); return }
        /* TODO: PUT /api/cm/holland/answer-weights */
        setLikertDirty(false)
        setLikertSaved(true)
        setTimeout(() => setLikertSaved(false), 2500)
    }

    /* ── Spec weight cell edit ── */
    function startCellEdit(specId, dim, currentVal) {
        setEditCell({ specId, dim })
        setEditVal(String(currentVal))
    }

    function commitCellEdit() {
        if (!editCell) return
        const { specId, dim } = editCell
        const val = clamp(editVal)
        setSpecWeights(prev => prev.map(s => s.specId === specId
            ? { ...s, weights: { ...s.weights, [dim]: val } }
            : s
        ))
        // NAC-91-02: warn if all zero
        const updated = specWeights.find(s => s.specId === specId)
        if (updated) {
            const newWeights = { ...updated.weights, [dim]: val }
            if (isAllZero(newWeights)) {
                setSpecErrors(p => ({ ...p, [specId]: 'Toàn bộ chiều RIASEC đều bằng 0 — Specialization này sẽ luôn có Holland Score = 0 (NAC-91-02).' }))
            } else {
                setSpecErrors(p => { const copy = { ...p }; delete copy[specId]; return copy })
            }
        }
        setEditCell(null)
        setEditVal('')
        setSpecDirty(true)
        setSpecSaved(false)
    }

    function cancelCellEdit() {
        setEditCell(null)
        setEditVal('')
    }

    function saveSpec() {
        const invalids = specWeights.filter(s => Object.values(s.weights).some(v => v < 0 || v > 1))
        if (invalids.length > 0) { alert('Tất cả trọng số phải trong khoảng [0.0, 1.0] (NAC-91-01).'); return }
        /* TODO: PUT /api/cm/holland/spec-weights */
        setSpecDirty(false)
        setSpecSaved(true)
        setTimeout(() => setSpecSaved(false), 2500)
    }

    function copyFrom(targetSpecId, sourceSpecId) {
        const source = specWeights.find(s => s.specId === sourceSpecId)
        if (!source) return
        setSpecWeights(prev => prev.map(s => s.specId === targetSpecId
            ? { ...s, weights: { ...source.weights } }
            : s
        ))
        setSpecDirty(true)
    }

    const handleLogout = async () => { await logout(); navigate('/login') }

    return (
        <Layout role="cm" user={{ name: username }}
            breadcrumbs={[{ label: 'Cấu hình trọng số Holland' }]}
            onLogout={handleLogout} onLogoClick={() => navigate('/')} onGoHome={() => navigate('/')}>
            <div className="hw-page">

                {/* ── SECTION 1: Likert answer weights (UC-47) ── */}
                <div className="hw-section">
                    <div className="hw-section-header">
                        <div>
                            <h2 className="hw-section-title">Trọng số câu trả lời Likert</h2>
                            <p className="hw-section-sub">UC-47 · Áp dụng cho tất cả câu hỏi · Trọng số phải lớn hơn 0 (BV-29)</p>
                        </div>
                        <div className="hw-header-actions">
                            {likertSaved && <span className="hw-saved-badge">Đã lưu ✓</span>}
                            <button className="hw-btn-save" onClick={saveLikert} disabled={!likertDirty} type="button">
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>

                    <div className="hw-likert-table">
                        <div className="hw-likert-head">
                            <span>Mức</span>
                            <span>Nhãn</span>
                            <span>Trọng số</span>
                            <span>Visualize</span>
                        </div>
                        {likert.map((item, idx) => (
                            <div key={item.value} className="hw-likert-row">
                                <span className="hw-likert-num">{item.value}</span>
                                <span className="hw-likert-label">{item.label}</span>
                                <input
                                    className="hw-likert-input"
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={item.weight}
                                    onChange={e => updateLikert(idx, e.target.value)}
                                />
                                <div className="hw-likert-bar-bg">
                                    <div
                                        className="hw-likert-bar"
                                        style={{ width: `${(item.weight / 5) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── SECTION 2: Specialization × RIASEC weight grid (UC-91) ── */}
                <div className="hw-section">
                    <div className="hw-section-header">
                        <div>
                            <h2 className="hw-section-title">Trọng số RIASEC theo Specialization</h2>
                            <p className="hw-section-sub">UC-91 · Giá trị 0.0–1.0 · Click ô để chỉnh sửa · Cảnh báo khi toàn chiều = 0 (NAC-91-02)</p>
                        </div>
                        <div className="hw-header-actions">
                            {specSaved && <span className="hw-saved-badge">Đã lưu ✓</span>}
                            <button className="hw-btn-save" onClick={saveSpec} disabled={!specDirty} type="button">
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>

                    <div className="hw-grid-wrap">
                        <table className="hw-grid">
                            <thead>
                                <tr>
                                    <th className="hw-grid-th hw-grid-th--spec">Specialization</th>
                                    {DIMS.map(d => (
                                        <th key={d} className="hw-grid-th">
                                            <span className="hw-dim-letter">{d}</span>
                                            <span className="hw-dim-name">{DIM_NAMES[d]}</span>
                                        </th>
                                    ))}
                                    <th className="hw-grid-th hw-grid-th--action">Copy từ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {specWeights.map(spec => {
                                    const hasError = isAllZero(spec.weights)
                                    return (
                                        <tr key={spec.specId} className={hasError ? 'hw-row-warn' : ''}>
                                            <td className="hw-grid-td hw-grid-td--spec">
                                                <div className="hw-spec-name">{spec.specName}</div>
                                                <div className="hw-spec-major">{spec.majorName}</div>
                                                {hasError && (
                                                    <div className="hw-spec-warn">⚠ Tất cả = 0</div>
                                                )}
                                                {specErrors[spec.specId] && (
                                                    <div className="hw-spec-err">{specErrors[spec.specId]}</div>
                                                )}
                                            </td>
                                            {DIMS.map(dim => {
                                                const val = spec.weights[dim]
                                                const isEditing = editCell?.specId === spec.specId && editCell?.dim === dim
                                                const intensity = val  // 0–1 for color
                                                return (
                                                    <td
                                                        key={dim}
                                                        className={`hw-grid-td hw-grid-td--cell${isEditing ? ' editing' : ''}`}
                                                        onClick={() => !isEditing && startCellEdit(spec.specId, dim, val)}
                                                    >
                                                        {isEditing ? (
                                                            <input
                                                                className="hw-cell-input"
                                                                type="number"
                                                                min="0" max="1" step="0.1"
                                                                value={editVal}
                                                                autoFocus
                                                                onChange={e => setEditVal(e.target.value)}
                                                                onBlur={commitCellEdit}
                                                                onKeyDown={e => { if (e.key === 'Enter') commitCellEdit(); if (e.key === 'Escape') cancelCellEdit() }}
                                                                onClick={e => e.stopPropagation()}
                                                            />
                                                        ) : (
                                                            <div className="hw-cell-val" style={{
                                                                background: `rgba(3,78,162,${0.08 + intensity * 0.55})`,
                                                                color: intensity > 0.5 ? '#fff' : '#0C447C',
                                                            }}>
                                                                {val.toFixed(1)}
                                                            </div>
                                                        )}
                                                    </td>
                                                )
                                            })}
                                            <td className="hw-grid-td hw-grid-td--action">
                                                <select
                                                    className="hw-copy-select"
                                                    defaultValue=""
                                                    onChange={e => { if (e.target.value) { copyFrom(spec.specId, e.target.value); e.target.value = '' } }}
                                                >
                                                    <option value="" disabled>Copy từ...</option>
                                                    {specWeights.filter(s => s.specId !== spec.specId).map(s => (
                                                        <option key={s.specId} value={s.specId}>{s.specName}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    <p className="hw-grid-note">
                        Click vào ô để chỉnh sửa · Enter để xác nhận · Esc để hủy · Màu đậm = trọng số cao
                    </p>
                </div>

            </div>
        </Layout>
    )
}