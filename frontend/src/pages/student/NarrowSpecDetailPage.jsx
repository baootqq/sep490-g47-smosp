import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getMajors, getSpecializationsByMajor, getNarrowSpecDetail } from "../../services/catalogService";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "./NarrowSpecDetailPage.css";

// Helper function to mock skills and interests based on the narrow spec details
const getMockSkillsAndInterests = (code, name) => {
  const codeLower = (code || "").toLowerCase();
  const nameLower = (name || "").toLowerCase();

  // Cybersecurity
  if (codeLower.includes("sec") || nameLower.includes("an ninh") || nameLower.includes("bảo mật") || nameLower.includes("cyber")) {
    return {
      skills: ["Network Security", "Penetration Testing", "Cryptography", "Incident Response", "Vulnerability Assessment", "Linux Administration"],
      interests: ["Hacking đạo đức (Ethical Hacking)", "Bảo mật hệ thống", "Tìm hiểu mã độc", "Chống gian lận số", "Công nghệ Blockchain"]
    };
  }
  // Software Engineering / Web / Mobile
  if (codeLower.includes("se") || nameLower.includes("phần mềm") || nameLower.includes("web") || nameLower.includes("di động") || nameLower.includes("mobile")) {
    return {
      skills: ["Fullstack Web Development", "React / React Native", "RESTful API Design", "Database Management (SQL/NoSQL)", "Data Structures & Algorithms", "Git & CI/CD workflows"],
      interests: ["Xây dựng ứng dụng di động", "Lập trình Web hiện đại", "Sáng tạo giao diện người dùng", "Kiến trúc phần mềm", "Tự động hóa quy trình"]
    };
  }
  // Artificial Intelligence / Data Science
  if (codeLower.includes("ai") || codeLower.includes("ds") || nameLower.includes("trí tuệ nhân tạo") || nameLower.includes("dữ liệu") || nameLower.includes("data") || nameLower.includes("machine learning")) {
    return {
      skills: ["Machine Learning & Deep Learning", "Python (NumPy, Pandas, PyTorch)", "Data Visualization (Tableau, PowerBI)", "Statistical Analysis", "Natural Language Processing (NLP)", "Big Data Processing"],
      interests: ["Nghiên cứu mô hình ngôn ngữ lớn (LLM)", "Khám phá tri thức từ dữ liệu", "Phân tích dự báo hành vi", "Robot học & Thị giác máy tính", "Tối ưu hóa thuật toán"]
    };
  }
  // Default / general fallback
  return {
    skills: ["Problem Solving", "Team Collaboration & Git", "Technical Documentation", "System Analysis & Design", "Critical Thinking", "Agile/Scrum Methodology"],
    interests: ["Công nghệ mới & Sáng tạo", "Phát triển bản thân", "Giải quyết vấn đề phức tạp", "Nghiên cứu giải pháp kỹ thuật", "Làm việc nhóm hiệu quả"]
  };
};

