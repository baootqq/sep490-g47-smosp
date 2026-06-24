import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import Layout from "../../components/layout/Layout";

function StudentDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Sinh viên";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Layout
      role="student"
      user={{ name: username }}
      breadcrumbs={[{ label: "Dashboard" }]}
      onLogout={handleLogout}
      onLogoClick={() => navigate("/")}
      onGoHome={() => navigate("/")}
    >
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 m-0">Chào bạn, {username}!</h1>
            <p className="text-gray-500 mt-1">Cổng định hướng và phân tích chuyển ngành học thuật SMOSP dành riêng cho bạn.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate("/student/holland")} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition duration-150 text-sm border-0 cursor-pointer"
            >
              Làm test Holland RIASEC
            </button>
            <button 
              onClick={() => navigate("/student/roadmap")} 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition duration-150 text-sm border-0 cursor-pointer"
            >
              Xem lộ trình học
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Holland Test</span>
              <h3 className="text-2xl font-bold text-gray-950 mt-1 mb-0">Chưa hoàn thành</h3>
              <span className="text-xs text-orange-500 font-medium mt-1 inline-block">Hãy làm test ngay để tìm cá tính</span>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 text-xl font-bold">
              🧩
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tiến độ lộ trình học</span>
              <h3 className="text-2xl font-bold text-gray-950 mt-1 mb-0">25%</h3>
              <span className="text-xs text-blue-500 font-medium mt-1 inline-block">Môn học đã hoàn thành</span>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-xl font-bold">
              🗺
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gợi ý chuyên ngành</span>
              <h3 className="text-2xl font-bold text-gray-950 mt-1 mb-0">3</h3>
              <span className="text-xs text-purple-500 font-medium mt-1 inline-block">Chuyên ngành được đề xuất</span>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 text-xl font-bold">
              ✨
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phân tích chuyển ngành</span>
              <h3 className="text-2xl font-bold text-gray-950 mt-1 mb-0">Khả dụng</h3>
              <span className="text-xs text-green-500 font-medium mt-1 inline-block">Sẵn sàng để mô phỏng chuyển đổi</span>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 text-xl font-bold">
              ⇄
            </div>
          </div>
        </div>

        {/* Features details section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4 mt-0">Chuyên ngành gợi ý cho bạn</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <span className="font-semibold text-gray-800 block">Kỹ nghệ Phần mềm (Software Engineering)</span>
                  <span className="text-xs text-gray-500">Môn tiên quyết: PRF192, PRO192</span>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Độ khớp: 98%</span>
              </div>
              <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <span className="font-semibold text-gray-800 block">Trí tuệ Nhân tạo (Artificial Intelligence)</span>
                  <span className="text-xs text-gray-500">Môn tiên quyết: MAD101, AIL302m</span>
                </div>
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">Độ khớp: 92%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 mt-0">Trang cá nhân nhanh</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate("/student/profile")} className="w-full text-left py-2.5 px-3 hover:bg-gray-50 text-gray-700 font-medium rounded-lg border-0 bg-transparent cursor-pointer transition text-sm flex justify-between">
                <span>👤 Xem hồ sơ cá nhân</span>
                <span>→</span>
              </button>
              <button onClick={() => navigate("/student/transfer")} className="w-full text-left py-2.5 px-3 hover:bg-gray-50 text-gray-700 font-medium rounded-lg border-0 bg-transparent cursor-pointer transition text-sm flex justify-between">
                <span>⇄ Phân tích chuyển ngành</span>
                <span>→</span>
              </button>
              <button onClick={() => navigate("/catalog")} className="w-full text-left py-2.5 px-3 hover:bg-gray-50 text-gray-700 font-medium rounded-lg border-0 bg-transparent cursor-pointer transition text-sm flex justify-between">
                <span>📚 Khám phá danh mục ngành</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default StudentDashboard;
