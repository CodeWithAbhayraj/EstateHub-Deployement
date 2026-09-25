
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  Eye,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Building2,
  ChevronRight,
} from "lucide-react";
import { getMyVisits } from "../../api/visitApi";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};


export default function MyVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadVisits = async (showFullLoader = true) => {
    try {
      if (showFullLoader) setLoading(true);
      else setRefreshing(true);

      setError("");

      const data = await getMyVisits();
      setVisits(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load visits.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadVisits();
  }, []);

  const handleRefresh = async () => loadVisits(false);

  const getStatusClass = (status) => {
    const s = String(status || "").toUpperCase();

    if (["CONFIRMED", "APPROVED"].includes(s)) {
      return "border-[#BFD2C2] bg-[#EDF4EE] text-[#3F6B52]";
    }

    if (s === "PENDING") {
      return "border-[#E4D3AA] bg-[#F8F1DF] text-[#8C6924]";
    }

    if (s === "COMPLETED") {
      return "border-[#C4D1DC] bg-[#EEF3F7] text-[#4C6578]";
    }

    if (["CANCELLED", "REJECTED"].includes(s)) {
      return "border-[#E4C4BE] bg-[#FAEFEC] text-[#B3564B]";
    }

    return "border-[#DDD5C4] bg-[#F5F1E8] text-[#6B6252]";
  };

  const formatStatus = (status) =>
    String(status || "")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-[#F8F5ED] px-4 py-10">
        <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center">
          <div className="text-center">
            <div className="relative mx-auto h-12 w-12">
              <div className="absolute inset-0 rounded-full border border-[#D8CFB9]" />
              <div className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-[#AD8332]" />
            </div>

            <p className="mt-5 text-sm font-medium tracking-wide text-[#8A806D]">
              Loading your visits...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8F5ED] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* Blueprint Header */}
        <div className="relative mb-7 overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1]">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(173,131,50,0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(173,131,50,0.08) 1px, transparent 1px)
              `,
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#D8C18F] bg-[#F4EBD7] text-[#8C6924]">
                <CalendarDays size={22} strokeWidth={1.7} />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-px w-7 bg-[#AD8332]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#AD8332]">
                    Schedule
                  </span>
                </div>

                <h1
                  style={FRASER}
                  className="text-3xl font-semibold tracking-tight text-[#201C15] sm:text-4xl"
                >
                  My Visits
                </h1>

                <p className="mt-1.5 text-sm text-[#8A806D]">
                  Manage your scheduled property visits.
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#D8CFB9] bg-[#FBF8F1] px-4 py-2.5 text-sm font-semibold text-[#3B352A] transition hover:border-[#BFA568] hover:bg-[#F4EBD7] disabled:cursor-not-allowed disabled:opacity-50 md:self-auto"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#E4C4BE] bg-[#FAEFEC] p-4 text-sm text-[#9D4B42]">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#B3564B]" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {visits.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1] p-8 text-center sm:p-12">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(173,131,50,0.07) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(173,131,50,0.07) 1px, transparent 1px)
                `,
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative mx-auto flex max-w-md flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D8C18F] bg-[#F4EBD7] text-[#AD8332]">
                <CalendarDays size={28} strokeWidth={1.5} />
              </div>

              <h3
                style={FRASER}
                className="mt-5 text-2xl font-semibold text-[#201C15]"
              >
                No visits scheduled
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#8A806D]">
                Find a property you like and schedule a visit at a convenient
                date and time.
              </p>

              <Link
                to="/properties"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#201C15] px-5 py-3 text-sm font-semibold text-[#FBF8F1] transition hover:bg-[#302A21]"
              >
                Find a Property
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {visits.map((visit) => (
              <div
                key={visit.id}
                className="group relative overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1] transition duration-200 hover:-translate-y-0.5 hover:border-[#C7B27D] hover:shadow-[0_14px_35px_rgba(49,42,29,0.08)]"
              >
                {/* Gold accent */}
                <div className="absolute left-0 top-0 h-full w-1 bg-[#AD8332] opacity-70 transition group-hover:opacity-100" />

                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    {/* Main Visit Information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D8CFB9] bg-[#F5F1E8] text-[#8C6924]">
                            <CalendarDays size={17} />
                          </div>

                          <h2
                            style={FRASER}
                            className="text-xl font-semibold text-[#201C15]"
                          >
                            Visit #{visit.id}
                          </h2>
                        </div>

                        {visit.status && (
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${getStatusClass(
                              visit.status
                            )}`}
                          >
                            {formatStatus(visit.status)}
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <VisitDetail
                          icon={<CalendarDays size={15} />}
                          label="Date"
                          value={visit.visitDate || "N/A"}
                        />

                        <VisitDetail
                          icon={<Clock size={15} />}
                          label="Time"
                          value={visit.visitTime || "N/A"}
                        />

                        {visit.propertyId ? (
                          <VisitDetail
                            icon={<Building2 size={15} />}
                            label="Property"
                            value={`#${visit.propertyId}`}
                          />
                        ) : (
                          <VisitDetail
                            icon={<MapPin size={15} />}
                            label="Location"
                            value="Not available"
                          />
                        )}
                      </div>

                      {/* Remarks */}
                      {visit.remarks && (
                        <div className="mt-4 rounded-xl border border-[#E4DCC9] bg-[#F5F1E8] p-4">
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8A806D]">
                            Remarks
                          </p>

                          <p className="text-sm leading-6 text-[#5F574A]">
                            {visit.remarks}
                          </p>
                        </div>
                      )}

                      {/* Completed */}
                      {visit.status?.toUpperCase() === "COMPLETED" && (
                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#3F6B52]">
                          <CheckCircle2 size={16} />
                          Visit completed
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    {visit.propertyId && (
                      <Link
                        to={`/properties/${visit.propertyId}`}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#D8CFB9] bg-[#201C15] px-4 py-3 text-sm font-semibold text-[#FBF8F1] transition hover:bg-[#302A21] lg:min-w-[170px]"
                      >
                        <Eye size={16} />
                        View Property
                        <ChevronRight size={15} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom note */}
        {visits.length > 0 && (
          <div className="mt-6 flex items-center gap-2 border-t border-[#D8CFB9] pt-5 text-xs text-[#8A806D]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#AD8332]" />
            Keep your scheduled visit details handy when visiting the property.
          </div>
        )}
      </div>
    </div>
  );
}

function VisitDetail({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-[#E4DCC9] bg-[#F8F5ED] px-4 py-3">
      <div className="flex items-center gap-1.5 text-[#AD8332]">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A806D]">
          {label}
        </span>
      </div>

      <p className="mt-1.5 truncate text-sm font-semibold text-[#302A21]">
        {value}
      </p>
    </div>
  );
}

