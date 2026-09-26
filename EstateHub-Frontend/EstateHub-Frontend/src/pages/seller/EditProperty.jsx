
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle,
  Home,
  ImagePlus,
  MapPin,
  Save,
  Sparkles,
} from "lucide-react";

import { getPropertyById, updateProperty } from "../../api/propertyApi";
import {
  getAllCities,
  getAreasByCity,
  getPropertyTypesByArea,
} from "../../api/locationAdminApi";
import PropertyImageUpload from "./PropertyImageUpload";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

export default function EditProperty() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  const [cityId, setCityId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [propertyTypeId, setPropertyTypeId] = useState("");

  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingPropertyTypes, setLoadingPropertyTypes] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    area: "",
    bhk: "",
    furnished: "",
    parking: false,
    facing: "",
    readyToMove: false,
    newProject: false,
    resale: false,
    description: "",
  });

  const [originalStatus, setOriginalStatus] = useState("");
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================
     LOAD CITIES
  ========================= */

  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoadingCities(true);

        const data = await getAllCities();

        setCities(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load cities."
        );
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, []);

  /* =========================
     LOAD PROPERTY
  ========================= */

  useEffect(() => {
    if (!id) {
      setLoadingProperty(false);
      return;
    }

    const loadProperty = async () => {
      try {
        setLoadingProperty(true);

        const property = await getPropertyById(id);

        setFormData({
          title: property.title || "",
          price: property.price ?? "",
          area: property.area ?? "",
          bhk: property.bhk ?? "",
          furnished: property.furnished || "",
          parking: property.parking ?? false,
          facing: property.facing || "",
          readyToMove: property.readyToMove ?? false,
          newProject: property.newProject ?? false,
          resale: property.resale ?? false,
          description: property.description || "",
        });

        setCityId(
          property.cityId ? String(property.cityId) : ""
        );

        setAreaId(
          property.areaId ? String(property.areaId) : ""
        );

        setPropertyTypeId(
          property.propertyTypeId
            ? String(property.propertyTypeId)
            : ""
        );

        setOriginalStatus(property.status || "");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load property."
        );
      } finally {
        setLoadingProperty(false);
      }
    };

    loadProperty();
  }, [id]);

  /* =========================
     LOAD AREAS
  ========================= */

  useEffect(() => {
    if (!cityId) {
      setAreas([]);
      return;
    }

    const loadAreas = async () => {
      try {
        setLoadingAreas(true);

        const data = await getAreasByCity(cityId);

        setAreas(Array.isArray(data) ? data : []);
      } catch {
        setAreas([]);
      } finally {
        setLoadingAreas(false);
      }
    };

    loadAreas();
  }, [cityId]);

  /* =========================
     LOAD PROPERTY TYPES
  ========================= */

  useEffect(() => {
    if (!areaId) {
      setPropertyTypes([]);
      return;
    }

    const loadTypes = async () => {
      try {
        setLoadingPropertyTypes(true);

        const data = await getPropertyTypesByArea(areaId);

        setPropertyTypes(Array.isArray(data) ? data : []);
      } catch {
        setPropertyTypes([]);
      } finally {
        setLoadingPropertyTypes(false);
      }
    };

    loadTypes();
  }, [areaId]);

  /* =========================
     HANDLE CHANGE
  ========================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  /* =========================
     UPDATE PROPERTY
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!cityId) {
      return setError("Please select a city.");
    }

    if (!areaId) {
      return setError("Please select an area.");
    }

    if (!propertyTypeId) {
      return setError("Please select a property type.");
    }

    if (!formData.title.trim()) {
      return setError("Please enter property title.");
    }

    if (!formData.price || Number(formData.price) <= 0) {
      return setError("Price must be greater than 0.");
    }

    if (!formData.area || Number(formData.area) <= 0) {
      return setError("Area must be greater than 0.");
    }

    if (
      formData.bhk !== "" &&
      Number(formData.bhk) < 0
    ) {
      return setError("BHK cannot be negative.");
    }

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        price: Number(formData.price),
        area: Number(formData.area),
        bhk:
          formData.bhk !== ""
            ? Number(formData.bhk)
            : null,
        cityId: Number(cityId),
        areaId: Number(areaId),
        propertyTypeId: Number(propertyTypeId),
        furnished: formData.furnished || null,
        parking: formData.parking,
        facing: formData.facing.trim() || null,
        readyToMove: formData.readyToMove,
        newProject: formData.newProject,
        resale: formData.resale,
        description: formData.description.trim() || null,
      };

      const updated = await updateProperty(id, payload);

      setOriginalStatus(
        updated.status || originalStatus
      );

      setSuccess("Property updated successfully.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update property."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     STATUS
  ========================= */

  const getStatusMeta = (status) => {
    const map = {
      DRAFT: {
        label: "Draft",
        className:
          "border-[#D8CFB9] bg-[#F1EDE3] text-[#6B6252]",
      },

      PENDING_APPROVAL: {
        label: "Pending Approval",
        className:
          "border-[#E2CAA1] bg-[#F8EFD9] text-[#8C6924]",
      },

      PUBLISHED: {
        label: "Published",
        className:
          "border-[#B8CCBC] bg-[#EEF5EF] text-[#3F6B52]",
      },

      REJECTED: {
        label: "Rejected",
        className:
          "border-[#E4BBB5] bg-[#FBEEEB] text-[#9E473D]",
      },
    };

    return (
      map[status] || {
        label: status || "Unknown",
        className:
          "border-[#D8CFB9] bg-[#F1EDE3] text-[#6B6252]",
      }
    );
  };

  /* =========================
     LOADING
  ========================= */

  if (loadingProperty) {
    return (
      <div className="min-h-[70vh] bg-[#F8F5ED] px-4 py-10">
        <div className="mx-auto flex min-h-[55vh] max-w-5xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1]">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D8CFB9] border-t-[#201C15]" />
            </div>

            <p className="mt-4 text-sm font-semibold text-[#6B6252]">
              Loading property...
            </p>

            <p className="mt-1 text-xs text-[#968D7C]">
              Preparing your property details
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statusMeta = getStatusMeta(originalStatus);

  return (
    <div className="min-h-screen bg-[#F8F5ED] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/seller/properties")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6B6252] transition hover:text-[#201C15]"
          >
            <ArrowLeft size={17} />
            Back to my properties
          </button>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px w-8 bg-[#AD8332]" />

                <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#AD8332]">
                  Seller workspace
                </span>
              </div>

              <h1
                style={FRASER}
                className="text-4xl leading-tight text-[#201C15] sm:text-5xl"
              >
                Edit your property.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#756D5E] sm:text-base">
                Update the listing details, keep the information accurate,
                and manage your property images.
              </p>
            </div>

            {originalStatus && (
              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${statusMeta.className}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {statusMeta.label}
              </div>
            )}
          </div>
        </div>

        {/* ALERTS */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#E4BBB5] bg-[#FBEEEB] px-4 py-4 text-sm text-[#9E473D]">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#B3564B] text-xs font-bold text-white">
              !
            </span>

            <span className="flex-1">{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-bold hover:text-[#7E352D]"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#B8CCBC] bg-[#EEF5EF] px-4 py-4 text-sm text-[#3F6B52]">
            <CheckCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>{success}</span>
          </div>
        )}

        {/* PROGRESS */}

        <div className="mb-7 grid gap-3 sm:grid-cols-3">
          <ProgressStep
            number="01"
            title="Property details"
            active
          />

          <ProgressStep
            number="02"
            title="Property images"
          />

          <ProgressStep
            number="03"
            title="Admin review"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* MAIN FORM */}

            <div className="space-y-6">
              {/* LOCATION */}

              <section className="rounded-[26px] border border-[#D8CFB9] bg-[#FBF8F1] p-5 shadow-[0_14px_45px_rgba(32,28,21,0.045)] sm:p-7">
                <SectionHeading
                  number="01"
                  icon={<MapPin size={18} />}
                  eyebrow="Location"
                  title="Where is the property?"
                  description="Update the location hierarchy from your EstateHub database."
                />

                <div className="mt-7 grid gap-5 md:grid-cols-3">
                  <FormField label="City" required>
                    <select
                      value={cityId}
                      onChange={(e) => {
                        setCityId(e.target.value);
                        setAreaId("");
                        setPropertyTypeId("");
                      }}
                      disabled={loadingCities}
                      className={selectClass}
                    >
                      <option value="">
                        {loadingCities
                          ? "Loading cities..."
                          : "Select City"}
                      </option>

                      {cities.map((city) => (
                        <option
                          key={city.id}
                          value={city.id}
                        >
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Area" required>
                    <select
                      value={areaId}
                      onChange={(e) => {
                        setAreaId(e.target.value);
                        setPropertyTypeId("");
                      }}
                      disabled={!cityId || loadingAreas}
                      className={selectClass}
                    >
                      <option value="">
                        {!cityId
                          ? "Select city first"
                          : loadingAreas
                          ? "Loading areas..."
                          : "Select Area"}
                      </option>

                      {areas.map((area) => (
                        <option
                          key={area.id}
                          value={area.id}
                        >
                          {area.name}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Property type" required>
                    <select
                      value={propertyTypeId}
                      onChange={(e) =>
                        setPropertyTypeId(e.target.value)
                      }
                      disabled={
                        !areaId || loadingPropertyTypes
                      }
                      className={selectClass}
                    >
                      <option value="">
                        {!areaId
                          ? "Select area first"
                          : loadingPropertyTypes
                          ? "Loading types..."
                          : "Select Property Type"}
                      </option>

                      {propertyTypes.map((type) => (
                        <option
                          key={type.id}
                          value={type.id}
                        >
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>
              </section>

              {/* BASIC DETAILS */}

              <section className="rounded-[26px] border border-[#D8CFB9] bg-[#FBF8F1] p-5 shadow-[0_14px_45px_rgba(32,28,21,0.045)] sm:p-7">
                <SectionHeading
                  number="02"
                  icon={<Home size={18} />}
                  eyebrow="Basic details"
                  title="Keep the listing accurate."
                  description="Update the core property information buyers will see."
                />

                <div className="mt-7 space-y-5">
                  <FormField label="Property title" required>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Spacious 2 BHK Flat in Baner"
                      className={inputClass}
                    />
                  </FormField>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <FormField label="Price" required>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="1"
                        className={inputClass}
                      />
                    </FormField>

                    <FormField label="Area (sq.ft)" required>
                      <input
                        type="number"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        min="1"
                        step="0.01"
                        className={inputClass}
                      />
                    </FormField>

                    <FormField label="BHK">
                      <input
                        type="number"
                        name="bhk"
                        value={formData.bhk}
                        onChange={handleChange}
                        min="0"
                        className={inputClass}
                      />
                    </FormField>

                    <FormField label="Furnished">
                      <select
                        name="furnished"
                        value={formData.furnished}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        <option value="">Select</option>
                        <option value="Furnished">
                          Furnished
                        </option>
                        <option value="Semi-Furnished">
                          Semi-Furnished
                        </option>
                        <option value="Unfurnished">
                          Unfurnished
                        </option>
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Facing">
                    <select
                      name="facing"
                      value={formData.facing}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option value="">
                        Select Facing
                      </option>

                      {[
                        "North",
                        "South",
                        "East",
                        "West",
                        "North-East",
                        "North-West",
                        "South-East",
                        "South-West",
                      ].map((direction) => (
                        <option
                          key={direction}
                          value={direction}
                        >
                          {direction}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>
              </section>

              {/* OPTIONS */}

              <section className="rounded-[26px] border border-[#D8CFB9] bg-[#FBF8F1] p-5 shadow-[0_14px_45px_rgba(32,28,21,0.045)] sm:p-7">
                <SectionHeading
                  number="03"
                  icon={<Sparkles size={18} />}
                  eyebrow="Features"
                  title="Highlight the important details."
                  description="Select only the features that accurately describe this property."
                />

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <CheckboxOption
                    name="parking"
                    checked={formData.parking}
                    onChange={handleChange}
                    title="Parking available"
                    description="The property includes parking."
                  />

                  <CheckboxOption
                    name="readyToMove"
                    checked={formData.readyToMove}
                    onChange={handleChange}
                    title="Ready to move"
                    description="Available for immediate possession."
                  />

                  <CheckboxOption
                    name="newProject"
                    checked={formData.newProject}
                    onChange={handleChange}
                    title="New project"
                    description="Part of a new development."
                  />

                  <CheckboxOption
                    name="resale"
                    checked={formData.resale}
                    onChange={handleChange}
                    title="Resale property"
                    description="Previously owned property."
                  />
                </div>
              </section>

              {/* DESCRIPTION */}

              <section className="rounded-[26px] border border-[#D8CFB9] bg-[#FBF8F1] p-5 shadow-[0_14px_45px_rgba(32,28,21,0.045)] sm:p-7">
                <SectionHeading
                  number="04"
                  icon={<Building2 size={18} />}
                  eyebrow="Description"
                  title="Add more context."
                  description="Give buyers useful information about the property and its surroundings."
                />

                <div className="mt-7">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={7}
                    placeholder="Describe the property, amenities, floor, surroundings, nearby facilities, or any other useful information..."
                    className={`${inputClass} resize-none leading-7`}
                  />

                  <p className="mt-2 text-right text-xs text-[#968D7C]">
                    Keep the description clear and useful.
                  </p>
                </div>
              </section>

              {/* SAVE */}

              <section className="rounded-[26px] border border-[#D8CFB9] bg-[#FBF8F1] p-5 shadow-[0_14px_45px_rgba(32,28,21,0.045)] sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD8332]">
                      Save changes
                    </p>

                    <h3
                      style={FRASER}
                      className="mt-1 text-2xl text-[#201C15]"
                    >
                      Ready to update?
                    </h3>

                    <p className="mt-1 text-sm text-[#756D5E]">
                      Your existing property status will remain unchanged.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/seller/properties")
                      }
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8CFB9] bg-[#FBF8F1] px-5 py-3 text-sm font-bold text-[#201C15] transition hover:border-[#AD8332] hover:bg-[#F7F4EC] disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#201C15] px-5 py-3 text-sm font-bold text-[#FBF8F1] transition hover:bg-[#2C2820] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Update property
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* SIDE PANEL */}

            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="overflow-hidden rounded-[26px] border border-[#D8CFB9] bg-[#201C15] text-[#FBF8F1] shadow-[0_18px_55px_rgba(32,28,21,0.12)]">
                <div
                  className="relative overflow-hidden px-6 py-7"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(216,184,118,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(216,184,118,.08) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                >
                  <div className="relative">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#D8B876]/25 bg-[#D8B876]/10 text-[#D8B876]">
                      <Save size={19} />
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D8B876]">
                      Editing property
                    </p>

                    <h2
                      style={FRASER}
                      className="mt-2 text-2xl leading-tight"
                    >
                      Keep your listing precise.
                    </h2>
                  </div>
                </div>

                <div className="space-y-5 px-6 py-6">
                  <InfoItem
                    title="Location"
                    text="City, area and property type are connected to your existing location data."
                  />

                  <InfoItem
                    title="Property details"
                    text="Update price, area, BHK, furnishing, facing and other features."
                  />

                  <InfoItem
                    title="Images"
                    text="Manage your existing property images separately below."
                  />

                  <InfoItem
                    title="Current status"
                    text={`This property is currently marked as ${
                      statusMeta.label
                    }.`}
                  />
                </div>
              </div>

              {/* PROPERTY ID */}

              <div className="mt-4 rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8A806D]">
                      Property ID
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#201C15]">
                      #{id}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0E9D9] text-[#8C6924]">
                    <Building2 size={18} />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </form>

        {/* IMAGE MANAGEMENT */}

        <section className="mt-6 overflow-hidden rounded-[26px] border border-[#D8CFB9] bg-[#FBF8F1] shadow-[0_14px_45px_rgba(32,28,21,0.045)]">
          <div className="border-b border-[#E4DCC9] bg-[#F7F4EC] px-5 py-6 sm:px-7">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#201C15] text-[#D8B876]">
                <ImagePlus size={19} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#AD8332]">
                  Media management
                </p>

                <h2
                  style={FRASER}
                  className="mt-1 text-2xl text-[#201C15] sm:text-3xl"
                >
                  Property images
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#756D5E]">
                  Manage existing images or upload new photographs for this
                  property.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <PropertyImageUpload propertyId={Number(id)} />
          </div>
        </section>

        {/* BOTTOM */}

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-[#D8CFB9] py-6 sm:flex-row">
          <p className="text-xs leading-5 text-[#8A806D]">
            EstateHub seller workspace · Property #{id}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(`/properties/${id}`)
            }
            className="inline-flex items-center gap-2 text-sm font-bold text-[#8C6924] transition hover:text-[#201C15]"
          >
            View property
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function ProgressStep({
  number,
  title,
  active = false,
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
        active
          ? "border-[#AD8332]/40 bg-[#FBF8F1]"
          : "border-[#E4DCC9] bg-[#F7F4EC]"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
          active
            ? "bg-[#201C15] text-[#D8B876]"
            : "bg-[#E5DFD1] text-[#8A806D]"
        }`}
      >
        {number}
      </div>

      <div>
        <p
          className={`text-sm font-bold ${
            active
              ? "text-[#201C15]"
              : "text-[#8A806D]"
          }`}
        >
          {title}
        </p>

        <p className="text-[11px] text-[#A29A8A]">
          {active ? "Current section" : "Next section"}
        </p>
      </div>
    </div>
  );
}

function SectionHeading({
  number,
  icon,
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="flex gap-4">
      <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#201C15] text-[#D8B876] sm:flex">
        {icon}
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-[0.18em] text-[#AD8332]">
            {number}
          </span>

          <span className="h-px w-8 bg-[#D8CFB9]" />

          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A806D]">
            {eyebrow}
          </span>
        </div>

        <h2
          style={FRASER}
          className="mt-2 text-2xl text-[#201C15] sm:text-3xl"
        >
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#756D5E]">
          {description}
        </p>
      </div>
    </div>
  );
}

function FormField({
  label,
  required = false,
  children,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#6B6252]">
        {label}

        {required && (
          <span className="ml-1 text-[#AD8332]">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function CheckboxOption({
  name,
  checked,
  onChange,
  title,
  description,
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
        checked
          ? "border-[#AD8332]/50 bg-[#F6EEDC]"
          : "border-[#E4DCC9] bg-[#F7F4EC] hover:border-[#CBBF9F]"
      }`}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 accent-[#8C6924]"
      />

      <span>
        <span className="block text-sm font-bold text-[#201C15]">
          {title}
        </span>

        <span className="mt-1 block text-xs leading-5 text-[#756D5E]">
          {description}
        </span>
      </span>
    </label>
  );
}

function InfoItem({ title, text }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D8B876]/15 text-[#D8B876]">
        <CheckCircle size={14} />
      </div>

      <div>
        <p className="text-sm font-semibold text-[#F5F0E6]">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-[#AFA99D]">
          {text}
        </p>
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const inputClass =
  "w-full rounded-2xl border border-[#D8CFB9] bg-[#F7F4EC] px-4 py-3.5 text-sm text-[#201C15] outline-none transition placeholder:text-[#A29A8A] focus:border-[#AD8332] focus:bg-[#FBF8F1] focus:ring-4 focus:ring-[#AD8332]/10";

const selectClass =
  "w-full rounded-2xl border border-[#D8CFB9] bg-[#F7F4EC] px-4 py-3.5 text-sm text-[#201C15] outline-none transition focus:border-[#AD8332] focus:bg-[#FBF8F1] focus:ring-4 focus:ring-[#AD8332]/10 disabled:cursor-not-allowed disabled:opacity-55";

