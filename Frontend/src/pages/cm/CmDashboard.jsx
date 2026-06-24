import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import Layout from "../../components/layout/Layout";

function CmDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Content Manager";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Layout
      role="cm"
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
            <p className="text-gray-500 mt-1">Trang quản trị nội dung định hướng ngành nghề cho sinh viên FPT.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate("/cm/catalog")} 
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition duration-150 text-sm border-0 cursor-pointer"
            >
              Quản lý ngành học
            </button>
            <button 
              onClick={() => navigate("/cm/questions")} 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition duration-150 text-sm border-0 cursor-pointer"
            >
              Ngân hàng câu hỏi
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Danh mục ngành</span>
              <h3 className="text-2xl font-bold text-gray-950 mt-1 mb-0">18</h3>
              <span className="text-xs text-orange-500 font-medium mt-1 inline-block">Chuyên ngành chính & hẹp</span>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 text-xl font-bold">
              📚
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Kỹ năng & Sở thích</span>
              <h3 className="text-2xl font-bold text-gray-950 mt-1 mb-0">45</h3>
              <span className="text-xs text-blue-500 font-medium mt-1 inline-block">Đã được gán trọng số</span>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-xl font-bold">
              🏷
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ngân hàng câu hỏi</span>
              <h3 className="text-2xl font-bold text-gray-950 mt-1 mb-0">250</h3>
              <span className="text-xs text-purple-500 font-medium mt-1 inline-block">Câu hỏi Holland RIASEC</span>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 text-xl font-bold">
              ❓
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Báo cáo lỗi nội dung</span>
              <h3 className="text-2xl font-bold text-gray-950 mt-1 mb-0">0</h3>
              <span className="text-xs text-green-500 font-medium mt-1 inline-block">Hoàn toàn sạch bóng</span>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 text-xl font-bold">
              🚩
            </div>
          </div>
        </div>

        {/* Content Management sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4 mt-0">Trạng thái dữ liệu thu thập (Crawl Logs)</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl">
                <div>
                  <span className="font-semibold text-gray-800 block">Crawl dữ liệu tuyển dụng FPT Software</span>
                  <span className="text-xs text-gray-500">Hoàn thành: 24/06/2026 - 08:30 AM</span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Thành công</span>
              </div>
              <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl">
                <div>
                  <span className="font-semibold text-gray-800 block">Crawl mô tả công việc IT Jobs Vietnam</span>
                  <span className="text-xs text-gray-500">Hoàn thành: 23/06/2026 - 11:15 PM</span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Thành công</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 mt-0">Lối tắt thao tác nhanh</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate("/cm/trending-weight")} className="w-full text-left py-2.5 px-3 hover:bg-gray-50 text-gray-700 font-medium rounded-lg border-0 bg-transparent cursor-pointer transition text-sm flex justify-between">
                <span>📈 Cấu hình Trending Weight</span>
                <span>→</span>
              </button>
              <button onClick={() => navigate("/cm/skills")} className="w-full text-left py-2.5 px-3 hover:bg-gray-50 text-gray-700 font-medium rounded-lg border-0 bg-transparent cursor-pointer transition text-sm flex justify-between">
                <span>🏷 Quản lý Kỹ năng & Sở thích</span>
                <span>→</span>
              </button>
              <button onClick={() => navigate("/cm/curriculum")} className="w-full text-left py-2.5 px-3 hover:bg-gray-50 text-gray-700 font-medium rounded-lg border-0 bg-transparent cursor-pointer transition text-sm flex justify-between">
                <span>📋 Quản lý Chương trình học</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CmDashboard;
