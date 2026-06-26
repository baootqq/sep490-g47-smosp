import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import Layout from '../../components/layout/Layout'
import './CmCatalogPage.css'

/* ── Mock data — thay bằng GET /api/cm/catalog/tree ────────── */
const MOCK_TREE = [
    {
        id: 'cntt', code: 'IT', name: 'Công nghệ thông tin',
        disciplineGroup: 'IT', isActive: true,
        specializations: [
            {
                id: 'se', code: 'SE', name: 'Software Engineering', isActive: true,
                narrowSpecs: [
                    { id: 'aiml', code: 'SE-AIML', name: 'AI/ML Engineering', isPublished: true, publishedAt: '10/05/2026', courses: 8, tw: 78.4, skills: 12, interests: 5 },
                    { id: 'backend', code: 'SE-BE', name: 'Backend Engineering', isPublished: true, publishedAt: '10/05/2026', courses: 7, tw: 72.1, skills: 10, interests: 4 },
                    { id: 'frontend', code: 'SE-FE', name: 'Frontend Dev', isPublished: true, publishedAt: '10/05/2026', courses: 6, tw: 68.5, skills: 9, interests: 4 },
                    { id: 'devops', code: 'SE-DO', name: 'Cloud & DevOps', isPublished: true, publishedAt: '10/05/2026', courses: 7, tw: 65.2, skills: 8, interests: 3 },
                    { id: 'embedded', code: 'SE-EMB', name: 'Embedded Systems', isPublished: false, publishedAt: null, courses: 3, tw: null, skills: 0, interests: 0 },
                ],
            },
            {
                id: 'is', code: 'IS', name: 'Information Systems', isActive: true,
                narrowSpecs: [
                    { id: 'ba', code: 'IS-BA', name: 'Business Analysis', isPublished: true, publishedAt: '01/03/2026', courses: 6, tw: 61.0, skills: 7, interests: 3 },
                    { id: 'pm', code: 'IS-PM', name: 'Project Management', isPublished: false, publishedAt: null, courses: 5, tw: null, skills: 4, interests: 2 },
                ],
            },
        ],
    },
    {
        id: 'qtkd', code: 'BUS', name: 'Quản trị kinh doanh',
        disciplineGroup: 'Business', isActive: true,
        specializations: [
            {
                id: 'mkt', code: 'MKT', name: 'Marketing', isActive: true,
                narrowSpecs: [
                    { id: 'digital-mkt', code: 'MKT-DM', name: 'Digital Marketing', isPublished: true, publishedAt: '15/04/2026', courses: 6, tw: 55.3, skills: 8, interests: 4 },
                    { id: 'brand', code: 'MKT-BR', name: 'Brand Management', isPublished: false, publishedAt: null, courses: 2, tw: null, skills: 0, interests: 0 },
                ],
            },
        ],
    },
    {
        id: 'nn', code: 'ENG', name: 'Ngôn ngữ Anh',
        disciplineGroup: 'Languages', isActive: false,
        specializations: [],
    },
    {
        id: 'dgraph', code: 'DA', name: 'Thiết kế đồ họa',
        disciplineGroup: 'DigitalArt', isActive: true,
        specializations: [],
    },
]

const DISCIPLINE_GROUPS = ['IT', 'Business', 'Languages', 'Law', 'DigitalArt']

/* ── Checklist helper ── */
function getChecklist(ns, specIsActive) {
    return [
        { ok: specIsActive, label: 'Specialization cha đang active', val: specIsActive ? 'OK' : 'Chưa active' },
        { ok: ns.courses >= 5, label: 'Môn chuyên sâu (5–10 · BV-18)', val: `${ns.courses} môn` },
        { ok: ns.skills > 0, label: 'Tag map kỹ năng đã cấu hình', val: ns.skills > 0 ? `${ns.skills} skill` : '0 mapping' },
        { ok: ns.interests > 0, label: 'Tag map sở thích đã cấu hình', val: ns.interests > 0 ? `${ns.interests} option` : '0 mapping' },
        { ok: ns.tw !== null, label: 'Compatibility Score config', val: ns.tw !== null ? `α auto` : 'Chưa thiết lập' },
    ]
}

