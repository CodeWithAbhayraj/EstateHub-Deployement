
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

function Properties() {
  return (
    <main className="min-h-screen bg-[#F2ECDF] text-[#201C15]">
      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="relative overflow-hidden bg-[#171B21]">
        {/* Blueprint-style background */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#AD8332]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 left-10 h-72 w-72 rounded-full bg-[#7FA88D]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          {/* Breadcrumb */}

          <div className="mb-10 flex items-center gap-2 text-xs text-white/35">
            <Link
              to="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <span>/</span>

            <span className="text-white/60">
              Properties
            </span>
          </div>

          {/* Heading */}

          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 border border-[#AD8332]/30 bg-[#AD8332]/10 px-3 py-1.5 text-xs font-semibold text-[#D8B876]">
              <Building2 size={14} />
              Explore EstateHub
            </div>

            <h1
              className="text-4xl leading-[1.08] text-white sm:text-5xl lg:text-[3.7rem]"
              style={FRASER}
            >
              Find a place that
              <span className="block text-[#D8B876]">
                feels like home.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
              Explore properties available on EstateHub and discover
              a place that fits your lifestyle, budget and needs.
            </p>
          </div>

          {/* =================================================
              SEARCH BAR
              ================================================= */}

          <div className="mt-10 max-w-4xl">
            <div className="flex flex-col gap-3 border border-white/10 bg-[#1D2128] p-3 shadow-2xl sm:flex-row">
              <div className="flex flex-1 items-center gap-3 border border-white/10 bg-[#171B21] px-4 py-3">
                <Search
                  size={20}
                  className="shrink-0 text-white/35"
                />

                <input
                  type="text"
                  placeholder="Search by city, area or property..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                />
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 bg-[#AD8332] px-6 py-3 text-sm font-semibold text-[#171B21] transition hover:bg-[#C39843]"
              >
                <Search size={17} />
                Search
              </button>
            </div>
          </div>

          {/* Trust points */}

          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
            <span className="flex items-center gap-2 text-sm text-white/45">
              <ShieldCheck
                size={16}
                className="text-[#7FA88D]"
              />
              Verified listings
            </span>

            <span className="flex items-center gap-2 text-sm text-white/45">
              <Building2
                size={16}
                className="text-[#7FA88D]"
              />
              Multiple property types
            </span>

            <span className="flex items-center gap-2 text-sm text-white/45">
              <Search
                size={16}
                className="text-[#7FA88D]"
              />
              Easy discovery
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROPERTY CONTENT
          ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}

        <div className="flex flex-col gap-5 border-b border-[#D8CFB9] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8C6924]">
              Property listings
            </p>

            <h2
              className="mt-2 text-2xl text-[#201C15] sm:text-3xl"
              style={FRASER}
            >
              Explore available properties
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B6252]">
              Browse verified property listings and find the right
              place for you.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 border border-[#C9BE9F] bg-[#F2ECDF] px-4 py-2.5 text-sm font-semibold text-[#201C15] transition hover:border-[#AD8332] hover:bg-[#EAE2CF]"
          >
            <SlidersHorizontal size={17} />
            Filters
          </button>
        </div>

        {/* =================================================
            EMPTY STATE
            ================================================= */}

        <div className="mt-10 border border-[#D8CFB9] bg-[#F7F2E8] px-6 py-16 text-center shadow-sm sm:px-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#C9BE9F] bg-[#EAE2CF] text-[#8C6924]">
            <Building2
              size={30}
              strokeWidth={1.5}
            />
          </div>

          <h3
            className="mt-6 text-2xl text-[#201C15]"
            style={FRASER}
          >
            Properties are coming soon
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6B6252]">
            We're building a better property discovery experience.
            Once listings are available, you'll be able to explore
            them right here.
          </p>

          <Link
            to="/register"
            className="mt-7 inline-flex items-center gap-2 bg-[#171B21] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#252B33]"
          >
            Join EstateHub
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* =================================================
            TRUST STRIP
            ================================================= */}

        <div className="mt-8 grid border border-[#D8CFB9] bg-[#F7F2E8] sm:grid-cols-3">
          <TrustItem
            icon={ShieldCheck}
            title="Verified listings"
            description="Reviewed by EstateHub before publishing."
          />

          <TrustItem
            icon={Building2}
            title="Multiple property types"
            description="Homes, apartments and more."
          />

          <TrustItem
            icon={Search}
            title="Easy discovery"
            description="Find properties faster and easier."
          />
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   TRUST ITEM
   ========================================================= */

function TrustItem({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="border-b border-[#D8CFB9] p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div className="flex h-10 w-10 items-center justify-center border border-[#C9BE9F] bg-[#EAE2CF] text-[#8C6924]">
        <Icon size={19} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[#201C15]">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-[#6B6252]">
        {description}
      </p>
    </div>
  );
}

export default Properties;

