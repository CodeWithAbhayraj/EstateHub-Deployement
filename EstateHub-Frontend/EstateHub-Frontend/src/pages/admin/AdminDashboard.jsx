
import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  UserRoundCheck,
  UserRoundCog,
  MessageSquare,
  CalendarDays,
  Handshake,
  IndianRupee,
  Clock3,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

import { getDashboardStats } from "../../api/dashboardApi";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  iconClass = "bg-slate-100 text-slate-700",
  valueClass = "text-slate-900",
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
            {title}
          </p>

          <h3
            className={`mt-2 break-words text-2xl font-semibold tracking-tight sm:text-3xl ${valueClass}`}
          >
            {value ?? 0}
          </h3>

          {description && (
            <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 text-slate-400 sm:text-xs">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition duration-300 group-hover:scale-105 ${iconClass}`}
          >
            <Icon size={19} />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
    </div>
  );
}

// ==========================================
// SUMMARY ITEM
// ==========================================

function SummaryItem({
  label,
  value,
  icon: Icon,
  iconClass = "bg-slate-100 text-slate-600",
  valueClass = "text-slate-900",
}) {
  return (
    <div className="group rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-200 hover:bg-white hover:shadow-sm">
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
          >
            <Icon size={16} />
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-400">
            {label}
          </p>

          <p
            className={`mt-1 truncate text-lg font-bold ${valueClass}`}
          >
            {value ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SECTION HEADER
// ==========================================

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600 sm:text-xs">
        {eyebrow}
      </p>

      <h2
        className="mt-1 text-2xl font-medium tracking-tight text-slate-900"
        style={FRASER}
      >
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  const fetchDashboard = async (showFullLoader = true) => {
    try {
      if (showFullLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const data = await getDashboardStats();

      setStats(data);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ==========================================
  // CURRENCY FORMAT
  // ==========================================

  const formatCurrency = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "₹0";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return "₹0";
    }

    return `₹${number.toLocaleString("en-IN")}`;
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <RefreshCw
              size={24}
              className="animate-spin text-blue-600"
            />
          </div>

          <p className="mt-5 text-sm font-semibold text-slate-700">
            Loading admin dashboard...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Fetching latest business data.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (error && !stats) {
    return (
      <div className="min-h-[70vh] bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertCircle size={21} />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-900">
                  Dashboard Error
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fetchDashboard()}
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 active:scale-[0.98]"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <section className="relative mb-8 overflow-hidden rounded-3xl bg-slate-950 shadow-xl">
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
          </div>

          <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

              {/* Title */}
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-950/40">
                  <UserRoundCog size={22} />
                </div>

                <div className="min-w-0">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                    <ShieldCheck
                      size={12}
                      className="text-blue-400"
                    />
                    EstateHub Administration
                  </div>

                  <h1
                    className="text-3xl font-medium tracking-tight text-white sm:text-4xl"
                    style={FRASER}
                  >
                    Admin Dashboard
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
                    Monitor properties, users, leads, visits and
                    business performance from one place.
                  </p>
                </div>
              </div>

              {/* Refresh */}
              <button
                type="button"
                onClick={() => fetchDashboard(false)}
                disabled={refreshing}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-blue-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing ? "animate-spin" : ""
                  }
                />

                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </section>

        {/* ==========================================
            ERROR BANNER
        ========================================== */}

        {error && stats && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-600">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>
          </div>
        )}

        {/* ==========================================
            PROPERTY OVERVIEW
        ========================================== */}

        <section>
          <SectionHeader
            eyebrow="Properties"
            title="Property Overview"
            description="Track the current state of EstateHub property listings."
          />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <StatCard
              title="Total Properties"
              value={stats?.totalProperties}
              icon={Building2}
              description="All properties in the system"
              iconClass="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="Pending Approval"
              value={stats?.pendingProperties}
              icon={Clock3}
              description="Waiting for verification"
              valueClass="text-amber-600"
              iconClass="bg-amber-50 text-amber-600"
            />

            <StatCard
              title="Published"
              value={stats?.publishedProperties}
              icon={CheckCircle}
              description="Currently live properties"
              valueClass="text-emerald-600"
              iconClass="bg-emerald-50 text-emerald-600"
            />
          </div>
        </section>

        {/* ==========================================
            USER OVERVIEW
        ========================================== */}

        <section className="mt-10">
          <SectionHeader
            eyebrow="Users"
            title="User Overview"
            description="Understand the current EstateHub user base."
          />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <StatCard
              title="Total Buyers"
              value={stats?.totalBuyers}
              icon={Users}
              description="Registered buyers"
              valueClass="text-blue-600"
              iconClass="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="Total Sellers"
              value={stats?.totalSellers}
              icon={UserRoundCheck}
              description="Registered sellers"
              valueClass="text-orange-600"
              iconClass="bg-orange-50 text-orange-600"
            />

            <StatCard
              title="Total Users"
              value={
                Number(stats?.totalBuyers || 0) +
                Number(stats?.totalSellers || 0)
              }
              icon={Users}
              description="Buyers + sellers"
              iconClass="bg-violet-50 text-violet-600"
            />
          </div>
        </section>

        {/* ==========================================
            LEADS & VISITS
        ========================================== */}

        <section className="mt-10">
          <SectionHeader
            eyebrow="Engagement"
            title="Leads & Visits"
            description="Monitor buyer enquiries and scheduled property visits."
          />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              title="Total Leads"
              value={stats?.totalLeads}
              icon={MessageSquare}
              description="All buyer enquiries"
              valueClass="text-blue-600"
              iconClass="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="New Leads"
              value={stats?.newLeads}
              icon={MessageSquare}
              description="Needs attention"
              valueClass="text-amber-600"
              iconClass="bg-amber-50 text-amber-600"
            />

            <StatCard
              title="Total Visits"
              value={stats?.totalVisits}
              icon={CalendarDays}
              description="All property visits"
              valueClass="text-violet-600"
              iconClass="bg-violet-50 text-violet-600"
            />

            <StatCard
              title="Upcoming Visits"
              value={stats?.upcomingVisits}
              icon={CalendarDays}
              description="Upcoming scheduled visits"
              valueClass="text-emerald-600"
              iconClass="bg-emerald-50 text-emerald-600"
            />
          </div>
        </section>

        {/* ==========================================
            BUSINESS OVERVIEW
        ========================================== */}

        <section className="mt-10">
          <SectionHeader
            eyebrow="Business"
            title="Business Overview"
            description="Track deals and commission activity across the platform."
          />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              title="Total Deals"
              value={stats?.totalDeals}
              icon={Handshake}
              description="All recorded deals"
              valueClass="text-violet-600"
              iconClass="bg-violet-50 text-violet-600"
            />

            <StatCard
              title="Total Commission"
              value={formatCurrency(stats?.totalCommission)}
              icon={IndianRupee}
              description="Generated commission"
              valueClass="text-emerald-600"
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              title="Pending Commission"
              value={formatCurrency(stats?.pendingCommission)}
              icon={Clock3}
              description="Awaiting payment"
              valueClass="text-amber-600"
              iconClass="bg-amber-50 text-amber-600"
            />

            <StatCard
              title="Paid Commission"
              value={formatCurrency(stats?.paidCommission)}
              icon={CheckCircle}
              description="Commission received"
              valueClass="text-emerald-600"
              iconClass="bg-emerald-50 text-emerald-600"
            />
          </div>
        </section>

        {/* ==========================================
            ADMIN SUMMARY
        ========================================== */}

        <section className="mt-10">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="relative overflow-hidden p-6 sm:p-7">
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-50 blur-3xl" />

              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                    <TrendingUp size={19} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600">
                      Snapshot
                    </p>

                    <h2
                      className="mt-0.5 text-xl font-medium text-slate-900"
                      style={FRASER}
                    >
                      Admin Summary
                    </h2>
                  </div>
                </div>

                <div className="hidden items-center gap-1 text-xs text-slate-400 sm:flex">
                  <ShieldCheck size={14} />
                  Live dashboard data
                </div>
              </div>

              <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <SummaryItem
                  label="Properties waiting"
                  value={stats?.pendingProperties}
                  icon={Clock3}
                  iconClass="bg-amber-50 text-amber-600"
                  valueClass="text-amber-600"
                />

                <SummaryItem
                  label="New enquiries"
                  value={stats?.newLeads}
                  icon={MessageSquare}
                  iconClass="bg-blue-50 text-blue-600"
                  valueClass="text-blue-600"
                />

                <SummaryItem
                  label="Upcoming visits"
                  value={stats?.upcomingVisits}
                  icon={CalendarDays}
                  iconClass="bg-emerald-50 text-emerald-600"
                  valueClass="text-emerald-600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            FOOTER NOTE
        ========================================== */}

        <div className="mt-7 flex flex-col items-center justify-center gap-2 pb-3 text-center sm:flex-row">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck size={13} className="text-emerald-600" />
            EstateHub administration
          </div>

          <span className="hidden text-slate-300 sm:block">
            •
          </span>

          <p className="text-xs text-slate-400">
            Dashboard data is loaded from the latest available system records.
          </p>

          <ArrowUpRight
            size={13}
            className="hidden text-slate-300 sm:block"
          />
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;

