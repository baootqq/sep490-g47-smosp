import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import Layout from '../../components/layout/Layout'
import './CmCatalogPage.css'

import {
    getMajors,
    getSpecializationsByMajor,
    getNarrowSpecsBySpecialization,
    getNarrowSpecDetail,
    createMajor,
    updateMajor,
    updateMajorStatus,
    createSpecialization,
    updateSpecialization,
    updateSpecializationStatus,
    createNarrowSpec,
    updateNarrowSpec,
    publishNarrowSpec
} from '../../services/catalogService'

/* ── Checklist helper ── */
function getChecklist(ns, specIsActive) {
    return [
        { ok: specIsActive, label: 'Chuyên ngành cha đang active', val: specIsActive ? 'OK' : 'Chưa active' },
        { ok: ns.courses >= 5, label: 'Môn chuyên sâu (5–10 · BV-18)', val: `${ns.courses} môn` },
        { ok: ns.skills > 0, label: 'Tag map kỹ năng đã cấu hình', val: ns.skills > 0 ? `${ns.skills} skill` : '0 mapping' },
        { ok: ns.interests > 0, label: 'Tag map sở thích đã cấu hình', val: ns.interests > 0 ? `${ns.interests} option` : '0 mapping' },
        { ok: ns.tw !== null, label: 'Compatibility Score config', val: ns.tw !== null ? `α auto` : 'Chưa thiết lập' },
    ]
}

/* ── Right panel modes ── */
const PANEL = { EMPTY: 'EMPTY', EDIT_MAJOR: 'EDIT_MAJOR', EDIT_SPEC: 'EDIT_SPEC', EDIT_NS: 'EDIT_NS', ADD_NS: 'ADD_NS', ADD_SPEC: 'ADD_SPEC', ADD_MAJOR: 'ADD_MAJOR' }

