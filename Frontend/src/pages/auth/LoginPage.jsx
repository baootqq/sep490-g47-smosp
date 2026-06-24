import "./LoginRegisterPage.css";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import { login, googleLogin } from "../../services/authService";
import logo from "../../asset/logo.svg";

const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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
    } else if (role === "ROLE_CONTENT_MANAGER") {
      navigate("/cm/dashboard");
    } else if (role === "ROLE_STUDENT") {
      navigate("/student/dashboard");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const init = () => {
      if (window.google) {
        google.accounts.id.initialize({
          client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
          callback: async (res) => {
            try {
              setError(""); setLoading(true);
              handleLoginSuccess(await googleLogin(res.credential));
            } catch (err) {
              setError(err.response?.data?.message || "Đăng nhập Google thất bại.");
            } finally { setLoading(false); }
          },
        });
        google.accounts.id.renderButton(
          document.getElementById("google-sdk-div"),
          { theme: "outline", size: "large" }
        );
      }
    };
    const t = setInterval(() => { if (window.google) { init(); clearInterval(t); } }, 100);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    try {
      setError(""); setLoading(true);
      handleLoginSuccess(await login(identifier, password));
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại. Kiểm tra lại thông tin.");
    } finally { setLoading(false); }
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



          <div className="lp-copy">
            © 2026 SMOSP
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="lp-right">
          <button className="lp-close" onClick={() => navigate("/")} aria-label="Đóng">✕</button>

          <div className="lp-form-box">
            <div className="eyebrow" style={{ marginBottom: 12 }}>Chào mừng bạn quay trở lại!</div>
            <h1 className="lp-title">
              Đăng nhập vào{" "}
              <span style={{ color: "var(--accent)" }}>
                SMOSP
              </span>
            </h1>
            {/* Google */}
            <button className="lp-google-btn" type="button"
              onClick={() => window.google?.accounts.id.prompt()}
              disabled={loading}>
              <GoogleLogo /> Đăng nhập với Google
            </button>
            <div id="google-sdk-div" style={{ display: "none" }} />

            <div className="lp-divider">Hoặc</div>

            <form className="lp-form" onSubmit={handleSubmit} noValidate>

              {/* Identifier */}
              <div className="field">
                <label className="field-label" htmlFor="login-id">
                  Email hoặc tên đăng nhập
                </label>
                <input
                  id="login-id"
                  className="field-input"
                  placeholder="user@gmail.com hoặc user123"
                  value={identifier}
                  disabled={loading}
                  autoComplete="username"
                  onChange={(e) => { setIdentifier(e.target.value); setError(""); }}
                />
              </div>

              {/* Password */}
              <div className="field">
                <div className="lp-label-row">
                  <label className="field-label" htmlFor="login-pass">Mật khẩu</label>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    id="login-pass"
                    className={`field-input${error ? " error" : ""}`}
                    style={{ paddingRight: 44 }}
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    disabled={loading}
                    autoComplete="current-password"
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  />
                  <button type="button"
                    onClick={() => setShowPass(v => !v)}
                    aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", padding: 4, cursor: "pointer",
                      color: "var(--text-muted)", display: "flex", alignItems: "center",
                    }}>
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <Link to="/forgot-password" className="lp-forgot" style={{ fontSize: 15, display: "flex", justifyContent: "flex-end" }}>
                Quên mật khẩu?
              </Link>

              {/* Error */}
              {error && (
                <p className="field-error" role="alert"
                  style={{ background: "var(--error-light)", padding: "10px 14px", borderRadius: "var(--r-md)", fontSize: 13 }}>
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className={`btn btn-lg btn-primary btn-full${loading ? " btn-loading" : ""}`}
                disabled={loading}>
                {loading
                  ? <><span className="btn-spinner" />Đang xử lý...</>
                  : <>Đăng nhập<ChevronRight size={16} /></>
                }
              </button>
            </form>

            <p className="lp-footer-note" style={{ fontSize: 15 }}>
              Chưa có tài khoản sinh viên?{" "}
              <Link to="/register">Đăng ký ngay</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;