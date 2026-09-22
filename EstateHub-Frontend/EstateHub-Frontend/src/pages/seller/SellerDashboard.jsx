
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Eye,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { getMyProperties } from "../../api/propertyApi";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

export default function SellerDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const savedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch {}

  const userName =
    user?.name || localStorage.getItem("name") || "Seller";

  const loadProperties = async (showFullLoader = true) => {
    try {
      if (showFullLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const data = await getMyProperties();

      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load properties."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleRefresh = async () => {
    loadProperties(false);
  };

  const totalProperties = properties.length;

  const draftProperties = properties.filter(
    (p) => p.status === "DRAFT"
  ).length;

  const pendingProperties = properties.filter(
    (p) => p.status === "PENDING_APPROVAL"
  ).length;

  const publishedProperties = properties.filter(
    (p) => p.status === "PUBLISHED"
  ).length;

  const rejectedProperties = properties.filter(
    (p) => p.status === "REJECTED"
  ).length;

  const getStatusClass = (status) => {
    switch (status) {
      case "DRAFT":
        return "bg-slate-100 text-slate-600 ring-slate-200";

      case "PENDING_APPROVAL":
        return "bg-amber-50 text-amber-700 ring-amber-200";

      case "PUBLISHED":
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";

      case "REJECTED":
        return "bg-rose-50 text-rose-700 ring-rose-200";

      default:
        return "bg-slate-100 text-slate-600 ring-slate-200";
    }
  };

  const formatStatus = (status) =>
    status?.replaceAll("_", " ") || "UNKNOWN";

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HERO HEADER
      ====================================================== */}
      <section className="relative overflow-hidden bg-slate-950">

        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/65">
                <Sparkles size={13} className="text-blue-400" />
                Seller Dashboard
              </div>

              <h1
                className="text-3xl font-medium tracking-tight text-white sm:text-4xl"
                style={FRASER}
              >
                Welcome,{" "}
                <span className="text-blue-400">
                  {userName}
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/50 sm:text-base">
                Manage your property listings and track their
                approval status from one place.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={handleRefresh}
                disabled={loading || refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing ? "animate-spin" : ""
                  }
                />

                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              <Link
                to="/seller/properties/add"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                <Plus size={17} />

                Add Property

                <ArrowRight
                  size={15}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Error */}
        {error && (
          <div className="mb-7 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <XCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Unable to load properties
              </p>

              <p className="mt-1 text-rose-600">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            STATS
        ====================================================== */}
        <section>

          <div className="mb-4 flex items-end justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                Listing activity
              </p>

              <h2
                className="mt-1 text-2xl font-medium text-slate-900"
                style={FRASER}
              >
                Overview
              </h2>
            </div>

            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
              <TrendingUp size={14} />
              Property portfolio
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">

            <StatCard
              label="Total"
              value={loading ? "..." : totalProperties}
              icon={Building2}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
            />

            <StatCard
              label="Draft"
              value={loading ? "..." : draftProperties}
              icon={Clock}
              iconBg="bg-slate-100"
              iconColor="text-slate-600"
            />

            <StatCard
              label="Pending"
              value={loading ? "..." : pendingProperties}
              icon={Clock}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
              valueColor="text-amber-600"
            />

            <StatCard
              label="Published"
              value={loading ? "..." : publishedProperties}
              icon={CheckCircle}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
              valueColor="text-emerald-600"
            />

            <StatCard
              label="Rejected"
              value={loading ? "..." : rejectedProperties}
              icon={XCircle}
              iconBg="bg-rose-50"
              iconColor="text-rose-600"
              valueColor="text-rose-600"
            />

          </div>
        </section>

        {/* =====================================================
            MY PROPERTIES
        ====================================================== */}
        <section className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Section header */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                Your listings
              </p>

              <h2
                className="mt-1 text-2xl font-medium text-slate-900"
                style={FRASER}
              >
                My Properties
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest property listings and approval status.
              </p>

            </div>

            <Link
              to="/seller/properties"
              className="group inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              View all

              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </Link>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-64 items-center justify-center p-6">

              <div className="text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                  <RefreshCw
                    size={21}
                    className="animate-spin text-blue-600"
                  />
                </div>

                <p className="mt-4 text-sm font-medium text-slate-700">
                  Loading your properties...
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Please wait a moment
                </p>

              </div>
            </div>
          ) : properties.length === 0 ? (

            /* Empty state */
            <div className="p-10 text-center sm:p-14">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Building2 size={28} />
              </div>

              <h3
                className="mt-5 text-xl font-medium text-slate-900"
                style={FRASER}
              >
                No properties yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Start your seller journey by adding your first
                property listing to EstateHub.
              </p>

              <Link
                to="/seller/properties/add"
                className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-blue-600"
              >
                <Plus size={17} />

                Add Property

                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

            </div>
          ) : (

            /* Property list */
            <div className="divide-y divide-slate-100">

              {properties.slice(0, 5).map((property) => (

                <div
                  key={property.id}
                  className="group flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
                >

                  {/* Property info */}
                  <div className="flex min-w-0 items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                      <Building2 size={20} />
                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                        {property.title || "Untitled"}
                      </h3>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {property.areaName || "—"},{" "}
                        {property.city || "—"}
                      </p>

                      <p className="mt-1 text-sm font-bold text-blue-600">
                        ₹
                        {Number(
                          property.price || 0
                        ).toLocaleString("en-IN")}
                      </p>

                    </div>
                  </div>

                  {/* Status + view */}
                  <div className="flex items-center justify-between gap-3 sm:justify-end">

                    <span
                      className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${getStatusClass(
                        property.status
                      )}`}
                    >
                      {formatStatus(property.status)}
                    </span>

                    <Link
                      to={`/properties/${property.id}`}
                      className="group/view inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={14} />

                      View

                      <ChevronRight
                        size={13}
                        className="transition group-hover/view:translate-x-0.5"
                      />
                    </Link>

                  </div>

                </div>
              ))}

            </div>
          )}
        </section>

        {/* =====================================================
            LISTING PROCESS
        ====================================================== */}
        <section className="mt-10">

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Simple process
            </p>

            <h2
              className="mt-1 text-2xl font-medium text-slate-900"
              style={FRASER}
            >
              How property listing works
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Follow these steps to get your property published.
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {[
              {
                num: "01",
                title: "Add Property",
                desc: "Enter your property information.",
                icon: Plus,
              },
              {
                num: "02",
                title: "Submit",
                desc: "Complete the details and submit.",
                icon: ArrowRight,
              },
              {
                num: "03",
                title: "Admin Review",
                desc: "EstateHub verifies your listing.",
                icon: ShieldCheck,
              },
              {
                num: "04",
                title: "Go Live",
                desc: "Approved properties become visible.",
                icon: CheckCircle,
              },
            ].map((step) => {

              const Icon = step.icon;

              return (
                <div
                  key={step.num}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
                      {step.num}
                    </div>

                    <Icon
                      size={18}
                      className="text-slate-300 transition group-hover:text-blue-600"
                    />

                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {step.desc}
                  </p>

                </div>
              );
            })}

          </div>
        </section>

        {/* =====================================================
            BOTTOM TRUST STRIP
        ====================================================== */}
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">
            <ShieldCheck
              size={16}
              className="text-emerald-600"
            />

            Your property listings are securely managed by EstateHub.
          </div>

          <Link
            to="/seller/properties/add"
            className="inline-flex items-center gap-1 font-semibold text-slate-700 transition hover:text-blue-600"
          >
            Add another property

            <ArrowRight size={13} />
          </Link>

        </div>

      </main>
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

const StatCard = ({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  valueColor = "text-slate-950",
}) => (
  <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg sm:p-5">

    <div className="flex items-start justify-between">

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p
          className={`mt-1 text-2xl font-semibold ${valueColor}`}
        >
          {value}
        </p>
      </div>

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
      >
        <Icon size={18} />
      </div>

    </div>

  </div>
);

