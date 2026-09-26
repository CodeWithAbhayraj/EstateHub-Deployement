
import { useEffect, useMemo, useState } from "react";
import {
  MessageSquare,
  RefreshCw,
  Search,
  CalendarDays,
  IndianRupee,
  Building2,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  UserRound,
  Clock3,
  ArrowRight,
  X,
  ShieldCheck,
} from "lucide-react";

import { getAllLeads, updateLeadStatus } from "../../api/leadApi";

const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "VISIT_SCHEDULED",
  "NEGOTIATION",
  "CLOSED",
  "REJECTED",
];

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({ status }) {
  const statusConfig = {
    NEW: {
      label: "New",
      className: "border-[#C8D8E7] bg-[#EEF4F9] text-[#42627C]",
      dot: "bg-[#527A98]",
    },
    CONTACTED: {
      label: "Contacted",
      className: "border-[#D8B876] bg-[#F7F0DE] text-[#8C6924]",
      dot: "bg-[#AD8332]",
    },
    VISIT_SCHEDULED: {
      label: "Visit Scheduled",
      className: "border-[#D3C8E5] bg-[#F2EEF8] text-[#66528A]",
      dot: "bg-[#76629C]",
    },
    NEGOTIATION: {
      label: "Negotiation",
      className: "border-[#E0C6A8] bg-[#F9F0E6] text-[#986638]",
      dot: "bg-[#B77B43]",
    },
    CLOSED: {
      label: "Closed",
      className: "border-[#BFD1C3] bg-[#EEF5EF] text-[#3F6B52]",
      dot: "bg-[#3F6B52]",
    },
    REJECTED: {
      label: "Rejected",
      className: "border-[#E2C4BF] bg-[#FAEFED] text-[#B3564B]",
      dot: "bg-[#B3564B]",
    },
  };

  const config = statusConfig[status] || {
    label: String(status || "UNKNOWN").replaceAll("_", " "),
    className: "border-[#DDD6C7] bg-[#F4F1EA] text-[#6B6252]",
    dot: "bg-[#8A806D]",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
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
  accent = "gold",
}) {
  const accents = {
    gold: {
      icon: "bg-[#F4EBD7] text-[#8C6924]",
      value: "text-[#201C15]",
    },
    amber: {
      icon: "bg-[#F7F0DE] text-[#8C6924]",
      value: "text-[#8C6924]",
    },
    orange: {
      icon: "bg-[#F9F0E6] text-[#986638]",
      value: "text-[#986638]",
    },
    green: {
      icon: "bg-[#EDF4EE] text-[#3F6B52]",
      value: "text-[#3F6B52]",
    },
  };

  const style = accents[accent] || accents.gold;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#DDD5C4] bg-[#FBF8F1] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#CDBB91] sm:p-5">
      <div className="absolute right-0 top-0 h-16 w-16 opacity-40">
        <div className="absolute right-3 top-3 h-7 w-7 border-r border-t border-[#D8CFB9]" />
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A806D]">
            {label}
          </p>

          <p
            className={`mt-2 text-2xl font-semibold tracking-[-0.03em] ${style.value}`}
            style={FRASER}
          >
            {value}
          </p>

          <p className="mt-1 truncate text-xs text-[#8A806D]">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
        >
          <Icon size={17} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// INFO BOX
// ==========================================

function InfoBox({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-[#E5DECF] bg-[#F7F4EC] p-3">
      <div className="flex items-center gap-1.5">
        {Icon && (
          <Icon
            size={12}
            className="shrink-0 text-[#9A907E]"
            strokeWidth={1.8}
          />
        )}

        <p className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A907E]">
          {label}
        </p>
      </div>

      <p className="mt-1.5 truncate text-sm font-semibold text-[#302B23]">
        {value}
      </p>
    </div>
  );
}

// ==========================================
// SECTION LABEL
// ==========================================

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A806D]">
      {children}
    </p>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

