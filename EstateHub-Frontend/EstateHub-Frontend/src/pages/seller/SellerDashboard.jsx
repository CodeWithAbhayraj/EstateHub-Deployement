
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Plus,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Eye,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
  MapPin,
  Home,
  BarChart3,
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
        err?.response?.data?.message ||
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
    await loadProperties(false);
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
        return "bg-[#F1EEE7] text-[#756D60] border-[#DDD5C6]";

      case "PENDING_APPROVAL":
        return "bg-[#FFF5DD] text-[#8C6924] border-[#E5CC91]";

      case "PUBLISHED":
        return "bg-[#EAF2EC] text-[#3F6B52] border-[#BDD2C2]";

      case "REJECTED":
        return "bg-[#FBEAE6] text-[#A04A40] border-[#E2BDB6]";

      default:
        return "bg-[#F1EEE7] text-[#756D60] border-[#DDD5C6]";
    }
  };

  const formatStatus = (status) =>
    status?.replaceAll("_", " ") || "UNKNOWN";

  return (
    <div className="min-h-screen bg-[#F8F5ED] text-[#201C15]">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#191B1F]">
        {/* Blueprint grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.075]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
            `,
            backgroundSize: "42px 42px",
          }}
        />

        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[#D8B876]/15" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full border border-[#D8B876]/10" />
        <div className="pointer-events-none absolute bottom-[-130px] left-[30%] h-72 w-72 rounded-full border border-white/[0.04]" />

        <div className="relative mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8 lg:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            {/* Hero text */}
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D8B876]/25 bg-[#D8B876]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#E7CA91]">
                <Sparkles className="h-3.5 w-3.5" />
                Seller workspace
              </div>

              <h1
                style={FRASER}
                className="text-4xl leading-[1] tracking-[-0.035em] text-[#F8F5ED] sm:text-5xl lg:text-6xl"
              >
                Welcome,
                <br />
                <span className="text-[#D8B876]">{userName}</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#A9A69E] sm:text-base">
                Manage your property portfolio, monitor approvals and keep
                your listings ready for the right buyer.
              </p>
            </div>

            {/* Hero actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading || refreshing}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-3 text-xs font-bold text-[#F8F5ED] transition hover:border-[#D8B876]/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              <Link
                to="/seller/properties/add"
                className="group inline-flex items-center gap-2 rounded-full bg-[#D8B876] px-5 py-3 text-xs font-bold text-[#201C15] shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#E6CC97]"
              >
                <Plus className="h-4 w-4" />
                Add Property
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Portfolio mini stats */}
          <div className="mt-9 grid max-w-2xl grid-cols-3 border-t border-white/10 pt-6">
            <MiniStat label="Properties" value={totalProperties} />
            <MiniStat label="Published" value={publishedProperties} />
            <MiniStat label="Pending" value={pendingProperties} />
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Error */}
        {error && (
          <div className="mb-7 flex items-start gap-3 rounded-2xl border border-[#E4BBB4] bg-[#FFF5F2] p-4 text-sm text-[#8C3D34]">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-bold">Unable to load properties</p>
              <p className="mt-1 text-[#9D6159]">{error}</p>
            </div>
          </div>
        )}

        {/* =====================================================
            STATS
        ====================================================== */}
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#AD8332]">
                Portfolio overview
              </p>

              <h2
                style={FRASER}
                className="mt-1 text-3xl tracking-[-0.025em] text-[#201C15]"
              >
                Listing activity
              </h2>
            </div>

            <div className="hidden items-center gap-2 text-xs text-[#958B7A] sm:flex">
              <TrendingUp className="h-3.5 w-3.5" />
              Your property portfolio
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard
              label="Total"
              value={loading ? "—" : totalProperties}
              icon={Building2}
            />

            <StatCard
              label="Draft"
              value={loading ? "—" : draftProperties}
              icon={Clock3}
            />

            <StatCard
              label="Pending"
              value={loading ? "—" : pendingProperties}
              icon={Clock3}
              accent="gold"
            />

            <StatCard
              label="Published"
              value={loading ? "—" : publishedProperties}
              icon={CheckCircle2}
              accent="green"
            />

            <StatCard
              label="Rejected"
              value={loading ? "—" : rejectedProperties}
              icon={XCircle}
              accent="red"
            />
          </div>
        </section>

        {/* =====================================================
            PROPERTY LIST + SIDE PANEL
        ====================================================== */}
        <section className="mt-8 grid gap-6 xl:grid-cols-[1.55fr_0.75fr]">
          {/* Properties */}
          <div className="overflow-hidden rounded-[24px] border border-[#DDD5C4] bg-[#FBF9F3]">
            <div className="flex flex-col gap-4 border-b border-[#E8E1D4] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AD8332]">
                  Your listings
                </p>

                <h2
                  style={FRASER}
                  className="mt-1 text-2xl tracking-[-0.02em] text-[#201C15]"
                >
                  My Properties
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#827967]">
                  Manage your latest listings and approval status.
                </p>
              </div>

              <Link
                to="/seller/properties"
                className="group inline-flex w-fit items-center gap-1.5 rounded-full border border-[#D8CFBF] bg-white px-4 py-2 text-xs font-bold text-[#514A3E] transition hover:border-[#AD8332]/40 hover:text-[#8C6924]"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </Link>
            </div>

            {loading ? (
              <PropertyLoading />
            ) : properties.length === 0 ? (
              <EmptyProperties />
            ) : (
              <div className="divide-y divide-[#EAE4D8]">
                {properties.slice(0, 5).map((property) => (
                  <PropertyRow
                    key={property.id}
                    property={property}
                    getStatusClass={getStatusClass}
                    formatStatus={formatStatus}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="space-y-6">
            {/* Add property card */}
            <div className="relative overflow-hidden rounded-[24px] bg-[#EDE4D0] p-6">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[#AD8332]/15" />
              <div className="pointer-events-none absolute -right-4 top-4 h-24 w-24 rounded-full border border-[#AD8332]/10" />

              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#201C15] text-[#D8B876]">
                  <Plus className="h-5 w-5" />
                </div>

                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8C6924]">
                  Grow your portfolio
                </p>

                <h3
                  style={FRASER}
                  className="mt-2 text-2xl leading-tight text-[#201C15]"
                >
                  Have another property?
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#6D6557]">
                  Add a new listing and submit it for EstateHub verification.
                </p>

                <Link
                  to="/seller/properties/add"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#201C15] px-4 py-2.5 text-xs font-bold text-[#F8F5ED] transition hover:bg-[#343129]"
                >
                  Add Property
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Process */}
            <div className="rounded-[24px] border border-[#DDD5C4] bg-[#FBF9F3] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0E9DA] text-[#8C6924]">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#AD8332]">
                    Listing journey
                  </p>

                  <h3
                    style={FRASER}
                    className="mt-0.5 text-xl text-[#201C15]"
                  >
                    From draft to live
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <ProcessStep
                  number="01"
                  title="Add Property"
                  description="Enter details and upload photos."
                  active={draftProperties > 0}
                />

                <ProcessStep
                  number="02"
                  title="Admin Review"
                  description="Your listing is checked by Admin."
                  active={pendingProperties > 0}
                />

                <ProcessStep
                  number="03"
                  title="Go Live"
                  description="Approved listings become visible."
                  active={publishedProperties > 0}
                  last
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}
        <section className="mt-8">
          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AD8332]">
              Quick actions
            </p>

            <h2
              style={FRASER}
              className="mt-1 text-2xl tracking-[-0.02em] text-[#201C15]"
            >
              Keep things moving
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <QuickAction
              to="/seller/properties/add"
              icon={Plus}
              title="Add Property"
              description="Create a new listing"
            />

            <QuickAction
              to="/seller/properties"
              icon={Building2}
              title="Manage Properties"
              description="View your full portfolio"
            />

            <QuickAction
              to="/properties"
              icon={Eye}
              title="Browse Marketplace"
              description="See the public property listings"
            />
          </div>
        </section>

        {/* =====================================================
            TRUST STRIP
        ====================================================== */}
        <section className="mt-8 flex flex-col gap-4 rounded-[22px] border border-[#DDD5C4] bg-[#FBF9F3] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2EC] text-[#3F6B52]">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-[#29251E]">
                Secure property management
              </p>

              <p className="mt-0.5 text-xs text-[#817869]">
                Your listings are managed securely through EstateHub.
              </p>
            </div>
          </div>

          <Link
            to="/seller/properties/add"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6924] transition hover:text-[#6E521D]"
          >
            Add another property
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </main>
    </div>
  );
}

/* ============================================================
   MINI STAT
============================================================ */

function MiniStat({ label, value }) {
  return (
    <div className="border-l border-white/10 pl-4 first:border-l-0 first:pl-0 sm:pl-6">
      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#85827B]">
        {label}
      </p>

      <p
        style={FRASER}
        className="mt-1 text-2xl text-[#F8F5ED]"
      >
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  label,
  value,
  icon: Icon,
  accent = "default",
}) {
  const styles = {
    default: {
      box: "bg-white/70 border-[#DDD5C4]",
      icon: "bg-[#F0E9DA] text-[#8C6924]",
      value: "text-[#201C15]",
    },
    gold: {
      box: "bg-[#FCF6E8] border-[#E2D0A3]",
      icon: "bg-[#F0E1BD] text-[#8C6924]",
      value: "text-[#8C6924]",
    },
    green: {
      box: "bg-[#F3F8F4] border-[#C8DCCF]",
      icon: "bg-[#E3EFE6] text-[#3F6B52]",
      value: "text-[#3F6B52]",
    },
    red: {
      box: "bg-[#FFF7F5] border-[#E6C5BF]",
      icon: "bg-[#F7E6E2] text-[#A04A40]",
      value: "text-[#A04A40]",
    },
  };

  const current = styles[accent];

  return (
    <div
      className={`rounded-[20px] border p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(45,40,30,0.07)] ${current.box}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#948B7B]">
            {label}
          </p>

          <p
            style={FRASER}
            className={`mt-3 text-3xl ${current.value}`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${current.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PROPERTY ROW
============================================================ */

function PropertyRow({
  property,
  getStatusClass,
  formatStatus,
}) {
  const image =
    property?.images?.[0]?.url ||
    property?.images?.[0] ||
    property?.imageUrl ||
    "";

  return (
    <div className="group flex flex-col gap-4 px-5 py-5 transition hover:bg-[#FEFCF7] sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        {/* Image */}
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#EAE4D8]">
          {image ? (
            <img
              src={image}
              alt={property.title || "Property"}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#9B927F]">
              <Building2 className="h-6 w-6" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${getStatusClass(
                property.status
              )}`}
            >
              {formatStatus(property.status)}
            </span>

            {property.propertyType && (
              <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9A917F]">
                {property.propertyType}
              </span>
            )}
          </div>

          <h3 className="mt-2 truncate text-sm font-bold text-[#29251E] sm:text-base">
            {property.title || "Untitled property"}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#817869]">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />

              {[property.areaName, property.city]
                .filter(Boolean)
                .join(", ") || "Location unavailable"}
            </span>

            {property.bhk !== undefined &&
              property.bhk !== null && (
                <span className="inline-flex items-center gap-1">
                  <Home className="h-3.5 w-3.5" />
                  {property.bhk} BHK
                </span>
              )}

            {property.area && (
              <span className="inline-flex items-center gap-1">
                <BarChart3 className="h-3.5 w-3.5" />
                {property.area} sq.ft.
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 lg:min-w-[180px] lg:justify-end">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#A39A89]">
            Asking price
          </p>

          <p className="mt-1 text-sm font-bold text-[#201C15]">
            ₹
            {Number(property.price || 0).toLocaleString("en-IN")}
          </p>
        </div>

        <Link
          to={`/properties/${property.id}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#D8CFBF] bg-white px-3.5 py-2 text-xs font-bold text-[#514A3E] transition hover:border-[#AD8332]/40 hover:bg-[#F8F2E5] hover:text-[#8C6924]"
        >
          <Eye className="h-3.5 w-3.5" />
          View
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

/* ============================================================
   PROCESS STEP
============================================================ */

function ProcessStep({
  number,
  title,
  description,
  active,
  last = false,
}) {
  return (
    <div className="relative flex gap-3">
      {!last && (
        <div className="absolute left-4 top-8 h-[calc(100%+12px)] w-px bg-[#DDD4C2]" />
      )}

      <div
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold ${
          active
            ? "border-[#AD8332] bg-[#201C15] text-[#D8B876]"
            : "border-[#D8CFBF] bg-[#F7F3EA] text-[#968D7C]"
        }`}
      >
        {number}
      </div>

      <div>
        <p className="text-sm font-bold text-[#29251E]">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-[#817869]">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   QUICK ACTION
============================================================ */

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-[20px] border border-[#DDD5C4] bg-[#FBF9F3] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#CDBB91] hover:bg-white hover:shadow-[0_15px_35px_rgba(45,40,30,0.07)]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0E9DA] text-[#8C6924] transition group-hover:bg-[#201C15] group-hover:text-[#D8B876]">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#29251E]">
          {title}
        </p>

        <p className="mt-1 text-xs text-[#817869]">
          {description}
        </p>
      </div>

      <ArrowRight className="h-4 w-4 text-[#AAA18F] transition group-hover:translate-x-1 group-hover:text-[#8C6924]" />
    </Link>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyProperties() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0E9DA] text-[#8C6924]">
        <Building2 className="h-7 w-7" />
      </div>

      <h3
        style={FRASER}
        className="mt-5 text-2xl text-[#201C15]"
      >
        Your portfolio starts here.
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817869]">
        Add your first property to start building your presence on
        EstateHub.
      </p>

      <Link
        to="/seller/properties/add"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#201C15] px-5 py-3 text-xs font-bold text-[#F8F5ED] transition hover:bg-[#343129]"
      >
        <Plus className="h-4 w-4" />
        Add Property
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

/* ============================================================
   LOADING
============================================================ */

function PropertyLoading() {
  return (
    <div className="divide-y divide-[#EAE4D8]">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 px-5 py-5 sm:px-6"
        >
          <div className="h-16 w-16 animate-pulse rounded-2xl bg-[#E8E1D4]" />

          <div className="flex-1">
            <div className="h-3 w-20 animate-pulse rounded bg-[#E8E1D4]" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-[#E8E1D4]" />
            <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-[#EEE8DD]" />
          </div>

          <div className="hidden h-8 w-20 animate-pulse rounded-full bg-[#E8E1D4] sm:block" />
        </div>
      ))}
    </div>
  );
}
