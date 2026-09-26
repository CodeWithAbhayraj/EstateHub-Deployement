
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
  iconClass = "bg-[#F2ECDF] text-[#6B6252]",
  valueClass = "text-[#201C15]",
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#DED6C5] bg-[#FBF8F1] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#CDBF9F] hover:shadow-[0_18px_45px_rgba(32,28,21,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-[#928975] sm:text-xs">
            {title}
          </p>

          <h3
            className={`mt-2 break-words text-2xl font-semibold tracking-tight sm:text-3xl ${valueClass}`}
          >
            {value ?? 0}
          </h3>

          {description && (
            <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 text-[#938B7A] sm:text-xs">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition duration-300 group-hover:scale-105 ${iconClass}`}
          >
            <Icon size={19} strokeWidth={1.8} />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#AD8332] transition-all duration-300 group-hover:w-full" />
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
  iconClass = "bg-[#F2ECDF] text-[#6B6252]",
  valueClass = "text-[#201C15]",
}) {
  return (
    <div className="group rounded-xl border border-[#E4DCC9] bg-[#F8F5ED] p-4 transition duration-300 hover:border-[#CDBF9F] hover:bg-[#FBF8F1] hover:shadow-sm">
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
          >
            <Icon size={16} strokeWidth={1.8} />
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-[#938B7A]">
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
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#AD8332] sm:text-xs">
        {eyebrow}
      </p>

      <h2
        className="mt-1 text-2xl font-medium tracking-tight text-[#201C15]"
        style={FRASER}
      >
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm text-[#766E5E]">
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
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F8F5ED] px-4">
        <div className="text-center">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#DED6C5] bg-[#FBF8F1] shadow-sm">
            <div className="absolute inset-2 rounded-xl border border-[#E4DCC9]" />

            <RefreshCw
              size={23}
              strokeWidth={1.8}
              className="animate-spin text-[#AD8332]"
            />
          </div>

          <p
            className="mt-5 text-xl font-medium text-[#201C15]"
            style={FRASER}
          >
            Loading dashboard
          </p>

          <p className="mt-1 text-xs text-[#938B7A]">
            Fetching the latest EstateHub records.
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
      <div className="min-h-[70vh] bg-[#F8F5ED] px-4 py-10">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-[#E3C9C3] bg-[#FBF8F1] p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F6E9E5] text-[#B3564B]">
                <AlertCircle size={21} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B3564B]">
                  System notice
                </p>

                <h2
                  className="mt-1 text-xl font-medium text-[#201C15]"
                  style={FRASER}
                >
                  Dashboard unavailable
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#766E5E]">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fetchDashboard()}
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#201C15] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#AD8332] active:scale-[0.98]"
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
    <div className="min-h-screen w-full bg-[#F8F5ED]">
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <section className="relative mb-8 overflow-hidden rounded-[28px] bg-[#201C15] shadow-[0_22px_60px_rgba(32,28,21,0.16)]">
          {/* Blueprint grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.055]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
          </div>

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border border-[#D8B876]/10" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#D8B876]/10" />

          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#AD8332]/10 blur-3xl" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

              {/* Title */}
              <div className="flex min-w-0 items-start gap-4">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#AD8332] text-white shadow-lg shadow-black/20">
                  <UserRoundCog size={22} strokeWidth={1.8} />

                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#201C15] bg-[#D8B876]" />
                </div>

                <div className="min-w-0">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                    <ShieldCheck
                      size={12}
                      className="text-[#D8B876]"
                    />
                    EstateHub Administration
                  </div>

                  <h1
                    className="text-3xl font-medium tracking-tight text-[#FBF8F1] sm:text-4xl lg:text-[42px]"
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
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#FBF8F1] px-5 py-3 text-sm font-semibold text-[#201C15] shadow-lg transition hover:bg-[#F2ECDF] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />

                {refreshing ? "Refreshing..." : "Refresh data"}
              </button>
            </div>

            {/* Header bottom metadata */}
            <div className="relative mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D8B876]" />
                Live overview
              </span>

              <span>EstateHub platform</span>

              <span className="hidden sm:inline">
                Administrative control
              </span>
            </div>
          </div>
        </section>

        {/* ==========================================
            ERROR BANNER
        ========================================== */}

        {error && stats && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#E3C9C3] bg-[#F6E9E5] p-4 text-sm font-medium text-[#B3564B]">
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
            eyebrow="01 / Properties"
            title="Property Overview"
            description="Track the current state of EstateHub property listings."
          />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <StatCard
              title="Total Properties"
              value={stats?.totalProperties}
              icon={Building2}
              description="All properties in the system"
              iconClass="bg-[#F0E8D7] text-[#8C6924]"
            />

            <StatCard
              title="Pending Approval"
              value={stats?.pendingProperties}
              icon={Clock3}
              description="Waiting for verification"
              valueClass="text-[#A87519]"
              iconClass="bg-[#F8EED7] text-[#A87519]"
            />

            <StatCard
              title="Published"
              value={stats?.publishedProperties}
              icon={CheckCircle}
              description="Currently live properties"
              valueClass="text-[#3F6B52]"
              iconClass="bg-[#E8F0EA] text-[#3F6B52]"
            />
          </div>
        </section>

        {/* ==========================================
            USER OVERVIEW
        ========================================== */}

        <section className="mt-10">
          <SectionHeader
            eyebrow="02 / Users"
            title="User Overview"
            description="Understand the current EstateHub user base."
          />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <StatCard
              title="Total Buyers"
              value={stats?.totalBuyers}
              icon={Users}
              description="Registered buyers"
              valueClass="text-[#526B8C]"
              iconClass="bg-[#E9EEF5] text-[#526B8C]"
            />

            <StatCard
              title="Total Sellers"
              value={stats?.totalSellers}
              icon={UserRoundCheck}
              description="Registered sellers"
              valueClass="text-[#9A6539]"
              iconClass="bg-[#F3E9DE] text-[#9A6539]"
            />

            <StatCard
              title="Total Users"
              value={
                Number(stats?.totalBuyers || 0) +
                Number(stats?.totalSellers || 0)
              }
              icon={Users}
              description="Buyers + sellers"
              iconClass="bg-[#EEE8F3] text-[#725B82]"
            />
          </div>
        </section>

        {/* ==========================================
            LEADS & VISITS
        ========================================== */}

        <section className="mt-10">
          <SectionHeader
            eyebrow="03 / Engagement"
            title="Leads & Visits"
            description="Monitor buyer enquiries and scheduled property visits."
          />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              title="Total Leads"
              value={stats?.totalLeads}
              icon={MessageSquare}
              description="All buyer enquiries"
              valueClass="text-[#526B8C]"
              iconClass="bg-[#E9EEF5] text-[#526B8C]"
            />

            <StatCard
              title="New Leads"
              value={stats?.newLeads}
              icon={MessageSquare}
              description="Needs attention"
              valueClass="text-[#A87519]"
              iconClass="bg-[#F8EED7] text-[#A87519]"
            />

            <StatCard
              title="Total Visits"
              value={stats?.totalVisits}
              icon={CalendarDays}
              description="All property visits"
              valueClass="text-[#725B82]"
              iconClass="bg-[#EEE8F3] text-[#725B82]"
            />

            <StatCard
              title="Upcoming Visits"
              value={stats?.upcomingVisits}
              icon={CalendarDays}
              description="Upcoming scheduled visits"
              valueClass="text-[#3F6B52]"
              iconClass="bg-[#E8F0EA] text-[#3F6B52]"
            />
          </div>
        </section>

        {/* ==========================================
            BUSINESS OVERVIEW
        ========================================== */}

        <section className="mt-10">
          <SectionHeader
            eyebrow="04 / Business"
            title="Business Overview"
            description="Track deals and commission activity across the platform."
          />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              title="Total Deals"
              value={stats?.totalDeals}
              icon={Handshake}
              description="All recorded deals"
              valueClass="text-[#725B82]"
              iconClass="bg-[#EEE8F3] text-[#725B82]"
            />

            <StatCard
              title="Total Commission"
              value={formatCurrency(stats?.totalCommission)}
              icon={IndianRupee}
              description="Generated commission"
              valueClass="text-[#3F6B52]"
              iconClass="bg-[#E8F0EA] text-[#3F6B52]"
            />

            <StatCard
              title="Pending Commission"
              value={formatCurrency(stats?.pendingCommission)}
              icon={Clock3}
              description="Awaiting payment"
              valueClass="text-[#A87519]"
              iconClass="bg-[#F8EED7] text-[#A87519]"
            />

            <StatCard
              title="Paid Commission"
              value={formatCurrency(stats?.paidCommission)}
              icon={CheckCircle}
              description="Commission received"
              valueClass="text-[#3F6B52]"
              iconClass="bg-[#E8F0EA] text-[#3F6B52]"
            />
          </div>
        </section>

        {/* ==========================================
            ADMIN SUMMARY
        ========================================== */}

        <section className="mt-10">
          <div className="overflow-hidden rounded-[28px] border border-[#DED6C5] bg-[#FBF8F1] shadow-sm">

            <div className="relative overflow-hidden p-6 sm:p-7">
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full border border-[#D8B876]/30" />

              <div className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rounded-full border border-[#D8B876]/20" />

              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#201C15] text-[#D8B876]">
                    <TrendingUp size={19} strokeWidth={1.8} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AD8332]">
                      Snapshot
                    </p>

                    <h2
                      className="mt-0.5 text-xl font-medium text-[#201C15]"
                      style={FRASER}
                    >
                      Admin Summary
                    </h2>
                  </div>
                </div>

                <div className="hidden items-center gap-1 text-xs text-[#938B7A] sm:flex">
                  <ShieldCheck size={14} />
                  Live dashboard data
                </div>
              </div>

              <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <SummaryItem
                  label="Properties waiting"
                  value={stats?.pendingProperties}
                  icon={Clock3}
                  iconClass="bg-[#F8EED7] text-[#A87519]"
                  valueClass="text-[#A87519]"
                />

                <SummaryItem
                  label="New enquiries"
                  value={stats?.newLeads}
                  icon={MessageSquare}
                  iconClass="bg-[#E9EEF5] text-[#526B8C]"
                  valueClass="text-[#526B8C]"
                />

                <SummaryItem
                  label="Upcoming visits"
                  value={stats?.upcomingVisits}
                  icon={CalendarDays}
                  iconClass="bg-[#E8F0EA] text-[#3F6B52]"
                  valueClass="text-[#3F6B52]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            FOOTER NOTE
        ========================================== */}

        <div className="mt-7 flex flex-col items-center justify-center gap-2 pb-3 text-center sm:flex-row">
          <div className="flex items-center gap-1.5 text-xs text-[#938B7A]">
            <ShieldCheck size={13} className="text-[#3F6B52]" />
            EstateHub administration
          </div>

          <span className="hidden text-[#D2C9B6] sm:block">
            •
          </span>

          <p className="text-xs text-[#938B7A]">
            Dashboard data is loaded from the latest available system records.
          </p>

          <ArrowUpRight
            size={13}
            className="hidden text-[#C9BFAE] sm:block"
          />
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;

