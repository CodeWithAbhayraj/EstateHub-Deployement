
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
      description: "Explore listings",
    },
    {
      title: "My favorites",
      value: stats.favorites,
      icon: Heart,
      link: "/buyer/favorites",
      description: "Saved properties",
    },
    {
      title: "My visits",
      value: stats.visits,
      icon: CalendarDays,
      link: "/buyer/visits",
      description: "Scheduled visits",
    },
    {
      title: "Notifications",
      value: stats.notifications,
      icon: Bell,
      link: "/buyer/notifications",
      description: "Unread updates",
    },
  ];

  const quickActions = [
    {
      title: "Find a property",
      desc: "Search available properties",
      link: "/properties",
      icon: Search,
    },
    {
      title: "My favorites",
      desc: "Manage saved properties",
      link: "/buyer/favorites",
      icon: Heart,
    },
    {
      title: "My visits",
      desc: "Check scheduled visits",
      link: "/buyer/visits",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8F5ED] text-[#201C15]">
      {/* Blueprint background */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(173,131,50,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(173,131,50,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#2B2A26] bg-[#171B21]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(216,184,118,.7) 1px, transparent 1px),
              linear-gradient(90deg, rgba(216,184,118,.7) 1px, transparent 1px)
            `,
            backgroundSize: "46px 46px",
          }}
        />

        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#AD8332]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-white/[0.03] blur-3xl" />

        <div className="relative mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#D8B876]">
                <span className="h-px w-8 bg-[#AD8332]" />
                Buyer workspace
              </div>

              <h1
                style={FRASER}
                className="max-w-3xl text-3xl font-semibold tracking-tight text-[#FBF8F1] sm:text-4xl lg:text-5xl"
              >
                Welcome back,{" "}
                <span className="text-[#D8B876]">
                  {user?.name || "Buyer"}
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                Discover properties, save the ones you love and keep track
                of your upcoming visits from one place.
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={13} className="text-[#D8B876]" />
                  Secure account
                </span>

                <span className="flex items-center gap-2">
                  <Building2 size={13} className="text-[#D8B876]" />
                  Property discovery
                </span>

                <span className="flex items-center gap-2">
                  <CalendarDays size={13} className="text-[#D8B876]" />
                  Visit tracking
                </span>
              </div>
            </div>

            <Link
              to="/properties"
              className="group inline-flex w-fit items-center gap-2 border border-[#D8B876] bg-[#D8B876] px-5 py-3 text-sm font-semibold text-[#201C15] transition hover:bg-[#E3C98F]"
            >
              <Search size={16} />
              Browse properties
              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="relative mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Error */}
        {error && (
          <div className="mb-7 flex items-start gap-3 border border-[#D9A39C] bg-[#F9ECE9] px-4 py-3.5 text-sm text-[#9B463C]">
            <Bell size={17} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-semibold">
                Dashboard update failed
              </p>

              <p className="mt-1 text-[#A65B51]">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Overview */}
        <section>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#AD8332]">
                <span className="h-px w-7 bg-[#AD8332]" />
                Your activity
              </div>

              <h2
                style={FRASER}
                className="mt-1.5 text-2xl font-semibold text-[#201C15] sm:text-3xl"
              >
                Overview
              </h2>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A806D]">
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
                  className="group relative overflow-hidden border border-[#D8CFB9] bg-[#FBF8F1] p-5 shadow-[0_10px_30px_rgba(32,28,21,0.035)] transition duration-300 hover:-translate-y-0.5 hover:border-[#C8B78F] hover:shadow-[0_16px_38px_rgba(32,28,21,0.08)]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center border border-[#D8B876] bg-[#F2ECDF] text-[#8C6924]">
                      <Icon size={19} strokeWidth={1.8} />
                    </div>

                    <ChevronRight
                      size={17}
                      className="text-[#B8AE9A] transition group-hover:translate-x-1 group-hover:text-[#8C6924]"
                    />
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-medium text-[#6B6252]">
                      {card.title}
                    </p>

                    <p
                      style={FRASER}
                      className="mt-1 text-3xl font-semibold text-[#201C15]"
                    >
                      {loading ? "…" : card.value}
                    </p>

                    <p className="mt-2 text-xs text-[#8A806D]">
                      {card.description}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#AD8332] transition-all duration-300 group-hover:w-full" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-10">
          <div className="mb-5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#AD8332]">
              <span className="h-px w-7 bg-[#AD8332]" />
              Shortcuts
            </div>

            <h2
              style={FRASER}
              className="mt-1.5 text-2xl font-semibold text-[#201C15] sm:text-3xl"
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
                  className="group flex items-center gap-4 border border-[#D8CFB9] bg-[#FBF8F1] p-5 shadow-[0_8px_25px_rgba(32,28,21,0.03)] transition duration-300 hover:-translate-y-0.5 hover:border-[#C8B78F] hover:shadow-[0_14px_32px_rgba(32,28,21,0.07)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#D8B876] bg-[#F2ECDF] text-[#8C6924]">
                    <Icon size={19} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-[#201C15]">
                      {action.title}
                    </p>

                    <p className="mt-1 text-xs text-[#6B6252]">
                      {action.desc}
                    </p>
                  </div>

                  <ArrowRight
                    size={17}
                    className="ml-auto shrink-0 text-[#B8AE9A] transition group-hover:translate-x-1 group-hover:text-[#8C6924]"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Discovery CTA */}
        <section className="relative mt-10 overflow-hidden border border-[#2C2B27] bg-[#171B21] shadow-[0_18px_45px_rgba(32,28,21,0.12)]">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.055]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(216,184,118,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(216,184,118,.8) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#AD8332]/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 p-7 sm:p-9 md:flex-row md:items-center md:justify-between lg:p-10">
            <div className="max-w-2xl">
              <div className="mb-5 flex h-11 w-11 items-center justify-center border border-[#D8B876]/30 bg-white/[0.04] text-[#D8B876]">
                <Home size={21} strokeWidth={1.7} />
              </div>

              <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D8B876]">
                <Sparkles size={12} />
                Your next move
              </div>

              <h2
                style={FRASER}
                className="text-2xl font-semibold text-[#FBF8F1] sm:text-3xl"
              >
                Find a place that feels like home.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
                Explore published properties, save the ones you love,
                and schedule a visit when you're ready.
              </p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={13} className="text-[#D8B876]" />
                  Verified listings
                </span>

                <span className="flex items-center gap-2">
                  <Search size={13} className="text-[#D8B876]" />
                  Easy discovery
                </span>

                <span className="flex items-center gap-2">
                  <CalendarDays size={13} className="text-[#D8B876]" />
                  Schedule visits
                </span>
              </div>
            </div>

            <Link
              to="/properties"
              className="group inline-flex w-fit shrink-0 items-center gap-2 border border-[#D8B876] bg-[#D8B876] px-5 py-3.5 text-sm font-semibold text-[#201C15] transition hover:bg-[#E3C98F]"
            >
              Explore properties
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>

        {/* Trust strip */}
        <div className="mt-8 flex flex-col gap-3 border border-[#D8CFB9] bg-[#FBF8F1] px-5 py-4 text-xs text-[#6B6252] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#3F6B52]" />
            Your buyer activity is securely managed by EstateHub.
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-1 font-semibold text-[#4A4436] transition hover:text-[#8C6924]"
          >
            Continue exploring
            <ArrowRight size={13} />
          </Link>
        </div>
      </main>
    </div>
  );
}

