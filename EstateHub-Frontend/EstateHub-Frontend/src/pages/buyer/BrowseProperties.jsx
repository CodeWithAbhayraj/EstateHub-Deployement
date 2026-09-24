
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  ArrowDown,
  X,
  Building2,
  ShieldCheck,
  MapPin,
} from "lucide-react";

import { getPublishedProperties } from "../../api/propertyApi";
import {
  addFavorite,
  getMyFavorites,
  removeFavorite,
} from "../../api/favoriteApi";

import PropertySearch from "../../components/property/PropertySearch";
import PropertyFilter from "../../components/property/PropertyFilter";
import PropertyGrid from "../../components/property/PropertyGrid";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

export default function BrowseProperties() {
  const [properties, setProperties] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [filters, setFilters] = useState({
    cityId: "",
    areaId: "",
    propertyTypeId: "",
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const savedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch {}

  const role = user?.role?.replace("ROLE_", "")?.trim()?.toUpperCase();
  const isBuyer = role === "BUYER";

  const loadProperties = async (showFullLoader = true) => {
    try {
      if (showFullLoader) setLoading(true);
      else setRefreshing(true);

      setError("");

      const data = await getPublishedProperties();

      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load properties."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadFavorites = async () => {
    if (!isBuyer) {
      setFavoriteIds([]);
      return;
    }

    try {
      const data = await getMyFavorites();

      setFavoriteIds(
        Array.isArray(data) ? data.map((f) => f.propertyId) : []
      );
    } catch {
      setFavoriteIds([]);
    }
  };

  useEffect(() => {
    loadProperties();

    if (isBuyer) {
      loadFavorites();
    } else {
      setFavoriteIds([]);
    }
  }, [isBuyer]);

  const handleRefresh = async () => {
    await Promise.all([
      loadProperties(false),
      isBuyer ? loadFavorites() : Promise.resolve(),
    ]);
  };

  const handleFavorite = async (propertyId) => {
    if (!isBuyer) return;

    try {
      setError("");

      const isFav = favoriteIds.includes(propertyId);

      if (isFav) {
        await removeFavorite(propertyId);

        setFavoriteIds((prev) =>
          prev.filter((id) => String(id) !== String(propertyId))
        );
      } else {
        await addFavorite(propertyId);

        setFavoriteIds((prev) => [...prev, propertyId]);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update favorite."
      );
    }
  };

  const filteredProperties = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return properties.filter((p) => {
      const matchSearch =
        !search ||
        p.title?.toLowerCase().includes(search) ||
        p.city?.toLowerCase().includes(search) ||
        p.areaName?.toLowerCase().includes(search) ||
        p.propertyType?.toLowerCase().includes(search);

      const matchCity =
        !filters.cityId ||
        String(p.cityId) === String(filters.cityId);

      const matchArea =
        !filters.areaId ||
        String(p.areaId) === String(filters.areaId);

      const matchType =
        !filters.propertyTypeId ||
        String(p.propertyTypeId) === String(filters.propertyTypeId);

      return matchSearch && matchCity && matchArea && matchType;
    });
  }, [properties, searchText, filters]);

  const activeFilterCount = [
    filters.cityId,
    filters.areaId,
    filters.propertyTypeId,
  ].filter(Boolean).length;

  const resetAll = () => {
    setSearchText("");
    setFilters({
      cityId: "",
      areaId: "",
      propertyTypeId: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#201C15]">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#171B21]">
        {/* blueprint grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(216,184,118,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(216,184,118,1) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
          }}
        />

        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[#D8B876]/15" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[#D8B876]/10" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 lg:px-10 lg:pb-24 lg:pt-20">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D8B876]/30 bg-[#D8B876]/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D8B876]">
              <Sparkles size={13} />
              EstateHub Property Collection
            </div>

            <h1
              style={FRASER}
              className="text-5xl leading-[1.02] tracking-[-0.035em] text-[#FBF8F1] sm:text-6xl lg:text-7xl"
            >
              Find a place
              <span className="block text-[#D8B876]">
                worth coming home to.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#C5C0B7] sm:text-base">
              Explore verified properties, discover neighborhoods you
              love, and narrow down your search with powerful filters.
            </p>
          </div>

          {/* Hero stats */}
          <div className="mt-10 flex flex-wrap gap-3">
            <HeroStat
              icon={<Building2 size={15} />}
              value={loading ? "—" : properties.length}
              label="Listings"
            />

            <HeroStat
              icon={<ShieldCheck size={15} />}
              value="100%"
              label="Published"
            />

            <HeroStat
              icon={<MapPin size={15} />}
              value="India"
              label="Locations"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          SEARCH PANEL
      ====================================================== */}
      <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="border border-[#D8CFB9] bg-[#FBF8F1] p-3 shadow-[0_18px_50px_rgba(32,28,21,0.12)] sm:p-4">
          <div className="flex items-center gap-2 px-2 pb-3">
            <div className="flex h-7 w-7 items-center justify-center bg-[#201C15] text-[#D8B876]">
              <Search size={14} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A806D]">
                Property search
              </p>
              <p className="text-xs text-[#6B6252]">
                Search by property, city, area or type
              </p>
            </div>
          </div>

          <div className="rounded-sm border border-[#D8CFB9] bg-[#F8F5ED] p-1">
            <PropertySearch
              value={searchText}
              onChange={setSearchText}
              onSearch={setSearchText}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 lg:px-10">
        {/* Top controls */}
        <div className="mb-8 flex flex-col gap-5 border-b border-[#D8CFB9] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#AD8332]">
              <span className="h-px w-6 bg-[#AD8332]" />
              Property directory
            </div>

            <h2
              style={FRASER}
              className="mt-2 text-3xl tracking-[-0.025em] text-[#201C15] sm:text-4xl"
            >
              Explore properties
            </h2>

            <p className="mt-2 text-sm text-[#7B7365]">
              {loading
                ? "Preparing the latest listings..."
                : `${filteredProperties.length} ${
                    filteredProperties.length === 1
                      ? "property"
                      : "properties"
                  } available`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex h-10 items-center gap-2 border border-[#D8CFB9] bg-[#FBF8F1] px-4 text-xs font-semibold text-[#6B6252] transition hover:border-[#AD8332] hover:text-[#8C6924]"
              >
                <X size={14} />
                Clear filters
              </button>
            )}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="inline-flex h-10 items-center gap-2 bg-[#201C15] px-4 text-xs font-bold text-[#FBF8F1] transition hover:bg-[#AD8332] disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="mb-6 flex items-center justify-between gap-4 border border-[#D9A39C] bg-[#F9ECE9] px-4 py-3 text-sm text-[#9B463C]">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#B3564B]" />
              {error}
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-[#9B463C] hover:text-[#71332D]"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* =====================================================
            CONTENT GRID
        ====================================================== */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* FILTER SIDEBAR */}
          <aside>
            <div className="border border-[#D8CFB9] bg-[#FBF8F1] shadow-[0_8px_25px_rgba(32,28,21,0.035)] lg:sticky lg:top-24">
              <div className="border-b border-[#E2DAC9] px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal
                      size={15}
                      className="text-[#AD8332]"
                    />

                    <span className="text-xs font-bold uppercase tracking-[0.16em]">
                      Filters
                    </span>
                  </div>

                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-[#201C15] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#D8B876]">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <PropertyFilter onFilterChange={setFilters} />
              </div>

              <div className="border-t border-[#E2DAC9] bg-[#F2ECDF] px-5 py-4">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={17}
                    className="mt-0.5 shrink-0 text-[#3F6B52]"
                  />

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#4A4438]">
                      Verified collection
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#7B7365]">
                      Listings shown here are published through
                      EstateHub.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* PROPERTY AREA */}
          <section className="min-w-0">
            {/* Active search */}
            {(searchText || activeFilterCount > 0) && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {searchText && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#D8B876] bg-[#F2E7CD] px-3 py-1.5 text-xs text-[#76581D]">
                    <Search size={12} />
                    "{searchText}"

                    <button
                      type="button"
                      onClick={() => setSearchText("")}
                      className="ml-1 hover:text-[#201C15]"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#D8CFB9] bg-[#FBF8F1] px-3 py-1.5 text-xs text-[#6B6252]">
                    <SlidersHorizontal size={12} />
                    {activeFilterCount} active filter
                    {activeFilterCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <PropertySkeleton />
            ) : filteredProperties.length === 0 ? (
              <EmptyState onReset={resetAll} />
            ) : (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-xs font-medium text-[#8A806D]">
                    Showing{" "}
                    <span className="font-bold text-[#201C15]">
                      {filteredProperties.length}
                    </span>{" "}
                    results
                  </p>

                  <div className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#9A9285] sm:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3F6B52]" />
                    Live listings
                  </div>
                </div>

                <PropertyGrid
                  properties={filteredProperties}
                  favoriteIds={favoriteIds}
                  onFavorite={isBuyer ? handleFavorite : undefined}
                />
              </>
            )}
          </section>
        </div>

        {/* =====================================================
            BOTTOM CTA
        ====================================================== */}
        <section className="mt-16 overflow-hidden border border-[#D8CFB9] bg-[#201C15]">
          <div className="relative px-6 py-10 sm:px-10 lg:px-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(216,184,118,1) 1px, transparent 1px), linear-gradient(90deg, rgba(216,184,118,1) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D8B876]">
                  EstateHub
                </p>

                <h3
                  style={FRASER}
                  className="mt-2 text-2xl text-[#FBF8F1] sm:text-3xl"
                >
                  Your next address could be here.
                </h3>

                <p className="mt-2 max-w-xl text-sm text-[#A9A398]">
                  Keep exploring verified listings and discover a
                  property that matches your needs.
                </p>
              </div>

              <div className="hidden h-16 w-px bg-[#D8B876]/20 sm:block" />

              <div className="shrink-0 text-[#D8B876]">
                <ArrowDown size={22} />
              </div>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <div className="mt-8 flex items-center justify-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#9A9285]">
          <span className="h-px w-10 bg-[#D8CFB9]" />
          EstateHub · Property discovery
          <span className="h-px w-10 bg-[#D8CFB9]" />
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   HERO STAT
========================================================= */
function HeroStat({ icon, value, label }) {
  return (
    <div className="flex items-center gap-3 border border-[#D8B876]/20 bg-white/[0.035] px-4 py-3">
      <div className="text-[#D8B876]">{icon}</div>

      <div>
        <div className="text-sm font-semibold text-[#F4F0E8]">
          {value}
        </div>

        <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#888278]">
          {label}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   LOADING SKELETON
========================================================= */
function PropertySkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="overflow-hidden border border-[#D8CFB9] bg-[#FBF8F1]"
        >
          <div className="aspect-[4/3] animate-pulse bg-[#E8E1D3]" />

          <div className="space-y-4 p-5">
            <div className="h-3 w-20 animate-pulse bg-[#E3DBCB]" />
            <div className="h-5 w-3/4 animate-pulse bg-[#E3DBCB]" />
            <div className="h-3 w-1/2 animate-pulse bg-[#E3DBCB]" />

            <div className="flex gap-3 border-t border-[#E5DECF] pt-4">
              <div className="h-3 w-14 animate-pulse bg-[#E3DBCB]" />
              <div className="h-3 w-14 animate-pulse bg-[#E3DBCB]" />
              <div className="h-3 w-14 animate-pulse bg-[#E3DBCB]" />
            </div>

            <div className="h-6 w-1/3 animate-pulse bg-[#E3DBCB]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */
function EmptyState({ onReset }) {
  return (
    <div className="relative overflow-hidden border border-[#D8CFB9] bg-[#FBF8F1] px-6 py-20 text-center">
      <div className="absolute left-0 top-0 h-20 w-20 border-b border-r border-[#D8B876]/30" />
      <div className="absolute bottom-0 right-0 h-20 w-20 border-l border-t border-[#D8B876]/30" />

      <div className="relative">
        <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#D8B876] bg-[#F2ECDF] text-[#AD8332]">
          <Search size={24} strokeWidth={1.6} />
        </div>

        <h3
          style={FRASER}
          className="mt-6 text-3xl text-[#201C15]"
        >
          Nothing matched your search
        </h3>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#766E60]">
          Try another keyword or remove some filters to see more
          properties from the collection.
        </p>

        <button
          type="button"
          onClick={onReset}
          className="mt-7 bg-[#201C15] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#FBF8F1] transition hover:bg-[#AD8332]"
        >
          Reset search
        </button>
      </div>
    </div>
  );
}
