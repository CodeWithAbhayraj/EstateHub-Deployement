
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Compass,
  KeyRound,
  MapPin,
  Ruler,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F2ECDF] text-[#201C15]">
      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="relative overflow-hidden bg-[#171B21]">
        {/* Background grid */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          {/* Top strip */}

          <div className="mb-12 flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-white/10 pb-4 text-xs text-white/40">
            <span className="tracking-wide">
              EstateHub — Property Platform
            </span>

            <span className="hidden sm:inline">
              Discover · Explore · Connect
            </span>

            <span className="ml-auto text-white/30">
              Simple property discovery
            </span>
          </div>

          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* =================================================
                LEFT
                ================================================= */}

            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#D8B876]">
                Find your next address
              </p>

              <h1
                className="max-w-xl text-4xl leading-[1.08] text-white sm:text-5xl lg:text-[3.4rem]"
                style={FRASER}
              >
                Property listings,
                <br />
                made easier.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-white/60">
                Discover properties, compare the details that matter, and
                connect through EstateHub when you find the right place.
              </p>

              {/* Search */}

              <div className="mt-10 border-b-2 border-[#AD8332]">
                <div className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label className="flex items-center gap-2 text-xs text-white/40">
                      <MapPin size={13} />
                      Locality, city or pincode
                    </label>

                    <input
                      type="text"
                      placeholder="Search Shivajinagar, Pune…"
                      className="mt-2 w-full bg-transparent text-lg text-white placeholder:text-white/30 focus:outline-none"
                    />
                  </div>

                  <Link
                    to="/properties"
                    className="inline-flex shrink-0 items-center justify-center gap-2 bg-[#AD8332] px-6 py-3 text-sm font-semibold text-[#171B21] transition hover:bg-[#C39843] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <Search size={16} />
                    Search listings
                  </Link>
                </div>
              </div>

              {/* Trust points */}

              <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
                <span className="flex items-center gap-2 text-sm text-white/50">
                  <CheckCircle2 size={16} className="text-[#7FA88D]" />
                  Verified property listings
                </span>

                <span className="flex items-center gap-2 text-sm text-white/50">
                  <ShieldCheck size={16} className="text-[#7FA88D]" />
                  Admin-reviewed properties
                </span>
              </div>
            </div>

            {/* =================================================
                RIGHT — PROPERTY PREVIEW
                ================================================= */}

            <div className="relative mx-auto w-full max-w-md lg:ml-auto">
              <CornerMarks />

              <div className="border border-white/15 bg-[#1D2128]">
                {/* Card header */}

                <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-xs text-white/40">
                  <span>Featured listing</span>
                  <span>EstateHub</span>
                </div>

                {/* Property visual */}

                <div className="relative h-56 overflow-hidden border-b border-white/10">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                      backgroundSize: "22px 22px",
                    }}
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building2
                      size={84}
                      strokeWidth={0.75}
                      className="text-white/25"
                    />
                  </div>

                  <div className="absolute left-4 top-4 flex items-center gap-1.5 border border-[#AD8332]/60 bg-[#171B21]/80 px-2.5 py-1 text-[11px] text-[#D8B876]">
                    <ShieldCheck size={12} />
                    Verified
                  </div>
                </div>

                {/* Property details */}

                <div className="p-5">
                  <h2 className="text-xl text-white" style={FRASER}>
                    Modern 2 BHK Apartment
                  </h2>

                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/45">
                    <MapPin size={13} />
                    Shivajinagar, Pune
                  </p>

                  <div className="mt-5 space-y-2.5">
                    <DimensionRow
                      label="Configuration"
                      value="2 BHK"
                    />

                    <DimensionRow
                      label="Carpet area"
                      value="1,200 sq ft"
                    />

                    <DimensionRow
                      label="Status"
                      value="Ready to move"
                    />
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                    <div>
                      <p className="text-[11px] text-white/40">
                        Starting from
                      </p>

                      <p
                        className="text-2xl text-white"
                        style={FRASER}
                      >
                        ₹99.99 L
                      </p>
                    </div>

                    <Link
                      to="/properties"
                      className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition hover:border-[#AD8332] hover:text-[#D8B876]"
                      aria-label="View properties"
                    >
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero feature strip */}

          <div className="mt-16 grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
            <Stat
              icon={Search}
              label="Simple search"
            />

            <Stat
              icon={ShieldCheck}
              label="Verified listings"
            />

            <Stat
              icon={Users}
              label="Buyer & seller platform"
            />

            <Stat
              icon={KeyRound}
              label="Easy property visits"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY ESTATEHUB
          ===================================================== */}

      <section className="bg-[#F2ECDF] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,340px)_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8C6924]">
                Why EstateHub
              </p>

              <h2
                className="mt-3 text-3xl leading-tight text-[#201C15]"
                style={FRASER}
              >
                Built for how people
                <br />
                actually search for homes.
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-6 text-[#6B6252]">
                A simple property platform that keeps discovery,
                property details and the next step in one place.
              </p>
            </div>

            <div className="divide-y divide-[#D8CFB9] border-t border-[#D8CFB9]">
              <FeatureRow
                icon={Search}
                title="Search by what actually matters"
                description="Explore properties using location, property type, area and other useful details."
              />

              <FeatureRow
                icon={ShieldCheck}
                title="Verified before publishing"
                description="Properties can be reviewed by the platform before becoming available to buyers."
              />

              <FeatureRow
                icon={Users}
                title="One place to follow through"
                description="Save properties, request a visit and connect through EstateHub without unnecessary steps."
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
          ===================================================== */}

      <section className="border-t border-[#D8CFB9] bg-[#EAE2CF] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8C6924]">
            How it works
          </p>

          <h2
            className="mt-3 text-3xl text-[#201C15]"
            style={FRASER}
          >
            Three steps, start to keys.
          </h2>

          <div className="relative mt-14">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-[#C9BE9F] md:block" />

            <div className="grid gap-10 md:grid-cols-3">
              <PlanStep
                index="1"
                icon={Search}
                title="Search"
                description="Browse properties and narrow your search using the details that matter to you."
              />

              <PlanStep
                index="2"
                icon={Compass}
                title="Explore"
                description="Open the property details, review the information and decide whether it fits your needs."
              />

              <PlanStep
                index="3"
                icon={KeyRound}
                title="Connect"
                description="Save the property, request a visit or connect through EstateHub for the next step."
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
          ===================================================== */}

      <section className="relative overflow-hidden bg-[#171B21]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(173,131,50,1) 1px, transparent 1px), linear-gradient(90deg, rgba(173,131,50,1) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 border-t border-white/10 pt-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="flex items-center gap-2 text-sm text-[#D8B876]">
                <Ruler size={15} />
                Ready when you are
              </p>

              <h2
                className="mt-3 text-3xl leading-tight text-white sm:text-4xl"
                style={FRASER}
              >
                Your next address is waiting.
              </h2>

              <p className="mt-3 text-white/55">
                Explore available properties or create an EstateHub account
                to start your property journey.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 bg-[#AD8332] px-6 py-3 text-sm font-semibold text-[#171B21] transition hover:bg-[#C39843]"
              >
                Explore properties
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   CORNER MARKS
   ========================================================= */

function CornerMarks() {
  const base = "absolute h-4 w-4 border-[#AD8332]/70";

  return (
    <>
      <span
        className={`${base} -left-2 -top-2 border-l-2 border-t-2`}
      />

      <span
        className={`${base} -right-2 -top-2 border-r-2 border-t-2`}
      />

      <span
        className={`${base} -bottom-2 -left-2 border-b-2 border-l-2`}
      />

      <span
        className={`${base} -bottom-2 -right-2 border-b-2 border-r-2`}
      />
    </>
  );
}

/* =========================================================
   DIMENSION ROW
   ========================================================= */

function DimensionRow({ label, value }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="shrink-0 text-white/40">
        {label}
      </span>

      <span className="h-px flex-1 bg-white/10" />

      <span className="shrink-0 font-medium text-white/85">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   FEATURE STAT
   ========================================================= */

function Stat({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3 border-r border-white/10 px-2 py-6 last:border-r-0 sm:px-5">
      <Icon
        size={18}
        strokeWidth={1.6}
        className="shrink-0 text-[#C39843]"
      />

      <p className="text-xs leading-snug text-white/45">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   FEATURE ROW
   ========================================================= */

function FeatureRow({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="group grid gap-4 py-7 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-8">
      <div className="flex h-11 w-11 items-center justify-center border border-[#C9BE9F] text-[#8C6924] transition group-hover:border-[#AD8332] group-hover:bg-[#AD8332] group-hover:text-white">
        <Icon size={19} />
      </div>

      <div>
        <h3 className="text-lg font-medium text-[#201C15]">
          {title}
        </h3>

        <p className="mt-1.5 max-w-lg text-sm leading-6 text-[#6B6252]">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PROCESS STEP
   ========================================================= */

function PlanStep({
  index,
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="relative">
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#171B21] bg-[#EAE2CF] text-sm font-medium text-[#171B21]">
        {index}
      </div>

      <div className="mt-5 flex items-center gap-2 text-[#8C6924]">
        <Icon size={17} />
      </div>

      <h3 className="mt-2 text-lg font-medium text-[#201C15]">
        {title}
      </h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-[#6B6252]">
        {description}
      </p>
    </div>
  );
}

