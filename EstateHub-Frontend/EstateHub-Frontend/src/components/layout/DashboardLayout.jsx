
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, PanelLeft } from "lucide-react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F5ED] text-[#201C15]">
      <Navbar />

      {/* Mobile Sidebar Trigger */}
      <div className="sticky top-16 z-30 border-b border-[#D8CFB9] bg-[#FBF8F1]/95 px-4 py-2.5 backdrop-blur-sm sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-2 border border-[#D8CFB9] bg-[#F2ECDF] px-3.5 py-2 text-sm font-medium text-[#201C15] transition hover:border-[#AD8332] hover:bg-white"
        >
          <Menu size={16} strokeWidth={2} />
          Menu
        </button>
      </div>

      {/* Dashboard Shell */}
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1600px]">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="min-w-0 flex-1">
          <div className="container-page">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