export default function CmCatalogPage() {
    const navigate = useNavigate()
    const username = localStorage.getItem('username') || 'Content Manager'

    /* Tree expand state */
    const [expandedMajors, setExpandedMajors] = useState({})
    const [expandedSpecs, setExpandedSpecs] = useState({})

    /* Selected node */
    const [selectedNS, setSelectedNS] = useState(null)
    const [selectedSpecDetail, setSelectedSpecDetail] = useState(null)
    const [selectedMajor, setSelectedMajor] = useState(null)

    /* Panel mode */
    const [panel, setPanel] = useState(PANEL.EMPTY)

    /* Filters */
    const [filterMajor, setFilterMajor] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [search, setSearch] = useState('')

    /* Form state for add/edit */
    const [form, setForm] = useState({ name: '', code: '', parentId: '', description: '' })

    /* Status dropdown on detail panel */
    const [nsStatus, setNsStatus] = useState('draft') // 'published' | 'draft' | 'hidden'

    /* Tree data loaded dynamically from Backend */
    const [treeData, setTreeData] = useState([])
    const [loading, setLoading] = useState(true)

    const tree = treeData

    const loadTreeData = async () => {
        try {
            setLoading(true);
            const majors = await getMajors();
            const assembledTree = await Promise.all(majors.map(async (major) => {
                const specializations = await getSpecializationsByMajor(major.id);
                const specsWithNS = await Promise.all(specializations.map(async (spec) => {
                    const narrowSpecs = await getNarrowSpecsBySpecialization(spec.id);
                    return {
                        id: spec.id,
                        code: spec.code,
                        name: spec.name,
                        isActive: spec.isActive,
                        narrowSpecs: narrowSpecs.map(ns => ({
                            id: ns.id,
                            code: ns.code,
                            name: ns.name,
                            isPublished: ns.isPublished,
                            publishedAt: ns.publishedAt ? new Date(ns.publishedAt).toLocaleDateString() : null,
                            courses: 0,
                            tw: null,
                            skills: 0,
                            interests: 0
                        }))
                    };
                }));
                return {
                    id: major.id,
                    code: major.code,
                    name: major.name,
                    description: major.description,
                    isActive: major.isActive,
                    specializations: specsWithNS.map(s => ({
                        ...s,
                        description: specializations.find(sp => sp.id === s.id)?.description
                    }))
                };
            }));
            
            // Auto expand first major and spec if any
            if (assembledTree.length > 0 && Object.keys(expandedMajors).length === 0) {
                 setExpandedMajors({ [assembledTree[0].id]: true });
                 if (assembledTree[0].specializations.length > 0) {
                     setExpandedSpecs({ [assembledTree[0].specializations[0].id]: true });
                 }
            }
            
            setTreeData(assembledTree);
            return assembledTree;
        } catch (error) {
            console.error("Failed to load catalog tree:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTreeData();
    }, []);

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

    function selectMajor(major) {
        setSelectedMajor(major)
        setSelectedSpecDetail(null)
        setSelectedNS(null)
        setForm({
            name: major.name,
            code: major.code,
            parentId: '',
            description: major.description || '',
        })
        setPanel(PANEL.EDIT_MAJOR)
        setExpandedMajors(p => ({ ...p, [major.id]: true }))
    }

    function selectSpec(spec, major) {
        setSelectedSpecDetail({ spec, major })
        setSelectedMajor(null)
        setSelectedNS(null)
        setForm({
            name: spec.name,
            code: spec.code,
            parentId: major.id,
            description: spec.description || '',
        })
        setPanel(PANEL.EDIT_SPEC)
        setExpandedSpecs(p => ({ ...p, [spec.id]: true }))
    }

    async function selectNS(ns, spec, major) {
        try {
            const detail = await getNarrowSpecDetail(ns.id);
            const enrichedNS = {
                ...ns,
                courses: detail.courses ? detail.courses.length : 0,
                description: detail.description
            };
            setSelectedNS({ ns: enrichedNS, spec, major });
            setSelectedSpecDetail(null);
            setSelectedMajor(null);
            setNsStatus(detail.isPublished ? 'published' : 'draft');
            setForm({
                name: enrichedNS.name,
                code: enrichedNS.code,
                parentId: spec.id,
                description: enrichedNS.description || '',
            })
            setPanel(PANEL.EDIT_NS);
        } catch (err) {
            console.error("Error loading narrow spec detail:", err);
            setSelectedNS({ ns, spec, major });
            setSelectedSpecDetail(null);
            setSelectedMajor(null);
            setNsStatus(ns.isPublished ? 'published' : 'draft');
            setForm({
                name: ns.name,
                code: ns.code,
                parentId: spec.id,
                description: ns.description || '',
            })
            setPanel(PANEL.EDIT_NS);
        }
    }

    function openAddMajor() {
        setSelectedNS(null); setSelectedSpecDetail(null); setSelectedMajor(null);
        setForm({ name: '', code: '', parentId: '', description: '' })
        setPanel(PANEL.ADD_MAJOR)
    }

    function openAddSpec(parentMajorId = '') {
        setSelectedNS(null); setSelectedSpecDetail(null); setSelectedMajor(null);
        setForm({ name: '', code: '', parentId: parentMajorId, description: '' })
        setPanel(PANEL.ADD_SPEC)
    }

    function openAddNS(parentSpecId = '') {
        setSelectedNS(null); setSelectedSpecDetail(null); setSelectedMajor(null);
        setForm({ name: '', code: '', parentId: parentSpecId, description: '' })
        setPanel(PANEL.ADD_NS)
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

        /* EDIT MAJOR */
        if (panel === PANEL.EDIT_MAJOR && selectedMajor) {
            return (
                <>
                    <div className="cc-rp-header">
                        <div className="cc-rp-meta">
                            <div className="cc-rp-eyebrow">Ngành học (Major)</div>
                            <div className="cc-rp-title">{selectedMajor.name}</div>
                        </div>
                        <div className="cc-rp-btns">
                            <button 
                                className="cc-btn cc-btn-danger-sm" 
                                onClick={() => alert("Chức năng xóa cứng bị giới hạn để tránh mất dữ liệu liên quan. Vui lòng bấm vào icon chấm tròn ngoài danh sách cây để Ẩn ngành này khỏi hệ thống.")}  
                                type="button"
                            >Xóa</button>
                            <button 
                                className="cc-btn cc-btn-save" 
                                onClick={async () => {
                                    if (!form.name || !form.code) {
                                        alert("Vui lòng điền các thông tin bắt buộc");
                                        return;
                                    }
                                    try {
                                        const updated = await updateMajor(selectedMajor.id, {
                                            code: form.code,
                                            name: form.name,
                                            description: form.description || ""
                                        });
                                        alert("Đã lưu ngành học thành công!");
                                        await loadTreeData();
                                        selectMajor({ ...updated, specializations: selectedMajor.specializations });
                                    } catch (err) {
                                        alert("Lỗi: " + (err.response?.data?.message || err.message));
                                    }
                                }} 
                                type="button"
                            >Lưu thay đổi</button>
                        </div>
                    </div>
                    <div className="cc-rp-body">
                        <div className="cc-info-grid" style={{ gridTemplateColumns: '1fr', marginBottom: 16 }}>
                            <div className="cc-info-box">
                                <div className="cc-info-lbl">Trạng thái hiện tại</div>
                                <select
                                    className={`cc-status-select cc-status-select--${selectedMajor.isActive ? 'published' : 'hidden'}`}
                                    value={selectedMajor.isActive ? 'published' : 'hidden'}
                                    onChange={async (e) => {
                                        const isActive = e.target.value === 'published';
                                        try {
                                            const updated = await updateMajorStatus(selectedMajor.id, isActive);
                                            await loadTreeData();
                                            selectMajor({ ...updated, specializations: selectedMajor.specializations });
                                        } catch (err) {
                                            alert("Lỗi khi đổi trạng thái: " + (err.response?.data?.message || err.message));
                                        }
                                    }}
                                >
                                    <option value="published">● Đang kích hoạt</option>
                                    <option value="hidden">● Đang ẩn</option>
                                </select>
                            </div>
                        </div>
                        <FormRow label="Tên ngành" required maxLen={100}>
                            <input className="cc-input" type="text" value={form.name} maxLength={100} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Mã ngành" required>
                            <input className="cc-input" type="text" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Mô tả" maxLen={500}>
                            <textarea className="cc-input cc-textarea" maxLength={500} value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                        </FormRow>
                    </div>
                </>
            )
        }

        /* EDIT SPEC */
        if (panel === PANEL.EDIT_SPEC && selectedSpecDetail) {
            const { spec, major } = selectedSpecDetail;
            return (
                <>
                    <div className="cc-rp-header">
                        <div className="cc-rp-meta">
                            <div className="cc-rp-eyebrow">Chuyên ngành (Specialization) · {major.name}</div>
                            <div className="cc-rp-title">{spec.name}</div>
                        </div>
                        <div className="cc-rp-btns">
                            <button 
                                className="cc-btn cc-btn-danger-sm" 
                                onClick={() => alert("Chức năng xóa cứng bị giới hạn để tránh mất dữ liệu liên quan. Vui lòng bấm vào icon chấm tròn ngoài danh sách cây để Ẩn chuyên ngành này.")}  
                                type="button"
                            >Xóa</button>
                            <button 
                                className="cc-btn cc-btn-save" 
                                onClick={async () => {
                                    if (!form.name || !form.code || !form.parentId) {
                                        alert("Vui lòng điền các thông tin bắt buộc");
                                        return;
                                    }
                                    try {
                                        const updated = await updateSpecialization(spec.id, {
                                            majorId: form.parentId,
                                            code: form.code,
                                            name: form.name,
                                            description: form.description || ""
                                        });
                                        alert("Đã lưu chuyên ngành thành công!");
                                        const updatedTree = await loadTreeData();
                                        let newMajor = major;
                                        if (updatedTree) {
                                            newMajor = updatedTree.find(m => m.id === form.parentId) || major;
                                        }
                                        selectSpec({ ...updated, narrowSpecs: spec.narrowSpecs }, newMajor);
                                    } catch (err) {
                                        alert("Lỗi: " + (err.response?.data?.message || err.message));
                                    }
                                }} 
                                type="button"
                            >Lưu thay đổi</button>
                        </div>
                    </div>
                    <div className="cc-rp-body">
                        <div className="cc-info-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 16 }}>
                            <div className="cc-info-box">
                                <div className="cc-info-lbl">Trạng thái hiện tại</div>
                                <select
                                    className={`cc-status-select cc-status-select--${spec.isActive ? 'published' : 'hidden'}`}
                                    value={spec.isActive ? 'published' : 'hidden'}
                                    onChange={async (e) => {
                                        const isActive = e.target.value === 'published';
                                        try {
                                            const updated = await updateSpecializationStatus(spec.id, isActive);
                                            await loadTreeData();
                                            selectSpec({ ...updated, narrowSpecs: spec.narrowSpecs }, major);
                                        } catch (err) {
                                            alert("Lỗi khi đổi trạng thái: " + (err.response?.data?.message || err.message));
                                        }
                                    }}
                                >
                                    <option value="published">● Đang kích hoạt</option>
                                    <option value="hidden">● Đang ẩn</option>
                                </select>
                            </div>
                            <div className="cc-info-box">
                                <div className="cc-info-lbl">Số lượng CN hẹp</div>
                                <div className="cc-info-val blue">{spec.narrowSpecs ? spec.narrowSpecs.length : 0} CN</div>
                            </div>
                        </div>
                        <FormRow label="Tên chuyên ngành" required maxLen={100}>
                            <input className="cc-input" type="text" value={form.name} maxLength={100} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Mã chuyên ngành" required>
                            <input className="cc-input" type="text" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Ngành cha" required>
                            <select className="cc-input cc-select" value={form.parentId} onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))}>
                                {tree.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </FormRow>
                        <FormRow label="Mô tả" maxLen={500}>
                            <textarea className="cc-input cc-textarea" maxLength={500} value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                        </FormRow>
                        {/* Link section */}
                        <div className="cc-sec-title" style={{ marginTop: 16 }}>Cấu hình liên kết</div>
                        <div className="cc-link-section">
                            <button className="cc-link-btn" onClick={() => navigate('/cm/curriculum', { state: { majorId: major.id, specId: spec.id, mode: 'spec' } })} type="button">
                                <div className="cc-link-left">
                                    <span className="cc-link-badge cc-lb-course">Môn học</span>
                                    Quản lý môn học chuyên ngành
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
            const { ns, spec, major } = selectedNS
            const checklist = getChecklist(ns, spec.isActive)
            const allOk = checklist.every(c => c.ok)
            return (
                <>
                    <div className="cc-rp-header">
                        <div className="cc-rp-meta">
                            <div className="cc-rp-eyebrow">Chuyên ngành hẹp · {spec.name}</div>
                            <div className="cc-rp-title">{ns.name}</div>
                        </div>
                        <div className="cc-rp-btns">
                            <button 
                                className="cc-btn cc-btn-danger-sm" 
                                onClick={() => alert("Chức năng xóa cứng bị giới hạn để tránh mất dữ liệu liên quan. Vui lòng chuyển trạng thái sang Draft để ẩn CN hẹp này khỏi học sinh.")}  
                                type="button"
                            >Xóa</button>
                            <button 
                                className="cc-btn cc-btn-save" 
                                onClick={async () => {
                                    if (!form.name || !form.code || !form.parentId) {
                                        alert("Vui lòng điền các thông tin bắt buộc");
                                        return;
                                    }
                                    try {
                                        const updated = await updateNarrowSpec(ns.id, {
                                            specializationId: form.parentId,
                                            code: form.code,
                                            name: form.name,
                                            description: form.description || ""
                                        });
                                        alert("Đã lưu CN hẹp thành công!");
                                        const updatedTree = await loadTreeData();
                                        let newSpec = spec;
                                        let newMajor = major;
                                        if (updatedTree) {
                                            for (const m of updatedTree) {
                                                const foundSpec = m.specializations.find(s => s.id === form.parentId);
                                                if (foundSpec) {
                                                    newSpec = foundSpec;
                                                    newMajor = m;
                                                    break;
                                                }
                                            }
                                        }
                                        await selectNS(updated, newSpec, newMajor);
                                    } catch (err) {
                                        alert("Lỗi: " + (err.response?.data?.message || err.message));
                                    }
                                }} 
                                type="button"
                            >Lưu thay đổi</button>
                        </div>
                    </div>

                    <div className="cc-rp-body">
                        {/* Status dropdown */}
                        <div className="cc-status-row">
                            <span className="cc-status-label">Trạng thái</span>
                            <select
                                className={`cc-status-select cc-status-select--${nsStatus}`}
                                value={nsStatus}
                                onChange={async (e) => {
                                    const val = e.target.value;
                                    const shouldPublish = val === 'published';
                                    try {
                                        await publishNarrowSpec(ns.id, shouldPublish);
                                        setNsStatus(val);
                                        alert(shouldPublish ? "Đã publish CN hẹp thành công!" : "Đã chuyển CN hẹp về dạng Draft!");
                                        await loadTreeData();
                                    } catch (err) {
                                        alert("Lỗi khi thay đổi trạng thái: " + (err.response?.data?.message || err.message));
                                    }
                                }}
                            >
                                {statusOptions.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            {nsStatus === 'published' && ns.publishedAt && (
                                <span className="cc-status-since">kể từ {ns.publishedAt}</span>
                            )}
                            {!allOk && nsStatus !== 'published' && (
                                <span className="cc-status-warn">⚠ Checklist chưa đủ để publish</span>
                            )}
                        </div>

                        {/* Form fields directly editable */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', marginBottom: '24px' }}>
                            <FormRow label="Tên chuyên ngành hẹp" required maxLen={100}>
                                <input className="cc-input" type="text" value={form.name} maxLength={100} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                            </FormRow>
                            <FormRow label="Mã" required>
                                <input className="cc-input" type="text" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} />
                            </FormRow>
                            <FormRow label="Chuyên ngành cha" required>
                                <select className="cc-input cc-select" value={form.parentId} onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))}>
                                    {tree.flatMap(m => m.specializations).map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </FormRow>
                            <FormRow label="Mô tả" maxLen={500}>
                                <textarea className="cc-input cc-textarea" maxLength={500} value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                            </FormRow>
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
                            <button className="cc-link-btn" onClick={() => navigate('/cm/curriculum', { state: { majorId: major.id, specId: spec.id, nsId: ns.id, mode: 'ns' } })} type="button">
                                <div className="cc-link-left">
                                    <span className="cc-link-badge cc-lb-course">{ns.courses || 0} môn</span>
                                    Quản lý môn chuyên sâu liên kết
                                </div>
                                <span className="cc-link-arrow">→</span>
                            </button>
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

        /* ADD NS */
        if (panel === PANEL.ADD_NS) {
            return (
                <>
                    <div className="cc-rp-header">
                        <div className="cc-rp-meta">
                            <div className="cc-rp-eyebrow">Thêm mới · Chuyên ngành hẹp</div>
                            <div className="cc-rp-title">Chuyên ngành hẹp mới</div>
                        </div>
                        <div className="cc-rp-btns">
                            <button 
                                className="cc-btn cc-btn-save" 
                                onClick={async () => {
                                    if (!form.name || !form.code || !form.parentId) {
                                        alert("Vui lòng điền các thông tin bắt buộc");
                                        return;
                                    }
                                    try {
                                        await createNarrowSpec({
                                            specializationId: form.parentId,
                                            code: form.code,
                                            name: form.name,
                                            description: form.description || ""
                                        });
                                        alert("Đã tạo CN hẹp thành công!");
                                        await loadTreeData();
                                        setPanel(PANEL.EMPTY);
                                    } catch (err) {
                                        alert("Lỗi: " + (err.response?.data?.message || err.message));
                                    }
                                }} 
                                type="button"
                            >Tạo CN hẹp</button>
                        </div>
                    </div>
                    <div className="cc-rp-body">
                        <FormRow label="Tên chuyên ngành hẹp" required maxLen={100}>
                            <input className="cc-input" type="text" placeholder="Vd: Cybersecurity Engineering" maxLength={100} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Mã" required hint="Mã duy nhất trong toàn hệ thống">
                            <input className="cc-input" type="text" placeholder="Vd: SE-SEC" onChange={e => setForm(p => ({ ...p, code: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Chuyên ngành cha" required>
                            <select className="cc-input cc-select" value={form.parentId} onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))}>
                                <option value="" disabled>Chọn Chuyên ngành...</option>
                                {tree.flatMap(m => m.specializations || []).map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({tree.find(m => m.specializations?.includes(s))?.name})</option>
                                ))}
                            </select>
                        </FormRow>
                        <FormRow label="Mô tả" maxLen={500}>
                            <textarea className="cc-input cc-textarea" placeholder="Mô tả ngắn (tùy chọn, tối đa 500 ký tự)..." maxLength={500} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                        </FormRow>
                        <p className="cc-form-note">Sau khi tạo, CN hẹp sẽ ở trạng thái <strong>Draft</strong>. Cần cấu hình đầy đủ trước khi chuyển sang Published.</p>
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
                            <button 
                                className="cc-btn cc-btn-save" 
                                onClick={async () => {
                                    if (!form.name || !form.code || !form.parentId) {
                                        alert("Vui lòng điền các thông tin bắt buộc");
                                        return;
                                    }
                                    try {
                                        await createSpecialization({
                                            majorId: form.parentId,
                                            code: form.code,
                                            name: form.name,
                                            description: form.description || ""
                                        });
                                        alert("Đã tạo chuyên ngành thành công!");
                                        await loadTreeData();
                                        setPanel(PANEL.EMPTY);
                                    } catch (err) {
                                        alert("Lỗi: " + (err.response?.data?.message || err.message));
                                    }
                                }} 
                                type="button"
                            >Tạo Chuyên ngành</button>
                        </div>
                    </div>
                    <div className="cc-rp-body">
                        <FormRow label="Tên chuyên ngành" required maxLen={100}>
                            <input className="cc-input" type="text" placeholder="Vd: Artificial Intelligence" maxLength={100} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Mã" required>
                            <input className="cc-input" type="text" placeholder="Vd: AI" onChange={e => setForm(p => ({ ...p, code: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Ngành cha" required>
                            <select className="cc-input cc-select" value={form.parentId} onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))}>
                                <option value="" disabled>Chọn Ngành...</option>
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
                            <div className="cc-rp-eyebrow">Thêm mới · Ngành (Major)</div>
                            <div className="cc-rp-title">Ngành mới</div>
                        </div>
                        <div className="cc-rp-btns">
                            <button 
                                className="cc-btn cc-btn-save" 
                                onClick={async () => {
                                    if (!form.name || !form.code) {
                                        alert("Vui lòng điền đầy đủ Tên ngành và Mã ngành");
                                        return;
                                    }
                                    try {
                                        await createMajor({
                                            code: form.code,
                                            name: form.name,
                                            description: form.description || ""
                                        });
                                        alert("Đã tạo ngành học thành công!");
                                        await loadTreeData();
                                        setPanel(PANEL.EMPTY);
                                    } catch (err) {
                                        alert("Lỗi: " + (err.response?.data?.message || err.message));
                                    }
                                }} 
                                type="button"
                            >Tạo Ngành</button>
                        </div>
                    </div>
                    <div className="cc-rp-body">
                        <FormRow label="Tên ngành" required maxLen={100}>
                            <input className="cc-input" type="text" placeholder="Vd: Luật" maxLength={100} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Mã ngành" required>
                            <input className="cc-input" type="text" placeholder="Vd: LAW" onChange={e => setForm(p => ({ ...p, code: e.target.value }))} />
                        </FormRow>
                        <FormRow label="Mô tả" maxLen={500}>
                            <textarea className="cc-input cc-textarea" placeholder="Mô tả ngắn (tùy chọn)..." maxLength={500} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                        </FormRow>
                        <p className="cc-form-note">Ngành mới sẽ ở trạng thái <strong>Active</strong> và hiển thị trong cây danh mục ngay sau khi tạo.</p>
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
                                    <div className={`cc-major-head${selectedMajor?.id === major.id ? ' sel' : ''}`}>
                                        <span className={`cc-chevron${expandedMajors[major.id] ? ' open' : ''}`} onClick={(e) => { e.stopPropagation(); toggleMajor(major.id) }}>›</span>
                                        <span className="cc-node-label" onClick={() => selectMajor(major)}>{major.name}</span>
                                        <button
                                            className="cc-btn-inline cc-btn-inline--spec"
                                            onClick={e => { e.stopPropagation(); setForm({ name: '', code: '', parentId: major.id, description: '' }); setPanel(PANEL.ADD_SPEC) }}
                                            type="button"
                                            title={`Thêm chuyên ngành vào ${major.name}`}
                                        >+ Chuyên ngành</button>
                                        <span 
                                            className={`cc-node-dot ${major.isActive ? 'dot-active' : 'dot-hidden'}`} 
                                            title={major.isActive ? 'Click để Ẩn' : 'Click để Kích hoạt'} 
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                try {
                                                    await updateMajorStatus(major.id, !major.isActive);
                                                    await loadTreeData();
                                                } catch (err) {
                                                    alert("Lỗi: " + (err.response?.data?.message || err.message));
                                                }
                                            }}
                                        />
                                    </div>

                                    {expandedMajors[major.id] && major.specializations && major.specializations.length > 0 && (
                                        <div className="cc-spec-list">
                                            {major.specializations.map(spec => (
                                                <div key={spec.id} className="cc-spec-node">
                                                    <div className={`cc-spec-head${selectedSpecDetail?.spec?.id === spec.id ? ' sel' : ''}`}>
                                                        <span className={`cc-chevron cc-chevron--sm${expandedSpecs[spec.id] ? ' open' : ''}`} onClick={(e) => { e.stopPropagation(); toggleSpec(spec.id) }}>›</span>
                                                        <span className="cc-spec-label" onClick={() => selectSpec(spec, major)}>{spec.name}</span>
                                                        <button
                                                            className="cc-btn-inline cc-btn-inline--ns"
                                                            onClick={e => { e.stopPropagation(); setForm({ name: '', code: '', parentId: spec.id, description: '' }); setPanel(PANEL.ADD_NS) }}
                                                            type="button"
                                                            title={`Thêm CN hẹp vào ${spec.name}`}
                                                        >+ CN hẹp</button>
                                                        <span className="cc-spec-count">{spec.narrowSpecs.length} CN hẹp</span>
                                                        <span 
                                                            className={`cc-node-dot ${spec.isActive ? 'dot-active' : 'dot-hidden'}`} 
                                                            style={{ marginLeft: 8 }}
                                                            title={spec.isActive ? 'Click để Ẩn' : 'Click để Kích hoạt'} 
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                try {
                                                                    await updateSpecializationStatus(spec.id, !spec.isActive);
                                                                    await loadTreeData();
                                                                } catch (err) {
                                                                    alert("Lỗi: " + (err.response?.data?.message || err.message));
                                                                }
                                                            }}
                                                        />
                                                    </div>

                                                    {expandedSpecs[spec.id] && spec.narrowSpecs && spec.narrowSpecs.length > 0 && (
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
                                                                    const isSel = selectedNS?.ns?.id === ns.id && panel === PANEL.EDIT_NS
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