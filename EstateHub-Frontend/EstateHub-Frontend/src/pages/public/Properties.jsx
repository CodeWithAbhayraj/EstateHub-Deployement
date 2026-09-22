import { Link } from "react-router-dom";
import {
ArrowRight,
Building2,
Search,
ShieldCheck,
SlidersHorizontal,
} from "lucide-react";

function Properties() {
return ( <main className="min-h-screen bg-slate-50">
{/* HERO */} <section className="relative overflow-hidden bg-slate-950"> <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" /> <div className="absolute -bottom-40 left-10 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />

```
    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="max-w-3xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
          <Building2 size={14} />
          Explore EstateHub
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Find a place that
          <span className="block text-blue-400">feels like home.</span>
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
          Explore properties available on EstateHub and discover a
          place that fits your lifestyle, budget and needs.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="mt-10 max-w-4xl">
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white p-3 shadow-2xl sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <Search
              size={20}
              className="shrink-0 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by city, area or property..."
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600"
          >
            <Search size={17} />
            Search
          </button>
        </div>
      </div>
    </div>
  </section>

  {/* CONTENT */}
  <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    {/* HEADER */}
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Property listings
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Explore available properties
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Browse verified property listings and find the right
          place for you.
        </p>
      </div>

      <button
        type="button"
        className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
      >
        <SlidersHorizontal size={17} />
        Filters
      </button>
    </div>

    {/* EMPTY STATE */}
    <div className="mt-10 rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm sm:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Building2 size={30} />
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-900">
        Properties are coming soon
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        We're building a better property discovery experience.
        Once listings are available, you'll be able to explore them
        right here.
      </p>

      <Link
        to="/register"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600"
      >
        Join EstateHub
        <ArrowRight size={16} />
      </Link>
    </div>

    {/* TRUST STRIP */}
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <ShieldCheck size={19} />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            Verified listings
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Reviewed by EstateHub
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Building2 size={19} />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            Multiple property types
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Homes, apartments and more
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Search size={19} />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            Easy discovery
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Find properties faster
          </p>
        </div>
      </div>
    </div>
  </section>
</main>


);
}

export default Properties;
