
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle,
  Home,
  MapPin,
  Save,
  Sparkles,
} from "lucide-react";

import { createProperty } from "../../api/propertyApi";
import {
  getAllCities,
  getAreasByCity,
  getPropertyTypesByArea,
} from "../../api/locationAdminApi";
import PropertyImageUpload from "./PropertyImageUpload";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

function AddProperty() {
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  const [cityId, setCityId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [propertyTypeId, setPropertyTypeId] = useState("");

  const [loadingCities, setLoadingCities] = useState(false);
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

  const [createdPropertyId, setCreatedPropertyId] = useState(null);
  const [createdProperty, setCreatedProperty] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================
     LOAD CITIES
  ========================= */

  useEffect(() => {
    const loadCities = async () => {
      setLoadingCities(true);

      try {
        const response = await getAllCities();
        setCities(Array.isArray(response) ? response : []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Unable to load cities. Please try again."
        );
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, []);

  /* =========================
     LOAD AREAS
  ========================= */

  useEffect(() => {
    if (!cityId) {
      setAreas([]);
      setAreaId("");
      setPropertyTypes([]);
      setPropertyTypeId("");
      return;
    }

    const loadAreas = async () => {
      setLoadingAreas(true);
      setAreas([]);
      setPropertyTypes([]);
      setAreaId("");
      setPropertyTypeId("");

      try {
        const response = await getAreasByCity(cityId);
        setAreas(Array.isArray(response) ? response : []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Unable to load areas. Please try again."
        );
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
      setPropertyTypeId("");
      return;
    }

    const loadPropertyTypes = async () => {
      setLoadingPropertyTypes(true);
      setPropertyTypes([]);
      setPropertyTypeId("");

      try {
        const response = await getPropertyTypesByArea(areaId);
        setPropertyTypes(Array.isArray(response) ? response : []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Unable to load property types. Please try again."
        );
      } finally {
        setLoadingPropertyTypes(false);
      }
    };

    loadPropertyTypes();
  }, [areaId]);

  /* =========================
     HANDLE CHANGE
  ========================= */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

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
     SUBMIT
  ========================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!cityId) {
      setError("Please select a city.");
      return;
    }

    if (!areaId) {
      setError("Please select an area.");
      return;
    }

    if (!propertyTypeId) {
      setError("Please select a property type.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a property title.");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError("Please enter a valid property price.");
      return;
    }

    if (!formData.area || Number(formData.area) <= 0) {
      setError("Please enter a valid property area.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        price: Number(formData.price),
        area: Number(formData.area),
        bhk: formData.bhk ? Number(formData.bhk) : null,
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

      const response = await createProperty(payload);

      setCreatedProperty(response);
      setCreatedPropertyId(response?.id);

      setSuccess(
        "Property created successfully. You can now upload property images."
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to create property. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SUCCESS SCREEN
  ========================= */

  if (createdPropertyId) {
    return (
      <div className="min-h-screen bg-[#F8F5ED] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => navigate("/seller/dashboard")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6B6252] transition hover:text-[#201C15]"
          >
            <ArrowLeft size={17} />
            Back to dashboard
          </button>

          <div className="overflow-hidden rounded-[28px] border border-[#D8CFB9] bg-[#FBF8F1] shadow-[0_20px_70px_rgba(32,28,21,0.08)]">
            <div className="relative overflow-hidden bg-[#171B21] px-6 py-12 sm:px-10 lg:px-14">
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(#D8B876 1px, transparent 1px), linear-gradient(90deg, #D8B876 1px, transparent 1px)",
                  backgroundSize: "42px 42px",
                }}
              />

              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D8B876]/30 bg-[#D8B876]/10 text-[#D8B876]">
                  <CheckCircle size={28} />
                </div>

                <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#D8B876]">
                  Property created
                </p>

                <h1
                  style={FRASER}
                  className="max-w-3xl text-4xl leading-tight text-[#FBF8F1] sm:text-5xl"
                >
                  Your property is ready for its next step.
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#C9C3B6] sm:text-base">
                  Add high-quality images to make the listing complete and
                  ready for review.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              {success && (
                <div className="mb-8 flex items-start gap-3 rounded-2xl border border-[#B8CCBC] bg-[#EEF5EF] px-4 py-4 text-sm text-[#3F6B52]">
                  <CheckCircle className="mt-0.5 shrink-0" size={18} />
                  <span>{success}</span>
                </div>
              )}

              {createdProperty && (
                <div className="mb-8 rounded-2xl border border-[#E4DCC9] bg-[#F7F4EC] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A806D]">
                    New listing
                  </p>

                  <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div>
                      <h2
                        style={FRASER}
                        className="text-2xl text-[#201C15]"
                      >
                        {createdProperty.title || formData.title}
                      </h2>

                      <p className="mt-1 text-sm text-[#756D5E]">
                        Property ID #{createdProperty.id}
                      </p>
                    </div>

                    <div className="text-lg font-bold text-[#8C6924]">
                      ₹{Number(formData.price).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A806D]">
                    Step 2
                  </p>

                  <h2
                    style={FRASER}
                    className="mt-1 text-2xl text-[#201C15]"
                  >
                    Add property images
                  </h2>
                </div>

                <div className="hidden rounded-full border border-[#D8CFB9] px-4 py-2 text-xs font-semibold text-[#6B6252] sm:block">
                  Make your listing stand out
                </div>
              </div>

              <PropertyImageUpload propertyId={createdPropertyId} />

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/seller/dashboard")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8CFB9] bg-[#FBF8F1] px-5 py-3 text-sm font-bold text-[#201C15] transition hover:border-[#AD8332] hover:bg-[#F7F4EC]"
                >
                  Go to dashboard
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/properties/${createdPropertyId}`)
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#201C15] px-5 py-3 text-sm font-bold text-[#FBF8F1] transition hover:bg-[#2C2820]"
                >
                  View property
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN FORM
  ========================= */

  return (
    <div className="min-h-screen bg-[#F8F5ED] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* TOP BAR */}

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <button
              type="button"
              onClick={() => navigate("/seller/dashboard")}
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6B6252] transition hover:text-[#201C15]"
            >
              <ArrowLeft size={17} />
              Seller dashboard
            </button>

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-[#AD8332]">
              Seller workspace
            </p>

            <h1
              style={FRASER}
              className="text-4xl leading-tight text-[#201C15] sm:text-5xl"
            >
              Add a new property.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#756D5E] sm:text-base">
              Create a clear, detailed listing so buyers can understand the
              property at a glance.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1] px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#201C15] text-[#D8B876]">
              <Building2 size={19} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8A806D]">
                Listing
              </p>
              <p className="text-sm font-semibold text-[#201C15]">
                Property details
              </p>
            </div>
          </div>
        </div>

        {/* PROGRESS */}

        <div className="mb-7 grid gap-3 sm:grid-cols-3">
          <ProgressStep
            number="01"
            title="Property details"
            active
          />

          <ProgressStep
            number="02"
            title="Upload images"
          />

          <ProgressStep
            number="03"
            title="Admin review"
          />
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#E4BBB5] bg-[#FBEEEB] px-4 py-4 text-sm text-[#9E473D]">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#B3564B] text-xs font-bold text-white">
              !
            </span>

            <div className="flex-1">{error}</div>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-bold text-[#9E473D] hover:text-[#7E352D]"
            >
              ×
            </button>
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#B8CCBC] bg-[#EEF5EF] px-4 py-4 text-sm text-[#3F6B52]">
            <CheckCircle className="mt-0.5 shrink-0" size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
            {/* MAIN */}

            <div className="space-y-6">
              {/* LOCATION */}

              <section className="rounded-[26px] border border-[#D8CFB9] bg-[#FBF8F1] p-5 shadow-[0_14px_45px_rgba(32,28,21,0.045)] sm:p-7">
                <SectionHeading
                  number="01"
                  icon={<MapPin size={18} />}
                  eyebrow="Location"
                  title="Where is the property?"
                  description="Start with the location. These options are loaded from your EstateHub database."
                />

                <div className="mt-7 grid gap-5 md:grid-cols-3">
                  <FormField label="City" required>
                    <Select
                      value={cityId}
                      onChange={(event) => setCityId(event.target.value)}
                      disabled={loadingCities}
                    >
                      <option value="">
                        {loadingCities
                          ? "Loading cities..."
                          : "Select city"}
                      </option>

                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>

                  <FormField label="Area" required>
                    <Select
                      value={areaId}
                      onChange={(event) => setAreaId(event.target.value)}
                      disabled={!cityId || loadingAreas}
                    >
                      <option value="">
                        {!cityId
                          ? "Select city first"
                          : loadingAreas
                          ? "Loading areas..."
                          : "Select area"}
                      </option>

                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>

                  <FormField label="Property type" required>
                    <Select
                      value={propertyTypeId}
                      onChange={(event) =>
                        setPropertyTypeId(event.target.value)
                      }
                      disabled={!areaId || loadingPropertyTypes}
                    >
                      <option value="">
                        {!areaId
                          ? "Select area first"
                          : loadingPropertyTypes
                          ? "Loading types..."
                          : "Select type"}
                      </option>

                      {propertyTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                </div>
              </section>

              {/* BASIC DETAILS */}

              <section className="rounded-[26px] border border-[#D8CFB9] bg-[#FBF8F1] p-5 shadow-[0_14px_45px_rgba(32,28,21,0.045)] sm:p-7">
                <SectionHeading
                  number="02"
                  icon={<Home size={18} />}
                  eyebrow="Basic details"
                  title="Tell buyers about the property."
                  description="Keep the title and specifications clear and easy to scan."
                />

                <div className="mt-7 space-y-5">
                  <FormField label="Property title" required>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Spacious 2 BHK Apartment in Baner"
                    />
                  </FormField>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <FormField label="Price" required>
                      <Input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="8500000"
                        min="0"
                      />
                    </FormField>

                    <FormField label="Area (sq.ft.)" required>
                      <Input
                        type="number"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="1200"
                        min="0"
                      />
                    </FormField>

                    <FormField label="BHK">
                      <Select
                        name="bhk"
                        value={formData.bhk}
                        onChange={handleChange}
                      >
                        <option value="">Select BHK</option>
                        <option value="1">1 BHK</option>
                        <option value="2">2 BHK</option>
                        <option value="3">3 BHK</option>
                        <option value="4">4 BHK</option>
                        <option value="5">5 BHK</option>
                        <option value="6">6+ BHK</option>
                      </Select>
                    </FormField>

                    <FormField label="Furnished">
                      <Select
                        name="furnished"
                        value={formData.furnished}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="FURNISHED">Furnished</option>
                        <option value="SEMI_FURNISHED">
                          Semi Furnished
                        </option>
                        <option value="UNFURNISHED">Unfurnished</option>
                      </Select>
                    </FormField>
                  </div>

                  <FormField label="Facing">
                    <Select
                      name="facing"
                      value={formData.facing}
                      onChange={handleChange}
                    >
                      <option value="">Select facing</option>
                      <option value="NORTH">North</option>
                      <option value="SOUTH">South</option>
                      <option value="EAST">East</option>
                      <option value="WEST">West</option>
                      <option value="NORTH_EAST">North East</option>
                      <option value="NORTH_WEST">North West</option>
                      <option value="SOUTH_EAST">South East</option>
                      <option value="SOUTH_WEST">South West</option>
                    </Select>
                  </FormField>
                </div>
              </section>

              {/* OPTIONS */}

              <section className="rounded-[26px] border border-[#D8CFB9] bg-[#FBF8F1] p-5 shadow-[0_14px_45px_rgba(32,28,21,0.045)] sm:p-7">
                <SectionHeading
                  number="03"
                  icon={<Sparkles size={18} />}
                  eyebrow="Property features"
                  title="Highlight the important details."
                  description="Select the options that accurately describe this listing."
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
                    description="This is part of a new development."
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
                  title="Add a little more context."
                  description="Mention useful information buyers may want to know."
                />

                <div className="mt-7">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={7}
                    placeholder="Describe the property, nearby facilities, amenities, floor, surroundings, or any other useful information..."
                    className="w-full resize-none rounded-2xl border border-[#D8CFB9] bg-[#F7F4EC] px-4 py-4 text-sm leading-7 text-[#201C15] outline-none transition placeholder:text-[#A29A8A] focus:border-[#AD8332] focus:bg-[#FBF8F1] focus:ring-4 focus:ring-[#AD8332]/10"
                  />

                  <p className="mt-2 text-right text-xs text-[#968D7C]">
                    Give buyers enough context to understand the property.
                  </p>
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
                      Before you publish
                    </p>

                    <h2
                      style={FRASER}
                      className="mt-2 text-2xl leading-tight"
                    >
                      Build a listing buyers can trust.
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 px-6 py-6">
                  <ChecklistItem
                    title="Accurate location"
                    text="City, area and property type should match the listing."
                  />

                  <ChecklistItem
                    title="Clear specifications"
                    text="Price, area and BHK details help buyers compare properties."
                  />

                  <ChecklistItem
                    title="Good photographs"
                    text="You can upload images immediately after creating the property."
                  />

                  <ChecklistItem
                    title="Admin verification"
                    text="Your listing will follow the existing EstateHub approval flow."
                  />
                </div>

                <div className="border-t border-white/10 px-6 py-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D8B876] px-5 py-3.5 text-sm font-bold text-[#201C15] transition hover:bg-[#E3C88F] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#201C15]/30 border-t-[#201C15]" />
                        Creating property...
                      </>
                    ) : (
                      <>
                        Create property
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/seller/dashboard")}
                    disabled={loading}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-[#D8D2C5] transition hover:border-[#D8B876]/40 hover:text-white disabled:opacity-50"
                  >
                    <ArrowLeft size={16} />
                    Cancel
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#D8CFB9] bg-[#FBF8F1] p-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 text-[#AD8332]">
                    <MapPin size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#201C15]">
                      Location hierarchy
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#756D5E]">
                      City → Area → Property Type are loaded dynamically from
                      your existing location APIs.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function ProgressStep({ number, title, active = false }) {
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
            active ? "text-[#201C15]" : "text-[#8A806D]"
          }`}
        >
          {title}
        </p>

        <p className="text-[11px] text-[#A29A8A]">
          {active ? "Current step" : "Coming next"}
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

function FormField({ label, required = false, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#6B6252]">
        {label}
        {required && <span className="ml-1 text-[#AD8332]">*</span>}
      </span>

      {children}
    </label>
  );
}

function Input({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  min,
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      className="w-full rounded-2xl border border-[#D8CFB9] bg-[#F7F4EC] px-4 py-3.5 text-sm text-[#201C15] outline-none transition placeholder:text-[#A29A8A] focus:border-[#AD8332] focus:bg-[#FBF8F1] focus:ring-4 focus:ring-[#AD8332]/10"
    />
  );
}

function Select({
  name,
  value,
  onChange,
  disabled = false,
  children,
}) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full rounded-2xl border border-[#D8CFB9] bg-[#F7F4EC] px-4 py-3.5 text-sm text-[#201C15] outline-none transition focus:border-[#AD8332] focus:bg-[#FBF8F1] focus:ring-4 focus:ring-[#AD8332]/10 disabled:cursor-not-allowed disabled:opacity-55"
    >
      {children}
    </select>
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

function ChecklistItem({ title, text }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D8B876]/15 text-[#D8B876]">
        <CheckCircle size={14} />
      </div>

      <div>
        <p className="text-sm font-semibold text-[#F5F0E6]">{title}</p>

        <p className="mt-1 text-xs leading-5 text-[#AFA99D]">{text}</p>
      </div>
    </div>
  );
}

export default AddProperty;

