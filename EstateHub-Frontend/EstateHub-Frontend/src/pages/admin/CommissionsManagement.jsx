
import { useEffect, useMemo, useState } from "react";
import {
  IndianRupee,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  Receipt,
  AlertCircle,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

import {
  getAllCommissions,
  updatePaymentStatus,
} from "../../api/commissionApi";

const PAYMENT_STATUSES = ["PENDING", "PAID"];

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

// ==========================================
// STATUS BADGE
// ==========================================

function PaymentStatusBadge({ status }) {
  const statusClasses = {
    PENDING: "border-[#E7D3A8] bg-[#F8EED7] text-[#A87519]",
    PAID: "border-[#C9DCCF] bg-[#E8F0EA] text-[#3F6B52]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
        statusClasses[status] ||
        "border-[#DED6C5] bg-[#F2ECDF] text-[#6B6252]"
      }`}
    >
      {status === "PAID" ? (
        <CheckCircle size={12} />
      ) : (
        <Clock size={12} />
      )}

      {status || "UNKNOWN"}
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
  iconClass,
  valueClass = "text-[#201C15]",
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#DED6C5] bg-[#FBF8F1] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#CDBF9F] hover:shadow-[0_18px_45px_rgba(32,28,21,0.08)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.15em] text-[#928975] sm:text-xs">
            {label}
          </p>

          <p
            className={`mt-1 text-xl font-semibold tracking-tight sm:text-2xl ${valueClass}`}
          >
            {value}
          </p>

          {description && (
            <p className="mt-1 truncate text-xs text-[#938B7A]">
              {description}
            </p>
          )}
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={17} strokeWidth={1.8} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#AD8332] transition-all duration-300 group-hover:w-full" />
    </div>
  );
}

// ==========================================
// INFO BOX
// ==========================================

function InfoBox({
  label,
  value,
  icon: Icon,
  valueClass = "text-[#201C15]",
}) {
  return (
    <div className="rounded-xl border border-[#E4DCC9] bg-[#F8F5ED] p-3">
      <div className="flex items-center gap-1.5">
        {Icon && (
          <Icon
            size={13}
            className="shrink-0 text-[#938B7A]"
          />
        )}

        <p className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-[#938B7A]">
          {label}
        </p>
      </div>

      <p
        className={`mt-1 truncate text-sm font-semibold ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

function CommissionsManagement() {
  const [commissions, setCommissions] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH COMMISSIONS
  // ==========================================

  const fetchCommissions = async (showFullLoader = true) => {
    try {
      showFullLoader
        ? setLoading(true)
        : setRefreshing(true);

      setError("");

      const data = await getAllCommissions();

      setCommissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Commission error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load commissions."
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
    fetchCommissions();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredCommissions = useMemo(() => {
    const value = search.toLowerCase().trim();

    return commissions.filter((commission) => {
      const matchesSearch =
        !value ||
        [
          commission.propertyTitle,
          commission.id,
          commission.dealId,
          commission.leadId,
          commission.propertyId,
        ].some((field) =>
          String(field || "")
            .toLowerCase()
            .includes(value)
        );

      const matchesPayment =
        paymentFilter === "ALL" ||
        commission.paymentStatus === paymentFilter;

      return matchesSearch && matchesPayment;
    });
  }, [commissions, search, paymentFilter]);

  // ==========================================
  // UPDATE PAYMENT STATUS
  // ==========================================

  const handlePaymentStatusChange = async (
    commissionId,
    paymentStatus
  ) => {
    try {
      setActionLoading(commissionId);
      setError("");
      setSuccess("");

      const updatedCommission =
        await updatePaymentStatus(
          commissionId,
          paymentStatus
        );

      setCommissions((prev) =>
        prev.map((commission) =>
          String(commission.id) ===
          String(commissionId)
            ? updatedCommission
            : commission
        )
      );

      setSuccess(
        `Commission #${commissionId} updated successfully.`
      );
    } catch (err) {
      console.error(
        "Update payment status error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update payment status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // CURRENCY
  // ==========================================

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

  // ==========================================
  // STATS
  // ==========================================

  const totalRecords = commissions.length;

  const pendingRecords = commissions.filter(
    (c) => c.paymentStatus === "PENDING"
  ).length;

  const paidRecords = commissions.filter(
    (c) => c.paymentStatus === "PAID"
  ).length;

  const totalCommission = commissions.reduce(
    (total, c) =>
      total + Number(c.commissionAmount || 0),
    0
  );

  const pendingCommission = commissions
    .filter((c) => c.paymentStatus === "PENDING")
    .reduce(
      (total, c) =>
        total + Number(c.commissionAmount || 0),
      0
    );

  const paidCommission = commissions
    .filter((c) => c.paymentStatus === "PAID")
    .reduce(
      (total, c) =>
        total + Number(c.commissionAmount || 0),
      0
    );

  const activeFilter =
    search.trim() !== "" ||
    paymentFilter !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setPaymentFilter("ALL");
  };

  return (
    <div className="w-full">

      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="relative mb-7 overflow-hidden rounded-[26px] bg-[#201C15] shadow-[0_18px_50px_rgba(32,28,21,0.12)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
        </div>

        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-[#D8B876]/10" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#AD8332] text-white shadow-lg shadow-black/20">
                <IndianRupee
                  size={22}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                  <ShieldCheck
                    size={12}
                    className="text-[#D8B876]"
                  />
                  Finance & Payments
                </div>

                <h1
                  className="text-3xl font-medium tracking-tight text-[#FBF8F1] sm:text-4xl"
                  style={FRASER}
                >
                  Commission Management
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
                  Track commission earnings, payment status,
                  and recorded business transactions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fetchCommissions(false)}
              disabled={loading || refreshing}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#FBF8F1] px-5 py-3 text-sm font-semibold text-[#201C15] shadow-lg transition hover:bg-[#F2ECDF] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
            >
              <RefreshCw
                size={15}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh data"}
            </button>
          </div>

          <div className="relative mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D8B876]" />
              Commission records
            </span>

            <span>Payment tracking</span>

            <span className="hidden sm:inline">
              EstateHub administration
            </span>
          </div>
        </div>
      </section>

      {/* ==========================================
          ALERTS
      ========================================== */}

      {error && (
        <div
          className="mb-4 flex items-start gap-3 rounded-2xl border border-[#E3C9C3] bg-[#F6E9E5] p-4 text-sm text-[#B3564B]"
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
          className="mb-4 flex items-start gap-3 rounded-2xl border border-[#C9DCCF] bg-[#E8F0EA] p-4 text-sm text-[#3F6B52]"
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

      <section className="mb-8">
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AD8332]">
            Overview
          </p>

          <h2
            className="mt-1 text-2xl font-medium text-[#201C15]"
            style={FRASER}
          >
            Commission Snapshot
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Total Records"
            value={totalRecords}
            description={`${pendingRecords} pending · ${paidRecords} paid`}
            icon={Receipt}
            iconClass="bg-[#E9EEF5] text-[#526B8C]"
          />

          <StatCard
            label="Total Commission"
            value={formatCurrency(totalCommission)}
            description="All commission earnings"
            icon={IndianRupee}
            valueClass="text-[#725B82]"
            iconClass="bg-[#EEE8F3] text-[#725B82]"
          />

          <StatCard
            label="Pending Amount"
            value={formatCurrency(pendingCommission)}
            description="Awaiting payment"
            icon={Clock}
            valueClass="text-[#A87519]"
            iconClass="bg-[#F8EED7] text-[#A87519]"
          />

          <StatCard
            label="Paid Amount"
            value={formatCurrency(paidCommission)}
            description="Payment received"
            icon={CheckCircle}
            valueClass="text-[#3F6B52]"
            iconClass="bg-[#E8F0EA] text-[#3F6B52]"
          />
        </div>
      </section>

      {/* ==========================================
          SEARCH + FILTER
      ========================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-[#DED6C5] bg-[#FBF8F1]">
        <div className="border-b border-[#E4DCC9] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2ECDF] text-[#8C6924]">
              <Search size={16} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#AD8332]">
                Records
              </p>

              <h2
                className="text-lg font-medium text-[#201C15]"
                style={FRASER}
              >
                Search & Filter
              </h2>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_210px]">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#938B7A]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search property, commission ID, deal ID..."
                className="w-full rounded-xl border border-[#D8CFB9] bg-[#F8F5ED] py-2.5 pl-9 pr-4 text-sm text-[#201C15] outline-none transition placeholder:text-[#A49B89] focus:border-[#AD8332] focus:bg-[#FBF8F1] focus:ring-2 focus:ring-[#AD8332]/10"
              />
            </div>

            <select
              value={paymentFilter}
              onChange={(event) =>
                setPaymentFilter(event.target.value)
              }
              className="w-full rounded-xl border border-[#D8CFB9] bg-[#F8F5ED] px-3 py-2.5 text-sm text-[#201C15] outline-none transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10"
            >
              <option value="ALL">
                All Payment Statuses
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="PAID">
                Paid
              </option>
            </select>
          </div>

          {!loading && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#938B7A]">
              <span>
                {filteredCommissions.length}{" "}
                {filteredCommissions.length === 1
                  ? "record"
                  : "records"}{" "}
                found
              </span>

              {activeFilter && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-semibold text-[#8C6924] transition hover:text-[#AD8332]"
                >
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
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[#DED6C5] bg-[#FBF8F1]">
          <div className="text-center">
            <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#DED6C5] bg-[#F8F5ED]">
              <RefreshCw
                size={19}
                className="animate-spin text-[#AD8332]"
              />
            </div>

            <p
              className="mt-4 text-lg font-medium text-[#201C15]"
              style={FRASER}
            >
              Loading commissions
            </p>

            <p className="mt-1 text-xs text-[#938B7A]">
              Fetching the latest payment records.
            </p>
          </div>
        </div>
      ) : filteredCommissions.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-[#DED6C5] bg-[#FBF8F1] p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2ECDF] text-[#AD8332]">
            <Receipt size={27} strokeWidth={1.7} />
          </div>

          <h3
            className="mt-4 text-xl font-medium text-[#201C15]"
            style={FRASER}
          >
            No commissions found
          </h3>

          <p className="mt-1 max-w-md text-sm text-[#766E5E]">
            No commission records match your current
            search or payment filter.
          </p>

          {activeFilter && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl border border-[#D8CFB9] bg-[#F8F5ED] px-4 py-2.5 text-sm font-semibold text-[#201C15] transition hover:border-[#AD8332] hover:bg-[#F2ECDF]"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ==========================================
              DESKTOP TABLE
          ========================================== */}

          <div className="hidden overflow-hidden rounded-2xl border border-[#DED6C5] bg-[#FBF8F1] lg:block">
            <div className="flex items-center justify-between border-b border-[#E4DCC9] px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#AD8332]">
                  Commission Ledger
                </p>

                <h2
                  className="mt-0.5 text-xl font-medium text-[#201C15]"
                  style={FRASER}
                >
                  Payment Records
                </h2>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#938B7A]">
                <ShieldCheck
                  size={14}
                  className="text-[#3F6B52]"
                />
                {filteredCommissions.length} records
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="border-b border-[#E4DCC9] bg-[#F2ECDF]">
                  <tr>
                    {[
                      "Commission",
                      "Deal",
                      "Property",
                      "Deal Amount",
                      "Commission %",
                      "Commission Amount",
                      "Payment",
                      "Update",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.1em] text-[#766E5E]"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E8E1D2]">
                  {filteredCommissions.map(
                    (commission) => {
                      const isUpdating =
                        actionLoading === commission.id;

                      return (
                        <tr
                          key={commission.id}
                          className="transition hover:bg-[#F8F5ED]"
                        >
                          <td className="px-4 py-4 align-top">
                            <p className="font-semibold text-[#201C15]">
                              #{commission.id}
                            </p>

                            <p className="mt-0.5 text-xs text-[#938B7A]">
                              Lead #
                              {commission.leadId || "—"}
                            </p>
                          </td>

                          <td className="px-4 py-4 align-top text-sm">
                            <p className="font-medium text-[#403A30]">
                              Deal #
                              {commission.dealId || "—"}
                            </p>

                            <p className="mt-0.5 text-xs text-[#938B7A]">
                              Property #
                              {commission.propertyId ||
                                "—"}
                            </p>
                          </td>

                          <td className="max-w-[200px] px-4 py-4 align-top">
                            <p className="truncate text-sm font-medium text-[#403A30]">
                              {commission.propertyTitle ||
                                `Property #${commission.propertyId}`}
                            </p>
                          </td>

                          <td className="px-4 py-4 align-top text-sm font-semibold text-[#201C15]">
                            {formatCurrency(
                              commission.dealAmount
                            )}
                          </td>

                          <td className="px-4 py-4 align-top">
                            <span className="rounded-lg border border-[#E4DCC9] bg-[#F8F5ED] px-2 py-1 text-xs font-semibold text-[#6B6252]">
                              {commission.commissionPercentage ??
                                0}
                              %
                            </span>
                          </td>

                          <td className="px-4 py-4 align-top text-sm font-semibold text-[#3F6B52]">
                            {formatCurrency(
                              commission.commissionAmount
                            )}
                          </td>

                          <td className="px-4 py-4 align-top">
                            <PaymentStatusBadge
                              status={
                                commission.paymentStatus
                              }
                            />
                          </td>

                          <td className="px-4 py-4 align-top">
                            <select
                              value={
                                commission.paymentStatus ||
                                "PENDING"
                              }
                              disabled={isUpdating}
                              onChange={(event) =>
                                handlePaymentStatusChange(
                                  commission.id,
                                  event.target.value
                                )
                              }
                              className="w-28 rounded-xl border border-[#D8CFB9] bg-[#F8F5ED] px-2 py-1.5 text-xs font-semibold text-[#403A30] outline-none transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10 disabled:opacity-50"
                            >
                              {PAYMENT_STATUSES.map(
                                (status) => (
                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {status}
                                  </option>
                                )
                              )}
                            </select>

                            {isUpdating && (
                              <RefreshCw
                                size={12}
                                className="mt-2 animate-spin text-[#AD8332]"
                              />
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ==========================================
              MOBILE / TABLET CARDS
          ========================================== */}

          <div className="grid gap-4 lg:hidden">
            {filteredCommissions.map(
              (commission) => {
                const isUpdating =
                  actionLoading === commission.id;

                return (
                  <article
                    key={commission.id}
                    className="overflow-hidden rounded-2xl border border-[#DED6C5] bg-[#FBF8F1] transition hover:border-[#CDBF9F] hover:shadow-sm"
                  >
                    <div className="border-b border-[#E4DCC9] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#AD8332]">
                            Commission
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[#201C15]">
                            #{commission.id}
                          </p>

                          <p className="mt-0.5 text-xs text-[#766E5E]">
                            Deal #
                            {commission.dealId || "—"}
                          </p>
                        </div>

                        <PaymentStatusBadge
                          status={
                            commission.paymentStatus
                          }
                        />
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="rounded-xl border border-[#E4DCC9] bg-[#F8F5ED] p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#938B7A]">
                          Property
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#403A30]">
                          {commission.propertyTitle ||
                            `Property #${commission.propertyId}`}
                        </p>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <InfoBox
                          label="Deal Amount"
                          value={formatCurrency(
                            commission.dealAmount
                          )}
                          icon={IndianRupee}
                        />

                        <InfoBox
                          label="Commission"
                          value={`${commission.commissionPercentage ?? 0}%`}
                          icon={Receipt}
                        />

                        <InfoBox
                          label="Commission Amount"
                          value={formatCurrency(
                            commission.commissionAmount
                          )}
                          icon={IndianRupee}
                          valueClass="text-[#3F6B52]"
                        />

                        <InfoBox
                          label="Lead"
                          value={
                            commission.leadId
                              ? `#${commission.leadId}`
                              : "—"
                          }
                          icon={Receipt}
                        />
                      </div>

                      <div className="mt-4 border-t border-[#E4DCC9] pt-4">
                        <label
                          htmlFor={`payment-status-${commission.id}`}
                          className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#938B7A]"
                        >
                          Payment Status
                        </label>

                        <select
                          id={`payment-status-${commission.id}`}
                          value={
                            commission.paymentStatus ||
                            "PENDING"
                          }
                          disabled={isUpdating}
                          onChange={(event) =>
                            handlePaymentStatusChange(
                              commission.id,
                              event.target.value
                            )
                          }
                          className="w-full rounded-xl border border-[#D8CFB9] bg-[#F8F5ED] px-3 py-2.5 text-sm font-semibold text-[#403A30] outline-none transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10 disabled:opacity-50"
                        >
                          {PAYMENT_STATUSES.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>

                        {isUpdating && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#8C6924]">
                            <RefreshCw
                              size={12}
                              className="animate-spin"
                            />
                            Updating payment status...
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </>
      )}

      {/* ==========================================
          FOOTER NOTE
      ========================================== */}

      {!loading && (
        <div className="mt-6 flex flex-col items-center justify-center gap-2 pb-3 text-center sm:flex-row">
          <div className="flex items-center gap-1.5 text-xs text-[#938B7A]">
            <ShieldCheck
              size={13}
              className="text-[#3F6B52]"
            />
            EstateHub finance records
          </div>

          <span className="hidden text-[#D2C9B6] sm:block">
            •
          </span>

          <p className="text-xs text-[#938B7A]">
            Payment status changes are saved to the system.
          </p>

          <ArrowUpRight
            size={13}
            className="hidden text-[#C9BFAE] sm:block"
          />
        </div>
      )}
    </div>
  );
}

export default CommissionsManagement;

