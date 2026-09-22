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

/*
  Fonts: this design pairs a serif display face (for the title and price)
  with a plain sans for everything else. Add these once, e.g. in index.html:

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  Then the `font-display` / `font-sans` classes below resolve to:
  font-display -> ['Fraunces', 'serif']
  font-sans    -> ['Inter', 'sans-serif']  (or leave as Tailwind's default sans)
*/

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

  const formatPrice = (price) =>
    price
      ? `₹${Number(price).toLocaleString("en-IN")}`
      : "Price on request";

  const formatStatus = (status) =>
    status?.replaceAll("_", " ") || "";

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F5] px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-[#E7E3D8] border-t-[#A6773B]" />

          <p className="mt-4 font-sans text-sm text-[#8A8577]">
            Loading property details…
          </p>
        </div>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F5] px-4">
        <div className="w-full max-w-md border border-[#E7E3D8] bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FBEAE8] text-[#B3443B]">
            <Home size={26} />
          </div>

          <h1 className="mt-5 font-display text-2xl font-medium text-[#1C1B16]">
            This listing isn&rsquo;t available
          </h1>

          <p className="mt-2 font-sans text-sm leading-6 text-[#8A8577]">
            {error}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 border border-[#1C1B16] px-5 py-2.5 font-sans text-sm font-medium text-[#1C1B16] transition hover:bg-[#1C1B16] hover:text-white"
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
    <div className="min-h-screen bg-[#FAF9F5] font-sans text-[#1C1B16]">
      {/* TOP BAR */}
      <header className="sticky top-0 z-30 border-b border-[#E7E3D8] bg-[#FAF9F5]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#5B5749] transition hover:text-[#1C1B16]"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back
          </button>

          {isOwnProperty && (
            <button
              onClick={() =>
                navigate(`/seller/properties/${property.id}/edit`)
              }
              className="inline-flex items-center gap-2 border border-[#1C1B16] px-4 py-2 text-sm font-medium text-[#1C1B16] transition hover:bg-[#1C1B16] hover:text-white"
            >
              <Edit3 size={15} />
              Edit listing
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ALERTS */}
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

          {error && <Alert tone="error" message={error} />}
        </div>

        {/* GALLERY */}
        <div className="mt-2 overflow-hidden border border-[#E7E3D8]">
          <PropertyGallery
            images={property.images}
            title={property.title}
          />
        </div>

        {/* MAIN GRID */}
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* MAIN CONTENT */}
          <div>
            {/* HEADER */}
            <section>
              <div className="flex flex-wrap items-center gap-2.5">
                {property.propertyType && (
                  <span className="border border-[#D8D2BF] px-2.5 py-1 text-xs font-medium text-[#6B6555]">
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

              <h1 className="mt-4 font-display text-3xl font-medium leading-tight text-[#1C1B16] sm:text-4xl">
                {property.title || "Untitled property"}
              </h1>

              <div className="mt-3 flex items-center gap-1.5 text-[#8A8577]">
                <MapPin size={16} className="shrink-0 text-[#A6773B]" />
                <span className="text-sm">
                  {property.areaName || "Unknown area"},{" "}
                  {property.city || "Unknown city"}
                </span>
              </div>

              {/* PRICE */}
              <div className="mt-8 flex flex-wrap items-baseline gap-3 border-y border-[#E7E3D8] py-6">
                <span className="font-display text-4xl font-medium text-[#1C1B16]">
                  {formatPrice(property.price)}
                </span>

                {property.area != null && (
                  <span className="text-sm text-[#8A8577]">
                    {property.area} sq.ft
                  </span>
                )}
              </div>

              {/* QUICK DETAILS */}
              <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-[#E7E3D8] bg-[#E7E3D8] sm:grid-cols-4">
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
                    label="Carpet area"
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
                  value={property.parking ? "Available" : "Not available"}
                />
              </div>
            </section>

            {/* DESCRIPTION */}
            <section className="mt-12">
              <SectionTitle title="About this property" />

              <p className="mt-4 max-w-[64ch] whitespace-pre-line text-[15px] leading-7 text-[#4B473C]">
                {property.description ||
                  "No description has been added for this property yet."}
              </p>
            </section>

            {/* PROPERTY DETAILS */}
            <section className="mt-12">
              <SectionTitle title="Details" />

              <div className="mt-5 divide-y divide-[#E7E3D8] border-t border-[#E7E3D8]">
                <DetailRow
                  icon={<Sofa size={16} />}
                  label="Furnishing"
                  value={property.furnished || "Not specified"}
                />

                <DetailRow
                  icon={<Compass size={16} />}
                  label="Facing"
                  value={property.facing || "Not specified"}
                />

                <DetailRow
                  icon={<CheckCircle2 size={16} />}
                  label="Ready to move"
                  value={property.readyToMove ? "Yes" : "No"}
                />

                <DetailRow
                  icon={<Home size={16} />}
                  label="New project"
                  value={property.newProject ? "Yes" : "No"}
                />

                <DetailRow
                  icon={<Home size={16} />}
                  label="Resale"
                  value={property.resale ? "Yes" : "No"}
                />
              </div>
            </section>

            {/* REJECTION */}
            {isRejected && property.rejectionReason && (
              <section className="mt-12 border-l-2 border-[#B3443B] bg-[#FBEAE8]/50 py-4 pl-5 pr-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#B3443B]">
                  Rejection reason
                </p>

                <p className="mt-1.5 text-sm leading-6 text-[#7A332C]">
                  {property.rejectionReason}
                </p>
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          <aside>
            {/* BUYER */}
            {isBuyer && (
              <div className="sticky top-24 border border-[#E7E3D8] bg-white">
                <div className="border-b border-[#E7E3D8] p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3EEE1] text-[#A6773B]">
                    <ShieldCheck size={19} />
                  </div>

                  <h3 className="mt-4 font-display text-lg font-medium text-[#1C1B16]">
                    Interested in this home?
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-[#8A8577]">
                    Reach out to the listing agent for more details or a
                    walkthrough.
                  </p>
                </div>

                <div className="p-5">
                  <button
                    onClick={handleFavorite}
                    disabled={favoriteLoading}
                    className="flex w-full items-center justify-center gap-2 border border-[#D8D2BF] py-3 text-sm font-medium text-[#4B473C] transition hover:border-[#1C1B16] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Heart
                      size={17}
                      className={
                        favorite
                          ? "fill-[#B3443B] text-[#B3443B]"
                          : "text-[#8A8577]"
                      }
                    />
                    {favorite ? "Saved to favorites" : "Save to favorites"}
                  </button>

                  <button
                    onClick={openLeadForm}
                    className="mt-3 flex w-full items-center justify-center bg-[#1C1B16] py-3 text-sm font-medium text-white transition hover:bg-[#A6773B]"
                  >
                    Contact agent
                  </button>

                  <button
                    onClick={openVisitForm}
                    className="mt-3 flex w-full items-center justify-center gap-2 border border-[#D8D2BF] py-3 text-sm font-medium text-[#4B473C] transition hover:border-[#1C1B16]"
                  >
                    <CalendarDays size={16} />
                    Schedule a visit
                  </button>

                  {leadId && (
                    <div className="mt-4 flex items-start gap-2 border border-[#CFE0CD] bg-[#F1F6F0] p-3 text-xs leading-5 text-[#3E5F3A]">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                      Enquiry submitted — you can now schedule a visit.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SELLER */}
            {isSeller && (
              <div className="sticky top-24 border border-[#E7E3D8] bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8A8577]">
                  Seller property
                </p>

                <h3 className="mt-2 font-display text-xl font-medium text-[#1C1B16]">
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

                <p className="mt-1.5 text-sm leading-6 text-[#8A8577]">
                  Manage this listing from your seller dashboard.
                </p>

                {isOwnProperty && (
                  <button
                    onClick={() =>
                      navigate(`/seller/properties/${property.id}/edit`)
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 bg-[#1C1B16] py-3 text-sm font-medium text-white transition hover:bg-[#A6773B]"
                  >
                    <Edit3 size={16} />
                    Edit listing
                  </button>
                )}

                {isDraft && isOwnProperty && (
                  <div className="mt-4 border border-[#EBDCB4] bg-[#FBF4E2] p-4 text-xs leading-5 text-[#8A6A1F]">
                    Upload at least 5 images and submit for approval.
                  </div>
                )}
              </div>
            )}

            {/* ADMIN */}
            {isAdmin && (
              <div className="sticky top-24 border border-[#E7E3D8] bg-white p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3EEE1] text-[#A6773B]">
                  <ShieldCheck size={19} />
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#8A8577]">
                  Administration
                </p>

                <h3 className="mt-2 font-display text-xl font-medium text-[#1C1B16]">
                  Property management
                </h3>

                <p className="mt-1.5 text-sm leading-6 text-[#8A8577]">
                  Review and manage this listing from the admin dashboard.
                </p>

                <button
                  onClick={() => navigate("/admin/properties")}
                  className="mt-5 flex w-full items-center justify-center bg-[#1C1B16] py-3 text-sm font-medium text-white transition hover:bg-[#A6773B]"
                >
                  Manage property
                </button>
              </div>
            )}

            {/* NOT LOGGED IN */}
            {!token && (
              <div className="sticky top-24 border border-[#E7E3D8] bg-white p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3EEE1] text-[#A6773B]">
                  <Home size={19} />
                </div>

                <h3 className="mt-5 font-display text-xl font-medium text-[#1C1B16]">
                  Interested?
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#8A8577]">
                  Log in as a buyer to save properties, contact an agent and
                  schedule a visit.
                </p>

                <button
                  onClick={() => navigate("/login")}
                  className="mt-5 flex w-full items-center justify-center bg-[#1C1B16] py-3 text-sm font-medium text-white transition hover:bg-[#A6773B]"
                >
                  Log in as buyer
                </button>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* LEAD MODAL */}
      {isBuyer && showLeadForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1B16]/60 p-4 backdrop-blur-sm"
          onClick={() => setShowLeadForm(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[#E7E3D8] bg-white p-6 sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setShowLeadForm(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#8A8577] transition hover:bg-[#F3EEE1] hover:text-[#1C1B16]"
              aria-label="Close"
            >
              <X size={17} />
            </button>

            <h2 className="pr-10 font-display text-2xl font-medium text-[#1C1B16]">
              Contact agent
            </h2>

            <p className="mt-1 text-sm text-[#8A8577]">
              Send your enquiry for this property.
            </p>

            <div className="mt-5">
              <LeadForm
                propertyId={id}
                onSuccess={handleLeadSuccess}
                onClose={() => setShowLeadForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* VISIT MODAL */}
      {isBuyer && showVisitForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1B16]/60 p-4 backdrop-blur-sm"
          onClick={() => setShowVisitForm(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[#E7E3D8] bg-white p-6 sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setShowVisitForm(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#8A8577] transition hover:bg-[#F3EEE1] hover:text-[#1C1B16]"
              aria-label="Close"
            >
              <X size={17} />
            </button>

            <h2 className="pr-10 font-display text-2xl font-medium text-[#1C1B16]">
              Schedule visit
            </h2>

            <p className="mt-1 text-sm text-[#8A8577]">
              Choose your preferred date and time.
            </p>

            <div className="mt-5">
              <VisitForm
                propertyId={id}
                leadId={leadId}
                onSuccess={handleVisitSuccess}
                onClose={() => setShowVisitForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- */
/* REUSABLE UI COMPONENTS        */
/* ----------------------------- */

function Alert({ tone, icon, message }) {
  const isSuccess = tone === "success";

  return (
    <div
      className={`flex items-start gap-2 border p-4 text-sm ${
        isSuccess
          ? "border-[#CFE0CD] bg-[#F1F6F0] text-[#3E5F3A]"
          : "border-[#F0CFC9] bg-[#FBEAE8] text-[#B3443B]"
      }`}
    >
      {icon}
      <span>{message}</span>
    </div>
  );
}

function StatusTag({ label, published, pending, rejected, draft }) {
  let className = "border-[#D8D2BF] text-[#6B6555]";

  if (published) {
    className = "border-[#CFE0CD] text-[#3E5F3A]";
  } else if (pending) {
    className = "border-[#EBDCB4] text-[#8A6A1F]";
  } else if (rejected) {
    className = "border-[#F0CFC9] text-[#B3443B]";
  } else if (draft) {
    className = "border-[#D8D2BF] text-[#6B6555]";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-medium ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function QuickDetail({ icon, label, value }) {
  return (
    <div className="bg-[#FAF9F5] p-4">
      <div className="text-[#A6773B]">{icon}</div>

      <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-[#8A8577]">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-[#1C1B16]">
        {value}
      </p>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h2 className="font-display text-xl font-medium text-[#1C1B16]">
      {title}
    </h2>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div className="flex items-center gap-2.5 text-sm text-[#6B6555]">
        <span className="text-[#A6773B]">{icon}</span>
        {label}
      </div>

      <span className="text-sm font-medium text-[#1C1B16]">{value}</span>
    </div>
  );
}