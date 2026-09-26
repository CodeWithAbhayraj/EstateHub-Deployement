
import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Building2,
  Layers3,
  RefreshCw,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

import {
  getAllCities,
  createCity,
  getAreasByCity,
  createArea,
  getPropertyTypesByArea,
  createPropertyType,
} from "../../api/locationAdminApi";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

function LocationsManagement() {
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [cityName, setCityName] = useState("");
  const [cityLoading, setCityLoading] = useState(false);

  const [areas, setAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [areaName, setAreaName] = useState("");
  const [areaLoading, setAreaLoading] = useState(false);

  const [propertyTypes, setPropertyTypes] = useState([]);
  const [propertyTypeName, setPropertyTypeName] = useState("");
  const [propertyTypeLoading, setPropertyTypeLoading] = useState(false);

  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingPropertyTypes, setLoadingPropertyTypes] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchCity, setSearchCity] = useState("");
  const [searchArea, setSearchArea] = useState("");
  const [searchPropertyType, setSearchPropertyType] = useState("");

  // ==========================================
  // LOAD CITIES
  // ==========================================

  const fetchCities = async (showFullLoader = true) => {
    try {
      showFullLoader ? setLoadingCities(true) : setRefreshing(true);
      setError("");

      const data = await getAllCities();
      const cityList = Array.isArray(data) ? data : [];
      setCities(cityList);

      if (cityList.length === 0) {
        setSelectedCityId("");
        setSelectedAreaId("");
        setAreas([]);
        setPropertyTypes([]);
        return;
      }

      const currentCityExists = cityList.some(
        (city) => String(city.id) === String(selectedCityId)
      );

      if (!currentCityExists) {
        setSelectedCityId(String(cityList[0].id));
      }
    } catch (err) {
      console.error("Cities error:", err);
      setError(err.response?.data?.message || "Failed to load cities.");
    } finally {
      setLoadingCities(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // ==========================================
  // LOAD AREAS
  // ==========================================

  const fetchAreas = async (cityId) => {
    if (!cityId) {
      setAreas([]);
      setSelectedAreaId("");
      setPropertyTypes([]);
      return;
    }

    try {
      setLoadingAreas(true);
      setError("");

      const data = await getAreasByCity(cityId);
      const areaList = Array.isArray(data) ? data : [];

      setAreas(areaList);

      if (areaList.length > 0) {
        const existingArea = areaList.find(
          (area) => String(area.id) === String(selectedAreaId)
        );

        if (!existingArea) {
          setSelectedAreaId(String(areaList[0].id));
        }
      } else {
        setSelectedAreaId("");
        setPropertyTypes([]);
      }
    } catch (err) {
      console.error("Areas error:", err);
      setAreas([]);
      setSelectedAreaId("");
      setPropertyTypes([]);
      setError(err.response?.data?.message || "Failed to load areas.");
    } finally {
      setLoadingAreas(false);
    }
  };

  useEffect(() => {
    fetchAreas(selectedCityId);
  }, [selectedCityId]);

  // ==========================================
  // LOAD PROPERTY TYPES
  // ==========================================

  const fetchPropertyTypes = async (areaId) => {
    if (!areaId) {
      setPropertyTypes([]);
      return;
    }

    try {
      setLoadingPropertyTypes(true);
      setError("");

      const data = await getPropertyTypesByArea(areaId);
      setPropertyTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Property types error:", err);
      setPropertyTypes([]);
      setError(
        err.response?.data?.message || "Failed to load property types."
      );
    } finally {
      setLoadingPropertyTypes(false);
    }
  };

  useEffect(() => {
    fetchPropertyTypes(selectedAreaId);
  }, [selectedAreaId]);

  // ==========================================
  // SELECT
  // ==========================================

  const handleSelectCity = (cityId) => {
    setSelectedCityId(String(cityId));
    setSelectedAreaId("");
    setAreas([]);
    setPropertyTypes([]);
    setError("");
    setSuccess("");
  };

  const handleSelectArea = (areaId) => {
    setSelectedAreaId(String(areaId));
    setPropertyTypes([]);
    setError("");
    setSuccess("");
  };

  // ==========================================
  // CREATE CITY
  // ==========================================

  const handleCreateCity = async (event) => {
    event.preventDefault();

    const name = cityName.trim();

    if (!name) {
      setSuccess("");
      setError("Please enter city name.");
      return;
    }

    try {
      setCityLoading(true);
      setError("");
      setSuccess("");

      const newCity = await createCity({ name });

      setCities((prev) => [...prev, newCity]);
      setCityName("");
      setSelectedCityId(String(newCity.id));
      setSuccess("City created successfully.");
    } catch (err) {
      console.error("Create city error:", err);
      setError(err.response?.data?.message || "Failed to create city.");
    } finally {
      setCityLoading(false);
    }
  };

  // ==========================================
  // CREATE AREA
  // ==========================================

  const handleCreateArea = async (event) => {
    event.preventDefault();

    const name = areaName.trim();

    if (!selectedCityId) {
      setSuccess("");
      setError("Please select a city.");
      return;
    }

    if (!name) {
      setSuccess("");
      setError("Please enter area name.");
      return;
    }

    try {
      setAreaLoading(true);
      setError("");
      setSuccess("");

      const newArea = await createArea(Number(selectedCityId), { name });

      setAreas((prev) => [...prev, newArea]);
      setAreaName("");
      setSelectedAreaId(String(newArea.id));
      setSuccess("Area created successfully.");
    } catch (err) {
      console.error("Create area error:", err);
      setError(err.response?.data?.message || "Failed to create area.");
    } finally {
      setAreaLoading(false);
    }
  };

  // ==========================================
  // CREATE PROPERTY TYPE
  // ==========================================

  const handleCreatePropertyType = async (event) => {
    event.preventDefault();

    const name = propertyTypeName.trim();

    if (!selectedAreaId) {
      setSuccess("");
      setError("Please select an area.");
      return;
    }

    if (!name) {
      setSuccess("");
      setError("Please enter property type name.");
      return;
    }

    try {
      setPropertyTypeLoading(true);
      setError("");
      setSuccess("");

      const newPropertyType = await createPropertyType(
        Number(selectedAreaId),
        { name }
      );

      setPropertyTypes((prev) => [...prev, newPropertyType]);
      setPropertyTypeName("");
      setSuccess("Property type created successfully.");
    } catch (err) {
      console.error("Create property type error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create property type."
      );
    } finally {
      setPropertyTypeLoading(false);
    }
  };

  // ==========================================
  // FILTERED DATA
  // ==========================================

  const filteredCities = useMemo(() => {
    const value = searchCity.toLowerCase().trim();

    return cities.filter((city) =>
      String(city.name || "")
        .toLowerCase()
        .includes(value)
    );
  }, [cities, searchCity]);

  const filteredAreas = useMemo(() => {
    const value = searchArea.toLowerCase().trim();

    return areas.filter((area) =>
      String(area.name || "")
        .toLowerCase()
        .includes(value)
    );
  }, [areas, searchArea]);

  const filteredPropertyTypes = useMemo(() => {
    const value = searchPropertyType.toLowerCase().trim();

    return propertyTypes.filter((type) =>
      String(type.name || "")
        .toLowerCase()
        .includes(value)
    );
  }, [propertyTypes, searchPropertyType]);

  const selectedCity = cities.find(
    (city) => String(city.id) === String(selectedCityId)
  );

  const selectedArea = areas.find(
    (area) => String(area.id) === String(selectedAreaId)
  );

  const cityCount = cities.length;
  const areaCount = areas.length;
  const propertyTypeCount = propertyTypes.length;

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative mb-6 overflow-hidden rounded-[28px] bg-[#171B21] px-5 py-6 text-white shadow-[0_24px_70px_rgba(23,27,33,0.14)] sm:px-7 sm:py-7">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D8B876]">
              <span className="h-px w-7 bg-[#D8B876]" />
              EstateHub Admin
            </div>

            <h1
              style={FRASER}
              className="text-3xl leading-tight tracking-[-0.03em] sm:text-4xl"
            >
              Location architecture.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
              Build the location hierarchy behind your property marketplace —
              city, area and property type.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchCities(false)}
            disabled={loadingCities || refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh data"}
          </button>
        </div>
      </section>

      {/* ALERTS */}
      {error && (
        <div
          className="mb-4 flex items-start gap-3 rounded-2xl border border-[#E6C6C0] bg-[#FFF7F5] p-4 text-sm text-[#A34C43]"
          role="alert"
        >
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="mb-4 flex items-start gap-3 rounded-2xl border border-[#C9D8CD] bg-[#F4F8F5] p-4 text-sm text-[#3F6B52]"
          role="status"
        >
          <CheckCircle size={17} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* STATS */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Cities"
          value={cityCount}
          icon={MapPin}
          eyebrow="01"
        />

        <StatCard
          label="Areas"
          value={areaCount}
          icon={Building2}
          eyebrow="02"
        />

        <StatCard
          label="Property types"
          value={propertyTypeCount}
          icon={Layers3}
          eyebrow="03"
        />
      </div>

      {/* CURRENT SELECTION */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1]">
        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A806D]">
              Current selection
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <SelectionItem
                active={Boolean(selectedCity)}
                value={selectedCity?.name || "Select city"}
              />

              <ChevronRight size={14} className="text-[#B8AE9B]" />

              <SelectionItem
                active={Boolean(selectedArea)}
                value={selectedArea?.name || "Select area"}
              />

              <ChevronRight size={14} className="text-[#B8AE9B]" />

              <span className="font-medium text-[#8A806D]">
                Property types
              </span>
            </div>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8CFB9] text-[#8C6924]">
            <ArrowUpRight size={16} />
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* CITIES */}
        <LocationPanel
          title="Cities"
          subtitle={`${cityCount} ${
            cityCount === 1 ? "city" : "cities"
          }`}
          icon={MapPin}
          index="01"
        >
          <CreateForm
            label="Add city"
            value={cityName}
            onChange={setCityName}
            onSubmit={handleCreateCity}
            placeholder="e.g. Pune"
            buttonClass="bg-[#201C15] hover:bg-[#312A20]"
            loading={cityLoading}
          />

          <SearchInput
            value={searchCity}
            onChange={setSearchCity}
            placeholder="Search cities..."
          />

          <div className="mt-3">
            {loadingCities ? (
              <LoadingText text="Loading cities..." />
            ) : filteredCities.length === 0 ? (
              <EmptyText text="No cities found." />
            ) : (
              <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                {filteredCities.map((city) => {
                  const active =
                    String(city.id) === String(selectedCityId);

                  return (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleSelectCity(city.id)}
                      className={`group w-full rounded-xl border px-3 py-3 text-left transition ${
                        active
                          ? "border-[#C7A45D] bg-[#F7F0DF]"
                          : "border-[#E4DCC9] bg-[#FCFAF5] hover:border-[#CFC4AE] hover:bg-[#F8F5ED]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${
                              active
                                ? "bg-[#AD8332]"
                                : "bg-[#D8CFB9]"
                            }`}
                          />

                          <span className="truncate text-sm font-semibold text-[#29251E]">
                            {city.name}
                          </span>
                        </div>

                        <span className="shrink-0 text-[10px] font-medium text-[#A49A87]">
                          #{city.id}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </LocationPanel>

        {/* AREAS */}
        <LocationPanel
          title="Areas"
          subtitle={
            selectedCity
              ? `Inside ${selectedCity.name}`
              : "Select a city"
          }
          icon={Building2}
          index="02"
        >
          <CreateForm
            label="Add area"
            value={areaName}
            onChange={setAreaName}
            onSubmit={handleCreateArea}
            placeholder={
              selectedCityId ? "e.g. Baner" : "Select city first"
            }
            disabled={!selectedCityId}
            buttonClass="bg-[#8C6924] hover:bg-[#76581E]"
            loading={areaLoading}
          />

          <SearchInput
            value={searchArea}
            onChange={setSearchArea}
            placeholder={
              selectedCityId
                ? "Search areas..."
                : "Select city first"
            }
            disabled={!selectedCityId}
          />

          <div className="mt-3">
            {!selectedCityId ? (
              <EmptyText text="Select a city to view areas." />
            ) : loadingAreas ? (
              <LoadingText text="Loading areas..." />
            ) : filteredAreas.length === 0 ? (
              <EmptyText text="No areas found." />
            ) : (
              <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                {filteredAreas.map((area) => {
                  const active =
                    String(area.id) === String(selectedAreaId);

                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => handleSelectArea(area.id)}
                      className={`group w-full rounded-xl border px-3 py-3 text-left transition ${
                        active
                          ? "border-[#C7A45D] bg-[#F7F0DF]"
                          : "border-[#E4DCC9] bg-[#FCFAF5] hover:border-[#CFC4AE] hover:bg-[#F8F5ED]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${
                              active
                                ? "bg-[#AD8332]"
                                : "bg-[#D8CFB9]"
                            }`}
                          />

                          <span className="truncate text-sm font-semibold text-[#29251E]">
                            {area.name}
                          </span>
                        </div>

                        <span className="shrink-0 text-[10px] font-medium text-[#A49A87]">
                          #{area.id}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </LocationPanel>

        {/* PROPERTY TYPES */}
        <LocationPanel
          title="Property types"
          subtitle={
            selectedArea
              ? `Inside ${selectedArea.name}`
              : "Select an area"
          }
          icon={Layers3}
          index="03"
        >
          <CreateForm
            label="Add property type"
            value={propertyTypeName}
            onChange={setPropertyTypeName}
            onSubmit={handleCreatePropertyType}
            placeholder={
              selectedAreaId
                ? "e.g. 2 BHK Flat"
                : "Select area first"
            }
            disabled={!selectedAreaId}
            buttonClass="bg-[#3F6B52] hover:bg-[#315540]"
            loading={propertyTypeLoading}
          />

          <SearchInput
            value={searchPropertyType}
            onChange={setSearchPropertyType}
            placeholder={
              selectedAreaId
                ? "Search property types..."
                : "Select area first"
            }
            disabled={!selectedAreaId}
          />

          <div className="mt-3">
            {!selectedAreaId ? (
              <EmptyText text="Select an area to view property types." />
            ) : loadingPropertyTypes ? (
              <LoadingText text="Loading property types..." />
            ) : filteredPropertyTypes.length === 0 ? (
              <EmptyText text="No property types found." />
            ) : (
              <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                {filteredPropertyTypes.map((type) => (
                  <div
                    key={type.id}
                    className="rounded-xl border border-[#E4DCC9] bg-[#FCFAF5] px-3 py-3 transition hover:border-[#CFC4AE]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#AD8332]" />

                        <span className="truncate text-sm font-semibold text-[#29251E]">
                          {type.name}
                        </span>
                      </div>

                      <span className="shrink-0 text-[10px] font-medium text-[#A49A87]">
                        #{type.id}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </LocationPanel>
      </div>

      {/* FOOTER INFO */}
      <section className="mt-6 overflow-hidden rounded-2xl bg-[#201C15] px-5 py-5 text-white sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p
              style={FRASER}
              className="text-lg text-white"
            >
              City → Area → Property Type
            </p>

            <p className="mt-1 text-xs leading-5 text-white/50">
              Property types are created inside the selected area.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <SummaryBadge label="Cities" value={cityCount} />
            <SummaryBadge label="Areas" value={areaCount} />
            <SummaryBadge label="Types" value={propertyTypeCount} />
          </div>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// LOCATION PANEL
// ==========================================

function LocationPanel({
  title,
  subtitle,
  icon: Icon,
  index,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-[#D8CFB9] bg-[#FBF8F1] shadow-[0_12px_35px_rgba(47,39,27,0.05)]">
      <div className="border-b border-[#E4DCC9] px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#201C15] text-[#D8B876]">
              <Icon size={18} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-[#201C15]">
                {title}
              </h2>

              <p className="truncate text-xs text-[#8A806D]">
                {subtitle}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold tracking-[0.15em] text-[#AD8332]">
            {index}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

// ==========================================
// CREATE FORM
// ==========================================

function CreateForm({
  label,
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled = false,
  loading = false,
  buttonClass,
}) {
  return (
    <form onSubmit={onSubmit} className="mb-3">
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B6252]">
        {label}
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="min-w-0 flex-1 rounded-xl border border-[#D8CFB9] bg-white px-3 py-2.5 text-sm text-[#29251E] outline-none placeholder:text-[#AAA18F] transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10 disabled:cursor-not-allowed disabled:bg-[#F0ECE2]"
        />

        <button
          type="submit"
          disabled={disabled || loading}
          className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${buttonClass}`}
        >
          {loading ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Plus size={14} />
          )}

          <span className="hidden sm:inline">
            {loading ? "Adding..." : "Add"}
          </span>
        </button>
      </div>
    </form>
  );
}

// ==========================================
// SEARCH INPUT
// ==========================================

function SearchInput({
  value,
  onChange,
  placeholder,
  disabled = false,
}) {
  return (
    <div className="relative">
      <Search
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9D9483]"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border border-[#D8CFB9] bg-white py-2.5 pl-9 pr-3 text-sm text-[#29251E] outline-none placeholder:text-[#AAA18F] transition focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10 disabled:cursor-not-allowed disabled:bg-[#F0ECE2]"
      />
    </div>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({ label, value, icon: Icon, eyebrow }) {
  return (
    <div className="group rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1] p-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(47,39,27,0.07)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold tracking-[0.18em] text-[#AD8332]">
            {eyebrow}
          </span>

          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#8A806D]">
            {label}
          </p>

          <p
            style={FRASER}
            className="mt-1 text-3xl tracking-[-0.03em] text-[#201C15]"
          >
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#201C15] text-[#D8B876]">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SELECTION ITEM
// ==========================================

function SelectionItem({ active, value }) {
  return (
    <span
      className={
        active
          ? "rounded-full bg-[#F2E6C9] px-3 py-1.5 font-bold text-[#8C6924]"
          : "rounded-full border border-[#E4DCC9] px-3 py-1.5 font-medium text-[#A29A89]"
      }
    >
      {value}
    </span>
  );
}

// ==========================================
// LOADING / EMPTY
// ==========================================

function LoadingText({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#D8CFB9] border-t-[#AD8332]" />

      <p className="mt-3 text-xs text-[#9A9180]">
        {text}
      </p>
    </div>
  );
}

function EmptyText({ text }) {
  return (
    <div className="rounded-xl border border-dashed border-[#D8CFB9] bg-[#F8F5ED] py-10 text-center">
      <p className="text-sm text-[#9A9180]">{text}</p>
    </div>
  );
}

// ==========================================
// SUMMARY BADGE
// ==========================================

function SummaryBadge({ label, value }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2">
      <span className="text-[11px] text-white/50">
        {label}
      </span>

      <span className="text-sm font-bold text-[#D8B876]">
        {value}
      </span>
    </div>
  );
}

export default LocationsManagement;