function LeadsManagement() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [remarks, setRemarks] = useState({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLeads = async (showFullLoader = true) => {
    try {
      showFullLoader ? setLoading(true) : setRefreshing(true);
      setError("");

      const data = await getAllLeads();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Leads error:", err);
      setError(
        err.response?.data?.message || "Failed to load leads."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    const value = search.toLowerCase().trim();

    return leads.filter((lead) => {
      const matchesSearch =
        !value ||
        [
          lead.id,
          lead.propertyTitle,
          lead.propertyId,
          lead.message,
        ].some((field) =>
          String(field || "")
            .toLowerCase()
            .includes(value)
        );

      const matchesStatus =
        statusFilter === "ALL" ||
        lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const handleStatusChange = async (leadId, status) => {
    try {
      setUpdatingId(leadId);
      setError("");
      setSuccess("");

      const updatedLead = await updateLeadStatus(leadId, {
        status,
        remarks: remarks[leadId] ?? "",
      });

      setLeads((prev) =>
        prev.map((lead) =>
          String(lead.id) === String(leadId)
            ? updatedLead
            : lead
        )
      );

      setSuccess(`Lead #${leadId} updated successfully.`);
    } catch (err) {
      console.error("Update lead error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update lead status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemarksChange = (leadId, value) => {
    setRemarks((prev) => ({
      ...prev,
      [leadId]: value,
    }));
  };

  const formatCurrency = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "₹0";
    }

    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Not specified";
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (l) => l.status === "NEW"
  ).length;

  const closedLeads = leads.filter(
    (l) => l.status === "CLOSED"
  ).length;

  const negotiationLeads = leads.filter(
    (l) => l.status === "NEGOTIATION"
  ).length;

  const activeFilter =
    search.trim() !== "" || statusFilter !== "ALL";

  return (
    <div className="min-h-full w-full">
      {/* ==========================================
          HERO HEADER
      ========================================== */}

      <section className="relative mb-6 overflow-hidden rounded-3xl border border-[#D9D0BE] bg-[#211E18] text-[#F7F1E5]">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />

        <div className="absolute right-0 top-0 h-32 w-32 border-b border-l border-[#8C6924]/40" />
        <div className="absolute bottom-0 left-0 h-20 w-20 border-r border-t border-[#8C6924]/40" />

        <div className="relative flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-7 bg-[#D8B876]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D8B876]">
                Brokerage operations
              </span>
            </div>

            <h1
              className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
              style={FRASER}
            >
              Leads Management
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#C9C1B2]">
              Manage buyer enquiries, follow their progress and keep
              every property conversation organized.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchLeads(false)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </section>

      {/* ==========================================
          ALERTS
      ========================================== */}

      {error && (
        <div
          className="mb-5 flex items-start gap-3 rounded-2xl border border-[#E2C4BF] bg-[#FAEFED] p-4 text-sm text-[#9E4B42]"
          role="alert"
        >
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0"
          />

          <div className="flex-1">{error}</div>

          <button
            type="button"
            onClick={() => setError("")}
            className="rounded-lg p-1 transition hover:bg-[#F3DDD9]"
            aria-label="Dismiss error"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {success && (
        <div
          className="mb-5 flex items-start gap-3 rounded-2xl border border-[#C3D5C7] bg-[#EEF5EF] p-4 text-sm text-[#3F6B52]"
          role="status"
        >
          <CheckCircle
            size={17}
            className="mt-0.5 shrink-0"
          />

          <div className="flex-1">{success}</div>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="rounded-lg p-1 transition hover:bg-[#DDEADF]"
            aria-label="Dismiss success"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ==========================================
          STATS
      ========================================== */}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total Leads"
          value={totalLeads}
          description="All enquiries"
          icon={MessageSquare}
        />

        <StatCard
          label="New Leads"
          value={newLeads}
          description="Needs attention"
          icon={MessageSquare}
          accent="amber"
        />

        <StatCard
          label="Negotiation"
          value={negotiationLeads}
          description="Active discussions"
          icon={UserRound}
          accent="orange"
        />

        <StatCard
          label="Closed Leads"
          value={closedLeads}
          description="Successfully closed"
          icon={CheckCircle}
          accent="green"
        />
      </div>

      {/* ==========================================
          SEARCH + FILTER
      ========================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-[#DDD5C4] bg-[#FBF8F1]">
        <div className="border-b border-[#E5DECF] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1E8D6] text-[#8C6924]">
              <Search size={16} />
            </div>

            <div>
              <SectionLabel>Lead directory</SectionLabel>

              <p className="mt-0.5 text-xs text-[#8A806D]">
                Search enquiries and filter by progress.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A907E]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search lead, property or message..."
                className="w-full rounded-xl border border-[#DCD4C3] bg-[#FDFBF6] py-3 pl-10 pr-4 text-sm text-[#302B23] outline-none transition placeholder:text-[#A69D8C] focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-[#DCD4C3] bg-[#FDFBF6] px-3.5 py-3 pr-10 text-sm text-[#302B23] outline-none transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10"
              >
                <option value="ALL">All Statuses</option>

                {LEAD_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9A907E]"
              />
            </div>
          </div>

          {!loading && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#E9E3D7] pt-3">
              <p className="text-xs text-[#8A806D]">
                Showing{" "}
                <span className="font-semibold text-[#302B23]">
                  {filteredLeads.length}
                </span>{" "}
                {filteredLeads.length === 1
                  ? "lead"
                  : "leads"}
              </p>

              {activeFilter && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6924] transition hover:text-[#6F531D]"
                >
                  <X size={13} />
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          CONTENT
      ========================================== */}

      {loading ? (
        <div className="flex min-h-72 items-center justify-center rounded-2xl border border-[#DDD5C4] bg-[#FBF8F1]">
          <div className="text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#DCD4C3] border-t-[#8C6924]" />

            <p className="mt-4 text-sm text-[#6B6252]">
              Loading leads...
            </p>
          </div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="relative flex min-h-72 flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#DDD5C4] bg-[#FBF8F1] p-8 text-center">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(#E8E0D0 1px, transparent 1px), linear-gradient(90deg, #E8E0D0 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D8CFB9] bg-[#F7F3E9] text-[#9A907E]">
            <MessageSquare
              size={25}
              strokeWidth={1.5}
            />
          </div>

          <h3
            className="relative mt-5 text-xl font-semibold text-[#302B23]"
            style={FRASER}
          >
            No leads found
          </h3>

          <p className="relative mt-2 max-w-sm text-sm leading-6 text-[#8A806D]">
            No leads match your current search or status
            filter.
          </p>

          {activeFilter && (
            <button
              type="button"
              onClick={clearFilters}
              className="relative mt-5 rounded-xl border border-[#D5CCBA] bg-[#FBF8F1] px-4 py-2.5 text-sm font-semibold text-[#4A4338] transition hover:border-[#AD8332] hover:text-[#8C6924]"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ==========================================
              DESKTOP TABLE
          ========================================== */}

          <div className="hidden overflow-hidden rounded-2xl border border-[#DDD5C4] bg-[#FBF8F1] lg:block">
            <div className="flex items-center justify-between border-b border-[#E4DCCB] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1E8D6] text-[#8C6924]">
                  <MessageSquare size={16} />
                </div>

                <div>
                  <SectionLabel>Enquiry register</SectionLabel>

                  <p className="mt-0.5 text-sm font-semibold text-[#302B23]">
                    Lead activity
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-[#DDD5C4] bg-[#F5F1E8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7E7463]">
                {filteredLeads.length} Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px]">
                <thead className="border-b border-[#E4DCCB] bg-[#F5F1E8]">
                  <tr>
                    {[
                      "Lead",
                      "Property",
                      "Budget",
                      "Visit Date",
                      "Message",
                      "Status",
                      "Remarks",
                      "Update",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A806D]"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EAE4D8]">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="transition hover:bg-[#F7F4EC]"
                    >
                      {/* LEAD */}

                      <td className="px-5 py-4 align-top">
                        <p className="font-semibold text-[#302B23]">
                          Lead #{lead.id}
                        </p>

                        <p className="mt-1 text-xs text-[#9A907E]">
                          {formatDate(lead.createdAt)}
                        </p>
                      </td>

                      {/* PROPERTY */}

                      <td className="max-w-[200px] px-5 py-4 align-top">
                        <p className="truncate text-sm font-semibold text-[#302B23]">
                          {lead.propertyTitle ||
                            "Property"}
                        </p>

                        <p className="mt-1 text-xs text-[#9A907E]">
                          Property #{lead.propertyId}
                        </p>
                      </td>

                      {/* BUDGET */}

                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-1 text-sm font-semibold text-[#403A30]">
                          <IndianRupee
                            size={13}
                            className="text-[#8C6924]"
                          />

                          {formatCurrency(lead.budget).replace(
                            "₹",
                            ""
                          )}
                        </div>
                      </td>

                      {/* VISIT DATE */}

                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-2 text-sm text-[#6B6252]">
                          <CalendarDays
                            size={14}
                            className="text-[#9A907E]"
                          />

                          {formatDate(
                            lead.preferredVisitDate
                          )}
                        </div>
                      </td>

                      {/* MESSAGE */}

                      <td className="max-w-[220px] px-5 py-4 align-top">
                        <p className="line-clamp-3 text-sm leading-5 text-[#6B6252]">
                          {lead.message || "—"}
                        </p>
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4 align-top">
                        <StatusBadge status={lead.status} />
                      </td>

                      {/* REMARKS */}

                      <td className="px-5 py-4 align-top">
                        <textarea
                          rows={2}
                          value={
                            remarks[lead.id] ??
                            lead.remarks ??
                            ""
                          }
                          onChange={(event) =>
                            handleRemarksChange(
                              lead.id,
                              event.target.value
                            )
                          }
                          placeholder="Add remarks..."
                          className="w-44 resize-y rounded-xl border border-[#DCD4C3] bg-[#FDFBF6] px-3 py-2 text-xs text-[#403A30] outline-none transition placeholder:text-[#A69D8C] focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10"
                        />
                      </td>

                      {/* UPDATE */}

                      <td className="px-5 py-4 align-top">
                        <div className="relative">
                          <select
                            value={
                              lead.status || "NEW"
                            }
                            onChange={(event) =>
                              handleStatusChange(
                                lead.id,
                                event.target.value
                              )
                            }
                            disabled={
                              updatingId === lead.id
                            }
                            className="w-40 appearance-none rounded-xl border border-[#DCD4C3] bg-[#FDFBF6] px-3 py-2 pr-8 text-xs font-medium text-[#403A30] outline-none transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10 disabled:opacity-50"
                          >
                            {LEAD_STATUSES.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status.replaceAll(
                                    "_",
                                    " "
                                  )}
                                </option>
                              )
                            )}
                          </select>

                          <ChevronDown
                            size={13}
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9A907E]"
                          />
                        </div>

                        {updatingId === lead.id && (
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-[#8C6924]">
                            <RefreshCw
                              size={11}
                              className="animate-spin"
                            />
                            Updating...
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ==========================================
              MOBILE / TABLET CARDS
          ========================================== */}

          <div className="grid gap-4 lg:hidden">
            {filteredLeads.map((lead) => {
              const isUpdating =
                updatingId === lead.id;

              return (
                <article
                  key={lead.id}
                  className="overflow-hidden rounded-2xl border border-[#DDD5C4] bg-[#FBF8F1]"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-[#E5DECF] p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1E8D6] text-[#8C6924]">
                          <MessageSquare size={14} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-[#302B23]">
                            Lead #{lead.id}
                          </p>

                          <p className="mt-0.5 max-w-[180px] truncate text-[11px] text-[#9A907E]">
                            {lead.propertyTitle ||
                              "Property"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <StatusBadge status={lead.status} />
                  </div>

                  <div className="p-4">
                    {/* PROPERTY INFO */}

                    <div className="rounded-xl border border-[#E5DECF] bg-[#F7F4EC] p-3.5">
                      <SectionLabel>Property</SectionLabel>

                      <p className="mt-1.5 text-sm font-semibold text-[#302B23]">
                        {lead.propertyTitle ||
                          "Property"}
                      </p>

                      <p className="mt-1 text-xs text-[#9A907E]">
                        Property #{lead.propertyId || "—"}
                      </p>
                    </div>

                    {/* INFO GRID */}

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <InfoBox
                        label="Property ID"
                        value={
                          lead.propertyId
                            ? `#${lead.propertyId}`
                            : "—"
                        }
                        icon={Building2}
                      />

                      <InfoBox
                        label="Budget"
                        value={formatCurrency(
                          lead.budget
                        )}
                        icon={IndianRupee}
                      />

                      <InfoBox
                        label="Visit Date"
                        value={formatDate(
                          lead.preferredVisitDate
                        )}
                        icon={CalendarDays}
                      />

                      <InfoBox
                        label="Created"
                        value={formatDate(
                          lead.createdAt
                        )}
                        icon={Clock3}
                      />
                    </div>

                    {/* MESSAGE */}

                    <div className="mt-3 rounded-xl border border-[#E5DECF] bg-[#F7F4EC] p-3.5">
                      <SectionLabel>Message</SectionLabel>

                      <p className="mt-1.5 text-sm leading-5 text-[#6B6252]">
                        {lead.message ||
                          "No message provided."}
                      </p>
                    </div>

                    {/* REMARKS */}

                    <div className="mt-4">
                      <label
                        htmlFor={`remarks-${lead.id}`}
                        className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8A806D]"
                      >
                        Remarks
                      </label>

                      <textarea
                        id={`remarks-${lead.id}`}
                        rows={3}
                        value={
                          remarks[lead.id] ??
                          lead.remarks ??
                          ""
                        }
                        onChange={(event) =>
                          handleRemarksChange(
                            lead.id,
                            event.target.value
                          )
                        }
                        placeholder="Add remarks..."
                        className="w-full resize-y rounded-xl border border-[#DCD4C3] bg-[#FDFBF6] px-3 py-2.5 text-sm text-[#403A30] outline-none transition placeholder:text-[#A69D8C] focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10"
                      />
                    </div>

                    {/* STATUS */}

                    <div className="mt-4 border-t border-[#E5DECF] pt-4">
                      <label
                        htmlFor={`status-${lead.id}`}
                        className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8A806D]"
                      >
                        Update Status
                      </label>

                      <div className="relative">
                        <select
                          id={`status-${lead.id}`}
                          value={
                            lead.status || "NEW"
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              lead.id,
                              event.target.value
                            )
                          }
                          disabled={isUpdating}
                          className="w-full appearance-none rounded-xl border border-[#DCD4C3] bg-[#FDFBF6] px-3 py-3 pr-10 text-sm font-medium text-[#403A30] outline-none transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10 disabled:opacity-50"
                        >
                          {LEAD_STATUSES.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status.replaceAll(
                                  "_",
                                  " "
                                )}
                              </option>
                            )
                          )}
                        </select>

                        <ChevronDown
                          size={15}
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9A907E]"
                        />
                      </div>

                      {isUpdating && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#8C6924]">
                          <RefreshCw
                            size={12}
                            className="animate-spin"
                          />
                          Updating lead...
                        </div>
                      )}
                    </div>

                    {/* PROPERTY LINK */}

                    {lead.propertyId && (
                      <a
                        href={`/properties/${lead.propertyId}`}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D8CFBF] bg-[#F7F4EC] px-4 py-3 text-sm font-semibold text-[#514A3F] transition hover:border-[#AD8332] hover:text-[#8C6924]"
                      >
                        View Property
                        <ArrowRight size={14} />
                      </a>
                    )}

                    {/* PRIVACY NOTE */}

                    <div className="mt-4 flex items-center gap-2 border-t border-[#E5DECF] pt-3 text-[10px] text-[#9A907E]">
                      <ShieldCheck
                        size={13}
                        className="text-[#8C6924]"
                      />
                      Lead contact information is managed
                      through the admin workflow.
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default LeadsManagement;
