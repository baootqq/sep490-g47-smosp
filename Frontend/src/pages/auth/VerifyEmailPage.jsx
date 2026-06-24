import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../../services/authService";
import logo from "../../asset/logo.svg";
import "./LoginRegisterPage.css";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const doVerify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token xác thực không hợp lệ.");
        return;
      }
      try {
        const res = await verifyEmail(token);
        setStatus("success");
        setMessage(res.message || "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.");
        setTimeout(() => navigate("/login"), 5000);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Xác thực thất bại hoặc token đã hết hạn.");
      }
    };
    doVerify();
  }, [token, navigate]);

  return (
    <div className="lp-root">
      <div className="lp-card" style={{ maxWidth: "500px", minHeight: "auto", padding: "40px" }}>
        <div style={{ textAlign: "center", width: "100%" }}>
          <img src={logo} alt="Logo" style={{ width: "150px", marginBottom: "20px" }} />
          <h1 className="lp-title" style={{ fontSize: "24px" }}>Xác thực Email</h1>
          
          {status === "verifying" && <p>Đang xác thực tài khoản của bạn...</p>}
          
          {status === "success" && (
            <div style={{ color: "#15803d", background: "#dcfce7", padding: "20px", borderRadius: "8px" }}>
              {message}
              <p style={{ fontSize: "12px", marginTop: "10px" }}>Đang chuyển hướng về trang đăng nhập...</p>
            </div>
          )}
          
          {status === "error" && (
            <div style={{ color: "#b91c1c", background: "#fee2e2", padding: "20px", borderRadius: "8px" }}>
              {message}
              <button 
                onClick={() => navigate("/login")}
                style={{ marginTop: "20px", border: "none", background: "none", color: "var(--accent)", cursor: "pointer", textDecoration: "underline" }}
              >
                Quay lại Đăng nhập
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
