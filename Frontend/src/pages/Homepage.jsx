import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass, ArrowRight, BrainCircuit, Sparkles,
  Fingerprint, TrendingUp, DollarSign,
  ArrowLeft, ChevronRight, Award, Layers,
  GraduationCap, GitCompare, Check, AlertTriangle, ListOrdered,
  BookOpen, BarChart2, Zap
} from "lucide-react";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import "./Homepage.css";
import Majorcatalog from "./guest/Majorcatalog.jsx";

/* =========================================================
   SCROLL REVEAL HOOK
   Adds class "revealed" to any element with class "reveal"
   when it enters the viewport.
   ========================================================= */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target); // fire once
          }
        });
      },
      { threshold: 0.14 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* =========================================================
   STAT PILL — hero stats row
   ========================================================= */
function StatPill({ icon: Icon, label, highlight }) {
  return (
    <div className="hp-stat-pill">
      <Icon className="icon-sm c-orange" />
      {highlight && <span className="hp-stat-pill-num">{highlight}</span>}
      <span>{label}</span>
    </div>
  );
}

/* =========================================================
   MOCK ILLUSTRATION COMPONENTS
   ========================================================= */
function StudentRoadmapMock() {
  return (
    <div className="mock-card">
      <div className="mock-roadmap-header">
        <div className="mock-card-icon mock-icon-blue">
          <Layers className="icon-sm" />
        </div>
        <span className="mock-card-name">Academic Roadmap</span>
      </div>
      <div className="mock-roadmap-list">
        {[0, 1, 2].map((i) => (
          <div key={i} className="mock-roadmap-item">
            <div className="mock-roadmap-spine">
              <div className="mock-roadmap-dot" />
              {i < 2 && <div className="mock-roadmap-line" />}
            </div>
            <div className="mock-roadmap-content">
              <div className="mock-roadmap-sk-title" />
              <div className="mock-roadmap-sk-body" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuggestionMock() {
  const tracks = [
    { name: "Kỹ nghệ Phần mềm (SE)", match: 98, level: "Rất Cao", barClass: "mock-bar-blue" },
    { name: "Trí tuệ Nhân tạo (AI)", match: 92, level: "Rất Cao", barClass: "mock-bar-orange" },
    { name: "An toàn Thông tin (CS)", match: 74, level: "Phù Hợp", barClass: "mock-bar-green" },
  ];

  return (
    <div className="mock-card">
      <div className="mock-blob" />
      <div className="mock-card-header">
        <div className="mock-card-title-group">
          <div className="mock-card-icon mock-icon-blue">
            <ListOrdered className="icon-sm" />
          </div>
          <div>
            <span className="mock-card-name">Xếp hạng chuyên ngành hẹp phù hợp</span>
          </div>
        </div>
      </div>
      <span
        className="mock-badge-active"
        style={{ display: "block", width: "fit-content", marginLeft: "auto", marginBottom: "4px" }}
      >
        Phù hợp nhất!
      </span>

      <div className="mock-track-list">
        {tracks.map((track, i) => (
          <div key={i} className="mock-track-item">
            <div className="mock-track-row">
              <span className="mock-track-name">{track.name}</span>
              <span className="mock-track-pct">
                Độ khớp:&nbsp;<b>{track.match}%</b>
              </span>
            </div>
            <div className="mock-prog-track">
              <div
                className={`mock-prog-bar ${track.barClass}`}
                style={{ width: `${track.match}%` }}
              />
            </div>
            <div className="mock-track-footer">
              <span className="mock-track-level">{track.level}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HollandMock() {
  const stats = [
    { label: "REALISTIC (Kỹ thuật)", val: 85, barClass: "mock-bar-blue" },
    { label: "INVESTIGATIVE (Nghiên cứu)", val: 95, barClass: "mock-bar-orange" },
    { label: "ARTISTIC (Nghệ thuật)", val: 60, barClass: "mock-bar-green" },
    { label: "SOCIAL (Xã hội)", val: 45, barClass: "mock-bar-indigo" },
    { label: "ENTERPRISING (Quản lý)", val: 78, barClass: "mock-bar-amber" },
    { label: "CONVENTIONAL (Nề nếp)", val: 52, barClass: "mock-bar-purple" },
  ];

  return (
    <div className="mock-card">
      <div className="mock-texture" />
      <div className="mock-card-header">
        <div className="mock-card-title-group">
          <div className="mock-card-icon mock-icon-orange">
            <Fingerprint className="icon-sm" />
          </div>
          <div>
            <span className="mock-card-name">Holland Graph</span>
            <span className="mock-card-sub">Đặc trưng RIASEC sinh viên FPT</span>
          </div>
        </div>
        <span className="mock-badge-orange-text">Vững vàng</span>
      </div>

      <div className="mock-stat-list">
        {stats.map((s, i) => (
          <div key={i} className="mock-stat-item">
            <div className="mock-stat-row">
              <span className="mock-stat-label">{s.label}</span>
              <span className="mock-stat-value">{s.val}%</span>
            </div>
            <div className="mock-prog-track">
              <div
                className={`mock-prog-bar ${s.barClass}`}
                style={{ width: `${s.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransferAnalysisMock() {
  return (
    <div className="mock-card">
      <div className="mock-blob" />
      <div className="mock-card-header">
        <div className="mock-card-title-group">
          <div className="mock-card-icon mock-icon-blue">
            <GitCompare className="icon-sm" />
          </div>
          <div>
            <span className="mock-card-name">Điều Kiện Chuyển Ngành</span>
          </div>
        </div>
        <span className="mock-badge-warn">Cần bù môn</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div className="mock-route-bar">
          <div className="mock-route-side">
            <span className="mock-route-lbl">Ngành hiện tại</span>
            <span className="mock-route-val">Kỹ nghệ Phần mềm</span>
          </div>
          <ArrowRight className="icon-sm mock-route-side-icon" />
          <div className="mock-route-side">
            <span className="mock-route-lbl">Ngành mục tiêu</span>
            <span className="mock-route-val mock-route-val-accent">Trí tuệ Nhân tạo (AI)</span>
          </div>
        </div>

        <div className="mock-stats-grid">
          <div className="mock-stat-box mock-stat-box-green">
            <span className="mock-stat-box-lbl">Độ Tương Thích</span>
            <span className="mock-stat-box-val mock-stat-box-val-green">78%</span>
          </div>
          <div className="mock-stat-box mock-stat-box-orange">
            <span className="mock-stat-box-lbl">Chi Phí Chuyển đổi</span>
            <span className="mock-stat-box-val mock-stat-box-val-orange">9.0M VND</span>
          </div>
        </div>

        <div className="mock-detail-section">
          <span className="mock-detail-heading">Phân tích Chi tiết môn học</span>
          <div className="mock-detail-row">
            <span className="mock-detail-code">PRN211, PRF192, PRO192</span>
            <span className="mock-detail-status mock-detail-status-green">
              <Check className="icon-sm" /> Bảo lưu
            </span>
          </div>
          <div className="mock-detail-row">
            <span className="mock-detail-code" style={{ color: "var(--primary)" }}>
              AIL302m, PRN231, ML Intro
            </span>
            <span className="mock-detail-status mock-detail-status-warn">
              <AlertTriangle className="icon-sm" /> Học bù
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE COMPONENT
   ========================================================= */
export default function Home({
  isLoggedIn,
  onStart,
  onLoginSuccess,
  onNavigateToCatalog,
  onNavigateToPortalTab,
  onLogout,
  registeredStudent,
  initialIntroTab = "none",
}) {
  const navigate = useNavigate();
  const [activeIntroTab, setActiveIntroTab] = useState(
    initialIntroTab === "none" ? "none" : initialIntroTab
  );

  const token = localStorage.getItem("accessToken");
  const actualIsLoggedIn = isLoggedIn !== undefined ? isLoggedIn : !!token;
  const username = localStorage.getItem("username");
  const user = actualIsLoggedIn && username ? { name: username } : null;

  /* Activate scroll reveal */
  useScrollReveal();

  useEffect(() => {
    setActiveIntroTab(initialIntroTab === "none" ? "none" : initialIntroTab);
  }, [initialIntroTab]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (actualIsLoggedIn && role) {
      if (role === "ROLE_ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "ROLE_CONTENT_MANAGER") {
        navigate("/cm/dashboard", { replace: true });
      }
    }
  }, [actualIsLoggedIn, navigate]);

  const openLogin = (mode = "login") => {
    navigate(mode === "register" ? "/register" : "/login");
  };

  const jumpTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDashboardRedirect = () => {
    if (actualIsLoggedIn) {
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

  const gotoFeature = (tab) => {
    if (actualIsLoggedIn) {
      const role = localStorage.getItem("role");
      if (role === "ROLE_ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "ROLE_CONTENT_MANAGER") {
        navigate("/cm/dashboard");
      } else {
        if (tab === "specialization-recommendations") {
          navigate("/student/recommendation");
        } else if (tab === "roadmap") {
          navigate("/student/roadmap");
        } else if (tab === "comparison") {
          navigate("/student/transfer");
        } else if (tab === "holland") {
          navigate("/student/holland");
        } else {
          navigate("/student/dashboard");
        }
      }
    } else {
      openLogin("login");
    }
  };

  return (
    <div className="hp-page">

      {/* ── Navbar ── */}
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
            href: "#",
            active: true,
            onClick: (e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          },

          {
            label: "Mục lục ngành",
            href: "#",
            onClick: (e) => {
              e.preventDefault();
              navigate("/major-catalog");
            },
          },
        ]}
        ctaLabel={actualIsLoggedIn ? "Dashboard" : "Đăng nhập"}
        onCtaClick={handleDashboardRedirect}
        onRegisterClick={() => openLogin("register")}
        user={user}
        onLogoClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <div className="hp-main">

        {/* ── HERO ── */}
        <section className="hp-hero">
          <div className="hp-hero-blob hp-hero-blob-1" />
          <div className="hp-hero-blob hp-hero-blob-2" />
          <div className="hp-hero-inner">
            <h1 className="hp-hero-title">
              <span className="hp-hero-title-brand">SMOSP</span>
            </h1>
            <p className="hp-hero-subtitle">
              Tư vấn, hỗ trợ sinh viên Đại học FPT xác định chuyên ngành hẹp phù hợp,
              đánh giá xu hướng ngành nghề qua bài test Holland,
              phân tích điều kiện chuyển ngành.
            </p>
            <div className="hp-hero-actions">
              <button
                onClick={() => jumpTo("specialization-recommendations")}
                className="btn btn-lg btn-primary"
              >
                Bắt đầu khám phá gợi ý
                <ArrowRight className="icon-sm" />
              </button>
              {!actualIsLoggedIn ? (
                <button
                  onClick={() => openLogin("register")}
                  className="btn btn-lg btn-ghost-blue"
                >
                  <Sparkles className="icon-sm c-orange" />
                  Đăng ký tài khoản sinh viên
                </button>
              ) : (
                <button
                  onClick={handleDashboardRedirect}
                  className="btn btn-lg btn-ghost-blue"
                >
                  Bảng điều khiển của tôi
                </button>
              )}
            </div>

          </div>
        </section>

        {/* ── FEATURE 01: Gợi ý chuyên ngành hẹp ── */}
        <section id="specialization-recommendations" className="hp-section hp-section-bg">
          <div className="container">
            <div className="hp-feature-grid">

              <div className="hp-feature-content reveal">
                <div className="hp-feature-number hp-num-blue">01</div>
                <h2 className="hp-feature-title">Gợi ý Chuyên ngành Hẹp</h2>
                <p className="hp-feature-body">
                  Tìm kiếm hướng đi sâu hẹp tối ưu nhất dựa trên sở thích, kết quả học thuật GPA
                  từ cổng FAP và nhu cầu tự định hướng của bạn.
                </p>
                <div className="hp-feature-inset">
                  Thuật toán đề xuất hỗ trợ phân loại mức độ hứng thú bẩm sinh và điểm xuất sắc
                  môn học tiên quyết, giúp định vị chính xác bạn thuộc về Kỹ nghệ phần mềm,
                  AI, hay An toàn thông tin.
                </div>
                <div className="hp-feature-actions">
                  <button
                    onClick={() => gotoFeature("specialization-recommendations")}
                    className="btn btn-md btn-blue"
                  >
                    Khám phá ngay <ChevronRight className="icon-sm" />
                  </button>
                </div>
              </div>

              <div className="hp-feature-illustration reveal">
                <SuggestionMock />
              </div>

            </div>
          </div>
        </section>

        {/* ── FEATURE 02: Holland RIASEC ── */}
        <section id="holland" className="hp-section hp-section-alt">
          <div className="container">
            <div className="hp-feature-grid hp-feature-grid-rev">



              <div className="hp-feature-content reveal">
                <div className="hp-feature-number hp-num-orange">02</div>
                <h2 className="hp-feature-title">Trắc nghiệm nghề nghiệp Holland</h2>
                <p className="hp-feature-body">
                  Công cụ đánh giá chuẩn hóa RIASEC giúp phân loại các nhóm đặc trưng cá tính
                  nghề nghiệp: Kỹ thuật (R), Nghiên cứu (I), Nghệ thuật (A),
                  Xã hội (S), Quản lý (E), Nề nếp (C).
                </p>
                <div className="hp-feature-inset-alt">
                  Hệ thống SMOSP tự động tính toán, vẽ biểu đồ radar chi tiết từ các câu hỏi
                  hành vi thực tế và so khớp với nhóm ngành tương quan đang được giảng dạy
                  tích hợp tại tập đoàn FPT.
                </div>
                <div className="hp-feature-actions">
                  <button
                    onClick={() => {
                      actualIsLoggedIn
                        ? navigate("/student/holland")
                        : openLogin("login");
                    }}
                    className="btn btn-md btn-primary"
                  >
                    Bắt đầu trắc nghiệm <ChevronRight className="icon-sm" />
                  </button>
                </div>
              </div>
              <div className="hp-feature-illustration reveal">
                <HollandMock />
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURE 03: Phân tích chuyển ngành ── */}
        <section id="transfer-analysis" className="hp-section hp-section-bg">
          <div className="container">
            <div className="hp-feature-grid">

              <div className="hp-feature-content reveal">
                <div className="hp-feature-number hp-num-blue">03</div>
                <h2 className="hp-feature-title">Phân tích Chuyển ngành Hẹp &amp; Chi phí</h2>
                <p className="hp-feature-body">
                  Thay đổi định hướng chưa bao giờ dễ dàng như thế. Hệ thống tự động đối chiếu
                  các lớp học đã qua từ bảng điểm FAP hoặc nhập thủ công để ước lượng cụ thể.
                </p>
                <div className="hp-checklist">
                  <div className="hp-checklist-item">
                    <Check className="hp-checklist-icon c-green" />
                    <span>
                      <b>Nhận định bảo lưu tín chỉ:</b> Tự động kiểm chuẩn các môn
                      chuyên ngành cơ sở trùng lặp để giảm thiểu số môn phải học lại.
                    </span>
                  </div>
                  <div className="hp-checklist-item">
                    <DollarSign className="hp-checklist-icon c-orange" />
                    <span>
                      <b>Cảnh báo chi phí &amp; môn bổ sung:</b> Dự kiến gánh nặng tài chính
                      phát sinh tính theo số tiền tín chỉ FPT hiện thời và thời lượng học bù.
                    </span>
                  </div>
                </div>
                <div className="hp-feature-actions">
                  <button
                    onClick={() => gotoFeature("comparison")}
                    className="btn btn-md btn-blue"
                  >
                    Phân tích chuyển đổi <ChevronRight className="icon-sm" />
                  </button>
                </div>
              </div>

              <div className="hp-feature-illustration reveal">
                <TransferAnalysisMock />
              </div>

            </div>
          </div>
        </section>

        {/* ── FEATURE 04: Academic Roadmap ── */}
        <section id="roadmap" className="hp-section hp-section-alt">
          <div className="container">
            <div className="hp-feature-grid hp-feature-grid-rev">



              <div className="hp-feature-content reveal">
                <div className="hp-feature-number hp-num-indigo">04</div>
                <h2 className="hp-feature-title">Academic Roadmap Sinh Viên</h2>
                <p className="hp-feature-body">
                  Thiết kế cấu trúc học phần từ học kỳ đại cương cho tới On-the-Job Training (OJT)
                  tại các tổng công ty FPT và đồ án bảo vệ khóa luận tốt nghiệp.
                </p>
                <div className="hp-feature-inset-alt">
                  Tương quan ma trận điều kiện tiên quyết (Prerequisites) được mã hóa tương tác.
                  Bạn có thể theo dõi tiến độ hoàn thành các môn học theo từng học kỳ.
                </div>
                <div className="hp-feature-actions">
                  <button
                    onClick={() => gotoFeature("roadmap")}
                    className="btn btn-md btn-primary"
                  >
                    Xem lộ trình chi tiết <ChevronRight className="icon-sm" />
                  </button>
                </div>
              </div>
              <div className="hp-feature-illustration reveal">
                <StudentRoadmapMock />
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ── Footer ── */}
      <Footer />

    </div>
  );
}