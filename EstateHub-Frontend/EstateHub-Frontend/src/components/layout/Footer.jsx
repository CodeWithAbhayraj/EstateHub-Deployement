import { Link } from "react-router-dom";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

/* Matches the display serif used on Home.jsx / Navbar.jsx. Falls back
   cleanly to Tailwind's default serif stack if Fraunces isn't loaded. */
const FRASER = { fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif" };

function Footer() {
  const year = new Date().getFullYear();

  const linkClass =
    "text-sm text-white/50 transition-colors duration-200 hover:text-white";

  return (
    <footer className="relative mt-16 border-t border-[#AD8332]/30 bg-[#171B21] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* TOP SECTION */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div className="lg:pr-8">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center border border-white/20 bg-white/5 text-white transition group-hover:border-[#AD8332] group-hover:text-[#D8B876]">
                <Building2 size={20} strokeWidth={1.75} />
              </div>

              <div>
                <span className="block text-lg text-white" style={FRASER}>
                  Estate<span className="text-[#D8B876]">Hub</span>
                </span>
                <span className="text-[11px] text-white/40">
                  Property listing index
                </span>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/45">
              A simple, verified way to discover, manage and connect with
              properties across India.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 border border-white/10 px-3 py-1.5 text-xs text-white/50">
              <ShieldCheck size={14} className="text-[#7FA88D]" />
              Every listing reviewed before it goes live
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-sm font-medium text-white">Quick links</h3>

            <div className="mt-5 flex flex-col gap-3">
              <Link to="/" className={linkClass}>Home</Link>
              <Link to="/properties" className={linkClass}>Properties</Link>
              <Link to="/login" className={linkClass}>Login</Link>
              <Link to="/register" className={linkClass}>Register</Link>
            </div>
          </div>

          {/* PLATFORM */}
          <div>
            <h3 className="text-sm font-medium text-white">Platform</h3>

            <div className="mt-5 flex flex-col gap-3">
              <span className="text-sm text-white/40">Buy properties</span>
              <span className="text-sm text-white/40">Sell properties</span>
              <span className="text-sm text-white/40">Schedule visits</span>
              <span className="text-sm text-white/40">Manage leads</span>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-sm font-medium text-white">Contact</h3>

            <div className="mt-5 space-y-4">
              <a href="mailto:abhaykonge41@gmail.com" className="group flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 text-white/40 transition group-hover:border-[#AD8332]/50 group-hover:text-[#D8B876]">
                  <Mail size={15} />
                </span>
                <span className="pt-1.5 text-sm text-white/45 transition group-hover:text-white">
                  abhaykonge41@gmail.com
                </span>
              </a>

              <a href="tel:+918855803608" className="group flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 text-white/40 transition group-hover:border-[#AD8332]/50 group-hover:text-[#D8B876]">
                  <Phone size={15} />
                </span>
                <span className="pt-1.5 text-sm text-white/45 transition group-hover:text-white">
                  +91 8855803608
                </span>
              </a>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 text-white/40">
                  <MapPin size={15} />
                </span>
                <span className="pt-1.5 text-sm text-white/45">India</span>
              </div>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-10 h-px bg-white/10" />

        {/* CTA STRIP */}
        <div className="mb-10 flex flex-col gap-5 border border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h3 className="text-base text-white" style={FRASER}>
              Looking for your next property?
            </h3>
            <p className="mt-1 text-sm text-white/45">
              Explore available listings on EstateHub.
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex w-fit items-center gap-2 bg-[#AD8332] px-5 py-2.5 text-sm font-semibold text-[#171B21] transition hover:bg-[#c39843]"
          >
            Explore properties
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-white/35">© {year} EstateHub. All rights reserved.</p>
          <p className="text-white/25">Built for better property discovery.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;