/* ── Right panel modes ── */
const PANEL = { EMPTY: 'EMPTY', VIEW_NS: 'VIEW_NS', EDIT_NS: 'EDIT_NS', ADD_NS: 'ADD_NS', ADD_SPEC: 'ADD_SPEC', ADD_MAJOR: 'ADD_MAJOR' }

export default function CmCatalogPage() {
    const navigate = useNavigate()
    const username = localStorage.getItem('username') || 'Content Manager'

    /* Tree expand state */
    const [expandedMajors, setExpandedMajors] = useState({ cntt: true })
    const [expandedSpecs, setExpandedSpecs] = useState({ se: true })

    /* Selected node */
    const [selectedNS, setSelectedNS] = useState({ ns: MOCK_TREE[0].specializations[0].narrowSpecs[0], spec: MOCK_TREE[0].specializations[0], major: MOCK_TREE[0] })
    const [selectedSpec, setSelectedSpec] = useState(null)

    /* Panel mode */
    const [panel, setPanel] = useState(PANEL.VIEW_NS)

    /* Filters */
    const [filterMajor, setFilterMajor] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [search, setSearch] = useState('')

    /* Form state for add/edit */
    const [form, setForm] = useState({ name: '', code: '', parentId: '', description: '', disciplineGroup: '' })

    /* Status dropdown on detail panel */
    const [nsStatus, setNsStatus] = useState('published') // 'published' | 'draft' | 'hidden'

    /* Tree data (mock — không thay đổi trong mockup) */
    const tree = MOCK_TREE

    /* ── Filter tree ── */
    const filteredTree = tree.filter(major => {
        if (filterMajor && major.id !== filterMajor) return false
        if (filterStatus === 'hidden' && major.isActive) return false
        if (filterStatus && filterStatus !== 'hidden' && !major.isActive) return false
        const nameMatch = !search || major.name.toLowerCase().includes(search.toLowerCase())
        const nsMatch = major.specializations.some(s =>
            s.narrowSpecs.some(ns => ns.name.toLowerCase().includes(search.toLowerCase()))
        )
        return nameMatch || nsMatch
    })

    /* ── Handlers ── */
    function toggleMajor(id) {
        setExpandedMajors(p => ({ ...p, [id]: !p[id] }))
    }

    function toggleSpec(id) {
        setExpandedSpecs(p => ({ ...p, [id]: !p[id] }))
    }

    function selectNS(ns, spec, major) {
        setSelectedNS({ ns, spec, major })
        setSelectedSpec(null)
        setNsStatus(ns.isPublished ? 'published' : 'draft')
        setPanel(PANEL.VIEW_NS)
    }

    function openAddMajor() {
        setSelectedNS(null); setSelectedSpec(null)
        setForm({ name: '', code: '', parentId: '', description: '', disciplineGroup: '' })
        setPanel(PANEL.ADD_MAJOR)
    }

    function openAddSpec(parentMajorId = '') {
        setSelectedNS(null); setSelectedSpec(null)
        setForm({ name: '', code: '', parentId: parentMajorId, description: '', disciplineGroup: '' })
        setPanel(PANEL.ADD_SPEC)
    }

    function openAddNS(parentSpecId = '') {
        setSelectedNS(null); setSelectedSpec(null)
        setForm({ name: '', code: '', parentId: parentSpecId, description: '', disciplineGroup: '' })
        setPanel(PANEL.ADD_NS)
    }

    function openEditNS() {
        if (!selectedNS) return
        setForm({
            name: selectedNS.ns.name,
            code: selectedNS.ns.code,
            parentId: selectedNS.spec.id,
            description: '',
            disciplineGroup: '',
        })
        setPanel(PANEL.EDIT_NS)
    }

    function cancelForm() {
        setPanel(selectedNS ? PANEL.VIEW_NS : PANEL.EMPTY)
    }

    const handleLogout = async () => { await logout(); navigate('/login') }

    /* ── Active filter tags ── */
    const activeTags = [
        filterMajor && { label: tree.find(m => m.id === filterMajor)?.name, clear: () => setFilterMajor('') },
        filterStatus && { label: { published: 'Published', draft: 'Draft', hidden: 'Ẩn' }[filterStatus], clear: () => setFilterStatus('') },
    ].filter(Boolean)

    /* ── NS status options ── */
    const statusOptions = [
        { value: 'published', label: '● Published', cls: 'status-opt-pub' },
        { value: 'draft', label: '● Draft', cls: 'status-opt-draft' },
        { value: 'hidden', label: '● Ẩn', cls: 'status-opt-hidden' },
    ]

    /* ── Render right panel ── */
    function renderPanel() {
        /* EMPTY */
        if (panel === PANEL.EMPTY) return (
            <div className="cc-empty">
                <div className="cc-empty-icon">⬡</div>
                <div className="cc-empty-text">Chọn một mục trên cây để xem chi tiết<br />hoặc nhấn nút thêm mới</div>
            </div>
        )

        /* VIEW NS */
        if (panel === PANEL.VIEW_NS && selectedNS) {
            const { ns, spec, major } = selectedNS
            const checklist = getChecklist(ns, spec.isActive)
            const allOk = checklist.every(c => c.ok)
            return (
                <>
                    <div className="cc-rp-header">
                        <div className="cc-rp-meta">
                            <div className="cc-rp-eyebrow">Narrow Specialization · {spec.name}</div>
                            <div className="cc-rp-title">{ns.name}</div>
                            <div className="cc-rp-subtitle">Mã: {ns.code} · {major.name}</div>
                        </div>
                        <div className="cc-rp-btns">
                            <button className="cc-btn cc-btn-ghost" onClick={openEditNS} type="button">Sửa thông tin</button>
                            <button className="cc-btn cc-btn-danger-sm" type="button">Xóa</button>
                        </div>
                    </div>

                    <div className="cc-rp-body">
                        {/* Status dropdown */}
                        <div className="cc-status-row">
                            <span className="cc-status-label">Trạng thái</span>
                            <select
                                className={`cc-status-select cc-status-select--${nsStatus}`}
                                value={nsStatus}
                                onChange={e => setNsStatus(e.target.value)}
                            >
                                {statusOptions.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            {nsStatus === 'published' && (
                                <span className="cc-status-since">kể từ {ns.publishedAt}</span>
                            )}
                            {!allOk && nsStatus !== 'published' && (
                                <span className="cc-status-warn">⚠ Checklist chưa đủ để publish</span>
                            )}
                        </div>

                        {/* 4 metrics */}
                        <div className="cc-info-grid">
                            <div className="cc-info-box"><div className="cc-info-lbl">Môn chuyên sâu</div><div className={`cc-info-val${ns.courses >= 5 ? ' blue' : ' orange'}`}>{ns.courses} môn</div></div>
                            <div className="cc-info-box"><div className="cc-info-lbl">Trending Weight</div><div className={`cc-info-val${ns.tw ? ' green' : ' muted'}`}>{ns.tw ?? '—'}</div></div>
                            <div className="cc-info-box"><div className="cc-info-lbl">Kỹ năng liên kết</div><div className="cc-info-val">{ns.skills} skill</div></div>
                            <div className="cc-info-box"><div className="cc-info-lbl">Sở thích liên kết</div><div className="cc-info-val">{ns.interests} option</div></div>
                        </div>

                        {/* Checklist */}
                        <div className="cc-sec-title">Checklist publish</div>
                        <div className="cc-checklist">
                            {checklist.map((c, i) => (
                                <div key={i} className="cc-check-row">
                                    <span className={`cc-ck ${c.ok ? 'cc-ck-ok' : 'cc-ck-err'}`}>{c.ok ? '✓' : '✗'}</span>
                                    <span className="cc-check-lbl">{c.label}</span>
                                    <span className={`cc-check-val${!c.ok ? ' cc-check-val--warn' : ''}`}>{c.val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Link section */}
                        <div className="cc-sec-title" style={{ marginTop: 16 }}>Cấu hình liên kết</div>
                        <div className="cc-link-section">
                            <button className="cc-link-btn" onClick={() => navigate('')} type="button">
                                <div className="cc-link-left">
                                    <span className="cc-link-badge cc-lb-skill">{ns.skills} kỹ năng</span>
                                    Quản lý kỹ năng liên kết
                                </div>
                                <span className="cc-link-arrow">→</span>
                            </button>
                            <button className="cc-link-btn" onClick={() => navigate('')} type="button">
                                <div className="cc-link-left">
                                    <span className="cc-link-badge cc-lb-interest">{ns.interests} sở thích</span>
                                    Quản lý sở thích liên kết
                                </div>
                                <span className="cc-link-arrow">→</span>
                            </button>
                            <button className="cc-link-btn" onClick={() => navigate('')} type="button">
                                <div className="cc-link-left">
                                    <span className="cc-link-badge cc-lb-tw">{ns.tw ? `TW: ${ns.tw}` : 'TW: chưa có'}</span>
                                    Xem lịch sử Trending Weight
                                </div>
                                <span className="cc-link-arrow">→</span>
                            </button>
                        </div>
                    </div>
                </>
            )
        }

        /* EDIT NS */
        if (panel === PANEL.EDIT_NS && selectedNS) {
            const { ns, spec } = selectedNS
            return (
                <>
                    <div className="cc-rp-header">
                        <div className="cc-rp-meta">
                            <div className="cc-rp-eyebrow">Chỉnh sửa · Narrow Specialization</div>
                            <div className="cc-rp-title">{ns.name}</div>
                        </div>
                        <div className="cc-rp-btns">
                            <button className="cc-btn cc-btn-ghost" onClick={cancelForm} type="button">Hủy</button>
                            <button className="cc-btn cc-btn-save" type="button">Lưu thay đổi</button>
                        </div>
                    </div>
                    <div className="cc-rp-body">
                        <FormRow label="Tên chuyên ngành hẹp" required maxLen={100}>
                            <input className="cc-input" type="text" defaultValue={ns.name} maxLength={100} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Mã" required>
                            <input className="cc-input" type="text" defaultValue={ns.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Specialization cha" required>
                            <select className="cc-input cc-select" defaultValue={spec.id} onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))}>
                                {tree.flatMap(m => m.specializations).map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </FormRow>
                        <FormRow label="Mô tả" maxLen={500}>
                            <textarea className="cc-input cc-textarea" maxLength={500} defaultValue="" onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                        </FormRow>
                    </div>
                </>
            )
        }

        /* ADD NS */
        if (panel === PANEL.ADD_NS) {
            return (
                <>
                    <div className="cc-rp-header">
                        <div className="cc-rp-meta">
                            <div className="cc-rp-eyebrow">Thêm mới · Narrow Specialization</div>
                            <div className="cc-rp-title">Chuyên ngành hẹp mới</div>
                        </div>
                        <div className="cc-rp-btns">
                            <button className="cc-btn cc-btn-ghost" onClick={cancelForm} type="button">Hủy</button>
                            <button className="cc-btn cc-btn-save" type="button">Tạo NS</button>
                        </div>
                    </div>
                    <div className="cc-rp-body">
                        <FormRow label="Tên chuyên ngành hẹp" required maxLen={100}>
                            <input className="cc-input" type="text" placeholder="Vd: Cybersecurity Engineering" maxLength={100} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Mã" required hint="Mã duy nhất trong toàn hệ thống">
                            <input className="cc-input" type="text" placeholder="Vd: SE-SEC" onChange={e => setForm(p => ({ ...p, code: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Specialization cha" required>
                            <select className="cc-input cc-select" value={form.parentId} onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))}>
                                <option value="" disabled>Chọn Specialization...</option>
                                {tree.flatMap(m => m.specializations).map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({tree.find(m => m.specializations.includes(s))?.name})</option>
                                ))}
                            </select>
                        </FormRow>
                        <FormRow label="Mô tả" maxLen={500}>
                            <textarea className="cc-input cc-textarea" placeholder="Mô tả ngắn (tùy chọn, tối đa 500 ký tự)..." maxLength={500} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                        </FormRow>
                        <p className="cc-form-note">Sau khi tạo, NS sẽ ở trạng thái <strong>Draft</strong>. Cần cấu hình đầy đủ trước khi chuyển sang Published.</p>
                    </div>
                </>
            )
        }

        /* ADD SPEC */
        if (panel === PANEL.ADD_SPEC) {
            return (
                <>
                    <div className="cc-rp-header">
                        <div className="cc-rp-meta">
                            <div className="cc-rp-eyebrow">Thêm mới · Chuyên ngành (Specialization)</div>
                            <div className="cc-rp-title">Chuyên ngành mới</div>
                        </div>
                        <div className="cc-rp-btns">
                            <button className="cc-btn cc-btn-ghost" onClick={cancelForm} type="button">Hủy</button>
                            <button className="cc-btn cc-btn-save" type="button">Tạo Specialization</button>
                        </div>
                    </div>
                    <div className="cc-rp-body">
                        <FormRow label="Tên chuyên ngành" required maxLen={100}>
                            <input className="cc-input" type="text" placeholder="Vd: Artificial Intelligence" maxLength={100} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Mã" required>
                            <input className="cc-input" type="text" placeholder="Vd: AI" onChange={e => setForm(p => ({ ...p, code: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Major cha" required>
                            <select className="cc-input cc-select" value={form.parentId} onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))}>
                                <option value="" disabled>Chọn Major...</option>
                                {tree.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </FormRow>
                        <FormRow label="Mô tả" maxLen={500}>
                            <textarea className="cc-input cc-textarea" placeholder="Mô tả ngắn (tùy chọn)..." maxLength={500} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                        </FormRow>
                    </div>
                </>
            )
        }

        /* ADD MAJOR */
        if (panel === PANEL.ADD_MAJOR) {
            return (
                <>
                    <div className="cc-rp-header">
                        <div className="cc-rp-meta">
                            <div className="cc-rp-eyebrow">Thêm mới · Major (Ngành)</div>
                            <div className="cc-rp-title">Ngành mới</div>
                        </div>
                        <div className="cc-rp-btns">
                            <button className="cc-btn cc-btn-ghost" onClick={cancelForm} type="button">Hủy</button>
                            <button className="cc-btn cc-btn-save" type="button">Tạo Major</button>
                        </div>
                    </div>
                    <div className="cc-rp-body">
                        <FormRow label="Tên ngành" required maxLen={100}>
                            <input className="cc-input" type="text" placeholder="Vd: Luật" maxLength={100} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Mã ngành" required>
                            <input className="cc-input" type="text" placeholder="Vd: LAW" onChange={e => setForm(p => ({ ...p, code: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Nhóm ngành (discipline group)" required hint="Quyết định alpha_base mặc định cho các NS trong ngành này">
                            <select className="cc-input cc-select" value={form.disciplineGroup} onChange={e => setForm(p => ({ ...p, disciplineGroup: e.target.value }))}>
                                <option value="" disabled>Chọn nhóm ngành...</option>
                                {DISCIPLINE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </FormRow>
                        <p className="cc-form-note">Major mới sẽ ở trạng thái <strong>Active</strong> và hiển thị trong cây danh mục ngay sau khi tạo.</p>
                    </div>
                </>
            )
        }

        return null
    }

    return (
        <Layout
            role="cm"
            user={{ name: username }}
            breadcrumbs={[{ label: 'Quản lý catalog' }]}
            onLogout={handleLogout}
            onLogoClick={() => navigate('/')}
            onGoHome={() => navigate('/')}
        >
            <div className="cc-page">
                <div className="cc-wrap">

                    {/* ══ LEFT TREE ══ */}
                    <div className="cc-tree-panel">
                        <div className="cc-tree-top">
                            {/* Search */}
                            <input
                                className="cc-tree-search"
                                placeholder="Tìm theo tên ngành..."
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />

                            {/* Filter dropdowns */}
                            <div className="cc-filter-row">
                                <select
                                    className={`cc-filter-select${filterMajor ? ' active' : ''}`}
                                    value={filterMajor}
                                    onChange={e => setFilterMajor(e.target.value)}
                                >
                                    <option value="">Tất cả ngành</option>
                                    {tree.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                                <select
                                    className={`cc-filter-select${filterStatus ? ' active' : ''}`}
                                    value={filterStatus}
                                    onChange={e => setFilterStatus(e.target.value)}
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                    <option value="hidden">Ẩn</option>
                                </select>
                            </div>

                            {/* Active filter tags */}
                            {activeTags.length > 0 && (
                                <div className="cc-filter-tags">
                                    {activeTags.map((t, i) => (
                                        <span key={i} className="cc-filter-tag">
                                            {t.label}
                                            <button className="cc-filter-tag-x" onClick={t.clear} type="button">×</button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Chỉ có nút + Major trên header */}
                            <div className="cc-add-major-wrap">
                                <button className="cc-btn-add-major" onClick={openAddMajor} type="button">+ Major</button>
                            </div>
                        </div>

                        {/* Tree */}
                        <div className="cc-tree-scroll">
                            {filteredTree.length === 0 && (
                                <div className="cc-tree-empty">Không có kết quả</div>
                            )}
                            {filteredTree.map(major => (
                                <div key={major.id} className="cc-major-node">
                                    <div
                                        className="cc-major-head"
                                        onClick={() => toggleMajor(major.id)}
                                    >
                                        <span className={`cc-chevron${expandedMajors[major.id] ? ' open' : ''}`}>›</span>
                                        <span className="cc-node-label">{major.name}</span>
                                        <button
                                            className="cc-btn-inline cc-btn-inline--spec"
                                            onClick={e => { e.stopPropagation(); setForm({ name: '', code: '', parentId: major.id, description: '', disciplineGroup: '' }); setPanel(PANEL.ADD_SPEC) }}
                                            type="button"
                                            title={`Thêm chuyên ngành vào ${major.name}`}
                                        >+ Chuyên ngành</button>
                                        <span className={`cc-node-dot ${major.isActive ? 'dot-active' : 'dot-hidden'}`} title={major.isActive ? 'Active' : 'Ẩn'} />
                                    </div>

                                    {expandedMajors[major.id] && (
                                        <div className="cc-spec-list">
                                            {major.specializations.map(spec => (
                                                <div key={spec.id} className="cc-spec-node">
                                                    <div
                                                        className="cc-spec-head"
                                                        onClick={() => toggleSpec(spec.id)}
                                                    >
                                                        <span className={`cc-chevron cc-chevron--sm${expandedSpecs[spec.id] ? ' open' : ''}`}>›</span>
                                                        <span className="cc-spec-label">{spec.name}</span>
                                                        <button
                                                            className="cc-btn-inline cc-btn-inline--ns"
                                                            onClick={e => { e.stopPropagation(); setForm({ name: '', code: '', parentId: spec.id, description: '', disciplineGroup: '' }); setPanel(PANEL.ADD_NS) }}
                                                            type="button"
                                                            title={`Thêm NS vào ${spec.name}`}
                                                        >+ NS</button>
                                                        <span className="cc-spec-count">{spec.narrowSpecs.length} NS</span>
                                                    </div>

                                                    {expandedSpecs[spec.id] && (
                                                        <div className="cc-ns-list">
                                                            {spec.narrowSpecs
                                                                .filter(ns => {
                                                                    if (!filterStatus) return true
                                                                    if (filterStatus === 'published') return ns.isPublished
                                                                    if (filterStatus === 'draft') return !ns.isPublished
                                                                    return false
                                                                })
                                                                .filter(ns => !search || ns.name.toLowerCase().includes(search.toLowerCase()))
                                                                .map(ns => {
                                                                    const isSel = selectedNS?.ns?.id === ns.id && (panel === PANEL.VIEW_NS || panel === PANEL.EDIT_NS)
                                                                    return (
                                                                        <div
                                                                            key={ns.id}
                                                                            className={`cc-ns-row${isSel ? ' sel' : ''}`}
                                                                            onClick={() => selectNS(ns, spec, major)}
                                                                        >
                                                                            <span className={`cc-ns-dot ${ns.isPublished ? 'dot-pub' : 'dot-draft'}`} />
                                                                            <span className="cc-ns-label">{ns.name}</span>
                                                                            <span className={`cc-ns-status ${ns.isPublished ? 'pub' : 'draft'}`}>
                                                                                {ns.isPublished ? 'Published' : 'Draft'}
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                })}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {major.specializations.length === 0 && (
                                                <div className="cc-tree-empty-sub">Chưa có chuyên ngành nào</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ══ RIGHT PANEL ══ */}
                    <div className="cc-right-panel">
                        {renderPanel()}
                    </div>

                </div>
            </div>
        </Layout>
    )
}

/* ── FormRow helper ── */
function FormRow({ label, required, hint, maxLen, children }) {
    const [count, setCount] = useState(0)
    const childWithHandler = maxLen
        ? (() => {
            const child = children
            const origChange = child.props.onChange
            return {
                ...child,
                props: {
                    ...child.props,
                    onChange: (e) => { setCount(e.target.value.length); origChange?.(e) },
                },
            }
        })()
        : children

    return (
        <div className="cc-form-row">
            <div className="cc-form-label">
                {label}{required && <span className="cc-req">*</span>}
            </div>
            {childWithHandler}
            {maxLen && <div className="cc-char-count">{count} / {maxLen}</div>}
            {hint && <div className="cc-form-hint">{hint}</div>}
        </div>
    )
}