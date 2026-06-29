import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import {
  getProfile,
  changePassword,
  logout,
} from "../../services/authService";
import { Key, Eye, EyeOff, Save, Shield } from "lucide-react";
import "./AccountPage.css";

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const storedRole = localStorage.getItem("role");
  const role =
    storedRole === "ROLE_ADMIN"
      ? "admin"
      : storedRole === "ROLE_CONTENT_MANAGER"
        ? "cm"
        : "student";
  const roleLabel = { student: "Sinh viên", cm: "Content Manager", admin: "Quản trị viên" }[role];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Không thể tải thông tin tài khoản. Vui lòng đăng nhập lại.");
        if (err.response?.status === 401) handleLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwError("Vui lòng điền đầy đủ thông tin mật khẩu.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Mật khẩu mới và mật khẩu xác nhận không khớp.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }
    const complexPwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
    if (!complexPwRegex.test(newPassword)) {
      setPwError("Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt.");
      return;
    }
    try {
      setPwSaving(true);
      setPwError("");
      setPwSuccess("");
      await changePassword(oldPassword, newPassword);
      setPwSuccess("Thay đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwSuccess(""), 4000);
    } catch (err) {
      console.error("Password change failed:", err);
      setPwError(err.response?.data?.message || "Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu cũ.");
    } finally {
      setPwSaving(false);
    }
  };

  const avatarLetter = profile?.displayName
    ? profile.displayName.charAt(0).toUpperCase()
    : "?";

  return (
    <Layout
      role={role}
      user={{ name: profile?.displayName || localStorage.getItem("username") || "Người dùng" }}
      breadcrumbs={[{ label: "Đổi mật khẩu" }]}
      onLogout={handleLogout}
      onLogoClick={() => navigate("/")}
      onGoHome={() => navigate("/")}
    >
      <div className="account-page">
        {/* Header */}
        <div className="account-page__header">
          <div className="eyebrow">Cài đặt</div>
          <h1 className="account-page__title" style={{ marginTop: 10 }}>
            Đổi mật khẩu
          </h1>
          <p className="account-page__subtitle">
            Cập nhật mật khẩu bảo mật tài khoản của bạn trên hệ thống SMOSP.
          </p>
        </div>

        {/* Grid */}
        <div className="account-page__grid">
          {loading ? (
            <div className="account-loading">
              <div className="account-loading__spinner" />
              <p className="account-loading__text">Đang tải thông tin tài khoản...</p>
            </div>
          ) : error && !profile ? (
            <div className="account-error-state">
              <p className="account-error-state__msg">{error}</p>
              <button className="btn btn-md btn-primary" onClick={handleLogout}>
                Đăng nhập lại
              </button>
            </div>
          ) : (
            <>
              {/* ── Sidebar ── */}
              <aside className="account-sidebar">
                <div className="account-sidebar__avatar">{avatarLetter}</div>
                <div>
                  <p className="account-sidebar__name">
                    {profile.displayName}
                  </p>
                  <span className="account-sidebar__role">{roleLabel}</span>
                </div>

                <hr className="account-sidebar__divider" />

                <div className="account-sidebar__meta">
                  <div className="account-sidebar__meta-item">
                    <div className="account-sidebar__meta-icon">
                      <Shield size={15} />
                    </div>
                    <div>
                      <div className="account-sidebar__meta-label">Vai trò</div>
                      <div className="account-sidebar__meta-value">{roleLabel}</div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* ── Right panels ── */}
              <div className="account-panels">
                {/* Panel 2 — Đổi mật khẩu */}
                <div className="account-panel">
                  <h2 className="account-panel__title">
                    <span className="account-panel__title-icon orange">
                      <Key size={15} />
                    </span>
                    Đổi mật khẩu
                  </h2>

                  {pwSuccess && (
                    <div className="account-alert account-alert--success" style={{ marginBottom: 20 }}>
                      {pwSuccess}
                    </div>
                  )}
                  {pwError && (
                    <div className="account-alert account-alert--error" style={{ marginBottom: 20 }}>
                      {pwError}
                    </div>
                  )}

                  {localStorage.getItem("loginProvider") === "google" ? (
                    <div className="account-alert account-alert--error" style={{ margin: "20px 0", lineHeight: 1.6 }}>
                      🔒 Tài khoản của bạn đăng nhập thông qua Google SSO (Gmail), do đó không sử dụng mật khẩu trên hệ thống SMOSP và không thể thực hiện đổi mật khẩu trực tiếp tại đây.
                    </div>
                  ) : (
                    <form className="account-form" onSubmit={handlePasswordChangeSubmit}>
                      {/* Old password */}
                      <div className="account-field">
                        <label className="account-field__label">Mật khẩu cũ</label>
                        <div className="account-field__icon-wrap">
                          <span className="account-field__icon">
                            <Key size={16} />
                          </span>
                          <input
                            type={showOldPw ? "text" : "password"}
                            className="field-input"
                            style={{ paddingLeft: 40, paddingRight: 40 }}
                            placeholder="Nhập mật khẩu hiện tại"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            disabled={pwSaving}
                          />
                          <button
                            type="button"
                            className="account-field__icon-right"
                            onClick={() => setShowOldPw(!showOldPw)}
                            tabIndex={-1}
                          >
                            {showOldPw ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* New password */}
                      <div className="account-field">
                        <label className="account-field__label">Mật khẩu mới</label>
                        <div className="account-field__icon-wrap">
                          <span className="account-field__icon">
                            <Key size={16} />
                          </span>
                          <input
                            type={showNewPw ? "text" : "password"}
                            className="field-input"
                            style={{ paddingLeft: 40, paddingRight: 40 }}
                            placeholder="Nhập mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={pwSaving}
                          />
                          <button
                            type="button"
                            className="account-field__icon-right"
                            onClick={() => setShowNewPw(!showNewPw)}
                            tabIndex={-1}
                          >
                            {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <span className="account-field__helper">
                          Tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt.
                        </span>
                      </div>

                      {/* Confirm password */}
                      <div className="account-field">
                        <label className="account-field__label">Xác nhận mật khẩu mới</label>
                        <div className="account-field__icon-wrap">
                          <span className="account-field__icon">
                            <Key size={16} />
                          </span>
                          <input
                            type={showConfirmPw ? "text" : "password"}
                            className="field-input"
                            style={{ paddingLeft: 40, paddingRight: 40 }}
                            placeholder="Nhập lại mật khẩu mới"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={pwSaving}
                          />
                          <button
                            type="button"
                            className="account-field__icon-right"
                            onClick={() => setShowConfirmPw(!showConfirmPw)}
                            tabIndex={-1}
                          >
                            {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="account-form__actions">
                        <button
                          type="submit"
                          className={`btn btn-md btn-primary${pwSaving ? " btn-loading" : ""}`}
                          disabled={pwSaving}
                        >
                          {pwSaving ? (
                            <>
                              <span className="btn-spinner--primary" />
                              Đang lưu...
                            </>
                          ) : (
                            <>
                              <Save size={15} />
                              Đổi mật khẩu
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
