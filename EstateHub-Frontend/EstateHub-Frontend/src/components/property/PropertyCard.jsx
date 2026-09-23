
import { Link } from "react-router-dom";
import {
  Heart,
  MapPin,
  BedDouble,
  Ruler,
  Building2,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

function PropertyCard({ property, isFavorite = false, onFavorite }) {
  if (!property) return null;

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

  const imageUrl =
    property.images?.length > 0
      ? property.images[0]
      : null;

  const detailPath = `/properties/${property.id}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-[#D8CFB9] bg-[#F7F2E8] transition-all duration-300 hover:-translate-y-1 hover:border-[#AD8332] hover:shadow-[0_18px_40px_-18px_rgba(23,27,33,0.35)]">
      {/* =====================================================
          IMAGE
          ===================================================== */}

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE2CF]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title || "Property"}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-[#8A806D]">
            <div className="flex h-14 w-14 items-center justify-center border border-[#D8CFB9] bg-[#F7F2E8]">
              <Building2
                size={26}
                strokeWidth={1.25}
                className="text-[#8C6924]/70"
              />
            </div>

            <span className="mt-3 text-xs">
              No image available
            </span>
          </div>
        )}

        {/* Image overlay */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171B21]/35 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

        {/* =================================================
            STATUS
            ================================================= */}

        {property.status && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 border border-[#D8CFB9] bg-[#F7F2E8]/95 px-2.5 py-1 text-[11px] font-medium text-[#201C15] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3F6B52]" />

            {formatStatus(property.status)}
          </span>
        )}

        {/* =================================================
            FAVORITE
            ================================================= */}

        {onFavorite && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              onFavorite(property.id);
            }}
            aria-label={
              isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
            aria-pressed={isFavorite}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center border backdrop-blur transition-all duration-200 ${
              isFavorite
                ? "border-[#B3564B]/40 bg-[#B3564B]/10 text-[#B3564B]"
                : "border-[#D8CFB9] bg-[#F7F2E8]/95 text-[#4A4436] hover:border-[#B3564B]/40 hover:text-[#B3564B]"
            }`}
          >
            <Heart
              size={16}
              strokeWidth={2}
              className={
                isFavorite
                  ? "fill-[#B3564B]"
                  : ""
              }
            />
          </button>
        )}

        {/* =================================================
            PROPERTY TYPE
            ================================================= */}

        {property.propertyType && (
          <span className="absolute bottom-3 left-3 border border-[#AD8332]/60 bg-[#171B21]/90 px-2.5 py-1 text-[11px] font-medium text-[#D8B876] backdrop-blur">
            {property.propertyType}
          </span>
        )}
      </div>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div className="flex flex-1 flex-col p-5">
        {/* Title */}

        <Link
          to={detailPath}
          className="flex items-start justify-between gap-3"
        >
          <h2 className="line-clamp-2 text-base font-medium leading-6 text-[#201C15] transition group-hover:text-[#8C6924] sm:text-lg">
            {property.title || "Untitled Property"}
          </h2>

          <ArrowUpRight
            size={18}
            className="mt-0.5 shrink-0 text-[#C9BE9F] transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#8C6924]"
          />
        </Link>

        {/* Location */}

        <div className="mt-2 flex items-center gap-1.5 text-sm text-[#6B6252]">
          <MapPin
            size={14}
            className="shrink-0 text-[#8C6924]"
          />

          <span className="line-clamp-1">
            {property.areaName || "Unknown Area"}

            {property.city
              ? `, ${property.city}`
              : ""}
          </span>
        </div>

        {/* =================================================
            SPECS
            ================================================= */}

        {(property.bedrooms || property.area) && (
          <div className="mt-4 flex items-center gap-4 border-y border-[#EAE2CF] py-3 text-sm text-[#4A4436]">
            {property.bedrooms && (
              <span className="flex items-center gap-1.5">
                <BedDouble
                  size={15}
                  className="text-[#8A806D]"
                />

                {property.bedrooms} BHK
              </span>
            )}

            {property.bedrooms && property.area && (
              <span className="h-3.5 w-px bg-[#D8CFB9]" />
            )}

            {property.area && (
              <span className="flex items-center gap-1.5">
                <Ruler
                  size={15}
                  className="text-[#8A806D]"
                />

                {Number(property.area).toLocaleString(
                  "en-IN"
                )}{" "}
                sq ft
              </span>
            )}
          </div>
        )}

        {/* =================================================
            PRICE + ACTION
            ================================================= */}

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <div>
            {property.verified ? (
              <p className="flex items-center gap-1.5 text-xs text-[#3F6B52]">
                <CheckCircle2 size={13} />
                Verified listing
              </p>
            ) : (
              <p className="text-xs text-[#8A806D]">
                Property price
              </p>
            )}

            <p className="mt-1 text-xl font-medium tracking-tight text-[#201C15]">
              {formatPrice(property.price)}
            </p>
          </div>

          <Link
            to={detailPath}
            aria-label="View property details"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#D8CFB9] text-[#4A4436] transition group-hover:border-[#AD8332] group-hover:bg-[#AD8332] group-hover:text-[#171B21]"
          >
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;

