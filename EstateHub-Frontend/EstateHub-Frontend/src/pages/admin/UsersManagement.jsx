
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  User,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Filter,
  AlertCircle,
  ArrowRight,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";

import {
  getAllUsers,
  enableUser,
  disableUser,
} from "../../api/userApi";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

// --------------------------------------------------
// Role Badge
// --------------------------------------------------
const RoleBadge = ({ role }) => {
  const classes = {
    SUPER_ADMIN: "border-violet-200 bg-violet-50 text-violet-700",
    ADMIN: "border-blue-200 bg-blue-50 text-blue-700",
    SELLER: "border-amber-200 bg-amber-50 text-amber-700",
    BUYER: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
        classes[role] || "border-[#D8CFB9] bg-[#F8F5ED] text-[#6B6252]"
      }`}
    >
      {role?.replace("_", " ") || "USER"}
    </span>
  );
};

// --------------------------------------------------
// Status Badge
// --------------------------------------------------
const StatusBadge = ({ enabled }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
      enabled
        ? "border-[#BCD0C1] bg-[#EEF5EF] text-[#3F6B52]"
        : "border-[#E4C1BC] bg-[#FBF0EE] text-[#B3564B]"
    }`}
  >
    {enabled ? <CheckCircle size={12} /> : <XCircle size={12} />}
    {enabled ? "Active" : "Disabled"}
  </span>
);

