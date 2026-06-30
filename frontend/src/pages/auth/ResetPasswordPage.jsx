import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "../../services/authService";
import logo from "../../asset/logo.svg";
import "./LoginRegisterPage.css";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Token không hợp lệ hoặc đã hết hạn.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    try {
      setError("");
      setLoading(true);
      const res = await resetPassword(token, newPassword);
      setMessage(res.message || "Đổi mật khẩu thành công!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-root">
      <div className="lp-card">
        <div className="lp-left">
          <img src={logo} alt="Logo" style={{ width: "250px", height: "auto" }} />
          <h2 className="lp-headline" style={{ fontStyle: "italic", marginTop: 15, textAlign: "center" }}>
            Hỗ trợ định hướng học thuật cho sinh viên
          </h2>
          <div className="lp-copy">© 2026 SMOSP</div>
        </div>

        <div className="lp-right">
          <button className="lp-close" onClick={() => navigate("/login")} aria-label="Hủy">✕</button>
          <div className="lp-form-box">
            <h1 className="lp-title">Đặt lại mật khẩu</h1>
            
            <form className="lp-form" onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-label" htmlFor="new-pass">Mật khẩu mới</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="new-pass"
                    className="field-input"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                  />
                  <button type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#666" }}>
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="field">
                <label className="field-label" htmlFor="conf-pass">Xác nhận mật khẩu</label>
                <input
                  id="conf-pass"
                  className="field-input"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                />
              </div>

              {error && <p className="field-error" style={{ background: "#fee2e2", padding: "10px", borderRadius: "8px", fontSize: "13px", color: "#b91c1c" }}>{error}</p>}
              {message && <p style={{ background: "#dcfce7", padding: "10px", borderRadius: "8px", fontSize: "13px", color: "#15803d", marginBottom: 20 }}>{message}</p>}

              <button
                type="submit"
                className={`btn btn-lg btn-primary btn-full ${loading ? "btn-loading" : ""}`}
                disabled={loading || !token}
              >
                {loading ? "Đang xử lý..." : <>Cập nhật mật khẩu <ChevronRight size={16} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
