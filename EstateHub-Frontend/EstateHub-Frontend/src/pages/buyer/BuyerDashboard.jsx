
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Heart,
  CalendarDays,
  Bell,
  ArrowRight,
  Search,
  Home,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getPublishedProperties } from "../../api/propertyApi";
import { getMyFavorites } from "../../api/favoriteApi";
import { getMyVisits } from "../../api/visitApi";
import { getUnreadNotificationCount } from "../../api/notificationApi";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

export default function BuyerDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    properties: 0,
    favorites: 0,
    visits: 0,
    notifications: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [properties, favorites, visits, count] = await Promise.all([
          getPublishedProperties(),
          getMyFavorites(),
          getMyVisits(),
          getUnreadNotificationCount(),
        ]);

        setStats({
          properties: Array.isArray(properties) ? properties.length : 0,
          favorites: Array.isArray(favorites) ? favorites.length : 0,
          visits: Array.isArray(visits) ? visits.length : 0,
          notifications: Number(count) || 0,
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const statCards = [
    {
      title: "Available properties",
      value: stats.properties,
      icon: Building2,
      link: "/properties",
      accent: "text-blue-600",
      bg: "bg-blue-50",
      description: "Explore listings",
    },
    {
      title: "My favorites",
      value: stats.favorites,
      icon: Heart,
      link: "/buyer/favorites",
      accent: "text-rose-600",
      bg: "bg-rose-50",
      description: "Saved properties",
    },
    {
      title: "My visits",
      value: stats.visits,
      icon: CalendarDays,
      link: "/buyer/visits",
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
      description: "Scheduled visits",
    },
    {
      title: "Notifications",
      value: stats.notifications,
      icon: Bell,
      link: "/buyer/notifications",
      accent: "text-amber-600",
      bg: "bg-amber-50",
      description: "Unread updates",
    },
  ];

  const quickActions = [
    {
      title: "Find a property",
      desc: "Search available properties",
      link: "/properties",
      icon: Search,
      accent: "bg-blue-600",
    },
    {
      title: "My favorites",
      desc: "Manage saved properties",
      link: "/buyer/favorites",
      icon: Heart,
      accent: "bg-rose-600",
    },
    {
      title: "My visits",
      desc: "Check scheduled visits",
      link: "/buyer/visits",
      icon: CalendarDays,
      accent: "bg-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-slate-950">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70">
                <Sparkles size={13} className="text-blue-400" />
                Buyer Dashboard
              </div>

              <h1
                className="max-w-2xl text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl"
                style={FRASER}
              >
                Welcome back,{" "}
                <span className="text-blue-400">
                  {user?.name || "Buyer"}
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/55 sm:text-base">
                Discover properties, manage your favorites and keep track
                of your upcoming visits.
              </p>
            </div>

            <Link
              to="/properties"
              className="group inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <Search size={17} />
              Browse properties
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Error */}
        {error && (
          <div className="mb-7 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <Bell size={17} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Dashboard update failed</p>
              <p className="mt-1 text-rose-600">{error}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                Your activity
              </p>

              <h2
                className="mt-1 text-2xl font-medium text-slate-900"
                style={FRASER}
              >
                Overview
              </h2>
            </div>

            <div className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
              <ShieldCheck size={14} />
              EstateHub account
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  to={card.link}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bg}`}
                    >
                      <Icon size={19} className={card.accent} />
                    </div>

                    <ChevronRight
                      size={17}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-500"
                    />
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>

                    <p
                      className="mt-1 text-3xl font-medium text-slate-950"
                      style={FRASER}
                    >
                      {loading ? "…" : card.value}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      {card.description}
                    </p>
                  </div>

                  {/* Bottom accent */}
                  <div
                    className={`absolute bottom-0 left-0 h-1 w-0 ${card.bg} transition-all duration-300 group-hover:w-full`}
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-10">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Shortcuts
            </p>

            <h2
              className="mt-1 text-2xl font-medium text-slate-900"
              style={FRASER}
            >
              Quick actions
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  to={action.link}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${action.accent}`}
                  >
                    <Icon size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {action.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {action.desc}
                    </p>
                  </div>

                  <ArrowRight
                    size={17}
                    className="ml-auto shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Discovery CTA */}
        <section className="relative mt-10 overflow-hidden rounded-3xl bg-slate-950 shadow-2xl">
          {/* Background pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative flex flex-col gap-7 p-7 sm:p-9 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-blue-400 ring-1 ring-white/10">
                <Home size={22} />
              </div>

              <h2
                className="text-2xl font-medium text-white sm:text-3xl"
                style={FRASER}
              >
                Find a place that feels like home.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
                Explore published properties, save the ones you love,
                and schedule a visit when you're ready.
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/55">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Verified listings
                </span>

                <span className="flex items-center gap-2">
                  <Search size={14} className="text-blue-400" />
                  Easy discovery
                </span>

                <span className="flex items-center gap-2">
                  <CalendarDays size={14} className="text-amber-400" />
                  Schedule visits
                </span>
              </div>
            </div>

            <Link
              to="/properties"
              className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Explore properties
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>

        {/* Bottom trust strip */}
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            Your buyer activity is securely managed by EstateHub.
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-1 font-semibold text-slate-700 transition hover:text-blue-600"
          >
            Continue exploring
            <ArrowRight size={13} />
          </Link>
        </div>
      </main>
    </div>
  );
}

