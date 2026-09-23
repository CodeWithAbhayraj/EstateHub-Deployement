
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  Car,
  CheckCircle2,
  Compass,
  Edit3,
  Heart,
  Home,
  MapPin,
  Ruler,
  ShieldCheck,
  Sofa,
  X,
} from "lucide-react";

import { getPropertyById } from "../../api/propertyApi";
import {
  addFavorite,
  isFavorite,
  removeFavorite,
} from "../../api/favoriteApi";

import PropertyGallery from "../../components/property/PropertyGallery";
import LeadForm from "../../components/lead/LeadForm";
import VisitForm from "../../components/visit/VisitForm";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch {
    user = null;
  }

  const role = user?.role
    ?.replace("ROLE_", "")
    ?.trim()
    ?.toUpperCase();

  const isBuyer = role === "BUYER";
  const isSeller = role === "SELLER";
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  const currentUserId = user?.id || user?.userId || null;

  const [property, setProperty] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(false);

  const [leadId, setLeadId] = useState(null);
  const [leadSuccess, setLeadSuccess] = useState("");
  const [visitSuccess, setVisitSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);

        const data = await getPropertyById(id);
        setProperty(data);

        if (isBuyer) {
          try {
            const fav = await isFavorite(id);
            setFavorite(Boolean(fav));
          } catch {
            setFavorite(false);
          }
        } else {
          setFavorite(false);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load property details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, isBuyer]);

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "") {
      return "Price on request";
    }

    const value = Number(price);

    if (Number.isNaN(value)) {
      return "Price on request";
    }

    return `₹${value.toLocaleString("en-IN")}`;
  };

  const formatStatus = (status) =>
    status
      ? String(status)
          .replaceAll("_", " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "";

  const propertyStatus = property?.status;

  const isDraft = propertyStatus === "DRAFT";
  const isPending = propertyStatus === "PENDING_APPROVAL";
  const isPublished = propertyStatus === "PUBLISHED";
  const isRejected = propertyStatus === "REJECTED";

  const propertySellerId =
    property?.sellerId || property?.seller?.id || null;

  const isOwnProperty =
    isSeller &&
    propertySellerId &&
    currentUserId &&
    String(propertySellerId) === String(currentUserId);

  const handleFavorite = async () => {
    if (!isBuyer) return;

    try {
      setFavoriteLoading(true);

      if (favorite) {
        await removeFavorite(id);
        setFavorite(false);
      } else {
        await addFavorite(id);
        setFavorite(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update favorite."
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleLeadSuccess = (response) => {
    const newLeadId =
      response?.id ||
      response?.leadId ||
      response?.data?.id ||
      response?.data?.leadId;

    if (newLeadId) {
      setLeadId(newLeadId);
    }

    setLeadSuccess(
      response?.message || "Enquiry submitted successfully."
    );

    setShowLeadForm(false);
  };

  const handleVisitSuccess = (response) => {
    setVisitSuccess(
      response?.message || "Visit scheduled successfully."
    );

    setShowVisitForm(false);
  };

  const openLeadForm = () => {
    if (!isBuyer) return;
    setShowLeadForm(true);
  };

  const openVisitForm = () => {
    if (!isBuyer) return;

    if (!leadId) {
      setError(
        "Please submit an enquiry first, then schedule a visit."
      );

      setShowLeadForm(true);
      return;
    }

    setShowVisitForm(true);
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F2E8] px-4">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-[3px] border-[#D8CFB9] border-t-[#AD8332]" />

          <p className="mt-5 text-sm text-[#8A806D]">
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error && !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F2E8] px-4">
        <div className="w-full max-w-md border border-[#D8CFB9] bg-[#FBF8F1] p-8 text-center shadow-[0_20px_50px_rgba(23,27,33,0.08)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#E7C8C2] bg-[#FBEAE8] text-[#B3564B]">
            <Home size={25} />
          </div>

          <h1
            className="mt-5 text-2xl text-[#201C15]"
            style={FRASER}
          >
            This listing isn't available
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#8A806D]">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-7 inline-flex items-center gap-2 bg-[#171B21] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#AD8332] hover:text-[#171B21]"
          >
            <ArrowLeft size={15} />
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="min-h-screen bg-[#F7F2E8] text-[#201C15]">
      {/* =====================================================
          TOP BAR
          ===================================================== */}

      <header className="sticky top-0 z-30 border-b border-[#D8CFB9] bg-[#F7F2E8]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#5D5547] transition hover:text-[#8C6924]"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to properties
          </button>

          {isOwnProperty && (
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/seller/properties/${property.id}/edit`
                )
              }
              className="inline-flex items-center gap-2 border border-[#201C15] px-4 py-2 text-sm font-semibold text-[#201C15] transition hover:bg-[#171B21] hover:text-white"
            >
              <Edit3 size={15} />
              Edit listing
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* ===================================================
            ALERTS
            =================================================== */}

        <div className="space-y-2.5">
          {leadSuccess && (
            <Alert
              tone="success"
              icon={<CheckCircle2 size={17} />}
              message={leadSuccess}
            />
          )}

          {visitSuccess && (
            <Alert
              tone="success"
              icon={<CalendarDays size={17} />}
              message={visitSuccess}
            />
          )}

          {error && (
            <Alert
              tone="error"
              message={error}
            />
          )}
        </div>

        {/* ===================================================
            GALLERY
            =================================================== */}

        <div className="mt-2 overflow-hidden border border-[#D8CFB9] bg-[#EAE2CF]">
          <PropertyGallery
            images={property.images}
            title={property.title}
          />
        </div>

        {/* ===================================================
            MAIN CONTENT
            =================================================== */}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
          {/* =================================================
              LEFT
              ================================================= */}

          <div>
            {/* HEADER */}

            <section>
              <div className="flex flex-wrap items-center gap-2">
                {property.propertyType && (
                  <span className="border border-[#C9BE9F] bg-[#F2ECDF] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#6D5A31]">
                    {property.propertyType}
                  </span>
                )}

                {property.status && (
                  <StatusTag
                    label={formatStatus(property.status)}
                    published={isPublished}
                    pending={isPending}
                    rejected={isRejected}
                    draft={isDraft}
                  />
                )}
              </div>

              <h1
                className="mt-5 max-w-4xl text-3xl leading-tight text-[#201C15] sm:text-4xl lg:text-5xl"
                style={FRASER}
              >
                {property.title || "Untitled property"}
              </h1>

              <div className="mt-4 flex items-center gap-2 text-sm text-[#6B6252]">
                <MapPin
                  size={16}
                  className="shrink-0 text-[#8C6924]"
                />

                <span>
                  {property.areaName || "Unknown area"}
                  {property.city
                    ? `, ${property.city}`
                    : ""}
                </span>
              </div>

              {/* PRICE */}

              <div className="mt-8 flex flex-wrap items-end gap-4 border-y border-[#D8CFB9] py-6">
                <span
                  className="text-4xl text-[#201C15] sm:text-5xl"
                  style={FRASER}
                >
                  {formatPrice(property.price)}
                </span>

                {property.area != null && (
                  <span className="pb-1 text-sm text-[#8A806D]">
                    {property.area} sq.ft
                  </span>
                )}
              </div>

              {/* QUICK DETAILS */}

              <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-[#D8CFB9] bg-[#D8CFB9] sm:grid-cols-4">
                {property.bhk != null && (
                  <QuickDetail
                    icon={<BedDouble size={18} />}
                    label="Configuration"
                    value={`${property.bhk} BHK`}
                  />
                )}

                {property.area != null && (
                  <QuickDetail
                    icon={<Ruler size={18} />}
                    label="Area"
                    value={`${property.area} sq.ft`}
                  />
                )}

                {property.propertyType && (
                  <QuickDetail
                    icon={<Home size={18} />}
                    label="Type"
                    value={property.propertyType}
                  />
                )}

                <QuickDetail
                  icon={<Car size={18} />}
                  label="Parking"
                  value={
                    property.parking
                      ? "Available"
                      : "Not available"
                  }
                />
              </div>
            </section>

            {/* =================================================
                DESCRIPTION
                ================================================= */}

            <section className="mt-14">
              <SectionTitle title="About this property" />

              <p className="mt-5 max-w-[68ch] whitespace-pre-line text-[15px] leading-7 text-[#514B3F]">
                {property.description ||
                  "No description has been added for this property yet."}
              </p>
            </section>

            {/* =================================================
                DETAILS
                ================================================= */}

            <section className="mt-14">
              <SectionTitle title="Property details" />

              <div className="mt-5 divide-y divide-[#D8CFB9] border-y border-[#D8CFB9]">
                <DetailRow
                  icon={<Sofa size={16} />}
                  label="Furnishing"
                  value={
                    property.furnished ||
                    "Not specified"
                  }
                />

                <DetailRow
                  icon={<Compass size={16} />}
                  label="Facing"
                  value={
                    property.facing ||
                    "Not specified"
                  }
                />

                <DetailRow
                  icon={<CheckCircle2 size={16} />}
                  label="Ready to move"
                  value={
                    property.readyToMove
                      ? "Yes"
                      : "No"
                  }
                />

                <DetailRow
                  icon={<Home size={16} />}
                  label="New project"
                  value={
                    property.newProject
                      ? "Yes"
                      : "No"
                  }
                />

                <DetailRow
                  icon={<Home size={16} />}
                  label="Resale"
                  value={
                    property.resale
                      ? "Yes"
                      : "No"
                  }
                />
              </div>
            </section>

            {/* =================================================
                REJECTION
                ================================================= */}

            {isRejected &&
              property.rejectionReason && (
                <section className="mt-12 border border-[#E7C8C2] bg-[#FBEAE8] p-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#B3564B]">
                    Rejection reason
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#7A332C]">
                    {property.rejectionReason}
                  </p>
                </section>
              )}
          </div>

          {/* =================================================
              RIGHT SIDEBAR
              ================================================= */}

          <aside>
            {/* BUYER */}

            {isBuyer && (
              <div className="sticky top-24 overflow-hidden border border-[#D8CFB9] bg-[#FBF8F1] shadow-[0_15px_40px_rgba(23,27,33,0.06)]">
                <div className="border-b border-[#D8CFB9] bg-[#F2ECDF] p-6">
                  <div className="flex h-11 w-11 items-center justify-center border border-[#C9BE9F] bg-[#F7F2E8] text-[#8C6924]">
                    <ShieldCheck size={19} />
                  </div>

                  <h3
                    className="mt-5 text-xl text-[#201C15]"
                    style={FRASER}
                  >
                    Interested in this home?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#756C5D]">
                    Reach out to the listing agent for
                    more details or a walkthrough.
                  </p>
                </div>

                <div className="p-5">
                  <button
                    type="button"
                    onClick={handleFavorite}
                    disabled={favoriteLoading}
                    className="flex w-full items-center justify-center gap-2 border border-[#C9BE9F] py-3 text-sm font-semibold text-[#4A4436] transition hover:border-[#AD8332] hover:bg-[#F2ECDF] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Heart
                      size={17}
                      className={
                        favorite
                          ? "fill-[#B3564B] text-[#B3564B]"
                          : "text-[#8A806D]"
                      }
                    />

                    {favorite
                      ? "Saved to favorites"
                      : "Save to favorites"}
                  </button>

                  <button
                    type="button"
                    onClick={openLeadForm}
                    className="mt-3 flex w-full items-center justify-center bg-[#171B21] py-3.5 text-sm font-semibold text-white transition hover:bg-[#AD8332] hover:text-[#171B21]"
                  >
                    Contact agent
                  </button>

                  <button
                    type="button"
                    onClick={openVisitForm}
                    className="mt-3 flex w-full items-center justify-center gap-2 border border-[#C9BE9F] py-3 text-sm font-semibold text-[#4A4436] transition hover:border-[#171B21] hover:bg-[#F2ECDF]"
                  >
                    <CalendarDays size={16} />
                    Schedule a visit
                  </button>

                  {leadId && (
                    <div className="mt-4 flex items-start gap-2 border border-[#CFE0CD] bg-[#F1F6F0] p-3 text-xs leading-5 text-[#3E5F3A]">
                      <CheckCircle2
                        size={14}
                        className="mt-0.5 shrink-0"
                      />

                      <span>
                        Enquiry submitted — you can now
                        schedule a visit.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SELLER */}

            {isSeller && (
              <div className="sticky top-24 border border-[#D8CFB9] bg-[#FBF8F1] p-6">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A806D]">
                  Seller property
                </p>

                <h3
                  className="mt-2 text-2xl text-[#201C15]"
                  style={FRASER}
                >
                  {isDraft
                    ? "Draft"
                    : isPending
                    ? "Pending approval"
                    : isPublished
                    ? "Published"
                    : isRejected
                    ? "Rejected"
                    : "Property"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#756C5D]">
                  Manage this listing from your seller
                  dashboard.
                </p>

                {isOwnProperty && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/seller/properties/${property.id}/edit`
                      )
                    }
                    className="mt-6 flex w-full items-center justify-center gap-2 bg-[#171B21] py-3.5 text-sm font-semibold text-white transition hover:bg-[#AD8332] hover:text-[#171B21]"
                  >
                    <Edit3 size={16} />
                    Edit listing
                  </button>
                )}

                {isDraft && isOwnProperty && (
                  <div className="mt-4 border border-[#EBDCB4] bg-[#FBF4E2] p-4 text-xs leading-5 text-[#8A6A1F]">
                    Upload at least 5 images and submit
                    for approval.
                  </div>
                )}
              </div>
            )}

            {/* ADMIN */}

            {isAdmin && (
              <div className="sticky top-24 border border-[#D8CFB9] bg-[#FBF8F1] p-6">
                <div className="flex h-11 w-11 items-center justify-center border border-[#C9BE9F] bg-[#F2ECDF] text-[#8C6924]">
                  <ShieldCheck size={19} />
                </div>

                <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-[#8A806D]">
                  Administration
                </p>

                <h3
                  className="mt-2 text-2xl text-[#201C15]"
                  style={FRASER}
                >
                  Property management
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#756C5D]">
                  Review and manage this listing from
                  the admin dashboard.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/properties")
                  }
                  className="mt-6 flex w-full items-center justify-center bg-[#171B21] py-3.5 text-sm font-semibold text-white transition hover:bg-[#AD8332] hover:text-[#171B21]"
                >
                  Manage property
                </button>
              </div>
            )}

            {/* NOT LOGGED IN */}

            {!token && (
              <div className="sticky top-24 border border-[#D8CFB9] bg-[#FBF8F1] p-6">
                <div className="flex h-11 w-11 items-center justify-center border border-[#C9BE9F] bg-[#F2ECDF] text-[#8C6924]">
                  <Home size={19} />
                </div>

                <h3
                  className="mt-5 text-2xl text-[#201C15]"
                  style={FRASER}
                >
                  Interested?
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#756C5D]">
                  Log in as a buyer to save properties,
                  contact an agent and schedule a visit.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="mt-6 flex w-full items-center justify-center bg-[#171B21] py-3.5 text-sm font-semibold text-white transition hover:bg-[#AD8332] hover:text-[#171B21]"
                >
                  Log in as buyer
                </button>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* =====================================================
          LEAD MODAL
          ===================================================== */}

      {isBuyer && showLeadForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#171B21]/70 p-4 backdrop-blur-sm"
          onClick={() => setShowLeadForm(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[#D8CFB9] bg-[#FBF8F1] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.25)] sm:p-8"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={() => setShowLeadForm(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-[#D8CFB9] text-[#756C5D] transition hover:border-[#AD8332] hover:bg-[#F2ECDF] hover:text-[#201C15]"
              aria-label="Close"
            >
              <X size={17} />
            </button>

            <div className="pr-12">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C6924]">
                EstateHub enquiry
              </p>

              <h2
                className="mt-2 text-3xl text-[#201C15]"
                style={FRASER}
              >
                Contact agent
              </h2>

              <p className="mt-1.5 text-sm text-[#8A806D]">
                Send your enquiry for this property.
              </p>
            </div>

            <div className="mt-6">
              <LeadForm
                propertyId={id}
                onSuccess={handleLeadSuccess}
                onClose={() =>
                  setShowLeadForm(false)
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          VISIT MODAL
          ===================================================== */}

      {isBuyer && showVisitForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#171B21]/70 p-4 backdrop-blur-sm"
          onClick={() => setShowVisitForm(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[#D8CFB9] bg-[#FBF8F1] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.25)] sm:p-8"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={() => setShowVisitForm(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-[#D8CFB9] text-[#756C5D] transition hover:border-[#AD8332] hover:bg-[#F2ECDF] hover:text-[#201C15]"
              aria-label="Close"
            >
              <X size={17} />
            </button>

            <div className="pr-12">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C6924]">
                EstateHub visit
              </p>

              <h2
                className="mt-2 text-3xl text-[#201C15]"
                style={FRASER}
              >
                Schedule visit
              </h2>

              <p className="mt-1.5 text-sm text-[#8A806D]">
                Choose your preferred date and time.
              </p>
            </div>

            <div className="mt-6">
              <VisitForm
                propertyId={id}
                leadId={leadId}
                onSuccess={handleVisitSuccess}
                onClose={() =>
                  setShowVisitForm(false)
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   ALERT
   ========================================================= */

function Alert({ tone, icon, message }) {
  const isSuccess = tone === "success";

  return (
    <div
      className={`flex items-start gap-2.5 border p-4 text-sm ${
        isSuccess
          ? "border-[#CFE0CD] bg-[#F1F6F0] text-[#3E5F3A]"
          : "border-[#E7C8C2] bg-[#FBEAE8] text-[#B3564B]"
      }`}
    >
      {icon || (
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-current" />
      )}

      <span>{message}</span>
    </div>
  );
}

/* =========================================================
   STATUS TAG
   ========================================================= */

function StatusTag({
  label,
  published,
  pending,
  rejected,
  draft,
}) {
  let className =
    "border-[#C9BE9F] bg-[#F2ECDF] text-[#6B6252]";

  if (published) {
    className =
      "border-[#CFE0CD] bg-[#F1F6F0] text-[#3E5F3A]";
  } else if (pending) {
    className =
      "border-[#EBDCB4] bg-[#FBF4E2] text-[#8A6A1F]";
  } else if (rejected) {
    className =
      "border-[#E7C8C2] bg-[#FBEAE8] text-[#B3564B]";
  } else if (draft) {
    className =
      "border-[#C9BE9F] bg-[#F2ECDF] text-[#6B6252]";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-[11px] font-semibold ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

/* =========================================================
   QUICK DETAIL
   ========================================================= */

function QuickDetail({ icon, label, value }) {
  return (
    <div className="bg-[#FBF8F1] p-4">
      <div className="text-[#8C6924]">
        {icon}
      </div>

      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#8A806D]">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-[#201C15]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   SECTION TITLE
   ========================================================= */

function SectionTitle({ title }) {
  return (
    <div className="flex items-center gap-4">
      <h2
        className="text-2xl text-[#201C15]"
        style={FRASER}
      >
        {title}
      </h2>

      <div className="h-px flex-1 bg-[#D8CFB9]" />
    </div>
  );
}

/* =========================================================
   DETAIL ROW
   ========================================================= */

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div className="flex items-center gap-2.5 text-sm text-[#6B6252]">
        <span className="text-[#8C6924]">
          {icon}
        </span>

        {label}
      </div>

      <span className="text-right text-sm font-semibold text-[#201C15]">
        {value}
      </span>
    </div>
  );
}

