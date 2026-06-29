import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../../services/authService'
import Layout from '../../components/layout/Layout'
import './CmCurriculumPage.css'
import {
    getMajors,
    getSpecializationsByMajor,
    getNarrowSpecsBySpecialization,
    getSpecializationCourses,
    updateSpecializationCourses,
    getNarrowSpecCourses,
    updateNarrowSpecCourses
} from '../../services/catalogService'
import { getCourses } from '../../services/courseService'

/* ── Toast helper ── */
function Toast({ msg, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
    return (
        <div className={`curr-toast curr-toast--${type}`}>
            <span>{type === 'success' ? '✓' : '✗'}</span>
            {msg}
        </div>
    )
}

/* ── Credit badge ── */
function CreditBar({ credits, max = 20 }) {
    const pct = Math.min((credits / max) * 100, 100)
    return (
        <div className="curr-credit-bar-wrap">
            <div className="curr-credit-bar-track">
                <div
                    className="curr-credit-bar-fill"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="curr-credit-label">
                {credits} / {max} tc
            </span>
        </div>
    )
}

export default function CmCurriculumPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const username = localStorage.getItem('username') || 'Content Manager'

    const navState = location.state || {}

    /* Mode: spec | ns */
    const [mode, setMode] = useState(navState.mode || 'spec')

    /* Dropdown Data */
    const [majors, setMajors] = useState([])
    const [specs, setSpecs] = useState([])
    const [narrowSpecs, setNarrowSpecs] = useState([])
    const [allCourses, setAllCourses] = useState([])
    
    /* Context selectors */
    const [selectedMajorId, setSelectedMajorId] = useState(navState.majorId || '')
    const [selectedSpecId, setSelectedSpecId] = useState(navState.specId || '')
    const [selectedNsId, setSelectedNsId] = useState(navState.nsId || '')

    /* Course mapping for current active mode context */
    const [termMap, setTermMap] = useState({})
    const [loading, setLoading] = useState(false)

    /* Add-to-term popup */
    const [addPopup, setAddPopup] = useState(null) // { term }
    const [addSearch, setAddSearch] = useState('')

    /* Toast */
    const [toast, setToast] = useState(null)
    const showToast = (msg, type = 'success') => setToast({ msg, type })

    /* Load initial majors & courses */
    useEffect(() => {
        const initLoad = async () => {
            try {
                const majorsData = await getMajors()
                setMajors(majorsData.filter(m => m.isActive))

                const coursesData = await getCourses()
                setAllCourses(coursesData.content || [])

                // Set initial major selection if not passed from state
                if (!navState.majorId && majorsData.length > 0) {
                    const activeMajors = majorsData.filter(m => m.isActive)
                    if (activeMajors.length > 0) {
                        setSelectedMajorId(activeMajors[0].id)
                    }
                }
            } catch (err) {
                console.error("Failed to load initial catalog:", err)
                showToast("Lỗi khi tải danh mục gốc", "error")
            }
        }
        initLoad()
    }, [])

    /* Load Specializations when selectedMajorId changes */
    useEffect(() => {
        if (!selectedMajorId) return
        const loadSpecs = async () => {
            try {
                const specsData = await getSpecializationsByMajor(selectedMajorId)
                const activeSpecs = specsData.filter(s => s.isActive)
                setSpecs(activeSpecs)

                // Select first specialization if not passed from navState or if changing major
                if (navState.majorId === selectedMajorId && navState.specId) {
                    setSelectedSpecId(navState.specId)
                } else if (activeSpecs.length > 0) {
                    setSelectedSpecId(activeSpecs[0].id)
                } else {
                    setSelectedSpecId('')
                    setNarrowSpecs([])
                    setSelectedNsId('')
                    setMode('spec')
                }
            } catch (err) {
                console.error("Failed to load specializations:", err)
                showToast("Lỗi khi tải chuyên ngành", "error")
            }
        }
        loadSpecs()
    }, [selectedMajorId])

    /* Load Narrow Specializations when selectedSpecId changes */
    useEffect(() => {
        if (!selectedSpecId) return
        const loadNS = async () => {
            try {
                const nsData = await getNarrowSpecsBySpecialization(selectedSpecId)
                setNarrowSpecs(nsData)

                if (navState.specId === selectedSpecId && navState.nsId) {
                    setSelectedNsId(navState.nsId)
                    setMode('ns')
                } else {
                    // Default to none (specialization mode) when spec changes
                    setSelectedNsId('')
                    setMode('spec')
                }
            } catch (err) {
                console.error("Failed to load narrow specializations:", err)
                showToast("Lỗi khi tải chuyên ngành hẹp", "error")
            }
        }
        loadNS()
    }, [selectedSpecId])

    /* Load mapping when spec, ns, or mode changes */
    useEffect(() => {
        const loadMapping = async () => {
            if (mode === 'spec' && selectedSpecId) {
                try {
                    setLoading(true)
                    const data = await getSpecializationCourses(selectedSpecId)
                    // Map back to unified format
                    const courseLookup = {}
                    allCourses.forEach(c => { courseLookup[c.id] = c })

                    const grouped = {}
                    data.forEach(item => {
                        const term = item.termOrder
                        if (!grouped[term]) grouped[term] = []
                        grouped[term].push({
                            id: item.courseId,
                            code: item.courseCode,
                            name: item.courseName,
                            credits: courseLookup[item.courseId]?.credits || 0
                        })
                    })
                    setTermMap(grouped)
                } catch (err) {
                    console.error("Failed to load spec mapping:", err)
                    showToast("Lỗi khi tải chương trình học của chuyên ngành", "error")
                } finally {
                    setLoading(false)
                }
            } else if (mode === 'ns' && selectedNsId) {
                try {
                    setLoading(true)
                    const data = await getNarrowSpecCourses(selectedNsId)
                    const courseLookup = {}
                    allCourses.forEach(c => { courseLookup[c.id] = c })

                    const grouped = {}
                    data.forEach(item => {
                        const term = item.termOrder
                        if (!grouped[term]) grouped[term] = []
                        grouped[term].push({
                            id: item.courseId,
                            code: item.courseCode,
                            name: item.courseName,
                            credits: courseLookup[item.courseId]?.credits || 0
                        })
                    })
                    setTermMap(grouped)
                } catch (err) {
                    console.error("Failed to load ns mapping:", err)
                    showToast("Lỗi khi tải chương trình học của chuyên ngành hẹp", "error")
                } finally {
                    setLoading(false)
                }
            } else {
                setTermMap({})
            }
        }
        if (allCourses.length > 0) {
            loadMapping()
        }
    }, [mode, selectedSpecId, selectedNsId, allCourses])

    /* Handle major change */
    function handleMajorChange(mid) {
        setSelectedMajorId(mid)
        setSpecs([])
        setNarrowSpecs([])
        setSelectedSpecId('')
        setSelectedNsId('')
        setMode('spec')
        setTermMap({})
    }

    function handleSpecChange(sid) {
        setSelectedSpecId(sid)
        setNarrowSpecs([])
        setSelectedNsId('')
        setMode('spec')
        setTermMap({})
    }

    const termRange = mode === 'spec' ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [5, 6, 7, 8, 9]

    /* Credits per term */
    function termCredits(termCourses) {
        return (termCourses || []).reduce((s, c) => s + c.credits, 0)
    }

    /* Add course to term */
    function handleAddToTerm(course) {
        // Check already assigned in this context
        const already = Object.values(termMap).some(arr => arr.some(c => c.id === course.id))
        if (already) { showToast('Môn này đã được gán vào kỳ khác trong cùng chuyên ngành', 'error'); return }

        const courseEntry = {
            id: course.id,
            code: course.code,
            name: course.name,
            credits: course.credits
        }

        const term = addPopup.term

        setTermMap(prev => ({
            ...prev,
            [term]: [...(prev[term] || []), courseEntry]
        }))

        showToast(`Đã gán ${course.code} vào Kỳ ${term}`)
        setAddPopup(null)
        setAddSearch('')
    }

    /* Remove course from term */
    function removeFromTerm(term, courseId) {
        setTermMap(prev => ({
            ...prev,
            [term]: (prev[term] || []).filter(c => c.id !== courseId)
        }))
        showToast('Đã gỡ môn khỏi kỳ')
    }

    /* Save mapping to backend */
    async function saveConfig() {
        try {
            if (mode === 'spec') {
                if (!selectedSpecId) return
                const payload = []
                Object.entries(termMap).forEach(([term, list]) => {
                    list.forEach(c => {
                        payload.push({
                            courseId: c.id,
                            termOrder: Number(term),
                            courseType: 'CORE' // Default type under the hood
                        })
                    })
                })
                await updateSpecializationCourses(selectedSpecId, payload)
                showToast('Đã lưu cấu hình curriculum chuyên ngành thành công!')
            } else {
                if (!selectedNsId) return
                const payload = []
                Object.entries(termMap).forEach(([term, list]) => {
                    list.forEach(c => {
                        payload.push({
                            courseId: c.id,
                            termOrder: Number(term)
                        })
                    })
                })
                await updateNarrowSpecCourses(selectedNsId, payload)
                showToast('Đã lưu cấu hình curriculum chuyên ngành hẹp thành công!')
            }
        } catch (err) {
            console.error("Failed to save config:", err)
            showToast("Lỗi khi lưu cấu hình: " + (err.response?.data?.message || err.message), "error")
        }
    }

    /* Available courses for add popup */
    const assignedIds = new Set(Object.values(termMap).flat().map(c => c.id))
    const availForAdd = allCourses.filter(c =>
        c.isActive &&
        !assignedIds.has(c.id) &&
        (addSearch === '' ||
            c.code.toLowerCase().includes(addSearch.toLowerCase()) ||
            c.name.toLowerCase().includes(addSearch.toLowerCase()))
    )

    /* Total stats */
    const totalCourses = Object.values(termMap).flat().length
    const totalCredits = Object.values(termMap).flat().reduce((s, c) => s + c.credits, 0)
    const configuredTerms = termRange.filter(t => (termMap[t] || []).length > 0).length

    const handleLogout = async () => { await logout(); navigate('/login') }

    /* Context label */
    const selectedSpec = specs.find(s => s.id === selectedSpecId)
    const selectedNs = narrowSpecs.find(n => n.id === selectedNsId)
    const currentLabel = mode === 'spec'
        ? selectedSpec?.name
        : selectedNs?.name

    return (
        <Layout
            role="cm"
            user={{ name: username }}
            breadcrumbs={[
                { label: 'Quản lý Curriculum' },
            ]}
            onLogout={handleLogout}
            onLogoClick={() => navigate('/')}
            onGoHome={() => navigate('/')}
        >
            <div className="curr-page">
                {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

                {/* Add-course popup overlay */}
                {addPopup && (
                    <div className="curr-overlay" onClick={() => { setAddPopup(null); setAddSearch('') }}>
                        <div className="curr-popup" onClick={e => e.stopPropagation()}>
                            <div className="curr-popup-header">
                                <div>
                                    <div className="curr-popup-eyebrow">Gán môn học vào</div>
                                    <div className="curr-popup-title">Kỳ {addPopup.term}</div>
                                </div>
                                <button className="curr-popup-close" onClick={() => { setAddPopup(null); setAddSearch('') }} type="button">×</button>
                            </div>

                            <input
                                className="curr-popup-search"
                                placeholder="Tìm theo mã hoặc tên môn..."
                                value={addSearch}
                                onChange={e => setAddSearch(e.target.value)}
                                autoFocus
                            />

                            <div className="curr-popup-list">
                                {availForAdd.length === 0
                                    ? <div className="curr-popup-empty">Không có môn nào phù hợp hoặc tất cả đã được gán</div>
                                    : availForAdd.slice(0, 12).map(c => (
                                        <div key={c.id} className="curr-popup-item" onClick={() => handleAddToTerm(c)}>
                                            <div className="curr-popup-item-info">
                                                <span className="curr-popup-item-code">{c.code}</span>
                                                <span className="curr-popup-item-name">{c.name}</span>
                                            </div>
                                            <span className="curr-popup-item-credits">{c.credits}tc</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )}

                <div className="curr-wrap">
                    {/* ══ LEFT SIDEBAR ══ */}
                    <div className="curr-sidebar">
                        {/* Context selectors */}
                        <div className="curr-context">
                            <div className="curr-ctx-label">Ngành</div>
                            <select
                                className="curr-ctx-select"
                                value={selectedMajorId}
                                onChange={e => handleMajorChange(e.target.value)}
                            >
                                {majors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>

                            <div className="curr-ctx-label" style={{ marginTop: 12 }}>Chuyên ngành</div>
                            <select
                                className="curr-ctx-select"
                                value={selectedSpecId}
                                onChange={e => handleSpecChange(e.target.value)}
                            >
                                {specs.length === 0
                                    ? <option disabled>Chưa có chuyên ngành</option>
                                    : specs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                                }
                            </select>

                            {narrowSpecs.length > 0 && (
                                <>
                                    <div className="curr-ctx-label" style={{ marginTop: 12 }}>Chuyên ngành hẹp</div>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <select
                                            className="curr-ctx-select"
                                            value={selectedNsId}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setSelectedNsId(val);
                                                if (val) {
                                                    setMode('ns');
                                                } else {
                                                    setMode('spec');
                                                }
                                            }}
                                            style={{ flex: 1 }}
                                        >
                                            <option value="">-- Chọn chuyên ngành hẹp --</option>
                                            {narrowSpecs.map(ns => (
                                                <option key={ns.id} value={ns.id}>{ns.name}</option>
                                            ))}
                                        </select>
                                        {selectedNsId && (
                                            <button
                                                className="curr-btn curr-btn-ghost"
                                                onClick={() => {
                                                    setSelectedNsId('');
                                                    setMode('spec');
                                                }}
                                                type="button"
                                                title="Bỏ chọn chuyên ngành hẹp"
                                                style={{ padding: '7px 10px', height: '32px' }}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="curr-sidebar-divider" />

                        {/* Stats */}
                        <div className="curr-stats">
                            <div className="curr-stat-row">
                                <span className="curr-stat-label">Kỳ đã cấu hình</span>
                                <span className="curr-stat-val blue">{configuredTerms} / {termRange.length}</span>
                            </div>
                            <div className="curr-stat-row">
                                <span className="curr-stat-label">Tổng số môn</span>
                                <span className="curr-stat-val">{totalCourses} môn</span>
                            </div>
                            <div className="curr-stat-row">
                                <span className="curr-stat-label">Tổng tín chỉ</span>
                                <span className="curr-stat-val">{totalCredits} tc</span>
                            </div>
                        </div>

                        <div style={{ flex: 1 }} />

                        {/* Save button */}
                        <div className="curr-save-area">
                            <button
                                className="curr-btn curr-btn-ghost curr-btn-full"
                                onClick={() => navigate('/cm/courses')}
                                type="button"
                            >
                                Quản lý môn học →
                            </button>
                        </div>
                    </div>

                    {/* ══ MAIN: term builder ══ */}
                    <div className="curr-main">
                        {/* Header */}
                        <div className="curr-main-header">
                            <div>
                                <div className="curr-main-eyebrow">
                                    {mode === 'spec' ? 'Specialization · Kỳ 1–9' : 'Narrow Specialization · Kỳ 5–9'}
                                </div>
                                <div className="curr-main-title">{currentLabel || '—'}</div>
                            </div>
                            <button className="curr-btn curr-btn-save" onClick={saveConfig} type="button">
                                Lưu cấu hình
                            </button>
                        </div>

                        {/* Term grid */}
                        <div className="curr-term-scroll">
                            {loading && <div className="curr-ns-empty">Đang tải chương trình học...</div>}
                            {!loading && narrowSpecs.length === 0 && mode === 'ns' && (
                                <div className="curr-ns-empty">
                                    <div className="curr-ns-empty-icon">🔬</div>
                                    <div>Chuyên ngành <strong>{selectedSpec?.name}</strong> chưa có Narrow Specialization nào.</div>
                                    <button className="curr-btn curr-btn-outline" onClick={() => navigate('/cm/catalog')} type="button">
                                        Tạo Narrow Spec →
                                    </button>
                                </div>
                            )}
                            {!loading && (narrowSpecs.length > 0 || mode === 'spec') && (
                                <div className="curr-terms">
                                    {termRange.map(term => {
                                        const termCourses = termMap[term] || []
                                        const tc = termCredits(termCourses)
                                        return (
                                            <div key={term} className="curr-term-card">
                                                {/* Term header */}
                                                <div className="curr-term-head">
                                                    <div className="curr-term-num">Kỳ {term}</div>
                                                    <CreditBar credits={tc} />
                                                </div>

                                                {/* Course rows */}
                                                <div className="curr-course-list">
                                                    {termCourses.length === 0
                                                        ? <div className="curr-course-empty">Chưa có môn nào trong kỳ này</div>
                                                        : termCourses.map(c => (
                                                            <div key={c.id} className="curr-course-row">
                                                                <div className="curr-course-row-left">
                                                                    <span className="curr-course-code">{c.code}</span>
                                                                    <span className="curr-course-name">{c.name}</span>
                                                                 </div>
                                                                <div className="curr-course-row-right">
                                                                    <span className="curr-course-credits">{c.credits}tc</span>
                                                                    <button
                                                                        className="curr-course-remove"
                                                                        onClick={() => removeFromTerm(term, c.id)}
                                                                        title="Gỡ môn khỏi kỳ"
                                                                        type="button"
                                                                    >×</button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>

                                                {/* Add button */}
                                                <button
                                                    className="curr-add-term-btn"
                                                    onClick={() => { setAddPopup({ term }); setAddSearch('') }}
                                                    type="button"
                                                >
                                                    + Gán môn vào kỳ {term}
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}