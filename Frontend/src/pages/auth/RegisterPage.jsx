import "./LoginRegisterPage.css"; // Dùng chung style panel và card
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronRight, User, Mail, Lock } from "lucide-react";
import { register } from "../../services/authService";
import logo from "../../asset/logo.svg";

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await register(fullName, email, password);
      // Giả sử đăng ký xong cần verify email hoặc login luôn
      alert("Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-root">
      <div className="lp-card">
        {/* ── LEFT ── */}
        <div className="lp-left">
          <img src={logo} alt="Logo" style={{ width: "250px", height: "auto" }} />
        
          <h2 className="lp-headline" style={{ fontStyle: "italic", marginTop: 15, textAlign: "center" }}>
            Hỗ trợ định hướng học thuật cho sinh viên 
            
          </h2>

          <div style={{ fontSize: 15, color: "rgba(255, 251, 251, 0.74)", }}>
            Đăng ký tài khoản mới để trải nghiệm các tính năng: 
            
          </div>
        
        
          <div className="lp-feature-card">
            <div className="lp-feature-item">
              <span className="lp-feature-num">1</span>
              Đánh giá hồ sơ cá nhân
            </div>
        
            <div className="lp-feature-item">
              <span className="lp-feature-num">2</span>
              Gợi ý chuyên ngành hẹp phù hợp
            </div>
        
            <div className="lp-feature-item">
              <span className="lp-feature-num">3</span>
              Xây dựng lộ trình học tập
            </div>
        
            <div className="lp-feature-item">
              <span className="lp-feature-num">4</span>
              Bài test Holland và hỗ trợ chuyển ngành
            </div>
          </div>
        
          <div className="lp-copy">
            © 2026 SMOSP
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="lp-right">
          <button className="lp-close" onClick={() => navigate("/")} aria-label="Đóng">✕</button>

          <div className="lp-form-box">
            <div className="eyebrow" style={{ marginBottom: 12 }}>Tạo tài khoản mới</div>
<h1 className="lp-title">
  Đăng ký tài khoản{" "}
  <span style={{ color: "var(--accent)" }}>
    SMOSP
  </span>
</h1>
            <form className="lp-form" onSubmit={handleSubmit} noValidate>
              
              {/* Full Name */}
              <div className="field">
                <label className="field-label" htmlFor="reg-name">Họ và tên</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="reg-name"
                    className="field-input"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setError(""); }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="field">
                <label className="field-label" htmlFor="reg-email">Email</label>
                <input
                  id="reg-email"
                  className="field-input"
                  type="email"
                  placeholder="hovaten@gmail.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                />
              </div>

              {/* Password */}
              <div className="field">
                <label className="field-label" htmlFor="reg-pass">Mật khẩu</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="reg-pass"
                    className="field-input"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  />
                  <button type="button"
                    onClick={() => setShowPass(v => !v)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#666" }}>
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="field" style={{ marginBottom: "24px" }}>
                <label className="field-label" htmlFor="reg-conf-pass">Xác nhận mật khẩu</label>
                <input
                  id="reg-conf-pass"
                  className="field-input"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                />
              </div>

              {/* Error */}
              {error && (
                <p className="field-error" style={{ background: "#fee2e2", padding: "10px", borderRadius: "8px", fontSize: "13px", color: "#b91c1c" }}>
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className={`btn btn-lg btn-primary btn-full ${loading ? "btn-loading" : ""}`}
                disabled={loading}>
                {loading ? "Đang xử lý..." : <>Đăng ký ngay <ChevronRight size={16} /></>}
              </button>
            </form>

            <p className="lp-footer-note" style={{ fontSize: 15, marginTop: "20px" }}>
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
