
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
  const map = {
    SUPER_ADMIN: "border-violet-200 bg-violet-50 text-violet-700",
    ADMIN: "border-blue-200 bg-blue-50 text-blue-700",
    SELLER: "border-amber-200 bg-amber-50 text-amber-700",
    BUYER: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${
        map[role] ||
        "border-[#D8CFB9] bg-[#F8F5ED] text-[#6B6252]"
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
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${
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
  <div className="group relative overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#CBB98E]">
    <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-[#F2ECDF]" />

    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#8A806D]">
          {label}
        </p>

        <p
          className="mt-1 text-2xl font-semibold text-[#201C15]"
          style={FRASER}
        >
          {value}
        </p>
      </div>

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl border ${accent}`}
      >
        <Icon size={16} />
      </div>
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
        err.response?.data?.message ||
          "Failed to load users."
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
  // Filter
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
        roleFilter === "ALL" ||
        u.role === roleFilter;

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
        `User ${
          enable ? "enabled" : "disabled"
        } successfully.`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Action failed."
      );
    } finally {
      setActionId(null);
    }
  };

  // --------------------------------------------------
  // Stats
  // --------------------------------------------------
  const total = users.length;

  const active = users.filter(
    (u) => u.enabled
  ).length;

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
  // Helpers
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
    <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-4 sm:py-6">

      {/* ==================================================
          HEADER
      ================================================== */}
      <section className="relative mb-6 overflow-hidden rounded-[22px] border border-[#D8CFB9] bg-[#201C15] px-5 py-6 text-[#F8F5ED] sm:px-7">

        {/* Blueprint grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2 text-[#D8B876]">
              <Users size={14} />

              <span className="text-[9px] font-bold uppercase tracking-[0.2em]">
                Admin • User Directory
              </span>
            </div>

            <h1
              className="text-3xl leading-tight sm:text-4xl"
              style={FRASER}
            >
              Users Management
            </h1>

            <p className="mt-2 max-w-xl text-sm text-[#C9C1B2]">
              Manage buyers, sellers and administrators
              from one central workspace.
            </p>
          </div>

          <button
            onClick={() => fetchUsers(false)}
            disabled={loading || refreshing}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#F8F5ED] px-4 py-2.5 text-sm font-semibold text-[#201C15] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={
                refreshing ? "animate-spin" : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        <div className="relative mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#D7D0C4]">
            {total} accounts
          </span>

          <span className="rounded-full border border-[#789A82]/30 bg-[#789A82]/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#BFD2C4]">
            {active} active
          </span>

          <span className="rounded-full border border-[#B3564B]/30 bg-[#B3564B]/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#E1B5AF]">
            {disabled} disabled
          </span>
        </div>
      </section>

      {/* ==================================================
          ALERTS
      ================================================== */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#E4C1BC] bg-[#FBF0EE] p-3 text-sm text-[#9E4A40]">
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0"
          />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#BCD0C1] bg-[#EEF5EF] p-3 text-sm text-[#3F6B52]">
          <CheckCircle
            size={17}
            className="mt-0.5 shrink-0"
          />
          <span>{success}</span>
        </div>
      )}

      {/* ==================================================
          STATS
      ================================================== */}
      <section className="mb-6">

        <div className="mb-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#AD8332]">
            Overview
          </p>

          <h2
            className="mt-1 text-xl text-[#201C15]"
            style={FRASER}
          >
            Account snapshot
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">

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
            icon={User}
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
          SEARCH & FILTER
      ================================================== */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1]">

        <div className="border-b border-[#E4DCC9] px-4 py-3.5 sm:px-5">

          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D8CFB9] bg-[#F2ECDF] text-[#8C6924]">
                <Filter size={14} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#302A22]">
                  Search & Filter
                </p>

                <p className="hidden text-[11px] text-[#918777] sm:block">
                  Search accounts by identity, role or status.
                </p>
              </div>
            </div>

            {isFilterActive && (
              <button
                onClick={clearFilters}
                className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C6924] hover:text-[#6D511B]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5">

          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-[1fr_160px_160px]">

            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A907D]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search name, email, mobile..."
                className="w-full rounded-xl border border-[#D8CFB9] bg-white py-2.5 pl-9 pr-3 text-sm text-[#403A31] outline-none transition placeholder:text-[#A39A8A] focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
              className="w-full rounded-xl border border-[#D8CFB9] bg-white px-3 py-2.5 text-sm text-[#403A31] outline-none focus:border-[#AD8332]"
            >
              <option value="ALL">
                All Roles
              </option>

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

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full rounded-xl border border-[#D8CFB9] bg-white px-3 py-2.5 text-sm text-[#403A31] outline-none focus:border-[#AD8332]"
            >
              <option value="ALL">
                All Statuses
              </option>
              <option value="ACTIVE">
                Active
              </option>
              <option value="DISABLED">
                Disabled
              </option>
            </select>
          </div>

          {!loading && (
            <p className="mt-3 text-[11px] text-[#8A806D]">
              {filtered.length} user
              {filtered.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
      </section>

      {/* ==================================================
          USER LIST
      ================================================== */}
      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1]">

          <div className="text-center">

            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8CFB9] bg-[#F2ECDF]">
              <RefreshCw
                size={18}
                className="animate-spin text-[#8C6924]"
              />
            </div>

            <p className="mt-3 text-sm font-semibold text-[#403A31]">
              Loading users...
            </p>
          </div>
        </div>
      ) : filtered.length === 0 ? (

        <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-[#CFC4AE] bg-[#FBF8F1] p-6 text-center">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D8CFB9] bg-[#F2ECDF] text-[#9A907D]">
            <Users size={22} />
          </div>

          <h3
            className="mt-3 text-xl text-[#302A22]"
            style={FRASER}
          >
            No users found
          </h3>

          <p className="mt-1 text-xs text-[#8A806D]">
            Try adjusting your search or filters.
          </p>

          {isFilterActive && (
            <button
              onClick={clearFilters}
              className="mt-3 rounded-xl border border-[#D8CFB9] bg-white px-4 py-2 text-xs font-semibold text-[#403A31] hover:border-[#AD8332]"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ==================================================
              DESKTOP TABLE
          ================================================== */}
          <div className="hidden overflow-x-auto rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1] lg:block">

            <div className="flex items-center justify-between border-b border-[#E4DCC9] px-5 py-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#AD8332]">
                  User Directory
                </p>

                <h2
                  className="mt-0.5 text-xl text-[#302A22]"
                  style={FRASER}
                >
                  Platform accounts
                </h2>
              </div>

              <span className="rounded-full border border-[#D8CFB9] bg-[#F2ECDF] px-3 py-1 text-[10px] font-semibold text-[#6B6252]">
                {filtered.length} records
              </span>
            </div>

            <table className="w-full min-w-[760px] text-sm">

              <thead className="border-b border-[#E4DCC9] bg-[#F5F0E6]">
                <tr>
                  <th className="px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-[0.13em] text-[#8A806D]">
                    User
                  </th>

                  <th className="px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-[0.13em] text-[#8A806D]">
                    Contact
                  </th>

                  <th className="px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-[0.13em] text-[#8A806D]">
                    Role
                  </th>

                  <th className="px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-[0.13em] text-[#8A806D]">
                    Status
                  </th>

                  <th className="px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-[0.13em] text-[#8A806D]">
                    Created
                  </th>

                  <th className="px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-[0.13em] text-[#8A806D]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E8E0D0]">

                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-[#F8F5ED]"
                  >

                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#D8CFB9] bg-[#F2ECDF] text-[#8C6924]">
                          <User size={14} />
                        </div>

                        <div>
                          <p className="font-semibold text-[#302A22]">
                            {user.name || "Unnamed"}
                          </p>

                          <p className="text-[10px] text-[#9A907D]">
                            #{user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3">
                      <p className="max-w-[210px] truncate text-sm text-[#403A31]">
                        {user.email || "—"}
                      </p>

                      <p className="text-[10px] text-[#9A907D]">
                        {user.mobile || "No mobile"}
                      </p>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <RoleBadge role={user.role} />
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge enabled={user.enabled} />
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3 text-xs text-[#6B6252]">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">

                      {user.role === "SUPER_ADMIN" ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-violet-700">
                          <ShieldCheck size={11} />
                          Protected
                        </span>
                      ) : user.enabled ? (
                        <button
                          onClick={() =>
                            toggleUser(user.id, false)
                          }
                          disabled={
                            actionId === user.id
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4C1BC] bg-[#FBF0EE] px-2.5 py-1.5 text-[10px] font-bold text-[#B3564B] transition hover:bg-[#F8E5E2] disabled:opacity-50"
                        >
                          <UserRoundX size={12} />

                          {actionId === user.id
                            ? "Updating..."
                            : "Disable"}
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            toggleUser(user.id, true)
                          }
                          disabled={
                            actionId === user.id
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#BCD0C1] bg-[#EEF5EF] px-2.5 py-1.5 text-[10px] font-bold text-[#3F6B52] transition hover:bg-[#E3EFE5] disabled:opacity-50"
                        >
                          <UserRoundCheck size={12} />

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

          {/* ==================================================
              MOBILE CARDS
          ================================================== */}
          <div className="grid gap-3 lg:hidden">

            {filtered.map((user) => (
              <div
                key={user.id}
                className="overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1]"
              >

                <div className="border-b border-[#E4DCC9] bg-[#F5F0E6] p-3.5">

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-2.5">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D8CFB9] bg-[#F2ECDF] text-[#8C6924]">
                        <User size={15} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-bold text-[#302A22]">
                          {user.name || "Unnamed"}
                        </p>

                        <p className="text-[10px] text-[#9A907D]">
                          #{user.id}
                        </p>
                      </div>
                    </div>

                    <StatusBadge enabled={user.enabled} />
                  </div>
                </div>

                <div className="p-3.5">

                  <div className="grid grid-cols-2 gap-3">

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A907D]">
                        Email
                      </p>

                      <p className="mt-0.5 break-all text-xs font-medium text-[#403A31]">
                        {user.email || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A907D]">
                        Mobile
                      </p>

                      <p className="mt-0.5 text-xs font-medium text-[#403A31]">
                        {user.mobile || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A907D]">
                        Role
                      </p>

                      <RoleBadge role={user.role} />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A907D]">
                        Created
                      </p>

                      <p className="mt-0.5 text-xs font-medium text-[#403A31]">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 border-t border-[#E8E0D0] pt-3">

                    {user.role === "SUPER_ADMIN" ? (
                      <div className="flex items-center justify-center gap-2 rounded-lg bg-violet-50 py-2 text-xs font-bold text-violet-700">
                        <ShieldCheck size={14} />
                        Protected
                      </div>
                    ) : user.enabled ? (
                      <button
                        onClick={() =>
                          toggleUser(user.id, false)
                        }
                        disabled={
                          actionId === user.id
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E4C1BC] bg-[#FBF0EE] py-2 text-xs font-bold text-[#B3564B] hover:bg-[#F8E5E2] disabled:opacity-50"
                      >
                        <UserRoundX size={14} />

                        {actionId === user.id
                          ? "Updating..."
                          : "Disable User"}
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          toggleUser(user.id, true)
                        }
                        disabled={
                          actionId === user.id
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#BCD0C1] bg-[#EEF5EF] py-2 text-xs font-bold text-[#3F6B52] hover:bg-[#E3EFE5] disabled:opacity-50"
                      >
                        <UserRoundCheck size={14} />

                        {actionId === user.id
                          ? "Updating..."
                          : "Enable User"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ==================================================
          SUMMARY
      ================================================== */}
      {!loading && users.length > 0 && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#201C15] text-[#F8F5ED]">

          <div className="relative p-4 sm:p-5">

            <div
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
              }}
            />

            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#D8B876]">
                  Summary
                </p>

                <p
                  className="mt-0.5 text-lg"
                  style={FRASER}
                >
                  {active} active · {disabled} disabled ·{" "}
                  {total} total
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">

                <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-[#D7D0C4]">
                  Buyers {buyers}
                </span>

                <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-[#D7D0C4]">
                  Sellers {sellers}
                </span>

                <span className="rounded-lg border border-[#D8B876]/20 bg-[#D8B876]/10 px-2.5 py-1 text-[10px] font-medium text-[#E3CC9B]">
                  Admins {admins}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

