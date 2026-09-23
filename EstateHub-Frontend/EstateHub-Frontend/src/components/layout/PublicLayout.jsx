
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F5ED] text-[#201C15]">
      <Navbar />

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default PublicLayout;

