import "./LoginRegisterPage.css"; // Dùng chung style panel và card
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronRight, User, Mail, Lock } from "lucide-react";
import { register, googleLogin } from "../../services/authService";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import logo from "../../asset/logo.svg";

const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = (data) => {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("username", data.username);
    const role = data.roles?.length > 0 ? data.roles[0] : null;
    if (role) localStorage.setItem("role", role);

    if (role === "ROLE_ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const data = await googleLogin(idToken);
      handleLoginSuccess(data);
    } catch (err) {
      console.error("Google registration/login error:", err);
      setError(err.response?.data?.message || err.message || "Đăng nhập Google thất bại.");
    } finally {
      setLoading(false);
    }
  };

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

            {/* Google */}
            <button className="lp-google-btn" type="button"
              onClick={handleGoogleLogin}
              disabled={loading}>
              <GoogleLogo /> Đăng nhập với Google
            </button>

            <div className="lp-divider">Hoặc</div>

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
