
import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, SlidersHorizontal, Sparkles } from "lucide-react";

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

  const token = localStorage.getItem("token");
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8F5ED]">
      {/* Blueprint background */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(173,131,50,0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(173,131,50,0.07) 1px, transparent 1px)
            `,
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <header className="mb-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#AD8332]">
                <span className="h-px w-8 bg-[#AD8332]" />
                Estate collection
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center border border-[#D8CFB9] bg-[#F2ECDF] text-[#8C6924]">
                  <Search size={19} strokeWidth={1.8} />
                </div>

                <div>
                  <h1
                    style={FRASER}
                    className="text-3xl font-semibold tracking-tight text-[#201C15] sm:text-4xl"
                  >
                    Browse Properties
                  </h1>

                  <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#6B6252]">
                    Explore verified property listings and find a place
                    that fits the way you want to live.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="inline-flex h-10 items-center justify-center gap-2 border border-[#D8CFB9] bg-[#201C15] px-4 text-sm font-semibold text-[#FBF8F1] transition hover:bg-[#2C2820] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh listings"}
            </button>
          </div>

          {/* Header rule */}
          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#D8CFB9]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A806D]">
              {loading
                ? "Loading collection"
                : `${filteredProperties.length} available`}
            </span>
            <span className="h-px flex-1 bg-[#D8CFB9]" />
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 border border-[#D9A39C] bg-[#F9ECE9] px-4 py-3 text-sm text-[#9B463C]">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#B3564B]" />
            <span>{error}</span>
          </div>
        )}

        {/* Search */}
        <section className="mb-5 border border-[#D8CFB9] bg-[#FBF8F1] p-3 shadow-[0_10px_30px_rgba(32,28,21,0.04)] sm:p-4">
          <div className="mb-2 flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A806D]">
            <Search size={13} />
            Search the collection
          </div>

          <PropertySearch
            value={searchText}
            onChange={setSearchText}
            onSearch={setSearchText}
          />
        </section>

        {/* Meta */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#D8CFB9] pb-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[#6B6252]">
            <span>
              {loading
                ? "Loading properties..."
                : `${filteredProperties.length} ${
                    filteredProperties.length === 1
                      ? "property"
                      : "properties"
                  } found`}
            </span>

            {activeFilterCount > 0 && (
              <span className="inline-flex items-center gap-1.5 border border-[#D8B876] bg-[#F2E7CD] px-2.5 py-1 text-xs font-semibold text-[#7B5C20]">
                <SlidersHorizontal size={12} />
                {activeFilterCount} filter
                {activeFilterCount > 1 ? "s" : ""} active
              </span>
            )}
          </div>

          {searchText && (
            <button
              type="button"
              onClick={() => setSearchText("")}
              className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8C6924] transition hover:text-[#5F471A]"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[270px_minmax(0,1fr)] xl:gap-8">
          {/* Filter */}
          <aside>
            <div className="sticky top-24 border border-[#D8CFB9] bg-[#FBF8F1] p-4 shadow-[0_10px_30px_rgba(32,28,21,0.035)]">
              <div className="mb-4 flex items-center justify-between border-b border-[#E4DCC9] pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal
                    size={15}
                    className="text-[#8C6924]"
                  />

                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#201C15]">
                    Refine
                  </span>
                </div>

                {activeFilterCount > 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#AD8332]">
                    {activeFilterCount} active
                  </span>
                )}
              </div>

              <PropertyFilter onFilterChange={setFilters} />
            </div>
          </aside>

          {/* Property collection */}
          <section className="min-w-0">
            {loading ? (
              <div className="flex min-h-[360px] items-center justify-center border border-[#D8CFB9] bg-[#FBF8F1] p-6">
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#D8B876] bg-[#F2ECDF]">
                    <RefreshCw
                      size={19}
                      className="animate-spin text-[#8C6924]"
                    />
                  </div>

                  <p className="mt-4 text-sm font-medium text-[#4A4436]">
                    Loading properties...
                  </p>

                  <p className="mt-1 text-xs text-[#8A806D]">
                    Preparing the latest listings
                  </p>
                </div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center border border-[#D8CFB9] bg-[#FBF8F1] px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center border border-[#D8B876] bg-[#F2ECDF] text-[#8C6924]">
                  <Sparkles size={19} strokeWidth={1.7} />
                </div>

                <h2
                  style={FRASER}
                  className="mt-5 text-2xl font-semibold text-[#201C15]"
                >
                  No properties found
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-[#6B6252]">
                  Try changing your search or removing one or more filters
                  to explore more listings.
                </p>

                {(searchText || activeFilterCount > 0) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchText("");
                      setFilters({
                        cityId: "",
                        areaId: "",
                        propertyTypeId: "",
                      });
                    }}
                    className="mt-5 border border-[#AD8332] bg-[#AD8332] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#8C6924]"
                  >
                    Reset search
                  </button>
                )}
              </div>
            ) : (
              <PropertyGrid
                properties={filteredProperties}
                favoriteIds={favoriteIds}
                onFavorite={isBuyer ? handleFavorite : undefined}
              />
            )}
          </section>
        </div>

        {/* Bottom note */}
        <div className="mt-10 flex items-center gap-3 border-t border-[#D8CFB9] pt-5">
          <div className="h-1.5 w-1.5 bg-[#AD8332]" />
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8A806D]">
            EstateHub · Curated property listings
          </p>
        </div>
      </div>
    </div>
  );
}

