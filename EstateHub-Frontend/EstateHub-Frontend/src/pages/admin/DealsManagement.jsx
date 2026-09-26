
import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  IndianRupee,
  Plus,
  X,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  Receipt,
} from "lucide-react";

import { getAllDeals, updateDealStatus } from "../../api/dealApi";
import { getAllLeads } from "../../api/leadApi";
import api from "../../api/axios";

const DEAL_STATUSES = ["PENDING", "COMPLETED", "CANCELLED"];

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({ status }) {
  const statusConfig = {
    PENDING: {
      label: "Pending",
      className: "border-[#D8B876] bg-[#F7F0DE] text-[#8C6924]",
      dot: "bg-[#AD8332]",
    },
    COMPLETED: {
      label: "Completed",
      className: "border-[#BFD1C3] bg-[#EEF5EF] text-[#3F6B52]",
      dot: "bg-[#3F6B52]",
    },
    CANCELLED: {
      label: "Cancelled",
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
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${config.className}`}
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
    green: {
      icon: "bg-[#EDF4EE] text-[#3F6B52]",
      value: "text-[#3F6B52]",
    },
    red: {
      icon: "bg-[#FAEFED] text-[#B3564B]",
      value: "text-[#B3564B]",
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A806D]">
            {label}
          </p>

          <p
            className={`mt-2 text-2xl font-semibold tracking-[-0.03em] ${style.value}`}
            style={FRASER}
          >
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-[#8A806D]">{description}</p>
          )}
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
          <Icon size={12} className="shrink-0 text-[#9A907E]" strokeWidth={1.8} />
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

function DealsManagement() {
  const [deals, setDeals] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [closedLeads, setClosedLeads] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    leadId: "",
    dealAmount: "",
    commissionPercentage: "2",
  });

  const fetchDeals = async (showFullLoader = true) => {
    try {
      showFullLoader ? setLoading(true) : setRefreshing(true);
      setError("");

      const data = await getAllDeals();
      setDeals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Deals error:", err);
      setError(err.response?.data?.message || "Failed to load deals.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const filteredDeals = useMemo(() => {
    const value = search.toLowerCase().trim();

    return deals.filter((deal) => {
      const matchesSearch =
        !value ||
        [deal.propertyTitle, deal.id, deal.leadId, deal.propertyId].some(
          (field) =>
            String(field || "")
              .toLowerCase()
              .includes(value)
        );

      const matchesStatus =
        statusFilter === "ALL" || deal.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [deals, search, statusFilter]);

  const fetchClosedLeads = async () => {
    try {
      setLeadsLoading(true);
      setError("");

      const data = await getAllLeads();
      const leads = Array.isArray(data) ? data : [];
      const closed = leads.filter((lead) => lead.status === "CLOSED");

      const existingLeadIds = new Set(
        deals.map((deal) => String(deal.leadId))
      );

      const availableClosedLeads = closed.filter(
        (lead) => !existingLeadIds.has(String(lead.id))
      );

      setClosedLeads(availableClosedLeads);
    } catch (err) {
      console.error("Closed leads error:", err);
      setError(
        err.response?.data?.message || "Failed to load closed leads."
      );
    } finally {
      setLeadsLoading(false);
    }
  };

  const openCreateModal = async () => {
    setError("");
    setSuccess("");

    setFormData({
      leadId: "",
      dealAmount: "",
      commissionPercentage: "2",
    });

    setShowCreateModal(true);
    await fetchClosedLeads();
  };

  const closeCreateModal = () => {
    if (createLoading) return;

    setShowCreateModal(false);

    setFormData({
      leadId: "",
      dealAmount: "",
      commissionPercentage: "2",
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleCreateDeal = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.leadId) {
      return setError("Please select a closed lead.");
    }

    if (
      !formData.dealAmount ||
      Number(formData.dealAmount) <= 0
    ) {
      return setError("Deal amount must be greater than 0.");
    }

    if (
      !formData.commissionPercentage ||
      Number(formData.commissionPercentage) <= 0
    ) {
      return setError("Commission percentage must be greater than 0.");
    }

    if (Number(formData.commissionPercentage) > 100) {
      return setError("Commission percentage cannot exceed 100.");
    }

    try {
      setCreateLoading(true);

      const payload = {
        leadId: Number(formData.leadId),
        dealAmount: Number(formData.dealAmount),
        commissionPercentage: Number(formData.commissionPercentage),
      };

      const response = await api.post("/deals", payload);
      const createdDeal = response.data;

      setDeals((prev) => [createdDeal, ...prev]);

      setSuccess("Deal created successfully.");
      closeCreateModal();
    } catch (err) {
      console.error("Create deal error:", err);
      setError(
        err.response?.data?.message || "Failed to create deal."
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const handleStatusChange = async (dealId, status) => {
    try {
      setActionLoading(dealId);
      setError("");
      setSuccess("");

      const updatedDeal = await updateDealStatus(dealId, status);

      setDeals((prev) =>
        prev.map((deal) =>
          String(deal.id) === String(dealId)
            ? updatedDeal
            : deal
        )
      );

      setSuccess("Deal status updated successfully.");
    } catch (err) {
      console.error("Update deal status error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update deal status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") {
      return "₹0";
    }

    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const commissionPreview = useMemo(() => {
    const amount = Number(formData.dealAmount);
    const percentage = Number(formData.commissionPercentage);

    if (!amount || !percentage) return 0;

    return (amount * percentage) / 100;
  }, [formData.dealAmount, formData.commissionPercentage]);

  const totalDeals = deals.length;
  const pendingDeals = deals.filter(
    (d) => d.status === "PENDING"
  ).length;
  const completedDeals = deals.filter(
    (d) => d.status === "COMPLETED"
  ).length;
  const cancelledDeals = deals.filter(
    (d) => d.status === "CANCELLED"
  ).length;

  const totalDealValue = deals.reduce(
    (total, deal) => total + Number(deal.dealAmount || 0),
    0
  );

  const activeFilter =
    search.trim() !== "" || statusFilter !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

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
              Deals Management
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#C9C1B2]">
              Monitor closed business, transaction values, commissions and
              deal status from one workspace.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D8B876] px-4 py-3 text-sm font-semibold text-[#211E18] transition hover:bg-[#E4C98F]"
            >
              <Plus size={16} />
              Create Deal
            </button>

            <button
              type="button"
              onClick={() => fetchDeals(false)}
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
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <div className="flex-1">{error}</div>

          <button
            type="button"
            onClick={() => setError("")}
            className="rounded-lg p-1 hover:bg-[#F3DDD9]"
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
          <CheckCircle size={17} className="mt-0.5 shrink-0" />
          <div className="flex-1">{success}</div>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="rounded-lg p-1 hover:bg-[#DDEADF]"
            aria-label="Dismiss success"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ==========================================
          STATS
      ========================================== */}

      <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-5">
        <StatCard
          label="Total Deals"
          value={totalDeals}
          description="All recorded deals"
          icon={BriefcaseBusiness}
        />

        <StatCard
          label="Pending"
          value={pendingDeals}
          description="Currently in progress"
          icon={Clock}
          accent="amber"
        />

        <StatCard
          label="Completed"
          value={completedDeals}
          description="Successful transactions"
          icon={CheckCircle}
          accent="green"
        />

        <StatCard
          label="Cancelled"
          value={cancelledDeals}
          description="Cancelled transactions"
          icon={XCircle}
          accent="red"
        />

        <StatCard
          label="Deal Value"
          value={formatCurrency(totalDealValue)}
          description="Total transaction value"
          icon={IndianRupee}
        />
      </div>

      {/* ==========================================
          SEARCH + FILTER
      ========================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-[#DDD5C4] bg-[#FBF8F1]">
        <div className="border-b border-[#E5DECF] px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1E8D6] text-[#8C6924]">
              <Search size={15} />
            </div>

            <div>
              <SectionLabel>Deal directory</SectionLabel>
              <p className="mt-0.5 text-xs text-[#8A806D]">
                Search and filter transactions.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_210px]">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A907E]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search property, deal ID, lead ID..."
                className="w-full rounded-xl border border-[#DCD4C3] bg-[#FDFBF6] py-3 pl-10 pr-4 text-sm text-[#302B23] outline-none transition placeholder:text-[#A69D8C] focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="w-full rounded-xl border border-[#DCD4C3] bg-[#FDFBF6] px-3 py-3 text-sm text-[#302B23] outline-none transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10"
            >
              <option value="ALL">All Statuses</option>

              {DEAL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {!loading && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#E9E3D7] pt-3">
              <p className="text-xs text-[#8A806D]">
                Showing{" "}
                <span className="font-semibold text-[#302B23]">
                  {filteredDeals.length}
                </span>{" "}
                {filteredDeals.length === 1 ? "deal" : "deals"}
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
              Loading deals...
            </p>
          </div>
        </div>
      ) : filteredDeals.length === 0 ? (
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
            <BriefcaseBusiness size={25} strokeWidth={1.5} />
          </div>

          <h3
            className="relative mt-5 text-xl font-semibold text-[#302B23]"
            style={FRASER}
          >
            No deals found
          </h3>

          <p className="relative mt-2 max-w-sm text-sm leading-6 text-[#8A806D]">
            No deals match your current search or status filter.
          </p>

          {activeFilter ? (
            <button
              type="button"
              onClick={clearFilters}
              className="relative mt-5 rounded-xl border border-[#D5CCBA] bg-[#FBF8F1] px-4 py-2.5 text-sm font-semibold text-[#4A4338] transition hover:border-[#AD8332] hover:text-[#8C6924]"
            >
              Clear Filters
            </button>
          ) : (
            <button
              type="button"
              onClick={openCreateModal}
              className="relative mt-5 inline-flex items-center gap-2 rounded-xl bg-[#211E18] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#302B23]"
            >
              <Plus size={15} />
              Create Deal
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
                  <Receipt size={16} />
                </div>

                <div>
                  <SectionLabel>Transaction register</SectionLabel>
                  <p className="mt-0.5 text-sm font-semibold text-[#302B23]">
                    Deal activity
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-[#DDD5C4] bg-[#F5F1E8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7E7463]">
                {filteredDeals.length} Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead className="border-b border-[#E4DCCB] bg-[#F5F1E8]">
                  <tr>
                    {[
                      "Deal",
                      "Property",
                      "Deal Amount",
                      "Commission",
                      "Commission Amount",
                      "Status",
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
                  {filteredDeals.map((deal) => {
                    const isUpdating =
                      actionLoading === deal.id;

                    return (
                      <tr
                        key={deal.id}
                        className="transition hover:bg-[#F7F4EC]"
                      >
                        <td className="px-5 py-4 align-top">
                          <p className="font-semibold text-[#302B23]">
                            Deal #{deal.id}
                          </p>

                          <p className="mt-1 text-xs text-[#9A907E]">
                            Lead #{deal.leadId || "—"}
                          </p>
                        </td>

                        <td className="max-w-[220px] px-5 py-4 align-top">
                          <p className="truncate text-sm font-medium text-[#403A30]">
                            {deal.propertyTitle ||
                              `Property #${deal.propertyId}`}
                          </p>

                          <p className="mt-1 text-[11px] text-[#9A907E]">
                            Property #{deal.propertyId || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4 align-top">
                          <p className="text-sm font-semibold text-[#302B23]">
                            {formatCurrency(deal.dealAmount)}
                          </p>
                        </td>

                        <td className="px-5 py-4 align-top">
                          <span className="inline-flex rounded-lg border border-[#DDD5C4] bg-[#F5F1E8] px-2.5 py-1.5 text-xs font-semibold text-[#5D5548]">
                            {deal.commissionPercentage}%
                          </span>
                        </td>

                        <td className="px-5 py-4 align-top">
                          <p className="text-sm font-semibold text-[#3F6B52]">
                            {formatCurrency(
                              deal.commissionAmount
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-4 align-top">
                          <StatusBadge status={deal.status} />
                        </td>

                        <td className="px-5 py-4 align-top">
                          <select
                            value={deal.status || "PENDING"}
                            disabled={isUpdating}
                            onChange={(event) =>
                              handleStatusChange(
                                deal.id,
                                event.target.value
                              )
                            }
                            className="w-36 rounded-xl border border-[#DCD4C3] bg-[#FDFBF6] px-3 py-2 text-xs font-medium text-[#403A30] outline-none transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10 disabled:opacity-50"
                          >
                            {DEAL_STATUSES.map((status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            ))}
                          </select>

                          {isUpdating && (
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ==========================================
              MOBILE / TABLET CARDS
          ========================================== */}

          <div className="grid gap-4 lg:hidden">
            {filteredDeals.map((deal) => {
              const isUpdating =
                actionLoading === deal.id;

              return (
                <article
                  key={deal.id}
                  className="overflow-hidden rounded-2xl border border-[#DDD5C4] bg-[#FBF8F1]"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-[#E5DECF] p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1E8D6] text-[#8C6924]">
                          <BriefcaseBusiness size={14} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-[#302B23]">
                            Deal #{deal.id}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#9A907E]">
                            Lead #{deal.leadId || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <StatusBadge status={deal.status} />
                  </div>

                  <div className="p-4">
                    <div className="rounded-xl border border-[#E5DECF] bg-[#F7F4EC] p-3.5">
                      <SectionLabel>Property</SectionLabel>

                      <p className="mt-1.5 text-sm font-semibold text-[#302B23]">
                        {deal.propertyTitle ||
                          `Property #${deal.propertyId}`}
                      </p>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <InfoBox
                        label="Deal Amount"
                        value={formatCurrency(
                          deal.dealAmount
                        )}
                        icon={IndianRupee}
                      />

                      <InfoBox
                        label="Commission"
                        value={`${deal.commissionPercentage ?? 0}%`}
                        icon={BriefcaseBusiness}
                      />

                      <InfoBox
                        label="Commission Amount"
                        value={formatCurrency(
                          deal.commissionAmount
                        )}
                        icon={IndianRupee}
                      />

                      <InfoBox
                        label="Lead"
                        value={
                          deal.leadId
                            ? `#${deal.leadId}`
                            : "—"
                        }
                        icon={BriefcaseBusiness}
                      />
                    </div>

                    <div className="mt-4 border-t border-[#E5DECF] pt-4">
                      <label
                        htmlFor={`deal-status-${deal.id}`}
                        className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8A806D]"
                      >
                        Update Status
                      </label>

                      <select
                        id={`deal-status-${deal.id}`}
                        value={deal.status || "PENDING"}
                        disabled={isUpdating}
                        onChange={(event) =>
                          handleStatusChange(
                            deal.id,
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-[#DCD4C3] bg-[#FDFBF6] px-3 py-3 text-sm font-medium text-[#403A30] outline-none transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10 disabled:opacity-50"
                      >
                        {DEAL_STATUSES.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>

                      {isUpdating && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#8C6924]">
                          <RefreshCw
                            size={12}
                            className="animate-spin"
                          />
                          Updating deal...
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* ==========================================
          CREATE DEAL MODAL
      ========================================== */}

      {showCreateModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17140F]/70 p-4 backdrop-blur-sm"
          onClick={closeCreateModal}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#D8CFB9] bg-[#FBF8F1] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="relative overflow-hidden border-b border-[#E2DAC9] bg-[#211E18] px-5 py-5 text-[#F7F1E5] sm:px-6">
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-px w-5 bg-[#D8B876]" />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#D8B876]">
                      New transaction
                    </span>
                  </div>

                  <h2
                    className="text-2xl font-semibold"
                    style={FRASER}
                  >
                    Create Deal
                  </h2>

                  <p className="mt-1.5 text-sm text-[#BFB7A8]">
                    Create a deal from a closed lead.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={createLoading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-[#C8C0B2] transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* MODAL BODY */}

            <form
              onSubmit={handleCreateDeal}
              className="p-5 sm:p-6"
            >
              <div className="space-y-5">
                {/* CLOSED LEAD */}

                <div>
                  <label
                    htmlFor="closed-lead"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#716857]"
                  >
                    Closed Lead
                  </label>

                  {leadsLoading ? (
                    <div className="flex items-center gap-2 rounded-xl border border-[#DDD5C4] bg-[#F5F1E8] px-4 py-3 text-sm text-[#7E7463]">
                      <RefreshCw
                        size={14}
                        className="animate-spin text-[#8C6924]"
                      />
                      Loading closed leads...
                    </div>
                  ) : closedLeads.length === 0 ? (
                    <div className="rounded-xl border border-[#E2D09D] bg-[#F9F2DE] p-4">
                      <div className="flex gap-3">
                        <AlertCircle
                          size={17}
                          className="mt-0.5 shrink-0 text-[#8C6924]"
                        />

                        <div>
                          <p className="text-sm font-semibold text-[#6F531D]">
                            No available closed leads
                          </p>

                          <p className="mt-1 text-xs leading-5 text-[#8C6924]">
                            Only CLOSED leads without an existing
                            deal can be selected.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <select
                      id="closed-lead"
                      name="leadId"
                      value={formData.leadId}
                      onChange={handleFormChange}
                      disabled={createLoading}
                      className="w-full rounded-xl border border-[#DCD4C3] bg-[#FDFBF6] px-3.5 py-3 text-sm text-[#302B23] outline-none transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10 disabled:bg-[#F1EEE6]"
                    >
                      <option value="">
                        Select closed lead
                      </option>

                      {closedLeads.map((lead) => (
                        <option key={lead.id} value={lead.id}>
                          Lead #{lead.id}
                          {lead.propertyTitle
                            ? ` - ${lead.propertyTitle}`
                            : lead.property?.title
                              ? ` - ${lead.property.title}`
                              : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* DEAL AMOUNT */}

                <div>
                  <label
                    htmlFor="deal-amount"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#716857]"
                  >
                    Deal Amount
                  </label>

                  <div className="relative">
                    <IndianRupee
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A907E]"
                    />

                    <input
                      id="deal-amount"
                      type="number"
                      name="dealAmount"
                      value={formData.dealAmount}
                      onChange={handleFormChange}
                      min="1"
                      step="0.01"
                      inputMode="decimal"
                      placeholder="e.g. 10000000"
                      disabled={createLoading}
                      className="w-full rounded-xl border border-[#DCD4C3] bg-[#FDFBF6] py-3 pl-10 pr-3 text-sm text-[#302B23] outline-none transition placeholder:text-[#A69D8C] focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10 disabled:bg-[#F1EEE6]"
                    />
                  </div>
                </div>

                {/* COMMISSION */}

                <div>
                  <label
                    htmlFor="commission-percentage"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#716857]"
                  >
                    Commission Percentage
                  </label>

                  <div className="relative">
                    <input
                      id="commission-percentage"
                      type="number"
                      name="commissionPercentage"
                      value={formData.commissionPercentage}
                      onChange={handleFormChange}
                      min="0.01"
                      max="100"
                      step="0.01"
                      inputMode="decimal"
                      placeholder="e.g. 2"
                      disabled={createLoading}
                      className="w-full rounded-xl border border-[#DCD4C3] bg-[#FDFBF6] py-3 pl-3.5 pr-10 text-sm text-[#302B23] outline-none transition placeholder:text-[#A69D8C] focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10 disabled:bg-[#F1EEE6]"
                    />

                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#8A806D]">
                      %
                    </span>
                  </div>
                </div>

                {/* PREVIEW */}

                <div className="overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#F3EBDD]">
                  <div className="flex items-center justify-between gap-4 p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck
                          size={15}
                          className="text-[#8C6924]"
                        />

                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#716857]">
                          Commission Preview
                        </p>
                      </div>

                      <p className="mt-1.5 text-xs text-[#8A806D]">
                        Based on entered deal amount.
                      </p>
                    </div>

                    <p
                      className="text-xl font-semibold text-[#3F6B52]"
                      style={FRASER}
                    >
                      {formatCurrency(commissionPreview)}
                    </p>
                  </div>

                  <div className="border-t border-[#D8CFB9] px-4 py-2.5">
                    <p className="text-[10px] text-[#8A806D]">
                      {formData.commissionPercentage || 0}% of{" "}
                      {formatCurrency(formData.dealAmount || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* MODAL ACTIONS */}

              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={createLoading}
                  className="rounded-xl border border-[#D8CFBF] bg-[#F7F4EC] px-4 py-3 text-sm font-semibold text-[#514A3F] transition hover:border-[#BEB29D] hover:bg-[#F1EDE3] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    createLoading || closedLeads.length === 0
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#211E18] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#302B23] disabled:opacity-50"
                >
                  {createLoading ? (
                    <>
                      <RefreshCw
                        size={15}
                        className="animate-spin"
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={15} />
                      Create Deal
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DealsManagement;

