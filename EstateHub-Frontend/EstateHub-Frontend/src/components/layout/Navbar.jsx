
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Building2,
  LayoutDashboard,
  Search,
  ChevronDown,
} from "lucide-react";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
    setProfileOpen(false);

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

          <Link
            to="/"
            onClick={closeMobile}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center border border-[#171B21] bg-[#171B21] text-[#F2ECDF] transition duration-200 group-hover:border-[#AD8332] group-hover:bg-[#AD8332]">
              <Building2 size={19} strokeWidth={2} />
            </div>

            <div className="leading-none">
              <div
                className="text-lg tracking-tight text-[#201C15]"
                style={FRASER}
              >
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

            <NavItem
              to="/properties"
              label="Properties"
              icon={<Search size={15} />}
            />

            {token && (
              <NavItem
                to={dashboardPath}
                label="Dashboard"
                icon={<LayoutDashboard size={15} />}
              />
            )}
          </div>

          {/* ================= DESKTOP USER AREA ================= */}

          <div className="hidden items-center gap-3 md:flex">
            {token ? (
              <>
                {/* User Profile */}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center gap-3 border border-[#D8CFB9] bg-white/60 px-3 py-2 transition hover:border-[#BDAF91] hover:bg-white"
                    aria-expanded={profileOpen}
                    aria-label="Open profile menu"
                  >
                    <div className="flex h-9 w-9 items-center justify-center border border-[#171B21] bg-[#171B21] text-sm font-medium text-[#F2ECDF]">
                      {userInitial}
                    </div>

                    <div className="max-w-[130px] text-left">
                      <p className="truncate text-sm font-medium text-[#201C15]">
                        {name}
                      </p>

                      <p className="text-[10px] uppercase tracking-wide text-[#8A806D]">
                        {role?.replace("_", " ") || "User"}
                      </p>
                    </div>

                    <ChevronDown
                      size={14}
                      className={`text-[#8A806D] transition-transform duration-200 ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown */}

                  {profileOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] w-52 overflow-hidden border border-[#D8CFB9] bg-[#FDFBF6] p-1.5 shadow-xl shadow-[#171B21]/10">
                      <Link
                        to={dashboardPath}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#201C15] transition hover:bg-[#F2ECDF]"
                      >
                        <LayoutDashboard
                          size={16}
                          className="text-[#8C6924]"
                        />
                        Dashboard
                      </Link>

                      <div className="my-1 border-t border-[#D8CFB9]" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#B3564B] transition hover:bg-[#B3564B]/10"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
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
                  className="inline-flex items-center gap-2 bg-[#AD8332] px-5 py-2.5 text-sm font-semibold text-[#171B21] transition hover:bg-[#C39843]"
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
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
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
                  <p className="text-sm font-medium text-[#201C15]">
                    {name}
                  </p>

                  <p className="mt-0.5 text-xs uppercase tracking-wide text-[#8A806D]">
                    {role?.replace("_", " ") || "User"}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}

            <div className="flex flex-col gap-1">
              <MobileNavItem
                to="/"
                label="Home"
                onClick={closeMobile}
              />

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
                    className="bg-[#AD8332] px-4 py-3 text-center text-sm font-semibold text-[#171B21] transition hover:bg-[#C39843]"
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

/* =========================================================
   DESKTOP NAV ITEM
   ========================================================= */

function NavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `group relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition ${
          isActive
            ? "text-[#201C15]"
            : "text-[#4A4436] hover:text-[#201C15]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {icon && (
            <span
              className={`transition ${
                isActive
                  ? "text-[#8C6924]"
                  : "text-[#8A806D] group-hover:text-[#8C6924]"
              }`}
            >
              {icon}
            </span>
          )}

          {label}

          <span
            className={`absolute bottom-1 left-4 right-4 h-px bg-[#AD8332] transition-transform duration-300 ${
              isActive
                ? "scale-x-100"
                : "scale-x-0 group-hover:scale-x-100"
            }`}
          />
        </>
      )}
    </NavLink>
  );
}

/* =========================================================
   MOBILE NAV ITEM
   ========================================================= */

function MobileNavItem({ to, label, icon, onClick }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
          isActive
            ? "bg-white text-[#8C6924]"
            : "text-[#201C15] hover:bg-white/60"
        }`
      }
    >
      {icon ? (
        <span className="text-[#8A806D]">{icon}</span>
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-[#AD8332]" />
      )}

      {label}
    </NavLink>
  );
}

export default Navbar;

