
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Heart,
  CalendarDays,
  Bell,
  PlusCircle,
  Users,
  MapPin,
  UserCheck,
  Handshake,
  WalletCards,
  X,
  ShieldCheck,
} from "lucide-react";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

function NavItem({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `
        group flex items-center gap-3 border px-3 py-2.5 text-sm
        transition-all duration-200
        ${
          isActive
            ? "border-[#AD8332]/35 bg-[#171B21] text-white shadow-[0_6px_18px_-12px_rgba(23,27,33,0.5)]"
            : "border-transparent text-[#6B6252] hover:border-[#E4DCC9] hover:bg-[#F2ECDF]/70 hover:text-[#201C15]"
        }
        `
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={17}
            strokeWidth={isActive ? 1.9 : 1.75}
            className={
              isActive
                ? "text-[#D8B876]"
                : "text-[#8A806D] transition-colors group-hover:text-[#8C6924]"
            }
          />

          <span className="min-w-0 flex-1 truncate">
            {label}
          </span>

          {isActive && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D8B876]" />
          )}
        </>
      )}
    </NavLink>
  );
}

function Sidebar({ isOpen = false, onClose }) {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token) return null;

  let user = null;

  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch {
    user = null;
  }

  const role = user?.role
    ?.replace("ROLE_", "")
    .trim()
    .toUpperCase();

  const roleLabel =
    role === "SUPER_ADMIN"
      ? "Super Admin"
      : role === "ADMIN"
        ? "Administrator"
        : role === "SELLER"
          ? "Seller"
          : role === "BUYER"
            ? "Buyer"
            : "Account";

  return (
    <>
      {/* Mobile overlay */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#171B21]/45 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-[#D8CFB9] bg-[#FBF8F1]
          transition-transform duration-300
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
          ${isOpen
            ? "translate-x-0 shadow-[16px_0_40px_-28px_rgba(23,27,33,0.45)]"
            : "-translate-x-full"
          }
        `}
      >
        {/* =================================================
            HEADER
            ================================================= */}

        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#E4DCC9] px-4">
          <NavLink
            to={
              role === "BUYER"
                ? "/buyer/dashboard"
                : role === "SELLER"
                  ? "/seller/dashboard"
                  : role === "ADMIN" ||
                      role === "SUPER_ADMIN"
                    ? "/admin/dashboard"
                    : "/"
            }
            onClick={onClose}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center border border-[#AD8332]/40 bg-[#171B21] text-white transition group-hover:border-[#D8B876]">
              <Building2
                size={18}
                strokeWidth={1.5}
              />
            </div>

            <div>
              <span
                className="block text-lg leading-none text-[#201C15]"
                style={FRASER}
              >
                Estate
                <span className="text-[#8C6924]">
                  Hub
                </span>
              </span>

              <span className="mt-1 block text-[9px] uppercase tracking-[0.16em] text-[#8A806D]">
                Property platform
              </span>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-[#8A806D] transition hover:bg-[#F2ECDF] hover:text-[#201C15] lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* =================================================
            ACCOUNT ROLE
            ================================================= */}

        <div className="mx-3 mt-4 border border-[#E4DCC9] bg-white/60 px-3 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center bg-[#F2ECDF] text-[#8C6924]">
              <ShieldCheck size={15} />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8A806D]">
                Signed in as
              </p>

              <p className="mt-0.5 truncate text-xs font-medium text-[#201C15]">
                {roleLabel}
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            NAVIGATION
            ================================================= */}

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {/* BUYER */}

          {role === "BUYER" && (
            <>
              <NavItem
                to="/buyer/dashboard"
                label="Dashboard"
                icon={LayoutDashboard}
                onClick={onClose}
              />

              <NavItem
                to="/buyer/properties"
                label="Browse Properties"
                icon={Building2}
                onClick={onClose}
              />

              <NavItem
                to="/buyer/favorites"
                label="My Favorites"
                icon={Heart}
                onClick={onClose}
              />

              <NavItem
                to="/buyer/visits"
                label="My Visits"
                icon={CalendarDays}
                onClick={onClose}
              />

              <NavItem
                to="/buyer/notifications"
                label="Notifications"
                icon={Bell}
                onClick={onClose}
              />
            </>
          )}

          {/* SELLER */}

          {role === "SELLER" && (
            <>
              <NavItem
                to="/seller/dashboard"
                label="Dashboard"
                icon={LayoutDashboard}
                onClick={onClose}
              />

              <NavItem
                to="/seller/properties"
                label="My Properties"
                icon={Building2}
                onClick={onClose}
              />

              <NavItem
                to="/seller/properties/add"
                label="Add Property"
                icon={PlusCircle}
                onClick={onClose}
              />
            </>
          )}

          {/* ADMIN */}

          {(role === "ADMIN" ||
            role === "SUPER_ADMIN") && (
            <>
              <NavItem
                to="/admin/dashboard"
                label="Dashboard"
                icon={LayoutDashboard}
                onClick={onClose}
              />

              <NavItem
                to="/admin/properties"
                label="Properties"
                icon={Building2}
                onClick={onClose}
              />

              <NavItem
                to="/admin/leads"
                label="Leads"
                icon={UserCheck}
                onClick={onClose}
              />

              <NavItem
                to="/admin/visits"
                label="Visits"
                icon={CalendarDays}
                onClick={onClose}
              />

              <NavItem
                to="/admin/deals"
                label="Deals"
                icon={Handshake}
                onClick={onClose}
              />

              <NavItem
                to="/admin/commissions"
                label="Commissions"
                icon={WalletCards}
                onClick={onClose}
              />

              <NavItem
                to="/admin/users"
                label="Users"
                icon={Users}
                onClick={onClose}
              />

              <NavItem
                to="/admin/locations"
                label="Locations"
                icon={MapPin}
                onClick={onClose}
              />
            </>
          )}
        </nav>

        {/* =================================================
            FOOTER
            ================================================= */}

        <div className="shrink-0 border-t border-[#E4DCC9] px-3 py-4">
          <div className="flex items-center gap-2 px-2 text-[10px] text-[#8A806D]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3F6B52]" />
            EstateHub account active
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

