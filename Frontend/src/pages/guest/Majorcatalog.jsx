import { useState, useMemo, useEffect, useRef } from 'react';
// Dùng chung Navbar với Homepage — điều chỉnh path nếu khác
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

import './Majorcatalog.css';
import { Link, useNavigate } from "react-router-dom";


// ─── Mock data (thay bằng API call khi backend catalog module sẵn sàng) ───
// Cấu trúc theo ERD: major → specialization → narrow_spec


const CATALOG_DATA = [
  {
    id: 'it',
    code: 'IT',
    name: 'Công nghệ thông tin',
    disciplineGroup: 'IT',
    color: 'var(--primary)',
    bgLight: '#FFF4EC',
    totalNarrowSpecs: 14,
    specializations: [
      {
        id: 'se',
        code: 'SE',
        name: 'Software Engineering',
        isHot: true,
        narrowSpecs: [
          { id: 'se-01', code: 'SE-BE', name: 'Backend Development', trending: 'hot' },
          { id: 'se-02', code: 'SE-FE', name: 'Frontend Development', trending: 'hot' },
          { id: 'se-03', code: 'SE-MB', name: 'Mobile Development', trending: 'rising' },
          { id: 'se-04', code: 'SE-OPS', name: 'DevOps & Cloud Engineering', trending: 'hot' },
          { id: 'se-05', code: 'SE-GD', name: 'Game Development', trending: 'stable' },
        ],
      },
      {
        id: 'ai',
        code: 'AI',
        name: 'Artificial Intelligence',
        isHot: true,
        narrowSpecs: [
          { id: 'ai-01', code: 'AI-ML', name: 'Machine Learning Engineering', trending: 'hot' },
          { id: 'ai-02', code: 'AI-CV', name: 'Computer Vision', trending: 'rising' },
          { id: 'ai-03', code: 'AI-NLP', name: 'Natural Language Processing', trending: 'hot' },
          { id: 'ai-04', code: 'AI-DA', name: 'Data Science & Analytics', trending: 'hot' },
        ],
      },
      {
        id: 'is',
        code: 'IS',
        name: 'Information Systems',
        isHot: false,
        narrowSpecs: [
          { id: 'is-01', code: 'IS-BI', name: 'Business Intelligence', trending: 'stable' },
          { id: 'is-02', code: 'IS-SA', name: 'System Analysis & Design', trending: 'stable' },
          { id: 'is-03', code: 'IS-DB', name: 'Database Administration', trending: 'stable' },
          { id: 'is-04', code: 'IS-EC', name: 'E-Commerce Management', trending: 'rising' },
        ],
      },
      {
        id: 'ia',
        code: 'IA',
        name: 'Information Assurance',
        isHot: false,
        narrowSpecs: [
          { id: 'ia-01', code: 'IA-SEC', name: 'Cybersecurity', trending: 'rising' },
          { id: 'ia-02', code: 'IA-NET', name: 'Network Security', trending: 'stable' },
        ],
      },
    ],
  },
  {
    id: 'ba',
    code: 'BA',
    name: 'Kinh doanh',
    disciplineGroup: 'Business',
    color: 'var(--primary)',
    bgLight: '#FFF4EC',
    totalNarrowSpecs: 10,
    specializations: [
      {
        id: 'qtkd',
        code: 'QTKD',
        name: 'Quản trị kinh doanh',
        isHot: true,
        narrowSpecs: [
          { id: 'qtkd-01', code: 'QTKD-MK', name: 'Marketing & Sales', trending: 'hot' },
          { id: 'qtkd-02', code: 'QTKD-HR', name: 'Human Resource Management', trending: 'stable' },
          { id: 'qtkd-03', code: 'QTKD-OP', name: 'Operations & Supply Chain', trending: 'rising' },
          { id: 'qtkd-04', code: 'QTKD-EN', name: 'Entrepreneurship', trending: 'rising' },
        ],
      },
      {
        id: 'fin',
        code: 'FIN',
        name: 'Tài chính - Ngân hàng',
        isHot: false,
        narrowSpecs: [
          { id: 'fin-01', code: 'FIN-FA', name: 'Financial Analysis', trending: 'stable' },
          { id: 'fin-02', code: 'FIN-BK', name: 'Banking & Insurance', trending: 'stable' },
          { id: 'fin-03', code: 'FIN-INV', name: 'Investment & Securities', trending: 'rising' },
        ],
      },
      {
        id: 'acc',
        code: 'ACC',
        name: 'Kế toán',
        isHot: false,
        narrowSpecs: [
          { id: 'acc-01', code: 'ACC-FIN', name: 'Financial Accounting', trending: 'stable' },
          { id: 'acc-02', code: 'ACC-AUD', name: 'Audit & Tax Advisory', trending: 'stable' },
          { id: 'acc-03', code: 'ACC-MG', name: 'Management Accounting', trending: 'stable' },
        ],
      },
    ],
  },
  {
    id: 'da',
    code: 'DA',
    name: 'Mỹ thuật số',
    disciplineGroup: 'DigitalArt',
    color: 'var(--primary)',
    bgLight: '#FFF4EC',
    totalNarrowSpecs: 7,
    specializations: [
      {
        id: 'gd',
        code: 'GD',
        name: 'Thiết kế đồ họa',
        isHot: true,
        narrowSpecs: [
          { id: 'gd-01', code: 'GD-UX', name: 'UI/UX Design', trending: 'hot' },
          { id: 'gd-02', code: 'GD-BR', name: 'Brand & Visual Identity', trending: 'stable' },
          { id: 'gd-03', code: 'GD-IL', name: 'Illustration & Concept Art', trending: 'stable' },
        ],
      },
      {
        id: 'vfx',
        code: 'VFX',
        name: 'Kỹ xảo điện ảnh',
        isHot: false,
        narrowSpecs: [
          { id: 'vfx-01', code: 'VFX-3D', name: '3D Animation & Rendering', trending: 'rising' },
          { id: 'vfx-02', code: 'VFX-PP', name: 'VFX & Post-production', trending: 'stable' },
          { id: 'vfx-03', code: 'VFX-MG', name: 'Motion Graphics', trending: 'rising' },
          { id: 'vfx-04', code: 'VFX-GD', name: 'Game Art & Environment', trending: 'rising' },
        ],
      },
    ],
  },
  {
    id: 'lang',
    code: 'LANG',
    name: 'Ngôn ngữ',
    disciplineGroup: 'Languages',
    color: 'var(--primary)',
    bgLight: '#FFF4EC',
    totalNarrowSpecs: 9,
    specializations: [
      {
        id: 'en',
        code: 'EN',
        name: 'Ngôn ngữ Anh',
        isHot: false,
        narrowSpecs: [
          { id: 'en-01', code: 'EN-BIZ', name: 'Business English', trending: 'stable' },
          { id: 'en-02', code: 'EN-IT', name: 'English for Technology', trending: 'rising' },
          { id: 'en-03', code: 'EN-TI', name: 'Translation & Interpretation', trending: 'stable' },
        ],
      },
      {
        id: 'ja',
        code: 'JA',
        name: 'Ngôn ngữ Nhật',
        isHot: false,
        narrowSpecs: [
          { id: 'ja-01', code: 'JA-BIZ', name: 'Business Japanese', trending: 'stable' },
          { id: 'ja-02', code: 'JA-IT', name: 'Japanese for Technology', trending: 'rising' },
          { id: 'ja-03', code: 'JA-TI', name: 'Japanese Translation', trending: 'stable' },
        ],
      },
      {
        id: 'ko',
        code: 'KO',
        name: 'Ngôn ngữ Hàn',
        isHot: false,
        narrowSpecs: [
          { id: 'ko-01', code: 'KO-BIZ', name: 'Business Korean', trending: 'stable' },
          { id: 'ko-02', code: 'KO-CUL', name: 'Korean Culture & Tourism', trending: 'stable' },
          { id: 'ko-03', code: 'KO-IT', name: 'Korean for Technology', trending: 'rising' },
        ],
      },
    ],
  },
  {
    id: 'law',
    code: 'LAW',
    name: 'Luật',
    disciplineGroup: 'Law',
    color: 'var(--primary)',
    bgLight: '#FFF4EC',
    totalNarrowSpecs: 5,
    specializations: [
      {
        id: 'cl',
        code: 'CL',
        name: 'Luật thương mại',
        isHot: false,
        narrowSpecs: [
          { id: 'cl-01', code: 'CL-CORP', name: 'Corporate & Business Law', trending: 'stable' },
          { id: 'cl-02', code: 'CL-EC', name: 'E-Commerce Law', trending: 'rising' },
          { id: 'cl-03', code: 'CL-CT', name: 'Contract & Property Law', trending: 'stable' },
        ],
      },
      {
        id: 'il',
        code: 'IL',
        name: 'Luật quốc tế',
        isHot: false,
        narrowSpecs: [
          { id: 'il-01', code: 'IL-TRD', name: 'International Trade Law', trending: 'stable' },
          { id: 'il-02', code: 'IL-IP', name: 'Intellectual Property Law', trending: 'rising' },
        ],
      },
    ],
  },
];



