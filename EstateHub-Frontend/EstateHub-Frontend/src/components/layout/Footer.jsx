
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Building2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

function Footer() {
  const year = new Date().getFullYear();

  const linkClass =
    "text-sm text-white/50 transition-colors duration-200 hover:text-[#D8B876]";

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-[#AD8332]/30 bg-[#171B21] text-white">
      {/* Blueprint background */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Decorative glow */}

      <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#AD8332]/[0.07] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        {/* =================================================
            MAIN FOOTER GRID
            ================================================= */}

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.9fr_1.2fr] lg:gap-16">
          {/* BRAND */}

          <div className="lg:pr-8">
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center border border-white/15 bg-white/[0.04] text-white transition duration-200 group-hover:border-[#AD8332]/70 group-hover:text-[#D8B876]">
                <Building2
                  size={20}
                  strokeWidth={1.5}
                />
              </div>

              <div>
                <span
                  className="block text-xl text-white"
                  style={FRASER}
                >
                  Estate
                  <span className="text-[#D8B876]">
                    Hub
                  </span>
                </span>

                <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                  Property platform
                </span>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/45">
              A simple way to discover, manage and
              connect with properties across India.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white/45">
              <ShieldCheck
                size={14}
                className="text-[#7FA88D]"
              />

              Listings reviewed before going live
            </div>
          </div>

          {/* QUICK LINKS */}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
              Quick links
            </h3>

            <nav className="mt-5 flex flex-col gap-3.5">
              <Link to="/" className={linkClass}>
                Home
              </Link>

              <Link
                to="/properties"
                className={linkClass}
              >
                Properties
              </Link>

              <Link to="/login" className={linkClass}>
                Login
              </Link>

              <Link
                to="/register"
                className={linkClass}
              >
                Register
              </Link>
            </nav>
          </div>

          {/* PLATFORM */}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
              Platform
            </h3>

            <div className="mt-5 flex flex-col gap-3.5">
              <span className="text-sm text-white/40">
                Buy properties
              </span>

              <span className="text-sm text-white/40">
                Sell properties
              </span>

              <span className="text-sm text-white/40">
                Schedule visits
              </span>

              <span className="text-sm text-white/40">
                Manage leads
              </span>
            </div>
          </div>

          {/* CONTACT */}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
              Contact
            </h3>

            <div className="mt-5 space-y-4">
              <a
                href="mailto:abhaykonge41@gmail.com"
                className="group flex items-start gap-3"
              >
                <ContactIcon>
                  <Mail size={15} />
                </ContactIcon>

                <span className="break-all pt-1.5 text-sm text-white/45 transition group-hover:text-white">
                  abhaykonge41@gmail.com
                </span>
              </a>

              <a
                href="tel:+918855803608"
                className="group flex items-start gap-3"
              >
                <ContactIcon>
                  <Phone size={15} />
                </ContactIcon>

                <span className="pt-1.5 text-sm text-white/45 transition group-hover:text-white">
                  +91 8855803608
                </span>
              </a>

              <div className="flex items-start gap-3">
                <ContactIcon>
                  <MapPin size={15} />
                </ContactIcon>

                <span className="pt-1.5 text-sm text-white/45">
                  India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DIVIDER */}

        <div className="my-10 h-px bg-white/10" />

        {/* =================================================
            CTA
            ================================================= */}

        <div className="mb-10 flex flex-col gap-6 border border-white/10 bg-white/[0.015] p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D8B876]">
              EstateHub
            </p>

            <h3
              className="mt-2 text-xl text-white"
              style={FRASER}
            >
              Looking for your next property?
            </h3>

            <p className="mt-1.5 text-sm text-white/40">
              Explore available listings and find a
              property that fits your needs.
            </p>
          </div>

          <Link
            to="/properties"
            className="group inline-flex w-fit shrink-0 items-center gap-2 bg-[#AD8332] px-5 py-3 text-sm font-semibold text-[#171B21] transition-all duration-200 hover:bg-[#D8B876]"
          >
            Explore properties

            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* =================================================
            BOTTOM BAR
            ================================================= */}

        <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-white/30">
            © {year} EstateHub. All rights reserved.
          </p>

          <p className="text-white/20">
            Built for better property discovery.
          </p>
        </div>
      </div>
    </footer>
  );
}

function ContactIcon({ children }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 text-white/40 transition group-hover:border-[#AD8332]/50 group-hover:text-[#D8B876]">
      {children}
    </span>
  );
}

export default Footer;

