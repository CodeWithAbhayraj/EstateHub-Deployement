
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Trash2,
  Eye,
  MapPin,
  BedDouble,
  Ruler,
  Building2,
  ArrowRight,
  RefreshCw,
  Bookmark,
  Sparkles,
  ShieldCheck,
  X,
} from "lucide-react";


import { getMyFavorites, removeFavorite } from "../../api/favoriteApi";
import { getPropertyById } from "../../api/propertyApi";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

export default function Favorites() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadFavorites = async (showFullLoader = true) => {
    try {
      if (showFullLoader) setLoading(true);
      else setRefreshing(true);

      setError("");

      const favData = await getMyFavorites();

      if (!Array.isArray(favData)) {
        setProperties([]);
        return;
      }

      const props = await Promise.all(
        favData.map((f) => getPropertyById(f.propertyId))
      );

      setProperties(props);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load favorites."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRefresh = async () => {
    await loadFavorites(false);
  };

  const handleRemove = async (propertyId) => {
    try {
      setRemovingId(propertyId);
      setError("");

      await removeFavorite(propertyId);

      setProperties((prev) =>
        prev.filter(
          (p) => String(p.id) !== String(propertyId)
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to remove favorite."
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return <FavoritesLoading />;
  }

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#201C15]">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#171B21]">
        {/* blueprint */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.075]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(216,184,118,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(216,184,118,1) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
          }}
        />

        {/* decorative geometry */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[#D8B876]/15" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[#D8B876]/10" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 lg:px-10 lg:pb-24 lg:pt-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 border border-[#D8B876]/30 bg-[#D8B876]/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D8B876]">
                <Bookmark size={13} />
                Personal collection
              </div>

              <h1
                style={FRASER}
                className="text-5xl leading-[1.02] tracking-[-0.035em] text-[#FBF8F1] sm:text-6xl lg:text-7xl"
              >
                Places you
                <span className="block text-[#D8B876]">
                  don't want to forget.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#C5C0B7] sm:text-base">
                Your saved properties, gathered in one place so you
                can compare, revisit, and decide when the time is right.
              </p>
            </div>

            {/* Counter */}
            <div className="flex shrink-0 items-center gap-4 border border-[#D8B876]/20 bg-white/[0.035] px-5 py-4">
              <div className="flex h-11 w-11 items-center justify-center border border-[#D8B876]/30 bg-[#D8B876]/10 text-[#D8B876]">
                <Heart
                  size={19}
                  fill="currentColor"
                  strokeWidth={1.5}
                />
              </div>

              <div>
                <div
                  style={FRASER}
                  className="text-3xl leading-none text-[#FBF8F1]"
                >
                  {properties.length}
                </div>

                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#8D887F]">
                  Saved properties
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        {/* Page toolbar */}
        <div className="mb-8 flex flex-col gap-5 border-b border-[#D8CFB9] pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#AD8332]">
              <span className="h-px w-7 bg-[#AD8332]" />
              Saved listings
            </div>

            <h2
              style={FRASER}
              className="mt-2 text-3xl tracking-[-0.025em] text-[#201C15] sm:text-4xl"
            >
              Your shortlist
            </h2>

            <p className="mt-2 text-sm text-[#7B7365]">
              {properties.length === 0
                ? "No properties saved yet."
                : `${properties.length} ${
                    properties.length === 1
                      ? "property"
                      : "properties"
                  } saved for later.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/properties"
              className="hidden h-10 items-center gap-2 border border-[#D8CFB9] bg-[#FBF8F1] px-4 text-xs font-bold uppercase tracking-[0.1em] text-[#5F5749] transition hover:border-[#AD8332] hover:text-[#8C6924] sm:inline-flex"
            >
              Explore more
              <ArrowRight size={14} />
            </Link>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex h-10 items-center gap-2 bg-[#201C15] px-4 text-xs font-bold uppercase tracking-[0.1em] text-[#FBF8F1] transition hover:bg-[#AD8332] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing" : "Refresh"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-7 flex items-start justify-between gap-4 border border-[#D9A39C] bg-[#F9ECE9] px-4 py-3.5 text-sm text-[#9B463C]">
            <div className="flex items-start gap-3">
              <Heart size={16} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Favorites update failed
                </p>

                <p className="mt-1 text-[#A65B51]">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 text-[#9B463C] transition hover:text-[#71332D]"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}
        {properties.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <>
            {/* Collection meta */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles
                  size={14}
                  className="text-[#AD8332]"
                />

                <span className="text-xs font-semibold text-[#6B6252]">
                  Your saved collection
                </span>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A9285]">
                {properties.length} results
              </span>
            </div>

            {/* =================================================
                PROPERTY GRID
            ================================================== */}
            <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => {
                const image =
                  property.images?.length > 0
                    ? property.images[0]
                    : null;

                return (
                  <article
                    key={property.id}
                    className="group overflow-hidden border border-[#D8CFB9] bg-[#FBF8F1] shadow-[0_8px_25px_rgba(32,28,21,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#C8B78F] hover:shadow-[0_20px_45px_rgba(32,28,21,0.10)]"
                  >
                    {/* IMAGE */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#E9E3D7]">
                      {image ? (
                        <img
                          src={image}
                          alt={property.title || "Property"}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-[#918878]">
                          <Building2
                            size={38}
                            strokeWidth={1.2}
                          />

                          <span className="mt-2 text-xs">
                            No image available
                          </span>
                        </div>
                      )}

                      {/* Image gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                      {/* Saved badge */}
                      <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 border border-white/25 bg-[#201C15]/85 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#FBF8F1] backdrop-blur-md">
                        <Heart
                          size={11}
                          fill="#D8B876"
                          className="text-[#D8B876]"
                        />
                        Saved
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => handleRemove(property.id)}
                        disabled={removingId === property.id}
                        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-[#201C15]/80 text-white backdrop-blur-md transition hover:bg-[#B3564B] disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label="Remove favorite"
                      >
                        {removingId === property.id ? (
                          <RefreshCw
                            size={14}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>

                      {/* Price on image */}
                      <div className="absolute bottom-4 left-4">
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/70">
                          Asking price
                        </p>

                        <p
                          style={FRASER}
                          className="mt-0.5 text-2xl font-semibold text-white"
                        >
                          ₹
                          {Number(
                            property.price || 0
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-5">
                      {/* Type */}
                      <div className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#AD8332]">
                        <Building2 size={12} />

                        {property.propertyType || "Property"}
                      </div>

                      {/* Title */}
                      <h2
                        title={property.title || "Untitled"}
                        className="line-clamp-2 min-h-[48px] text-[17px] font-semibold leading-6 text-[#201C15]"
                      >
                        {property.title || "Untitled Property"}
                      </h2>

                      {/* Location */}
                      <div className="mt-3 flex items-center gap-2 text-xs text-[#756D60]">
                        <MapPin
                          size={14}
                          className="shrink-0 text-[#AD8332]"
                        />

                        <span className="truncate">
                          {property.areaName || "Unknown area"},{" "}
                          {property.city || "Unknown city"}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="mt-5 grid grid-cols-2 border-y border-[#E3DCCF] py-4">
                        <DetailItem
                          icon={<BedDouble size={14} />}
                          label="Configuration"
                          value={
                            property.bhk
                              ? `${property.bhk} BHK`
                              : "—"
                          }
                        />

                        <DetailItem
                          icon={<Ruler size={14} />}
                          label="Area"
                          value={
                            property.area
                              ? `${property.area} sq.ft`
                              : "—"
                          }
                        />
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex gap-2">
                        <Link
                          to={`/properties/${property.id}`}
                          className="group/view flex flex-1 items-center justify-center gap-2 bg-[#201C15] px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#FBF8F1] transition hover:bg-[#AD8332]"
                        >
                          <Eye size={14} />
                          View property

                          <ArrowRight
                            size={13}
                            className="transition-transform group-hover/view:translate-x-0.5"
                          />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleRemove(property.id)}
                          disabled={removingId === property.id}
                          className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#D8CFB9] bg-[#F7F4EC] text-[#786F61] transition hover:border-[#B3564B] hover:bg-[#F9ECE9] hover:text-[#B3564B] disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Remove from favorites"
                        >
                          {removingId === property.id ? (
                            <RefreshCw
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Gold hover accent */}
                    <div className="h-0.5 w-0 bg-[#AD8332] transition-all duration-500 group-hover:w-full" />
                  </article>
                );
              })}
            </div>
          </>
        )}

        {/* =====================================================
            TRUST STRIP
        ====================================================== */}
        {!loading && (
          <section className="mt-14 border border-[#D8CFB9] bg-[#F0EBDD]">
            <div className="grid md:grid-cols-3">
              <TrustItem
                icon={<Heart size={17} />}
                title="Save what matters"
                text="Keep the properties you're genuinely interested in one place."
              />

              <TrustItem
                icon={<Eye size={17} />}
                title="Revisit anytime"
                text="Open your saved listings again whenever you want."
              />

              <TrustItem
                icon={<ShieldCheck size={17} />}
                title="Connected to your account"
                text="Your favorite collection stays available across your sessions."
              />
            </div>
          </section>
        )}

        {/* Bottom note */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-[#D8CFB9]" />

          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9A9285]">
            EstateHub · Saved property collection
          </p>

          <span className="h-px w-10 bg-[#D8CFB9]" />
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */
function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#D8D0C0] bg-[#F2ECDF] text-[#8C6924]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9A9285]">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-semibold text-[#4A4438]">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   TRUST ITEM
========================================================= */
function TrustItem({ icon, title, text }) {
  return (
    <div className="flex gap-4 border-b border-[#D8CFB9] p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#D8B876]/60 bg-[#D8B876]/10 text-[#8C6924]">
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#201C15]">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-[#7B7365]">
          {text}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */
function FavoritesLoading() {
  return (
    <div className="min-h-[75vh] bg-[#F7F4EC]">
      <section className="relative overflow-hidden bg-[#171B21]">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(216,184,118,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(216,184,118,1) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="h-3 w-32 animate-pulse bg-white/10" />

          <div className="mt-5 h-14 max-w-xl animate-pulse bg-white/10" />

          <div className="mt-4 h-4 max-w-md animate-pulse bg-white/10" />
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="h-3 w-28 animate-pulse bg-[#E1DACB]" />
            <div className="mt-3 h-9 w-56 animate-pulse bg-[#E1DACB]" />
          </div>

          <div className="h-10 w-24 animate-pulse bg-[#E1DACB]" />
        </div>

        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden border border-[#D8CFB9] bg-[#FBF8F1]"
            >
              <div className="aspect-[4/3] animate-pulse bg-[#E6DFD1]" />

              <div className="space-y-4 p-5">
                <div className="h-3 w-20 animate-pulse bg-[#E1DACB]" />
                <div className="h-6 w-3/4 animate-pulse bg-[#E1DACB]" />
                <div className="h-4 w-1/2 animate-pulse bg-[#E1DACB]" />

                <div className="border-y border-[#E5DECF] py-4">
                  <div className="h-5 w-full animate-pulse bg-[#E1DACB]" />
                </div>

                <div className="h-11 w-full animate-pulse bg-[#E1DACB]" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */
function EmptyFavorites() {
  return (
    <div className="relative flex min-h-[440px] flex-col items-center justify-center overflow-hidden border border-[#D8CFB9] bg-[#FBF8F1] px-6 py-12 text-center shadow-[0_12px_35px_rgba(32,28,21,0.04)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(173,131,50,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(173,131,50,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* corner marks */}
      <div className="absolute left-0 top-0 h-16 w-16 border-b border-r border-[#D8B876]/30" />
      <div className="absolute bottom-0 right-0 h-16 w-16 border-l border-t border-[#D8B876]/30" />

      <div className="relative">
        <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#D8B876] bg-[#F2ECDF] text-[#8C6924]">
          <Bookmark size={25} strokeWidth={1.5} />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#AD8332]">
          <span className="h-px w-5 bg-[#AD8332]" />
          Your collection
          <span className="h-px w-5 bg-[#AD8332]" />
        </div>

        <h2
          style={FRASER}
          className="mt-3 text-3xl tracking-[-0.02em] text-[#201C15]"
        >
          Nothing saved yet
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6B6252]">
          Start exploring EstateHub and save properties that catch
          your eye. They'll stay here for your next visit.
        </p>

        <Link
          to="/properties"
          className="mt-7 inline-flex items-center gap-2 bg-[#201C15] px-6 py-3 text-xs font-bold uppercase tracking-[0.13em] text-[#FBF8F1] transition hover:bg-[#AD8332]"
        >
          Browse properties
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