// --------------------------------------------------
// Stat Card
// --------------------------------------------------
const StatCard = ({ label, value, icon: Icon, accent }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CBB98E]">
    <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-[#F2ECDF] opacity-70" />

    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A806D]">
          {label}
        </p>

        <p
          className="mt-2 text-3xl font-semibold tracking-tight text-[#201C15]"
          style={FRASER}
        >
          {value}
        </p>
      </div>

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl border ${accent}`}
      >
        <Icon size={19} />
      </div>
    </div>
  </div>
);

// --------------------------------------------------
// Info Item
// --------------------------------------------------
const InfoItem = ({ label, children }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9A907D]">
      {label}
    </p>
    <div className="mt-1 text-sm font-medium text-[#403A31]">
      {children}
    </div>
  </div>
);

// --------------------------------------------------
// Main Component
// --------------------------------------------------
export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------------------------
  // Fetch users
  // --------------------------------------------------
  const fetchUsers = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      setError("");

      const data = await getAllUsers();

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load users."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --------------------------------------------------
  // Filter logic
  // --------------------------------------------------
  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();

    return users.filter((u) => {
      const matchSearch =
        !term ||
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.mobile?.toLowerCase().includes(term) ||
        String(u.id).includes(term);

      const matchRole =
        roleFilter === "ALL" || u.role === roleFilter;

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && u.enabled) ||
        (statusFilter === "DISABLED" && !u.enabled);

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // --------------------------------------------------
  // Enable / Disable
  // --------------------------------------------------
  const toggleUser = async (id, enable) => {
    try {
      setActionId(id);
      setError("");
      setSuccess("");

      const updated = enable
        ? await enableUser(id)
        : await disableUser(id);

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? updated : u))
      );

      setSuccess(
        `User ${enable ? "enabled" : "disabled"} successfully.`
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Action failed."
      );
    } finally {
      setActionId(null);
    }
  };

  // --------------------------------------------------
  // Stats
  // --------------------------------------------------
  const total = users.length;

  const active = users.filter((u) => u.enabled).length;

  const disabled = total - active;

  const buyers = users.filter(
    (u) => u.role === "BUYER"
  ).length;

  const sellers = users.filter(
    (u) => u.role === "SELLER"
  ).length;

  const admins = users.filter(
    (u) =>
      u.role === "ADMIN" ||
      u.role === "SUPER_ADMIN"
  ).length;

  // --------------------------------------------------
  // Filters
  // --------------------------------------------------
  const clearFilters = () => {
    setSearch("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
  };

  const isFilterActive =
    search ||
    roleFilter !== "ALL" ||
    statusFilter !== "ALL";

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <div className="w-full pb-8">

      {/* ==================================================
          HERO
      ================================================== */}
      <section className="relative mb-6 overflow-hidden rounded-[24px] border border-[#D8CFB9] bg-[#201C15] px-5 py-6 text-[#F8F5ED] shadow-sm sm:px-7 sm:py-8">

        {/* Blueprint grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.45) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />

        <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full border-b border-l border-[#D8B876]/20" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <div className="mb-3 flex items-center gap-2 text-[#D8B876]">
              <Users size={15} />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em]">
                Admin • User Directory
              </span>
            </div>

            <h1
              className="max-w-2xl text-3xl leading-tight sm:text-4xl"
              style={FRASER}
            >
              People behind the platform.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#C9C1B2]">
              Manage buyer, seller and administrator accounts from
              one central workspace.
            </p>
          </div>

          <button
            onClick={() => fetchUsers(false)}
            disabled={loading || refreshing}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#D8B876]/40 bg-[#F8F5ED] px-4 py-2.5 text-sm font-semibold text-[#201C15] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh users"}
          </button>
        </div>

        <div className="relative mt-7 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#D8D0C2]">
            {total} total accounts
          </span>

          <span className="rounded-full border border-[#789A82]/30 bg-[#789A82]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#BFD2C4]">
            {active} active
          </span>

          <span className="rounded-full border border-[#B3564B]/30 bg-[#B3564B]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#E1B5AF]">
            {disabled} disabled
          </span>
        </div>
      </section>

      {/* ==================================================
          ALERTS
      ================================================== */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-[#E4C1BC] bg-[#FBF0EE] p-4 text-sm text-[#9E4A40]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-[#BCD0C1] bg-[#EEF5EF] p-4 text-sm text-[#3F6B52]">
          <CheckCircle size={18} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* ==================================================
          OVERVIEW
      ================================================== */}
      <section className="mb-7">

        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#AD8332]">
              Directory overview
            </p>

            <h2
              className="mt-1 text-2xl text-[#201C15]"
              style={FRASER}
            >
              Account snapshot
            </h2>
          </div>

          <span className="hidden text-xs text-[#8A806D] sm:block">
            Live from your platform
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

          <StatCard
            label="Total"
            value={total}
            icon={Users}
            accent="border-[#D8CFB9] bg-[#F2ECDF] text-[#8C6924]"
          />

          <StatCard
            label="Active"
            value={active}
            icon={CheckCircle}
            accent="border-[#BCD0C1] bg-[#EEF5EF] text-[#3F6B52]"
          />

          <StatCard
            label="Disabled"
            value={disabled}
            icon={XCircle}
            accent="border-[#E4C1BC] bg-[#FBF0EE] text-[#B3564B]"
          />

          <StatCard
            label="Buyers"
            value={buyers}
            icon={UserRoundCheck}
            accent="border-[#C7D5DF] bg-[#EEF3F6] text-[#456B80]"
          />

          <StatCard
            label="Sellers"
            value={sellers}
            icon={ShieldCheck}
            accent="border-[#E2CF9F] bg-[#FAF3E4] text-[#9A7128]"
          />
        </div>
      </section>

      {/* ==================================================
          SEARCH + FILTER
      ================================================== */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1]">

        <div className="border-b border-[#E4DCC9] px-5 py-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D8CFB9] bg-[#F2ECDF] text-[#8C6924]">
                <Filter size={16} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#302A22]">
                  Search & filter
                </p>

                <p className="text-xs text-[#918777]">
                  Find accounts by identity, role or status.
                </p>
              </div>
            </div>

            {isFilterActive && (
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-[#8C6924] transition hover:text-[#6D511B]"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        <div className="p-5">

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_190px_190px]">

            {/* Search */}
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A907D]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, mobile or ID..."
                className="w-full rounded-xl border border-[#D8CFB9] bg-white py-3 pl-10 pr-4 text-sm text-[#302A22] outline-none transition placeholder:text-[#A39A8A] focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10"
              />
            </div>

            {/* Role */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full rounded-xl border border-[#D8CFB9] bg-white px-3.5 py-3 text-sm text-[#403A31] outline-none transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10"
            >
              <option value="ALL">All Roles</option>

              {[
                "BUYER",
                "SELLER",
                "ADMIN",
                "SUPER_ADMIN",
              ].map((r) => (
                <option key={r} value={r}>
                  {r.replace("_", " ")}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-[#D8CFB9] bg-white px-3.5 py-3 text-sm text-[#403A31] outline-none transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DISABLED">Disabled</option>
            </select>
          </div>

          {!loading && (
            <div className="mt-4 flex items-center justify-between border-t border-[#E8E0D0] pt-3">
              <p className="text-xs text-[#8A806D]">
                Showing{" "}
                <span className="font-bold text-[#403A31]">
                  {filtered.length}
                </span>{" "}
                user{filtered.length !== 1 ? "s" : ""}
              </p>

              {isFilterActive && (
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#AD8332]">
                  Filters active
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          LOADING
      ================================================== */}
      {loading ? (
        <div className="flex min-h-72 items-center justify-center rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1]">
          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D8CFB9] bg-[#F2ECDF]">
              <RefreshCw
                size={20}
                className="animate-spin text-[#8C6924]"
              />
            </div>

            <p className="mt-4 text-sm font-semibold text-[#403A31]">
              Loading user directory...
            </p>

            <p className="mt-1 text-xs text-[#978D7B]">
              Fetching the latest accounts.
            </p>
          </div>
        </div>
      ) : filtered.length === 0 ? (

        /* ==================================================
           EMPTY
        ================================================== */
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#CFC4AE] bg-[#FBF8F1] p-8 text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D8CFB9] bg-[#F2ECDF] text-[#9A907D]">
            <Users size={25} />
          </div>

          <h3
            className="mt-4 text-2xl text-[#302A22]"
            style={FRASER}
          >
            No users found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-[#8A806D]">
            No accounts match the current search or filter
            combination.
          </p>

          {isFilterActive && (
            <button
              onClick={clearFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#D8CFB9] bg-white px-4 py-2.5 text-sm font-semibold text-[#403A31] transition hover:border-[#AD8332] hover:bg-[#F8F5ED]"
            >
              Clear filters
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ==================================================
              DESKTOP TABLE
          ================================================== */}
          <div className="hidden overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1] lg:block">

            <div className="flex items-center justify-between border-b border-[#E4DCC9] px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AD8332]">
                  User directory
                </p>

                <h2
                  className="mt-1 text-xl text-[#302A22]"
                  style={FRASER}
                >
                  Platform accounts
                </h2>
              </div>

              <span className="rounded-full border border-[#D8CFB9] bg-[#F2ECDF] px-3 py-1.5 text-xs font-semibold text-[#6B6252]">
                {filtered.length} records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">

                <thead className="border-b border-[#E4DCC9] bg-[#F5F0E6]">
                  <tr>
                    {[
                      "User",
                      "Contact",
                      "Role",
                      "Status",
                      "Created",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-[#8A806D]"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E8E0D0]">

                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="group transition hover:bg-[#F8F5ED]"
                    >

                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D8CFB9] bg-[#F2ECDF] text-[#8C6924]">
                            <User size={17} />
                          </div>

                          <div>
                            <p className="font-semibold text-[#302A22]">
                              {user.name || "Unnamed"}
                            </p>

                            <p className="mt-0.5 text-[11px] text-[#9A907D]">
                              Account #{user.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <p className="max-w-[220px] truncate text-sm font-medium text-[#403A31]">
                          {user.email || "—"}
                        </p>

                        <p className="mt-1 text-xs text-[#9A907D]">
                          {user.mobile || "No mobile"}
                        </p>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <RoleBadge role={user.role} />
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge enabled={user.enabled} />
                      </td>

                      {/* Created */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-[#6B6252]">
                          {formatDate(user.createdAt)}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">

                        {user.role === "SUPER_ADMIN" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-violet-700">
                            <ShieldCheck size={13} />
                            Protected
                          </span>
                        ) : user.enabled ? (
                          <button
                            onClick={() =>
                              toggleUser(user.id, false)
                            }
                            disabled={actionId === user.id}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#E4C1BC] bg-[#FBF0EE] px-3 py-2 text-xs font-bold text-[#B3564B] transition hover:bg-[#F8E5E2] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <UserRoundX size={14} />

                            {actionId === user.id
                              ? "Updating..."
                              : "Disable"}
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              toggleUser(user.id, true)
                            }
                            disabled={actionId === user.id}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#BCD0C1] bg-[#EEF5EF] px-3 py-2 text-xs font-bold text-[#3F6B52] transition hover:bg-[#E3EFE5] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <UserRoundCheck size={14} />

                            {actionId === user.id
                              ? "Updating..."
                              : "Enable"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>

          {/* ==================================================
              MOBILE / TABLET CARDS
          ================================================== */}
          <div className="grid gap-4 lg:hidden">

            {filtered.map((user) => (
              <article
                key={user.id}
                className="overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1]"
              >

                {/* Card Header */}
                <div className="border-b border-[#E4DCC9] bg-[#F5F0E6] p-4">

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D8CFB9] bg-[#F2ECDF] text-[#8C6924]">
                        <User size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-bold text-[#302A22]">
                          {user.name || "Unnamed"}
                        </p>

                        <p className="mt-0.5 text-[11px] text-[#9A907D]">
                          Account #{user.id}
                        </p>
                      </div>
                    </div>

                    <StatusBadge enabled={user.enabled} />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">

                  <div className="grid grid-cols-2 gap-4">

                    <InfoItem label="Email">
                      <p className="break-all">
                        {user.email || "—"}
                      </p>
                    </InfoItem>

                    <InfoItem label="Mobile">
                      {user.mobile || "—"}
                    </InfoItem>

                    <InfoItem label="Role">
                      <RoleBadge role={user.role} />
                    </InfoItem>

                    <InfoItem label="Created">
                      {formatDate(user.createdAt)}
                    </InfoItem>
                  </div>

                  <div className="mt-5 border-t border-[#E8E0D0] pt-4">

                    {user.role === "SUPER_ADMIN" ? (
                      <div className="flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 py-2.5 text-sm font-bold text-violet-700">
                        <ShieldCheck size={16} />
                        Protected account
                      </div>
                    ) : user.enabled ? (
                      <button
                        onClick={() =>
                          toggleUser(user.id, false)
                        }
                        disabled={actionId === user.id}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E4C1BC] bg-[#FBF0EE] py-2.5 text-sm font-bold text-[#B3564B] transition hover:bg-[#F8E5E2] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <UserRoundX size={16} />

                        {actionId === user.id
                          ? "Updating..."
                          : "Disable user"}
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          toggleUser(user.id, true)
                        }
                        disabled={actionId === user.id}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#BCD0C1] bg-[#EEF5EF] py-2.5 text-sm font-bold text-[#3F6B52] transition hover:bg-[#E3EFE5] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <UserRoundCheck size={16} />

                        {actionId === user.id
                          ? "Updating..."
                          : "Enable user"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {/* ==================================================
          SUMMARY
      ================================================== */}
      {!loading && users.length > 0 && (
        <section className="mt-6 overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#201C15] text-[#F8F5ED]">

          <div className="relative p-5 sm:p-6">

            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D8B876]">
                  Directory summary
                </p>

                <p
                  className="mt-1 text-xl"
                  style={FRASER}
                >
                  {active} active · {disabled} disabled · {total} total
                </p>
              </div>

              <div className="flex flex-wrap gap-2">

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#D7D0C4]">
                  Buyers {buyers}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#D7D0C4]">
                  Sellers {sellers}
                </span>

                <span className="rounded-full border border-[#D8B876]/20 bg-[#D8B876]/10 px-3 py-1.5 text-xs font-medium text-[#E3CC9B]">
                  Admins {admins}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

