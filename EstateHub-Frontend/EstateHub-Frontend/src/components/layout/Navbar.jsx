import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Building2,
  LayoutDashboard,
  Search,
  ChevronDown,
} from "lucide-react";

/* Matches the display serif used on the Home page. Falls back cleanly to
   Tailwind's default serif stack if Fraunces isn't loaded — see Home.jsx
   for the optional Google Fonts link. */
const FRASER = { fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif" };

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch {
    user = null;
  }

  const role = user?.role?.replace("ROLE_", "").trim().toUpperCase();
  const name = user?.name || "User";

  const userInitial = name.trim().charAt(0).toUpperCase() || "U";

  const dashboardPath =
    role === "BUYER"
      ? "/buyer/dashboard"
      : role === "SELLER"
        ? "/seller/dashboard"
        : role === "ADMIN" || role === "SUPER_ADMIN"
          ? "/admin/dashboard"
          : "/";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setOpen(false);

    navigate("/login", { replace: true });
  };

  const closeMobile = () => {
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#171B21]/10 bg-[#F2ECDF]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          {/* ================= LOGO ================= */}

          <Link to="/" onClick={closeMobile} className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-[#171B21] bg-[#171B21] text-[#F2ECDF] transition group-hover:bg-[#AD8332] group-hover:border-[#AD8332]">
              <Building2 size={19} strokeWidth={2} />
            </div>

            <div className="leading-none">
              <div className="text-lg text-[#201C15]" style={FRASER}>
                Estate<span className="text-[#8C6924]">Hub</span>
              </div>
              <div className="mt-1 hidden text-[10px] text-[#8A806D] sm:block">
                Property listing index
              </div>
            </div>
          </Link>

          {/* ================= DESKTOP NAV ================= */}

          <div className="hidden items-center gap-1 md:flex">
            <NavItem to="/" label="Home" />
            <NavItem to="/properties" label="Properties" icon={<Search size={15} />} />
            {token && (
              <NavItem to={dashboardPath} label="Dashboard" icon={<LayoutDashboard size={15} />} />
            )}
          </div>

          {/* ================= DESKTOP USER AREA ================= */}

          <div className="hidden items-center gap-3 md:flex">
            {token ? (
              <>
                {/* User chip — ledger entry style */}
                <div className="flex items-center gap-3 border border-[#D8CFB9] bg-white/60 px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center border border-[#171B21] bg-[#171B21] text-sm font-medium text-[#F2ECDF]">
                    {userInitial}
                  </div>

                  <div className="max-w-[130px]">
                    <p className="truncate text-sm font-medium text-[#201C15]">{name}</p>
                    <p className="text-[10px] text-[#8A806D]">
                      {role?.replace("_", " ") || "User"}
                    </p>
                  </div>

                  <ChevronDown size={14} className="text-[#8A806D]" />
                </div>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 border border-[#D8CFB9] bg-transparent px-4 py-2.5 text-sm font-medium text-[#4A4436] transition hover:border-[#B3564B] hover:text-[#B3564B]"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-medium text-[#4A4436] transition hover:text-[#201C15]"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-[#AD8332] px-5 py-2.5 text-sm font-semibold text-[#171B21] transition hover:bg-[#c39843]"
                >
                  Get started
                  <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </div>

          {/* ================= MOBILE TOGGLE ================= */}

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center border border-[#D8CFB9] bg-white/60 text-[#201C15] transition hover:bg-white md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}

        {open && (
          <div className="border-t border-[#D8CFB9] py-4 md:hidden">
            {/* User information */}
            {token && (
              <div className="mb-3 flex items-center gap-3 border border-[#D8CFB9] bg-white/50 p-4">
                <div className="flex h-11 w-11 items-center justify-center border border-[#171B21] bg-[#171B21] font-medium text-[#F2ECDF]">
                  {userInitial}
                </div>

                <div>
                  <p className="text-sm font-medium text-[#201C15]">{name}</p>
                  <p className="mt-0.5 text-xs text-[#8A806D]">
                    {role?.replace("_", " ") || "User"}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col gap-1">
              <MobileNavItem to="/" label="Home" onClick={closeMobile} />
              <MobileNavItem
                to="/properties"
                label="Properties"
                icon={<Search size={16} />}
                onClick={closeMobile}
              />
              {token && (
                <MobileNavItem
                  to={dashboardPath}
                  label="Dashboard"
                  icon={<LayoutDashboard size={16} />}
                  onClick={closeMobile}
                />
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 border-t border-[#D8CFB9] pt-4">
              {token ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 border border-[#B3564B]/40 bg-[#B3564B]/10 px-4 py-3 text-sm font-medium text-[#B3564B] transition hover:bg-[#B3564B]/15"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="border border-[#D8CFB9] px-4 py-3 text-center text-sm font-medium text-[#201C15] transition hover:bg-white"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobile}
                    className="bg-[#AD8332] px-4 py-3 text-center text-sm font-semibold text-[#171B21] transition hover:bg-[#c39843]"
                  >
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

/* ========================================================= */
/* DESKTOP NAV ITEM */
/* ========================================================= */

function NavItem({ to, label, icon }) {
  return (
    <Link
      to={to}
      className="group relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#4A4436] transition hover:text-[#201C15]"
    >
      {icon && <span className="text-[#8A806D] transition group-hover:text-[#8C6924]">{icon}</span>}
      {label}
      <span className="absolute bottom-1 left-4 right-4 h-px scale-x-0 bg-[#AD8332] transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
}

/* ========================================================= */
/* MOBILE NAV ITEM */
/* ========================================================= */

function MobileNavItem({ to, label, icon, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#201C15] transition hover:bg-white/60"
    >
      {icon ? (
        <span className="text-[#8A806D]">{icon}</span>
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-[#AD8332]" />
      )}
      {label}
    </Link>
  );
}

export default Navbar;