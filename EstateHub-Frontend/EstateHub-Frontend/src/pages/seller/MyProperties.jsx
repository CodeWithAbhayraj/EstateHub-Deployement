
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  XCircle,
} from "lucide-react";
import {
  getMyProperties,
  submitPropertyForApproval,
} from "../../api/propertyApi";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

export default function MyProperties() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProperties = async (showFullLoader = true) => {
    try {
      if (showFullLoader) setLoading(true);
      else setRefreshing(true);

      setError("");

      const data = await getMyProperties();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load your properties."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleRefresh = async () => {
    await fetchProperties(false);
  };

  const handleSubmitForApproval = async (propertyId) => {
    try {
      setActionLoading(propertyId);
      setError("");
      setSuccess("");

      const updated = await submitPropertyForApproval(propertyId);

      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? updated : p
        )
      );

      setSuccess("Property submitted for approval.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit property."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();

    return properties.filter((p) => {
      const matchSearch =
        !term ||
        p.title?.toLowerCase().includes(term) ||
        p.city?.toLowerCase().includes(term) ||
        p.areaName?.toLowerCase().includes(term) ||
        String(p.id).includes(term);

      const matchStatus =
        statusFilter === "ALL" ||
        p.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [properties, search, statusFilter]);

  const formatPrice = (price) =>
    price
      ? `₹${Number(price).toLocaleString("en-IN")}`
      : "Price on request";

  const formatStatus = (status) =>
    status?.replaceAll("_", " ") || "UNKNOWN";

  const getStatusMeta = (status) => {
    const map = {
      DRAFT: {
        label: "Draft",
        icon: Edit,
        tone: "border-[#D8CFB9] bg-[#F7F4EC] text-[#6B6252]",
      },
      PENDING_APPROVAL: {
        label: "Pending",
        icon: Clock,
        tone: "border-[#E5D4A8] bg-[#FBF4DE] text-[#8C6924]",
      },
      PUBLISHED: {
        label: "Published",
        icon: CheckCircle,
        tone: "border-[#C9D9CF] bg-[#EEF6F0] text-[#3F6B52]",
      },
      REJECTED: {
        label: "Rejected",
        icon: XCircle,
        tone: "border-[#E7C7C2] bg-[#FAEEEC] text-[#B3564B]",
      },
    };

    return (
      map[status] || {
        label: formatStatus(status),
        icon: Clock,
        tone:
          "border-[#D8CFB9] bg-[#F7F4EC] text-[#6B6252]",
      }
    );
  };

  const total = properties.length;
  const draftCount = properties.filter(
    (p) => p.status === "DRAFT"
  ).length;
  const pendingCount = properties.filter(
    (p) => p.status === "PENDING_APPROVAL"
  ).length;
  const publishedCount = properties.filter(
    (p) => p.status === "PUBLISHED"
  ).length;
  const rejectedCount = properties.filter(
    (p) => p.status === "REJECTED"
  ).length;

  const isFilterActive =
    Boolean(search) || statusFilter !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  return (
    <div className="min-h-screen bg-[#F8F5ED] text-[#201C15]">
      {/* Blueprint background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(173,131,50,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(173,131,50,0.045) 1px, transparent 1px)
          `,
          backgroundSize: "42px 42px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <section className="mb-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-3">
              <button
                onClick={() => navigate("/seller/dashboard")}
                className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D8CFB9] bg-[#FBF8F1] text-[#6B6252] transition hover:border-[#AD8332] hover:bg-[#F2ECDF] hover:text-[#201C15]"
                aria-label="Back to dashboard"
              >
                <ArrowLeft size={17} />
              </button>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-px w-7 bg-[#AD8332]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#AD8332]">
                    Seller workspace
                  </span>
                </div>

                <h1
                  style={FRASER}
                  className="text-3xl font-semibold tracking-[-0.03em] text-[#201C15] sm:text-4xl"
                >
                  My properties.
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#756D60]">
                  Manage your listings, update details and track
                  each property's journey from draft to live.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleRefresh}
                disabled={loading || refreshing}
                className="inline-flex items-center gap-2 rounded-full border border-[#D8CFB9] bg-[#FBF8F1] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#4F483D] transition hover:border-[#AD8332] hover:bg-[#F2ECDF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing" : "Refresh"}
              </button>

              <Link
                to="/seller/properties/add"
                className="inline-flex items-center gap-2 rounded-full bg-[#201C15] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#FBF8F1] transition hover:bg-[#3A3429]"
              >
                <Plus size={15} />
                Add property
              </Link>
            </div>
          </div>
        </section>

        {/* Alerts */}
        {error && (
          <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-[#E7C7C2] bg-[#FAEEEC] px-4 py-3 text-sm text-[#9E4A41]">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="font-bold"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-[#C9D9CF] bg-[#EEF6F0] px-4 py-3 text-sm text-[#3F6B52]">
            <span>{success}</span>
            <button
              onClick={() => setSuccess("")}
              className="font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats */}
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A8D77]">
                Listing overview
              </p>
              <h2
                style={FRASER}
                className="mt-1 text-xl font-semibold text-[#201C15]"
              >
                Your portfolio at a glance.
              </h2>
            </div>

            <span className="hidden text-xs text-[#9A8D77] sm:block">
              {total} total listing{total !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard
              label="Total"
              value={loading ? "—" : total}
              icon={Building2}
              accent="gold"
            />

            <StatCard
              label="Draft"
              value={loading ? "—" : draftCount}
              icon={Edit}
              accent="neutral"
            />

            <StatCard
              label="Pending"
              value={loading ? "—" : pendingCount}
              icon={Clock}
              accent="amber"
            />

            <StatCard
              label="Published"
              value={loading ? "—" : publishedCount}
              icon={CheckCircle}
              accent="green"
            />

            <StatCard
              label="Rejected"
              value={loading ? "—" : rejectedCount}
              icon={XCircle}
              accent="red"
            />
          </div>
        </section>

        {/* Search / Filter */}
        <section className="mb-7 rounded-3xl border border-[#D8CFB9] bg-[#FBF8F1] p-4 shadow-[0_12px_40px_rgba(32,28,21,0.04)] sm:p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2ECDF] text-[#AD8332]">
                  <Search size={15} />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#201C15]">
                    Find a listing
                  </p>
                  <p className="text-[11px] text-[#8A806D]">
                    Search your properties or filter by status.
                  </p>
                </div>
              </div>
            </div>

            {isFilterActive && (
              <button
                onClick={clearFilters}
                className="self-start text-xs font-bold uppercase tracking-[0.08em] text-[#8C6924] hover:text-[#6F521C] sm:self-auto"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_210px]">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8D77]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, city, area or ID..."
                className="h-11 w-full rounded-xl border border-[#D8CFB9] bg-white/60 pl-11 pr-4 text-sm text-[#201C15] outline-none transition placeholder:text-[#A59A88] focus:border-[#AD8332] focus:bg-white focus:ring-2 focus:ring-[#AD8332]/10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 rounded-xl border border-[#D8CFB9] bg-white/60 px-4 text-sm font-medium text-[#4F483D] outline-none transition focus:border-[#AD8332] focus:bg-white focus:ring-2 focus:ring-[#AD8332]/10"
            >
              <option value="ALL">All statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_APPROVAL">
                Pending approval
              </option>
              <option value="PUBLISHED">Published</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {!loading && (
            <div className="mt-3 flex items-center justify-between border-t border-[#E4DCC9] pt-3">
              <p className="text-[11px] text-[#8A806D]">
                Showing{" "}
                <span className="font-bold text-[#4F483D]">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-[#4F483D]">
                  {properties.length}
                </span>{" "}
                properties
              </p>

              {statusFilter !== "ALL" && (
                <span className="rounded-full bg-[#F2ECDF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C6924]">
                  {formatStatus(statusFilter)}
                </span>
              )}
            </div>
          )}
        </section>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <PropertySkeleton key={item} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="overflow-hidden rounded-3xl border border-[#D8CFB9] bg-[#FBF8F1]">
            <div
              className="relative flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(173,131,50,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(173,131,50,0.05) 1px, transparent 1px)
                `,
                backgroundSize: "32px 32px",
              }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D8CFB9] bg-[#F2ECDF] text-[#AD8332]">
                {isFilterActive ? (
                  <Search size={25} />
                ) : (
                  <Building2 size={25} />
                )}
              </div>

              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#AD8332]">
                {isFilterActive
                  ? "No match"
                  : "Your portfolio starts here"}
              </p>

              <h3
                style={FRASER}
                className="mt-2 text-2xl font-semibold text-[#201C15]"
              >
                {isFilterActive
                  ? "No properties found."
                  : "Add your first property."}
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#756D60]">
                {isFilterActive
                  ? "Try changing your search or status filter to see more listings."
                  : "Create a listing, add the property details and submit it for admin approval."}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {isFilterActive ? (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 rounded-full border border-[#D8CFB9] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#4F483D] hover:border-[#AD8332]"
                  >
                    Clear filters
                  </button>
                ) : (
                  <Link
                    to="/seller/properties/add"
                    className="inline-flex items-center gap-2 rounded-full bg-[#201C15] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-[#3A3429]"
                  >
                    <Plus size={15} />
                    Add property
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Property Grid */
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((property) => {
              const status = getStatusMeta(property.status);
              const StatusIcon = status.icon;

              const image =
                property.images?.length > 0
                  ? property.images[0]
                  : null;

              const isSubmitting =
                actionLoading === property.id;

              return (
                <article
                  key={property.id}
                  className="group flex overflow-hidden rounded-3xl border border-[#D8CFB9] bg-[#FBF8F1] shadow-[0_10px_35px_rgba(32,28,21,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#C7B58F] hover:shadow-[0_18px_50px_rgba(32,28,21,0.08)]"
                >
                  {/* Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-[#EAE4D7]">
                    {image ? (
                      <img
                        src={image}
                        alt={property.title || "Property"}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center text-[#9A8D77]">
                        <Building2 size={35} strokeWidth={1.4} />
                        <span className="mt-2 text-xs">
                          No image available
                        </span>
                      </div>
                    )}

                    {/* Image overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#201C15]/55 to-transparent" />

                    {/* Status */}
                    <span
                      className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] backdrop-blur-sm ${status.tone}`}
                    >
                      <StatusIcon size={12} />
                      {status.label}
                    </span>

                    {/* Property ID */}
                    <span className="absolute bottom-4 right-4 rounded-full bg-[#201C15]/75 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-md">
                      ID #{property.id}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <div>
                      <h2
                        className="line-clamp-2 text-lg font-semibold leading-6 text-[#201C15]"
                        style={FRASER}
                      >
                        {property.title || "Untitled property"}
                      </h2>

                      <div className="mt-2 flex items-start gap-1.5 text-xs text-[#756D60]">
                        <MapPin
                          size={14}
                          className="mt-0.5 shrink-0 text-[#AD8332]"
                        />
                        <span>
                          {property.areaName || "Unknown area"},{" "}
                          {property.city || "Unknown city"}
                        </span>
                      </div>

                      <p className="mt-4 text-xl font-bold tracking-[-0.02em] text-[#201C15]">
                        {formatPrice(property.price)}
                      </p>
                    </div>

                    {/* Property details */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <InfoItem
                        label="BHK"
                        value={property.bhk ?? "—"}
                      />

                      <InfoItem
                        label="Area"
                        value={
                          property.area
                            ? `${property.area} sq.ft`
                            : "—"
                        }
                      />

                      <InfoItem
                        label="Type"
                        value={property.propertyType || "—"}
                      />

                      <InfoItem
                        label="Listing ID"
                        value={`#${property.id}`}
                      />
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-5">
                      <Link
                        to={`/properties/${property.id}`}
                        className="group/view flex w-full items-center justify-between rounded-xl border border-[#D8CFB9] bg-white/60 px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#4F483D] transition hover:border-[#AD8332] hover:bg-[#F2ECDF]"
                      >
                        <span className="flex items-center gap-2">
                          <Eye size={15} />
                          View property
                        </span>

                        <ArrowRight
                          size={15}
                          className="transition group-hover/view:translate-x-1"
                        />
                      </Link>

                      {/* Draft */}
                      {property.status === "DRAFT" && (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <Link
                            to={`/seller/properties/${property.id}/edit`}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#F2ECDF] py-3 text-xs font-bold uppercase tracking-[0.06em] text-[#6F521C] transition hover:bg-[#E9DFC8]"
                          >
                            <Edit size={14} />
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              handleSubmitForApproval(
                                property.id
                              )
                            }
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#201C15] py-3 text-xs font-bold uppercase tracking-[0.06em] text-white transition hover:bg-[#3A3429] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isSubmitting ? (
                              <>
                                <RefreshCw
                                  size={14}
                                  className="animate-spin"
                                />
                                Sending
                              </>
                            ) : (
                              <>
                                <Send size={14} />
                                Submit
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Rejected */}
                      {property.status === "REJECTED" && (
                        <div className="mt-2">
                          <Link
                            to={`/seller/properties/${property.id}/edit`}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#201C15] py-3 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#3A3429]"
                          >
                            <Edit size={15} />
                            Edit property
                          </Link>

                          {property.rejectionReason && (
                            <div className="mt-3 rounded-xl border border-[#E7C7C2] bg-[#FAEEEC] p-3">
                              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#B3564B]">
                                Admin feedback
                              </p>
                              <p className="mt-1 text-xs leading-5 text-[#7E4942]">
                                {property.rejectionReason}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Pending */}
                      {property.status === "PENDING_APPROVAL" && (
                        <div className="mt-2 flex items-center gap-2 rounded-xl border border-[#E5D4A8] bg-[#FBF4DE] px-3 py-3 text-xs font-semibold text-[#8C6924]">
                          <Clock size={14} />
                          <span>
                            Waiting for admin approval
                          </span>
                        </div>
                      )}

                      {/* Published */}
                      {property.status === "PUBLISHED" && (
                        <div className="mt-2 flex items-center gap-2 rounded-xl border border-[#C9D9CF] bg-[#EEF6F0] px-3 py-3 text-xs font-semibold text-[#3F6B52]">
                          <CheckCircle size={14} />
                          <span>Property is live</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom information strip */}
        {!loading && properties.length > 0 && (
          <section className="mt-8 overflow-hidden rounded-3xl border border-[#D8CFB9] bg-[#201C15] text-[#FBF8F1]">
            <div className="relative px-5 py-6 sm:px-7">
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(216,184,118,0.25) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(216,184,118,0.25) 1px, transparent 1px)
                  `,
                  backgroundSize: "28px 28px",
                }}
              />

              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D8B876]/30 bg-[#AD8332]/15 text-[#D8B876]">
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#D8B876]">
                      Keep your listings updated
                    </p>
                    <p className="mt-1 max-w-xl text-xs leading-5 text-[#BDB4A5]">
                      Accurate property information and quality images
                      help your listing stay clear and ready for buyers.
                    </p>
                  </div>
                </div>

                <Link
                  to="/seller/properties/add"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#FBF8F1] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#201C15] hover:bg-white"
                >
                  Add another
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Stat Card
--------------------------------------------- */

function StatCard({
  label,
  value,
  icon: Icon,
  accent = "gold",
}) {
  const accents = {
    gold: {
      icon: "bg-[#F2ECDF] text-[#AD8332]",
      value: "text-[#201C15]",
    },
    neutral: {
      icon: "bg-[#F3F0E9] text-[#6B6252]",
      value: "text-[#201C15]",
    },
    amber: {
      icon: "bg-[#FBF4DE] text-[#8C6924]",
      value: "text-[#8C6924]",
    },
    green: {
      icon: "bg-[#EEF6F0] text-[#3F6B52]",
      value: "text-[#3F6B52]",
    },
    red: {
      icon: "bg-[#FAEEEC] text-[#B3564B]",
      value: "text-[#B3564B]",
    },
  };

  const theme = accents[accent] || accents.gold;

  return (
    <div className="rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1] p-4 shadow-[0_8px_25px_rgba(32,28,21,0.03)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#9A8D77]">
            {label}
          </p>

          <p
            className={`mt-1 text-2xl font-semibold ${theme.value}`}
            style={FRASER}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.icon}`}
        >
          <Icon size={17} />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Property Info Item
--------------------------------------------- */

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl border border-[#E4DCC9] bg-[#F7F4EC] px-3 py-2.5">
      <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#9A8D77]">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold text-[#4F483D]">
        {value}
      </p>
    </div>
  );
}

/* ---------------------------------------------
   Skeleton
--------------------------------------------- */

function PropertySkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#D8CFB9] bg-[#FBF8F1]">
      <div className="h-56 animate-pulse bg-[#EAE4D7]" />

      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-[#EAE4D7]" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-[#EAE4D7]" />
        <div className="h-6 w-1/3 animate-pulse rounded bg-[#EAE4D7]" />

        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="h-14 animate-pulse rounded-xl bg-[#F0EBE1]" />
          <div className="h-14 animate-pulse rounded-xl bg-[#F0EBE1]" />
          <div className="h-14 animate-pulse rounded-xl bg-[#F0EBE1]" />
          <div className="h-14 animate-pulse rounded-xl bg-[#F0EBE1]" />
        </div>

        <div className="h-11 animate-pulse rounded-xl bg-[#EAE4D7]" />
      </div>
    </div>
  );
}