export default function NarrowSpecDetailPage() {
  const { nsId } = useParams();
  const navigate = useNavigate();

  const [parentMajor, setParentMajor] = useState(null);
  const [parentSpec, setParentSpec] = useState(null);
  const [narrowSpecDetail, setNarrowSpecDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLoggedIn = !!localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");
  const user = isLoggedIn && username ? { name: username } : null;

  useEffect(() => {
    const fetchNsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch narrow spec details
        const nsDetail = await getNarrowSpecDetail(nsId);
        setNarrowSpecDetail(nsDetail);

        // Traverse majors to find the parent specialization and major
        const majors = await getMajors();
        let foundSpec = null;
        let foundMajor = null;

        for (const major of majors) {
          const specs = await getSpecializationsByMajor(major.id);
          const spec = specs.find((s) => s.id === nsDetail.specializationId);
          if (spec) {
            foundSpec = spec;
            foundMajor = major;
            break;
          }
        }

        setParentSpec(foundSpec);
        setParentMajor(foundMajor);
      } catch (err) {
        console.error("Error fetching narrow spec details:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải thông tin chuyên ngành hẹp.");
      } finally {
        setLoading(false);
      }
    };

    if (nsId) {
      fetchNsData();
    }
  }, [nsId]);

  // Scroll Reveal Observer
  useEffect(() => {
    if (loading) return;
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

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
      navigate("/login");
    }
  };

  const navigationLinks = [
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
      href: "/catalog",
      active: true,
      onClick: (e) => {
        e.preventDefault();
        navigate("/catalog");
      }
    }
  ].filter(Boolean);

  if (loading || error) {
    const statusEl = (
      <div className="ns-status-container">
        <p className="ns-status-text" style={{ color: error ? "#e0362e" : "#5b6270" }}>
          {error ? error : "Đang tải dữ liệu..."}
        </p>
        {error && (
          <button 
            className="ns-status-btn" 
            onClick={() => navigate("/catalog")}
          >
            Quay lại mục lục ngành
          </button>
        )}
      </div>
    );

    return (
      <div className="catalog-page">
        <Navbar
          links={navigationLinks}
          ctaLabel={isLoggedIn ? "Dashboard" : "Đăng nhập"}
          onCtaClick={handleDashboardRedirect}
          onRegisterClick={() => navigate("/register")}
          user={user}
          onLogoClick={() => navigate("/")}
        />
        {statusEl}
        <Footer />
      </div>
    );
  }

  // Get mock skills and interests mapping
  const mockMeta = getMockSkillsAndInterests(narrowSpecDetail.code, narrowSpecDetail.name);

  return (
    <div className="catalog-page">
      <Navbar
        links={navigationLinks}
        ctaLabel={isLoggedIn ? "Dashboard" : "Đăng nhập"}
        onCtaClick={handleDashboardRedirect}
        onRegisterClick={() => navigate("/register")}
        user={user}
        onLogoClick={() => navigate("/")}
      />
      
      <div className="major-page-container">
        {/* ---------- Shorter Banner (No image) ---------- */}
        <section className="major-banner major-banner--no-image reveal">
          <div className="major-banner__content">
            <span className="major-banner__eyebrow">Chuyên ngành hẹp</span>
            <h1 className="major-banner__title">{narrowSpecDetail.name}</h1>
            <div className="major-banner__meta">
              <span className="major-banner__code">{narrowSpecDetail.code}</span>
              {parentSpec && (
                <>
                  <span className="major-banner__dot">•</span>
                  <span>
                    Chuyên ngành:{" "}
                    <Link to={`/catalog/specializations/${parentSpec.id}`} className="ns-banner-link">
                      {parentSpec.name}
                    </Link>
                  </span>
                </>
              )}
              {parentMajor && (
                <>
                  <span className="major-banner__dot">•</span>
                  <span>
                    Khối ngành:{" "}
                    <Link to={`/catalog/majors/${parentMajor.id}`} className="ns-banner-link">
                      {parentMajor.name}
                    </Link>
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ---------- Main Content ---------- */}
        <div className="major-content">
          {/* ---------- Description ---------- */}
          <section className="major-section reveal">
            <div className="major-intro">
              <h2 className="major-section__heading major-section__heading--center major-section__heading--accent">
                Giới thiệu chuyên ngành hẹp
              </h2>
              <p className="major-intro__text">
                {narrowSpecDetail.description || "Chưa có thông tin mô tả chi tiết cho chuyên ngành hẹp này."}
              </p>
            </div>
          </section>

          {/* ---------- Associated Skills and Interests (Mock Data) ---------- */}
          <section className="major-section reveal">
            <div className="ns-meta-grid">
              <div className="ns-meta-section">
                <h3 className="ns-meta-section__title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#034ea2" }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Kỹ năng liên kết
                </h3>
                <div className="ns-tag-list">
                  {mockMeta.skills.map((skill, index) => (
                    <span key={index} className="ns-tag ns-tag--skill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="ns-meta-section">
                <h3 className="ns-meta-section__title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#f37021" }}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  Sở thích liên kết
                </h3>
                <div className="ns-tag-list">
                  {mockMeta.interests.map((interest, index) => (
                    <span key={index} className="ns-tag ns-tag--interest">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
