import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import Layout from '../../components/layout/Layout'
import './CmCoursePage.css'
import {
    getCourses,
    getCourseDetail,
    createCourse,
    updateCourse,
    updatePrerequisites,
    uploadResource,
    deleteResource
} from '../../services/courseService'

const RESOURCE_TYPES = ['LINK', 'ARTICLE', 'DOCS', 'EXERCISE']

/* ── Panel modes ── */
const PANEL = {
    EMPTY: 'EMPTY',
    VIEW: 'VIEW',
    ADD: 'ADD',
    PREREQ: 'PREREQ',
}

/* ── Toast helper ── */
function Toast({ msg, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
    return (
        <div className={`course-toast course-toast--${type}`}>
            <span>{type === 'success' ? '✓' : '✗'}</span>
            {msg}
        </div>
    )
}

export default function CmCoursePage() {
    const navigate = useNavigate()
    const username = localStorage.getItem('username') || 'Content Manager'

    /* Data */
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)

    /* Selection */
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [panel, setPanel] = useState(PANEL.EMPTY)

    /* Filters */
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [filterGpa, setFilterGpa] = useState('')

    /* Form */
    const [form, setForm] = useState({ code: '', name: '', credits: 3, countsTowardGpa: true, description: '' })
    const [formErrors, setFormErrors] = useState({})

    /* Prereq panel */
    const [prereqSearch, setPrereqSearch] = useState('')
    const [pendingPrereqs, setPendingPrereqs] = useState([])
    const [prereqTarget, setPrereqTarget] = useState(null)

    /* Resources panel (inside VIEW) */
    const [resources, setResources] = useState([])
    const [newResource, setNewResource] = useState({ title: '', url: '', resourceType: 'LINK', file: null })

    /* Toast */
    const [toast, setToast] = useState(null)

    const showToast = (msg, type = 'success') => setToast({ msg, type })

    /* Load Courses */
    const loadCourses = async () => {
        try {
            setLoading(true)
            const data = await getCourses()
            setCourses(data.content || [])
        } catch (err) {
            console.error("Failed to load courses:", err)
            showToast("Lỗi khi tải danh sách môn học", "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCourses()
    }, [])

    /* ── Filtered courses ── */
    const filtered = courses.filter(c => {
        if (filterStatus === 'active' && !c.isActive) return false
        if (filterStatus === 'inactive' && c.isActive) return false
        if (filterGpa === 'gpa' && !c.countsTowardGpa) return false
        if (filterGpa === 'nogpa' && c.countsTowardGpa) return false
        if (search) {
            const q = search.toLowerCase()
            return c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
        }
        return true
    })

    /* ── Handlers ── */
    async function selectCourse(c) {
        try {
            setLoading(true)
            const detail = await getCourseDetail(c.id)
            setSelectedCourse(detail)
            setForm({
                code: detail.code,
                name: detail.name,
                credits: detail.credits,
                countsTowardGpa: detail.countsTowardGpa,
                description: detail.description || '',
                isActive: detail.isActive
            })
            setFormErrors({})
            setPanel(PANEL.VIEW)
            setResources(detail.learningResources || [])
        } catch (err) {
            console.error("Failed to load course detail:", err)
            showToast("Không thể tải chi tiết môn học", "error")
        } finally {
            setLoading(false)
        }
    }

    function openAdd() {
        setSelectedCourse(null)
        setForm({ code: '', name: '', credits: 3, countsTowardGpa: true, description: '', isActive: true })
        setFormErrors({})
        setPanel(PANEL.ADD)
    }

    function openPrereq(course) {
        setPrereqTarget(course)
        setPendingPrereqs(course.prerequisites ? course.prerequisites.map(p => p.id) : [])
        setPrereqSearch('')
        setPanel(PANEL.PREREQ)
    }

    function validateForm() {
        const errs = {}
        if (!form.code.trim()) errs.code = 'Bắt buộc'
        else if (form.code.length > 20) errs.code = 'Tối đa 20 ký tự'
        else if (!/^[a-zA-Z0-9]+$/.test(form.code)) errs.code = 'Chỉ chữ và số'
        if (!form.name.trim()) errs.name = 'Bắt buộc'
        if (form.credits < 1 || form.credits > 10) errs.credits = '1–10 tín chỉ'
        return errs
    }

    async function saveCourse() {
        const errs = validateForm()
        if (Object.keys(errs).length > 0) { setFormErrors(errs); return }

        const payload = {
            code: form.code,
            name: form.name,
            credits: Number(form.credits),
            countsTowardGpa: form.countsTowardGpa,
            description: form.description || '',
            isActive: form.isActive
        }

        try {
            if (panel === PANEL.ADD) {
                if (courses.some(c => c.code === form.code)) {
                    setFormErrors({ code: 'Mã môn đã tồn tại (NAC-35-02)' }); return
                }
                const newC = await createCourse(payload)
                showToast('Đã tạo môn học thành công!')
                await loadCourses()
                await selectCourse(newC)
            } else {
                if (courses.some(c => c.code === form.code && c.id !== selectedCourse.id)) {
                    setFormErrors({ code: 'Mã môn đã tồn tại (NAC-35-02)' }); return
                }
                const updated = await updateCourse(selectedCourse.id, payload)
                showToast('Đã lưu thay đổi!')
                await loadCourses()
                await selectCourse(updated)
            }
        } catch (err) {
            console.error("Failed to save course:", err)
            showToast("Lỗi khi lưu môn học: " + (err.response?.data?.message || err.message), "error")
        }
    }



    async function savePrereqs() {
        if (pendingPrereqs.length > 5) { showToast('Tối đa 5 môn tiên quyết (BV-22)', 'error'); return }
        try {
            const updatedDetail = await updatePrerequisites(prereqTarget.id, pendingPrereqs)
            showToast('Đã cập nhật tiên quyết!')
            await loadCourses()
            await selectCourse(updatedDetail)
        } catch (err) {
            console.error("Failed to update prerequisites:", err)
            showToast("Lỗi khi cập nhật môn tiên quyết: " + (err.response?.data?.message || err.message), "error")
        }
    }

    async function addResource() {
        if (!newResource.title || (!newResource.url && !newResource.file)) return
        if (resources.length >= 10) { showToast('Tối đa 10 tài nguyên (BV-23)', 'error'); return }
        try {
            const added = await uploadResource(selectedCourse.id, newResource.title, newResource.resourceType, newResource.url, newResource.file)
            setResources(p => [...p, added])
            setNewResource({ title: '', url: '', resourceType: 'LINK', file: null })
            showToast('Đã thêm tài nguyên!')
        } catch (err) {
            console.error("Failed to add resource:", err)
            showToast("Lỗi khi thêm tài nguyên: " + (err.response?.data?.message || err.message), "error")
        }
    }

    async function removeResource(id) {
        try {
            await deleteResource(id)
            setResources(p => p.filter(r => r.id !== id))
            showToast('Đã xóa tài nguyên')
        } catch (err) {
            console.error("Failed to delete resource:", err)
            showToast("Lỗi khi xóa tài nguyên: " + (err.response?.data?.message || err.message), "error")
        }
    }

    const handleLogout = async () => { await logout(); navigate('/login') }

    /* ── Prerequisites for panel ── */
    const availableForPrereq = courses.filter(c =>
        c.id !== prereqTarget?.id &&
        c.isActive &&
        (prereqSearch === '' || c.name.toLowerCase().includes(prereqSearch.toLowerCase()) || c.code.toLowerCase().includes(prereqSearch.toLowerCase()))
    )

    /* ── Resource type badge ── */
    const resTypeBadge = (type) => {
        const map = { LINK: '#034EA2', ARTICLE: '#51B848', DOCS: '#6d28d9', EXERCISE: '#C45A0A' }
        return { background: map[type] + '18', color: map[type] }
    }

    /* ── Right panel ── */
    function renderPanel() {
        if (panel === PANEL.EMPTY) return (
            <div className="course-empty">
                <div className="course-empty-icon">📚</div>
                <div className="course-empty-text">Chọn một môn học để xem chi tiết<br />hoặc nhấn <strong>+ Thêm môn</strong> để tạo mới</div>
            </div>
        )

        if (panel === PANEL.PREREQ && prereqTarget) {
            const selectedPrereqCourses = courses.filter(c => pendingPrereqs.includes(c.id))
            return (
                <>
                    <div className="course-rp-header">
                        <div className="course-rp-meta">
                            <div className="course-rp-eyebrow">Cấu hình tiên quyết</div>
                            <div className="course-rp-title">{prereqTarget.code} — {prereqTarget.name}</div>
                        </div>
                        <div className="course-rp-btns">
                            <button className="course-btn course-btn-ghost" onClick={() => selectCourse(prereqTarget)} type="button">Hủy</button>
                            <button className="course-btn course-btn-save" onClick={savePrereqs} type="button">Lưu tiên quyết</button>
                        </div>
                    </div>
                    <div className="course-rp-body">
                        <div className="course-prereq-info">
                            <span className="course-prereq-info-icon">ℹ</span>
                            Quan hệ tiên quyết toàn cục (BR-13): hệ thống kiểm tra vòng tròn và từ chối nếu vi phạm. Tối đa 5 môn tiên quyết (BV-22).
                        </div>

                        {/* Selected prereqs */}
                        <div className="course-sec-title">Đã chọn ({pendingPrereqs.length}/5)</div>
                        <div className="course-prereq-selected">
                            {selectedPrereqCourses.length === 0
                                ? <div className="course-prereq-empty">Chưa có môn tiên quyết nào</div>
                                : selectedPrereqCourses.map(c => (
                                    <div key={c.id} className="course-prereq-chip">
                                        <span className="course-prereq-chip-code">{c.code}</span>
                                        <span className="course-prereq-chip-name">{c.name}</span>
                                        <button
                                            className="course-prereq-chip-x"
                                            onClick={() => setPendingPrereqs(p => p.filter(id => id !== c.id))}
                                            type="button"
                                        >×</button>
                                    </div>
                                ))
                            }
                        </div>

                        {/* Search & add */}
                        <div className="course-sec-title" style={{ marginTop: 16 }}>Tìm môn để thêm</div>
                        <input
                            className="course-input"
                            placeholder="Tìm theo mã hoặc tên môn..."
                            value={prereqSearch}
                            onChange={e => setPrereqSearch(e.target.value)}
                        />
                        <div className="course-prereq-list">
                            {availableForPrereq.slice(0, 8).map(c => {
                                const already = pendingPrereqs.includes(c.id)
                                return (
                                    <div key={c.id} className={`course-prereq-pick${already ? ' selected' : ''}`}>
                                        <div className="course-prereq-pick-info">
                                            <span className="course-prereq-chip-code">{c.code}</span>
                                            <span className="course-prereq-chip-name">{c.name}</span>
                                            <span className="course-prereq-credits">{c.credits}tc</span>
                                        </div>
                                        <button
                                            className={`course-prereq-pick-btn${already ? ' active' : ''}`}
                                            onClick={() => {
                                                if (already) setPendingPrereqs(p => p.filter(id => id !== c.id))
                                                else if (pendingPrereqs.length >= 5) showToast('Tối đa 5 môn tiên quyết', 'error')
                                                else setPendingPrereqs(p => [...p, c.id])
                                            }}
                                            type="button"
                                        >{already ? '✓ Đã chọn' : '+ Thêm'}</button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>
            )
        }

        const isAdd = panel === PANEL.ADD
        const course = selectedCourse

        return (
            <>
                <div className="course-rp-header">
                    <div className="course-rp-meta">
                        <div className="course-rp-eyebrow">{isAdd ? 'Thêm môn học mới' : `Môn học · ${course?.code}`}</div>
                        <div className="course-rp-title">{isAdd ? 'Môn học mới' : course?.name}</div>
                    </div>
                    <div className="course-rp-btns">
                        <button className="course-btn course-btn-save" onClick={saveCourse} type="button">
                            {isAdd ? 'Tạo môn học' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </div>

                <div className="course-rp-body">
                    {/* Status Dropdown */}
                    {!isAdd && (
                        <div className="course-status-row">
                            <span className="course-status-label">Trạng thái môn học</span>
                            <select
                                className={`course-status-select course-status-select--${form.isActive ? 'active' : 'inactive'}`}
                                value={form.isActive ? 'active' : 'inactive'}
                                onChange={e => setForm(p => ({ ...p, isActive: e.target.value === 'active' }))}
                            >
                                <option value="active">🟢 Đang kích hoạt</option>
                                <option value="inactive">⚫ Đã vô hiệu hóa</option>
                            </select>
                        </div>
                    )}

                    {/* Form */}
                    <div className="course-form-grid">
                        <FormField label="Mã môn" required error={formErrors.code} hint="Tối đa 20 ký tự, chỉ chữ và số (BV-21)">
                            <input
                                className={`course-input${formErrors.code ? ' has-error' : ''}`}
                                placeholder="Vd: ML401"
                                maxLength={20}
                                value={form.code}
                                onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                            />
                        </FormField>
                        <FormField label="Số tín chỉ" required error={formErrors.credits} hint="1–10 (BV-20)">
                            <input
                                className={`course-input${formErrors.credits ? ' has-error' : ''}`}
                                type="number"
                                min={1}
                                max={10}
                                value={form.credits}
                                onChange={e => setForm(p => ({ ...p, credits: e.target.value }))}
                            />
                        </FormField>
                    </div>

                    <FormField label="Tên môn học" required error={formErrors.name}>
                        <input
                            className={`course-input${formErrors.name ? ' has-error' : ''}`}
                            placeholder="Vd: Machine Learning"
                            maxLength={255}
                            value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        />
                    </FormField>

                    <FormField label="Mô tả">
                        <textarea
                            className="course-input course-textarea"
                            placeholder="Mô tả ngắn về môn học (tùy chọn)..."
                            value={form.description}
                            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                        />
                    </FormField>

                    <label className="course-checkbox-row">
                        <input
                            type="checkbox"
                            className="course-checkbox"
                            checked={form.countsTowardGpa}
                            onChange={e => setForm(p => ({ ...p, countsTowardGpa: e.target.checked }))}
                        />
                        <div>
                            <div className="course-checkbox-label">Tính vào GPA</div>
                            <div className="course-checkbox-hint">Bỏ check cho các môn như OJT, Giáo dục QP, Vovinam (BR-31)</div>
                        </div>
                    </label>

                    {/* Prerequisites section */}
                    {!isAdd && course?.prerequisites?.length > 0 && (
                        <>
                            <div className="course-divider" />
                            <div className="course-sec-title">Môn tiên quyết</div>
                            <div className="course-prereq-tags">
                                {course.prerequisites.map(p => (
                                    <span key={p.id} className="course-prereq-tag">
                                        {p.code} — {p.name}
                                    </span>
                                ))}
                                <button className="course-prereq-edit-btn" onClick={() => openPrereq(course)} type="button">
                                    ✏ Chỉnh sửa
                                </button>
                            </div>
                        </>
                    )}
                    {!isAdd && (!course?.prerequisites || course.prerequisites.length === 0) && (
                        <>
                            <div className="course-divider" />
                            <div className="course-prereq-tags">
                                <span className="course-prereq-none">Chưa có môn tiên quyết</span>
                                <button className="course-prereq-edit-btn" onClick={() => openPrereq(course)} type="button">
                                    + Thêm tiên quyết
                                </button>
                            </div>
                        </>
                    )}

                    {/* Learning Resources */}
                    {!isAdd && (
                        <>
                            <div className="course-divider" />
                            <div className="course-sec-title" style={{ marginBottom: 12 }}>
                                Tài nguyên học tập
                                <span className="course-resource-count">{resources.length}/10</span>
                            </div>

                            <div className="course-resources-body">
                                {/* Resource list */}
                                <div className="course-resource-list" style={{ marginBottom: '16px' }}>
                                    {resources.length === 0
                                        ? <div className="course-prereq-empty">Chưa có tài nguyên nào</div>
                                        : resources.map((r, i) => (
                                            <div key={r.id} className="course-resource-item">
                                                <span className="course-resource-order">{i + 1}</span>
                                                <div className="course-resource-info">
                                                    <div className="course-resource-title">{r.title}</div>
                                                    <a className="course-resource-url" href={r.url} target="_blank" rel="noreferrer">{r.url}</a>
                                                </div>
                                                <span className="course-resource-type" style={resTypeBadge(r.resourceType)}>{r.resourceType}</span>
                                                <button className="course-resource-del" onClick={() => removeResource(r.id)} type="button">×</button>
                                            </div>
                                        ))
                                    }
                                </div>

                                {/* Add new resource */}
                                <div className="course-resource-add" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div className="course-sec-title" style={{ fontSize: '11px', margin: '4px 0 0' }}>Thêm tài nguyên mới</div>
                                    <input
                                        className="course-input"
                                        placeholder="Tên tài nguyên..."
                                        value={newResource.title}
                                        onChange={e => setNewResource(p => ({ ...p, title: e.target.value }))}
                                    />
                                    <div className="course-resource-add-row" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <input
                                            className="course-input"
                                            placeholder="URL liên kết (nếu dùng link)..."
                                            value={newResource.url}
                                            onChange={e => setNewResource(p => ({ ...p, url: e.target.value }))}
                                            style={{ flex: 1 }}
                                        />
                                        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>HOẶC</span>
                                        <input
                                            type="file"
                                            className="course-input"
                                            onChange={e => setNewResource(p => ({ ...p, file: e.target.files[0] }))}
                                            style={{ flex: 1, padding: '5px' }}
                                        />
                                    </div>
                                    <div className="course-resource-add-row" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <select
                                            className="course-input course-select"
                                            value={newResource.resourceType}
                                            onChange={e => setNewResource(p => ({ ...p, resourceType: e.target.value }))}
                                            style={{ flex: 1 }}
                                        >
                                            {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <button className="course-btn course-btn-save" onClick={addResource} type="button" style={{ flexShrink: 0 }}>+ Thêm tài nguyên</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {isAdd && (
                        <p className="course-form-note">
                            Sau khi tạo, bạn có thể cấu hình <strong>tiên quyết</strong> và <strong>tài nguyên học tập</strong> từ trang chi tiết môn.
                        </p>
                    )}
                </div>
            </>
        )
    }

    return (
        <Layout
            role="cm"
            user={{ name: username }}
            breadcrumbs={[
                { label: 'Quản lý Curriculum', to: '/cm/curriculum' },
                { label: 'Danh sách môn học' }
            ]}
            onLogout={handleLogout}
            onLogoClick={() => navigate('/')}
            onGoHome={() => navigate('/')}
        >
            <div className="course-page">
                {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

                <div className="course-wrap">
                    {/* ══ LEFT: list ══ */}
                    <div className="course-list-panel">
                        {/* Toolbar */}
                        <div className="course-list-top">
                            <div className="course-list-search-row">
                                <input
                                    className="course-search"
                                    placeholder="Tìm theo mã hoặc tên môn..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <button className="course-btn course-btn-save" onClick={openAdd} type="button">+ Thêm môn</button>
                            </div>
                            <div className="course-filter-row">
                                <select
                                    className={`course-filter-select${filterStatus ? ' active' : ''}`}
                                    value={filterStatus}
                                    onChange={e => setFilterStatus(e.target.value)}
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="active">Đang kích hoạt</option>
                                    <option value="inactive">Đã vô hiệu hóa</option>
                                </select>
                                <select
                                    className={`course-filter-select${filterGpa ? ' active' : ''}`}
                                    value={filterGpa}
                                    onChange={e => setFilterGpa(e.target.value)}
                                >
                                    <option value="">Tất cả (GPA)</option>
                                    <option value="gpa">Tính GPA</option>
                                    <option value="nogpa">Không tính GPA</option>
                                </select>
                                <span className="course-count-label">{filtered.length} môn</span>
                            </div>
                        </div>

                        {/* List */}
                        <div className="course-list-scroll">
                            {loading && <div className="course-list-empty">Đang tải...</div>}
                            {!loading && filtered.length === 0 && (
                                <div className="course-list-empty">Không tìm thấy môn học nào</div>
                            )}
                            {!loading && filtered.map(c => {
                                const isSel = selectedCourse?.id === c.id && panel !== PANEL.ADD
                                return (
                                    <div
                                        key={c.id}
                                        className={`course-row${isSel ? ' sel' : ''}${!c.isActive ? ' inactive' : ''}`}
                                        onClick={() => selectCourse(c)}
                                    >
                                        <div className="course-row-left">
                                            <span className={`course-row-dot ${c.isActive ? 'dot-active' : 'dot-hidden'}`} />
                                            <div>
                                                <div className="course-row-code">{c.code}</div>
                                                <div className="course-row-name">{c.name}</div>
                                            </div>
                                        </div>
                                        <div className="course-row-right">
                                            <span className="course-row-credits">{c.credits}tc</span>
                                            {!c.countsTowardGpa && <span className="course-row-nogpa">No GPA</span>}
                                            {c.prerequisites?.length > 0 && (
                                                <span className="course-row-prereq" title="Có môn tiên quyết">🔗{c.prerequisites.length}</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* ══ RIGHT: detail ══ */}
                    <div className="course-right-panel">
                        {renderPanel()}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

/* ── FormField helper ── */
function FormField({ label, required, hint, error, children }) {
    return (
        <div className="course-form-field">
            <div className="course-form-label">
                {label}{required && <span className="course-req">*</span>}
            </div>
            {children}
            {error && <div className="course-field-error">⚠ {error}</div>}
            {hint && !error && <div className="course-field-hint">{hint}</div>}
        </div>
    )
}
