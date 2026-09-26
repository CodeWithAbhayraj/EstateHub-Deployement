
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  MapPin,
  IndianRupee,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Clock3,
  Eye,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getAllPropertiesForAdmin,
  approveProperty,
  rejectProperty,
} from "../../api/propertyApi";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

function PropertiesManagement() {
  const [properties, setProperties] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchProperties = async (showFullLoader = true) => {
    try {
      showFullLoader ? setLoading(true) : setRefreshing(true);
      setError("");

      const data = await getAllPropertiesForAdmin();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Properties error:", err);
      setError(
        err.response?.data?.message || "Failed to load properties."
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

  const filteredProperties = useMemo(() => {
    const value = search.toLowerCase().trim();

    return properties.filter((property) => {
      const matchesSearch =
        !value ||
        [
          property.title,
          property.city,
          property.areaName,
          property.id,
        ].some((field) =>
          String(field || "")
            .toLowerCase()
            .includes(value)
        );

      const matchesStatus =
        statusFilter === "ALL" ||
        property.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [properties, search, statusFilter]);

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {
      return "Price on request";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const handleApprove = async (propertyId) => {
    try {
      setActionLoading(propertyId);
      setError("");
      setSuccess("");

      const updatedProperty = await approveProperty(propertyId);

      setProperties((prev) =>
        prev.map((property) =>
          String(property.id) === String(propertyId)
            ? updatedProperty
            : property
        )
      );

      setSuccess("Property approved successfully.");
    } catch (err) {
      console.error("Approve property error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to approve property."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (property) => {
    setSelectedProperty(property);
    setRejectionReason("");
    setError("");
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    if (actionLoading !== null) return;

    setShowRejectModal(false);
    setSelectedProperty(null);
    setRejectionReason("");
  };

  const handleReject = async () => {
    if (!selectedProperty) return;

    const reason = rejectionReason.trim();

    if (!reason) {
      setError("Please enter a rejection reason.");
      return;
    }

    try {
      setActionLoading(selectedProperty.id);
      setError("");
      setSuccess("");

      const updatedProperty = await rejectProperty(
        selectedProperty.id,
        reason
      );

      setProperties((prev) =>
        prev.map((property) =>
          String(property.id) ===
          String(selectedProperty.id)
            ? updatedProperty
            : property
        )
      );

      setSuccess("Property rejected successfully.");
      setShowRejectModal(false);
      setSelectedProperty(null);
      setRejectionReason("");
    } catch (err) {
      console.error("Reject property error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to reject property."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusMeta = (status) => {
    switch (status) {
      case "DRAFT":
        return {
          label: "Draft",
          className:
            "border-[#DDD6C7] bg-[#F3F0E8] text-[#6B6252]",
          icon: Building2,
        };

      case "PENDING_APPROVAL":
        return {
          label: "Pending",
          className:
            "border-[#E3D3A9] bg-[#FBF4E2] text-[#8C6924]",
          icon: Clock3,
        };

      case "PUBLISHED":
        return {
          label: "Published",
          className:
            "border-[#C9D8CD] bg-[#F0F6F2] text-[#3F6B52]",
          icon: CheckCircle,
        };

      case "REJECTED":
        return {
          label: "Rejected",
          className:
            "border-[#E6C6C0] bg-[#FFF5F3] text-[#A34C43]",
          icon: XCircle,
        };

      case "SOLD":
        return {
          label: "Sold",
          className:
            "border-[#D7CBE5] bg-[#F5F0F9] text-[#70548A]",
          icon: CheckCircle,
        };

      default:
        return {
          label: status || "Unknown",
          className:
            "border-[#DDD6C7] bg-[#F3F0E8] text-[#6B6252]",
          icon: Building2,
        };
    }
  };

  const totalCount = properties.length;
  const pendingCount = properties.filter(
    (p) => p.status === "PENDING_APPROVAL"
  ).length;
  const publishedCount = properties.filter(
    (p) => p.status === "PUBLISHED"
  ).length;
  const rejectedCount = properties.filter(
    (p) => p.status === "REJECTED"
  ).length;

  const activeFilter =
    statusFilter !== "ALL" || search.trim() !== "";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  return (
    <div className="w-full">
      {/* ==========================================
          HERO
      ========================================== */}
      <section className="relative mb-6 overflow-hidden rounded-[28px] bg-[#171B21] px-5 py-6 text-white shadow-[0_24px_70px_rgba(23,27,33,0.14)] sm:px-7 sm:py-7">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D8B876]">
              <span className="h-px w-7 bg-[#D8B876]" />
              EstateHub Admin
            </div>

            <h1
              style={FRASER}
              className="text-3xl leading-tight tracking-[-0.03em] sm:text-4xl"
            >
              Property review desk.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
              Review submitted listings, approve properties for
              publication and keep the marketplace clean.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh data"}
          </button>
        </div>
      </section>

      {/* ==========================================
          ALERTS
      ========================================== */}
      {error && (
        <div
          className="mb-4 flex items-start gap-3 rounded-2xl border border-[#E6C6C0] bg-[#FFF7F5] p-4 text-sm text-[#A34C43]"
          role="alert"
        >
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0"
          />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="mb-4 flex items-start gap-3 rounded-2xl border border-[#C9D8CD] bg-[#F4F8F5] p-4 text-sm text-[#3F6B52]"
          role="status"
        >
          <CheckCircle
            size={17}
            className="mt-0.5 shrink-0"
          />
          <span>{success}</span>
        </div>
      )}

      {/* ==========================================
          STATS
      ========================================== */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total"
          value={totalCount}
          description="All properties"
          icon={Building2}
          eyebrow="01"
        />

        <StatCard
          label="Pending"
          value={pendingCount}
          description="Need review"
          icon={Clock3}
          eyebrow="02"
          accent="gold"
        />

        <StatCard
          label="Published"
          value={publishedCount}
          description="Live listings"
          icon={CheckCircle}
          eyebrow="03"
          accent="green"
        />

        <StatCard
          label="Rejected"
          value={rejectedCount}
          description="Need changes"
          icon={XCircle}
          eyebrow="04"
          accent="red"
        />
      </div>

      {/* ==========================================
          SEARCH + FILTER
      ========================================== */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1]">
        <div className="border-b border-[#E4DCC9] px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AD8332]">
              Listing directory
            </p>

            <h2
              style={FRASER}
              className="text-xl tracking-[-0.02em] text-[#201C15]"
            >
              Search & review
            </h2>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9D9483]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search title, city, area or property ID..."
                className="w-full rounded-xl border border-[#D8CFB9] bg-white py-2.5 pl-9 pr-4 text-sm text-[#29251E] outline-none placeholder:text-[#AAA18F] transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="w-full rounded-xl border border-[#D8CFB9] bg-white px-3 py-2.5 text-sm text-[#29251E] outline-none transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_APPROVAL">
                Pending Approval
              </option>
              <option value="PUBLISHED">Published</option>
              <option value="REJECTED">Rejected</option>
              <option value="SOLD">Sold</option>
            </select>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#8A806D]">
              {loading
                ? "Loading..."
                : `${filteredProperties.length} ${
                    filteredProperties.length === 1
                      ? "property"
                      : "properties"
                  } found`}
            </span>

            {activeFilter && (
              <>
                <span className="text-[#C4BAA7]">•</span>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-semibold text-[#8C6924] hover:text-[#6F521D]"
                >
                  Clear filters
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ==========================================
          CONTENT
      ========================================== */}
      {loading ? (
        <LoadingState />
      ) : filteredProperties.length === 0 ? (
        <EmptyState
          activeFilter={activeFilter}
          onClear={clearFilters}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.map((property) => {
            const statusMeta = getStatusMeta(
              property.status
            );

            const StatusIcon = statusMeta.icon;

            const imageUrl =
              Array.isArray(property.images) &&
              property.images.length > 0
                ? property.images[0]
                : null;

            const isActionLoading =
              actionLoading === property.id;

            return (
              <article
                key={property.id}
                className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#D8CFB9] bg-[#FBF8F1] shadow-[0_12px_35px_rgba(47,39,27,0.05)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(47,39,27,0.09)]"
              >
                {/* IMAGE */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EDE8DC]">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={property.title || "Property"}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-[#A9A08F]">
                      <Building2 size={28} />
                      <p className="mt-2 text-xs font-semibold">
                        No image
                      </p>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />

                  <span
                    className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm ${statusMeta.className}`}
                  >
                    <StatusIcon size={12} />
                    {statusMeta.label}
                  </span>

                  <span className="absolute bottom-3 right-3 rounded-full bg-[#171B21]/85 px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-white backdrop-blur-sm">
                    #{property.id}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2
                      className="line-clamp-2 text-base font-bold leading-6 text-[#201C15]"
                    >
                      {property.title || "Untitled Property"}
                    </h2>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-sm text-[#7C7465]">
                    <MapPin
                      size={14}
                      className="shrink-0 text-[#AD8332]"
                    />

                    <span className="line-clamp-1">
                      {property.areaName || "Unknown Area"}
                      {property.areaName && property.city
                        ? ", "
                        : ""}
                      {property.city || "Unknown City"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-xl font-bold tracking-[-0.02em] text-[#201C15]">
                    <IndianRupee
                      size={17}
                      className="text-[#8C6924]"
                    />

                    {formatPrice(property.price).replace(
                      "₹",
                      ""
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <InfoBox
                      label="BHK"
                      value={property.bhk ?? "—"}
                    />

                    <InfoBox
                      label="Area"
                      value={
                        property.area
                          ? `${property.area} sq.ft`
                          : "—"
                      }
                    />

                    <InfoBox
                      label="Type"
                      value={property.propertyType || "—"}
                    />

                    <InfoBox
                      label="ID"
                      value={`#${property.id}`}
                    />
                  </div>

                  {property.description && (
                    <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#8A806D]">
                      {property.description}
                    </p>
                  )}

                  {/* ACTIONS */}
                  <div className="mt-auto space-y-2 pt-5">
                    <Link
                      to={`/properties/${property.id}`}
                      className="group/view flex w-full items-center justify-center gap-2 rounded-xl border border-[#D8CFB9] bg-white px-4 py-2.5 text-sm font-semibold text-[#403A31] transition hover:border-[#BDA873] hover:bg-[#F8F5ED]"
                    >
                      <Eye size={15} />

                      View Property

                      <ArrowRight
                        size={14}
                        className="text-[#9D9483] transition group-hover/view:translate-x-0.5"
                      />
                    </Link>

                    {property.status ===
                      "PENDING_APPROVAL" && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleApprove(property.id)
                          }
                          disabled={isActionLoading}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#3F6B52] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#315540] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                        >
                          {isActionLoading ? (
                            <RefreshCw
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <CheckCircle size={14} />
                          )}

                          {isActionLoading
                            ? "Processing..."
                            : "Approve"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openRejectModal(property)
                          }
                          disabled={isActionLoading}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#A34C43] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#873D36] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
                    )}

                    {property.status === "PUBLISHED" && (
                      <div className="flex items-center justify-center gap-2 rounded-xl border border-[#C9D8CD] bg-[#F0F6F2] p-2.5 text-xs font-bold text-[#3F6B52]">
                        <ShieldCheck size={14} />
                        Property is live
                      </div>
                    )}

                    {property.status === "REJECTED" && (
                      <div className="rounded-xl border border-[#E6C6C0] bg-[#FFF5F3] p-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#A34C43]">
                          <XCircle size={14} />
                          Property Rejected
                        </div>

                        {property.rejectionReason && (
                          <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-[#A34C43]/80">
                            {property.rejectionReason}
                          </p>
                        )}
                      </div>
                    )}

                    {property.status === "DRAFT" && (
                      <div className="rounded-xl border border-[#DDD6C7] bg-[#F3F0E8] p-2.5 text-center text-xs font-bold text-[#756D5E]">
                        Draft property
                      </div>
                    )}

                    {property.status === "SOLD" && (
                      <div className="flex items-center justify-center gap-2 rounded-xl border border-[#D7CBE5] bg-[#F5F0F9] p-2.5 text-xs font-bold text-[#70548A]">
                        <CheckCircle size={14} />
                        Property Sold
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ==========================================
          REJECT MODAL
      ========================================== */}
      {showRejectModal && selectedProperty && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#171B21]/65 p-4 backdrop-blur-[2px]"
          onClick={closeRejectModal}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[24px] border border-[#D8CFB9] bg-[#FBF8F1] shadow-[0_30px_90px_rgba(0,0,0,0.22)]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* MODAL HEADER */}
            <div className="relative overflow-hidden border-b border-[#E4DCC9] bg-[#201C15] px-5 py-5 text-white">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />

              <div className="relative">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D8B876]">
                  Listing review
                </p>

                <h2
                  style={FRASER}
                  className="mt-1 text-2xl tracking-[-0.02em]"
                >
                  Reject property
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-white/55">
                  Provide a clear reason for rejecting this
                  listing.
                </p>
              </div>
            </div>

            {/* MODAL BODY */}
            <div className="p-5">
              <div className="rounded-2xl border border-[#E4DCC9] bg-[#F8F5ED] p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A806D]">
                  Property
                </p>

                <p className="mt-1 text-sm font-bold text-[#201C15]">
                  {selectedProperty.title ||
                    "Untitled Property"}
                </p>

                <p className="mt-1 text-xs text-[#8A806D]">
                  Property ID: #{selectedProperty.id}
                </p>
              </div>

              <label
                htmlFor="rejection-reason"
                className="mt-5 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B6252]"
              >
                Rejection reason
              </label>

              <textarea
                id="rejection-reason"
                rows={5}
                value={rejectionReason}
                onChange={(event) =>
                  setRejectionReason(event.target.value)
                }
                placeholder="Enter the reason for rejection..."
                className="mt-2 w-full resize-y rounded-xl border border-[#D8CFB9] bg-white px-3 py-2.5 text-sm text-[#29251E] outline-none placeholder:text-[#AAA18F] transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10"
              />

              <p className="mt-1.5 text-xs leading-5 text-[#9A9180]">
                A rejection reason will be visible to the
                seller.
              </p>

              {/* MODAL ACTIONS */}
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={closeRejectModal}
                  disabled={actionLoading !== null}
                  className="rounded-xl border border-[#D8CFB9] bg-white px-4 py-2.5 text-sm font-semibold text-[#5F584D] transition hover:bg-[#F8F5ED] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleReject}
                  disabled={
                    actionLoading === selectedProperty.id
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#A34C43] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#873D36] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionLoading === selectedProperty.id ? (
                    <>
                      <RefreshCw
                        size={16}
                        className="animate-spin"
                      />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      Reject Property
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  eyebrow,
  accent = "default",
}) {
  const accentStyles = {
    default: {
      value: "text-[#201C15]",
      icon: "bg-[#201C15] text-[#D8B876]",
    },
    gold: {
      value: "text-[#8C6924]",
      icon: "bg-[#F7F0DF] text-[#8C6924]",
    },
    green: {
      value: "text-[#3F6B52]",
      icon: "bg-[#F0F6F2] text-[#3F6B52]",
    },
    red: {
      value: "text-[#A34C43]",
      icon: "bg-[#FFF5F3] text-[#A34C43]",
    },
  };

  const styles = accentStyles[accent];

  return (
    <div className="rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1] p-4 shadow-[0_8px_25px_rgba(47,39,27,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] font-bold tracking-[0.18em] text-[#AD8332]">
            {eyebrow}
          </span>

          <p className="mt-2 truncate text-xs font-bold uppercase tracking-[0.08em] text-[#8A806D]">
            {label}
          </p>

          <p
            style={FRASER}
            className={`mt-1 text-3xl tracking-[-0.03em] ${styles.value}`}
          >
            {value}
          </p>

          <p className="mt-1 truncate text-xs text-[#9A9180]">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// INFO BOX
// ==========================================

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl border border-[#E4DCC9] bg-[#F8F5ED] p-2.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9A9180]">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-[#4A443A]">
        {value}
      </p>
    </div>
  );
}

// ==========================================
// LOADING STATE
// ==========================================

function LoadingState() {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-[22px] border border-[#D8CFB9] bg-[#FBF8F1]">
      <div className="text-center">
        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#D8CFB9] border-t-[#AD8332]" />

        <p className="mt-3 text-sm text-[#8A806D]">
          Loading properties...
        </p>
      </div>
    </div>
  );
}

// ==========================================
// EMPTY STATE
// ==========================================

function EmptyState({ activeFilter, onClear }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-[22px] border border-dashed border-[#D8CFB9] bg-[#FBF8F1] p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0ECE2] text-[#A9A08F]">
        <Building2 size={26} />
      </div>

      <h3
        style={FRASER}
        className="mt-4 text-xl text-[#201C15]"
      >
        No properties found
      </h3>

      <p className="mt-1 max-w-sm text-sm leading-5 text-[#8A806D]">
        No properties match your search or status filter.
      </p>

      {activeFilter && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 rounded-full border border-[#D8CFB9] bg-white px-4 py-2 text-sm font-bold text-[#5F584D] transition hover:bg-[#F8F5ED]"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export default PropertiesManagement;

