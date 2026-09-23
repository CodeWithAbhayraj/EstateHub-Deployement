
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
    loadFavorites(false);
  };

  const handleRemove = async (propertyId) => {
    try {
      setRemovingId(propertyId);

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
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#F8F5ED]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(173,131,50,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(173,131,50,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "42px 42px",
          }}
        />

        <div className="relative text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#D8B876] bg-[#F2ECDF]">
            <RefreshCw
              size={19}
              className="animate-spin text-[#8C6924]"
            />
          </div>

          <p className="mt-4 text-sm font-medium text-[#4A4436]">
            Loading favorites...
          </p>

          <p className="mt-1 text-xs text-[#8A806D]">
            Preparing your saved properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8F5ED] text-[#201C15]">
      {/* Blueprint background */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(173,131,50,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(173,131,50,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        {/* Header */}
        <header className="mb-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#AD8332]">
                <span className="h-px w-8 bg-[#AD8332]" />
                Your collection
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center border border-[#D8B876] bg-[#F2ECDF] text-[#8C6924]">
                  <Heart size={19} fill="currentColor" strokeWidth={1.7} />
                </div>

                <div>
                  <h1
                    style={FRASER}
                    className="text-3xl font-semibold tracking-tight text-[#201C15] sm:text-4xl"
                  >
                    My Favorites
                  </h1>

                  <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#6B6252]">
                    Properties you've saved while exploring EstateHub.
                    Keep your shortlist here for easy access.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex h-10 items-center justify-center gap-2 border border-[#D8CFB9] bg-[#201C15] px-4 text-sm font-semibold text-[#FBF8F1] transition hover:bg-[#2C2820] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#D8CFB9]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A806D]">
              {properties.length}{" "}
              {properties.length === 1
                ? "saved property"
                : "saved properties"}
            </span>

            <span className="h-px flex-1 bg-[#D8CFB9]" />
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 border border-[#D9A39C] bg-[#F9ECE9] px-4 py-3.5 text-sm text-[#9B463C]">
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
        )}

        {/* Empty state */}
        {properties.length === 0 ? (
          <div className="relative flex min-h-[430px] flex-col items-center justify-center overflow-hidden border border-[#D8CFB9] bg-[#FBF8F1] px-6 py-10 text-center shadow-[0_12px_35px_rgba(32,28,21,0.04)]">
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

            <div className="relative flex h-14 w-14 items-center justify-center border border-[#D8B876] bg-[#F2ECDF] text-[#8C6924]">
              <Bookmark size={23} strokeWidth={1.6} />
            </div>

            <h2
              style={FRASER}
              className="relative mt-5 text-2xl font-semibold text-[#201C15] sm:text-3xl"
            >
              Your collection is empty
            </h2>

            <p className="relative mt-2 max-w-md text-sm leading-6 text-[#6B6252]">
              Start exploring properties and save the ones that catch
              your eye. They'll appear here for easy access later.
            </p>

            <Link
              to="/properties"
              className="relative mt-6 inline-flex items-center gap-2 border border-[#AD8332] bg-[#AD8332] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8C6924]"
            >
              Browse Properties
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            {/* Collection heading */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#AD8332]">
                  <span className="h-px w-7 bg-[#AD8332]" />
                  Saved listings
                </div>

                <p className="mt-1.5 text-sm text-[#6B6252]">
                  Your shortlisted properties.
                </p>
              </div>
            </div>

            {/* Property grid */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => {
                const image =
                  property.images?.length > 0
                    ? property.images[0]
                    : null;

                return (
                  <article
                    key={property.id}
                    className="group overflow-hidden border border-[#D8CFB9] bg-[#FBF8F1] shadow-[0_10px_30px_rgba(32,28,21,0.035)] transition duration-300 hover:-translate-y-0.5 hover:border-[#C8B78F] hover:shadow-[0_16px_38px_rgba(32,28,21,0.08)]"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-[#EEE9DE]">
                      {image ? (
                        <img
                          src={image}
                          alt={property.title || "Property"}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-[#8A806D]">
                          <Building2 size={32} strokeWidth={1.5} />
                          <span className="mt-2 text-xs">
                            No image available
                          </span>
                        </div>
                      )}

                      {/* Image overlay */}
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" />

                      {/* Saved badge */}
                      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 border border-white/60 bg-[#FBF8F1]/95 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8C6924] shadow-sm">
                        <Heart size={12} fill="currentColor" />
                        Saved
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h2
                        className="line-clamp-2 min-h-[48px] text-base font-semibold leading-6 text-[#201C15]"
                        title={property.title || "Untitled"}
                      >
                        {property.title || "Untitled"}
                      </h2>

                      <p
                        style={FRASER}
                        className="mt-2 text-2xl font-semibold text-[#8C6924]"
                      >
                        ₹
                        {Number(
                          property.price || 0
                        ).toLocaleString("en-IN")}
                      </p>

                      {/* Location */}
                      <div className="mt-3 flex items-start gap-2 border-b border-[#E4DCC9] pb-3 text-sm text-[#6B6252]">
                        <MapPin
                          size={15}
                          className="mt-0.5 shrink-0 text-[#AD8332]"
                        />

                        <span className="line-clamp-1">
                          {property.areaName || "Unknown"},{" "}
                          {property.city || "Unknown"}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {property.bhk != null && (
                          <span className="inline-flex items-center gap-1.5 border border-[#E4DCC9] bg-[#F2ECDF] px-2.5 py-1 text-xs font-semibold text-[#4A4436]">
                            <BedDouble
                              size={14}
                              className="text-[#8C6924]"
                            />
                            {property.bhk} BHK
                          </span>
                        )}

                        {property.area != null && (
                          <span className="inline-flex items-center gap-1.5 border border-[#E4DCC9] bg-[#F2ECDF] px-2.5 py-1 text-xs font-semibold text-[#4A4436]">
                            <Ruler
                              size={14}
                              className="text-[#8C6924]"
                            />
                            {property.area} sq.ft
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex gap-2">
                        <Link
                          to={`/properties/${property.id}`}
                          className="group/view flex flex-1 items-center justify-center gap-1.5 border border-[#201C15] bg-[#201C15] px-3 py-2.5 text-sm font-semibold text-[#FBF8F1] transition hover:bg-[#2C2820]"
                        >
                          <Eye size={15} />
                          View
                          <ArrowRight
                            size={13}
                            className="transition group-hover/view:translate-x-0.5"
                          />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleRemove(property.id)}
                          disabled={removingId === property.id}
                          className="inline-flex items-center justify-center gap-1.5 border border-[#D9A39C] bg-[#FBF8F1] px-3 py-2.5 text-sm font-semibold text-[#A64D43] transition hover:bg-[#F9ECE9] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={15} />

                          <span className="hidden sm:inline">
                            {removingId === property.id
                              ? "Removing..."
                              : "Remove"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Bottom accent */}
                    <div className="h-0.5 w-0 bg-[#AD8332] transition-all duration-300 group-hover:w-full" />
                  </article>
                );
              })}
            </div>
          </>
        )}

        {/* Bottom note */}
        <div className="mt-9 flex items-center gap-3 border-t border-[#D8CFB9] pt-5">
          <span className="h-1.5 w-1.5 bg-[#AD8332]" />

          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8A806D]">
            EstateHub · Your saved property collection
          </p>
        </div>
      </div>
    </div>
  );
}

