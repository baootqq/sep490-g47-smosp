import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", backgroundColor: "white", height: "100vh" }}>
      <h1>Admin Dashboard</h1>
      <p>Chào mừng bạn đến với trang quản trị.</p>
      <button 
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px"
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
}

export default AdminDashboard;
