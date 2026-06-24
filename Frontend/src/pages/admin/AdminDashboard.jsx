import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import Layout from "../../components/layout/Layout";

function AdminDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Layout
      role="admin"
      user={{ name: username }}
      breadcrumbs={[{ label: "Dashboard" }]}
      onLogout={handleLogout}
      onLogoClick={() => navigate("/")}
    >
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 m-0">Chào mừng quay trở lại, {username}!</h1>
            <p className="text-gray-500 mt-1">Hệ thống SMOSP hoạt động ổn định. Dưới đây là tóm tắt cấu hình và hiệu suất.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate("/admin/users")} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition duration-150 text-sm border-0 cursor-pointer"
            >
              Quản lý người dùng
            </button>
            <button 
              onClick={() => navigate("/admin/system-config")} 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition duration-150 text-sm border-0 cursor-pointer"
            >
              Cấu hình hệ thống
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tổng người dùng</span>
              <h3 className="text-2xl font-bold text-gray-950 mt-1 mb-0">1,248</h3>
              <span className="text-xs text-green-500 font-medium mt-1 inline-block">↑ 12% so với tháng trước</span>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-xl font-bold">
              👥
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Token sử dụng</span>
              <h3 className="text-2xl font-bold text-gray-950 mt-1 mb-0">120.4K</h3>
              <span className="text-xs text-purple-500 font-medium mt-1 inline-block">Mức sử dụng trung bình</span>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 text-xl font-bold">
              🤖
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Crawler logs</span>
              <h3 className="text-2xl font-bold text-gray-950 mt-1 mb-0">98.2%</h3>
              <span className="text-xs text-green-500 font-medium mt-1 inline-block">Thu thập thành công</span>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 text-xl font-bold">
              🔌
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Trạng thái hệ thống</span>
              <h3 className="text-2xl font-bold text-gray-950 mt-1 mb-0">Hoạt động</h3>
              <span className="text-xs text-green-500 font-medium mt-1 inline-block">CPU: 12% | RAM: 45%</span>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 text-xl font-bold">
              ⚡
            </div>
          </div>
        </div>

        {/* Crawler & AI Config section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Config Links */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4 mt-0">Hoạt động hệ thống gần đây</h3>
            <div className="divide-y divide-gray-100">
              <div className="py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold text-gray-800 m-0">Đồng bộ dữ liệu ngành học</p>
                  <p className="text-xs text-gray-500 m-0">Tự động crawl dữ liệu FPT Edu</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">Thành công</span>
              </div>
              <div className="py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold text-gray-800 m-0">Cập nhật trọng số Xu hướng (Trending Weight)</p>
                  <p className="text-xs text-gray-500 m-0">Thay đổi bởi Content Manager</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">1 giờ trước</span>
              </div>
              <div className="py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold text-gray-800 m-0">Sao lưu cơ sở dữ liệu</p>
                  <p className="text-xs text-gray-500 m-0">Sao lưu định kỳ hàng ngày</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">Thành công</span>
              </div>
            </div>
          </div>

          {/* Quick status list */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 mt-0">Dịch vụ liên kết</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">OpenAI API</span>
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full" title="Connected"></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Google OAuth 2.0</span>
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full" title="Connected"></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Database Connection</span>
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full" title="Connected"></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Email SMTP Service</span>
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full" title="Connected"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