const TOTALS = {
  majors: CATALOG_DATA.length,
  specializations: CATALOG_DATA.reduce((sum, m) => sum + m.specializations.length, 0),
  narrowSpecs: CATALOG_DATA.reduce((sum, m) => sum + m.totalNarrowSpecs, 0),
};

export default function MajorCatalog({
  isLoggedIn = !!localStorage.getItem("accessToken"),
  onNavigateToPortalTab,
} = {}) {
  const navigate = useNavigate();
  const openLogin = (mode = "login") => {
    navigate(mode === "register" ? "/register" : "/login");
  };

  const username = localStorage.getItem("username");
  const user = isLoggedIn && username ? { name: username } : null;

  const handleDashboardRedirect = () => {
    if (isLoggedIn) {
      const role = localStorage.getItem("role");
      if (role === "ROLE_ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "ROLE_CONTENT_MANAGER") {
        navigate("/cm/dashboard");
      } else if (role === "ROLE_STUDENT") {
        navigate("/student/dashboard");
      } else {
        navigate("/");
      }
    } else {
      openLogin();
    }
  };

  const [filterMajor, setFilterMajor] = useState('');
  const [filterSpec, setFilterSpec] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpec, setActiveSpec] = useState(null); // { majorId, specId }
  const panelRef = useRef(null);

  // Scroll panel vào tầm nhìn sau khi mở
  useEffect(() => {
    if (activeSpec && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSpec]);

  // ── Danh sách spec để populate filter dropdown ──
  const allSpecs = useMemo(() =>
    CATALOG_DATA.flatMap(m =>
      m.specializations.map(s => ({ ...s, majorName: m.name }))
    ),
    []
  );

  // ── Lọc dữ liệu theo filter + search ──
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CATALOG_DATA
      .filter(m => !filterMajor || m.id === filterMajor)
      .map(m => ({
        ...m,
        specializations: m.specializations.filter(s => {
          if (filterSpec && s.id !== filterSpec) return false;
          if (!q) return true;
          return (
            s.name.toLowerCase().includes(q) ||
            s.code.toLowerCase().includes(q) ||
            s.narrowSpecs.some(ns =>
              ns.name.toLowerCase().includes(q) || ns.code.toLowerCase().includes(q)
            )
          );
        }),
      }))
      .filter(m => m.specializations.length > 0);
  }, [filterMajor, filterSpec, searchQuery]);

  const hasActiveFilter = filterMajor || filterSpec || searchQuery;

  const handleSpecClick = (majorId, specId) => {
    if (activeSpec?.majorId === majorId && activeSpec?.specId === specId) {
      setActiveSpec(null);
    } else {
      setActiveSpec({ majorId, specId });
    }
  };

  const clearFilters = () => {
    setFilterMajor('');
    setFilterSpec('');
    setSearchQuery('');
  };

  const getActiveSpec = (major) => {
    if (!activeSpec || activeSpec.majorId !== major.id) return null;
    return major.specializations.find(s => s.id === activeSpec.specId) ?? null;
  };

  return (

    <div className="catalog-page">
      <Navbar
        links={[
          {
            label: "Dashboard",
            href: "#",
            onClick: (e) => {
              e.preventDefault();
              handleDashboardRedirect();
            }
          },
          {
            label: "Trang chủ",
            href: "/",
            onClick: (e) => {
              e.preventDefault();
              navigate("/");
            }
          },
          {
            label: "Mục lục ngành",
            href: "/major-catalog",
            active: true,
            onClick: (e) => {
              e.preventDefault();
            },
          },
        ]}
        ctaLabel={isLoggedIn ? "Dashboard" : "Đăng nhập"}
        onCtaClick={handleDashboardRedirect}
        onRegisterClick={() => openLogin("register")}
        user={user}
        onLogoClick={() => navigate("/")}
      />

      {/* ── Hero ── */}
      <section className="catalog-hero">
        <div className="catalog-hero__overlay" />
        <div className="catalog-container">
          <nav className="catalog-breadcrumb" aria-label="breadcrumb">
            <a href="/">Trang chủ</a>
            <span className="breadcrumb-sep" aria-hidden="true">›</span>
            <span aria-current="page">Mục lục ngành</span>
          </nav>

          <div className="catalog-hero__body">
            <div className="catalog-hero__text">
              <h1 className="catalog-hero__title">Mục Lục Ngành</h1>
              <p className="catalog-hero__subtitle">
                Khám phá đầy đủ các khối ngành, chuyên ngành và chuyên ngành hẹp
                tại FPT University — định hướng con đường phù hợp với bạn.
              </p>
            </div>

            <div className="catalog-hero__stats">
              <div className="hero-stat">
                <strong>{TOTALS.majors}</strong>
                <span>Khối ngành</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong>{TOTALS.specializations}</strong>
                <span>Chuyên ngành</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong>{TOTALS.narrowSpecs}+</strong>
                <span>Chuyên ngành hẹp</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter / Search bar ── */}
      <div className="catalog-filter-bar">
        <div className="catalog-container catalog-filter-bar__inner">
          <div className="filter-select-wrap">
            <label htmlFor="filter-major" className="sr-only">Lọc khối ngành</label>
            <select
              id="filter-major"
              className="filter-select"
              value={filterMajor}
              onChange={e => {
                setFilterMajor(e.target.value);
                setFilterSpec('');   // reset spec khi đổi major
                setActiveSpec(null);
              }}
            >
              <option value="">Tất cả khối ngành</option>
              {CATALOG_DATA.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-select-wrap">
            <label htmlFor="filter-spec" className="sr-only">Lọc chuyên ngành</label>
            <select
              id="filter-spec"
              className="filter-select"
              value={filterSpec}
              onChange={e => {
                setFilterSpec(e.target.value);
                setActiveSpec(null);
              }}
            >
              <option value="">Tất cả chuyên ngành</option>
              {allSpecs
                .filter(s => !filterMajor || CATALOG_DATA.find(m => m.id === filterMajor)
                  ?.specializations.some(ms => ms.id === s.id))
                .map(s => (
                  <option key={s.id} value={s.id}>{s.code} — {s.name}</option>
                ))}
            </select>
          </div>

          <div className="filter-search-wrap">
            <svg className="search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              className="filter-search"
              placeholder="Tìm chuyên ngành, chuyên ngành hẹp..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setActiveSpec(null); }}
              aria-label="Tìm kiếm"
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          {hasActiveFilter && (
            <button className="filter-clear-all" onClick={clearFilters}>
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* ── Catalog Content ── */}
      <main className="catalog-content" id="catalog-main">
        <div className="catalog-container">
          {filteredData.length === 0 ? (
            <div className="catalog-empty">
              <div className="catalog-empty__icon">🔍</div>
              <h3>Không tìm thấy kết quả</h3>
              <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
              <button className="btn-outline" onClick={clearFilters}>Xem tất cả ngành</button>
            </div>
          ) : (
            <div className="major-list">
              {filteredData.map(major => {
                const activeSpc = getActiveSpec(major);
                return (
                  <section
                    key={major.id}
                    className="major-section"
                    aria-label={major.name}
                  >
                    {/* ── Major label (left column) ── */}
                    <div
                      className="major-label"
                      style={{
                        '--major-color': major.color,
                        '--major-bg': major.bgLight,
                      }}
                    >
                      <span className="major-label__icon">{major.icon}</span>
                      <span className="major-label__code">{major.code}</span>
                      <span className="major-label__name">{major.name}</span>
                      <span className="major-label__count">
                        {major.specializations.length} chuyên ngành
                      </span>
                    </div>

                    {/* ── Specs + narrow spec panel (right) ── */}
                    <div className="specs-area">
                      <div className="specs-row" role="list">
                        {major.specializations.map(spec => {
                          const isActive =
                            activeSpec?.majorId === major.id &&
                            activeSpec?.specId === spec.id;
                          return (
                            <button
                              key={spec.id}
                              role="listitem"
                              className={`spec-card${isActive ? ' spec-card--active' : ''}${spec.isHot ? ' spec-card--hot' : ''}`}
                              style={{ '--major-color': major.color }}
                              onClick={() => handleSpecClick(major.id, spec.id)}
                              aria-pressed={isActive}
                              aria-expanded={isActive}
                            >
                              <span className="spec-card__code">{spec.code}</span>
                              <span className="spec-card__name">{spec.name}</span>
                              <span className="spec-card__count">
                                {spec.narrowSpecs.length} CN hẹp
                              </span>
                              <svg
                                className={`spec-card__chevron${isActive ? ' spec-card__chevron--up' : ''}`}
                                viewBox="0 0 12 8"
                                fill="none"
                                aria-hidden="true"
                              >
                                <path
                                  d="M1 1l5 5 5-5"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          );
                        })}
                      </div>

                      {/* ── Narrow Spec Panel ── */}
                      {activeSpc && (
                        <div
                          className="ns-panel"
                          style={{ '--major-color': major.color }}
                          ref={panelRef}
                          role="region"
                          aria-label={`Chuyên ngành hẹp của ${activeSpc.name}`}
                        >
                          <div className="ns-panel__header">
                            <div className="ns-panel__header-text">
                              <span className="ns-panel__eyebrow">Chuyên ngành hẹp</span>
                              <h3 className="ns-panel__title">{activeSpc.name}</h3>
                            </div>
                            <button
                              className="ns-panel__close"
                              onClick={() => setActiveSpec(null)}
                              aria-label="Đóng"
                            >
                              <svg viewBox="0 0 14 14" fill="none" width="12" height="12">
                                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                              </svg>
                            </button>
                          </div>

                          <div className="ns-panel__grid">
                            {activeSpc.narrowSpecs.map((ns, idx) => {
                              return (
                                <div key={ns.id} className="ns-item">
                                  <span className="ns-item__num">
                                    {String(idx + 1).padStart(2, '0')}
                                  </span>
                                  <div className="ns-item__body">
                                    <span className="ns-item__name">{ns.name}</span>
                                    <span className="ns-item__code">{ns.code}</span>
                                  </div>

                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}