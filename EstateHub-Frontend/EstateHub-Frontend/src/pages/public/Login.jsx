
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login(formData);

      switch (response.role) {
        case "BUYER":
          navigate("/buyer/dashboard");
          break;

        case "SELLER":
          navigate("/seller/dashboard");
          break;

        case "ADMIN":
        case "SUPER_ADMIN":
          navigate("/admin/dashboard");
          break;

        default:
          navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F2ECDF] px-4 py-6 sm:px-6 sm:py-10">
      {/* Decorative background */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#171B21 1px, transparent 1px), linear-gradient(90deg, #171B21 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center sm:min-h-[calc(100vh-5rem)]">
        <div className="grid w-full overflow-hidden border border-[#D8CFB9] bg-white shadow-[0_24px_70px_-35px_rgba(23,27,33,0.35)] lg:grid-cols-2">
          {/* =================================================
              LEFT BRAND PANEL
              ================================================= */}

          <div className="relative hidden min-h-[650px] overflow-hidden bg-[#171B21] p-10 lg:flex lg:flex-col lg:justify-between xl:p-12">
            {/* Grid */}

            <div
              className="pointer-events-none absolute inset-0 opacity-[0.055]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
                backgroundSize: "42px 42px",
              }}
            />

            {/* Gold glow */}

            <div className="pointer-events-none absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-[#AD8332]/10 blur-3xl" />

            <div className="relative">
              {/* Brand */}

              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center border border-white/15 bg-white/[0.04] text-white">
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

                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                    Property platform
                  </span>
                </div>
              </Link>

              {/* Intro */}

              <div className="mt-24 max-w-md">
                <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[11px] text-white/55">
                  <ShieldCheck
                    size={14}
                    className="text-[#D8B876]"
                  />

                  Trusted property platform
                </div>

                <h2
                  className="mt-6 text-4xl leading-[1.08] text-white xl:text-5xl"
                  style={FRASER}
                >
                  Welcome back
                  <br />
                  to Estate
                  <span className="text-[#D8B876]">
                    Hub.
                  </span>
                </h2>

                <p className="mt-6 max-w-sm text-sm leading-7 text-white/45">
                  Discover properties, manage your
                  listings and connect with the right
                  people — all from one simple platform.
                </p>
              </div>
            </div>

            {/* Features */}

            <div className="relative space-y-3.5">
              <Feature text="Discover properties easily" />
              <Feature text="Save your favorite properties" />
              <Feature text="Connect with agents securely" />
            </div>
          </div>

          {/* =================================================
              LOGIN PANEL
              ================================================= */}

          <div className="flex min-h-[650px] flex-col justify-center bg-[#FBF8F1] p-6 sm:p-10 lg:p-12 xl:p-14">
            {/* Mobile logo */}

            <div className="mb-10 lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center bg-[#171B21] text-white">
                  <Building2
                    size={20}
                    strokeWidth={1.5}
                  />
                </div>

                <div>
                  <span
                    className="block text-xl text-[#201C15]"
                    style={FRASER}
                  >
                    Estate
                    <span className="text-[#8C6924]">
                      Hub
                    </span>
                  </span>

                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8A806D]">
                    Property platform
                  </span>
                </div>
              </Link>
            </div>

            {/* Header */}

            <div>
              <div className="flex h-12 w-12 items-center justify-center border border-[#D8CFB9] bg-[#F2ECDF] text-[#8C6924]">
                <ShieldCheck size={21} />
              </div>

              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6924]">
                Account access
              </p>

              <h1
                className="mt-2 text-3xl text-[#201C15] sm:text-4xl"
                style={FRASER}
              >
                Welcome back
              </h1>

              <p className="mt-3 max-w-sm text-sm leading-6 text-[#6B6252]">
                Sign in to continue to your EstateHub
                account.
              </p>
            </div>

            {/* Error */}

            {error && (
              <div className="mt-7 border border-[#B3564B]/25 bg-[#B3564B]/[0.06] p-4 text-sm leading-5 text-[#B3564B]">
                {error}
              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >
              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#4A4436]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="h-12 w-full border border-[#D8CFB9] bg-white px-4 text-sm text-[#201C15] outline-none transition placeholder:text-[#AAA294] hover:border-[#C9BE9F] focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Password */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#4A4436]"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                    className="h-12 w-full border border-[#D8CFB9] bg-white px-4 pr-12 text-sm text-[#201C15] outline-none transition placeholder:text-[#AAA294] hover:border-[#C9BE9F] focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[#8A806D] transition hover:text-[#201C15] disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Login */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 bg-[#171B21] text-sm font-semibold text-white transition-all duration-200 hover:bg-[#AD8332] hover:text-[#171B21] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in

                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Register */}

            <div className="mt-8 border-t border-[#EAE2CF] pt-6 text-center">
              <p className="text-sm text-[#6B6252]">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-[#8C6924] transition hover:text-[#AD8332]"
                >
                  Create one
                </Link>
              </p>
            </div>

            {/* Security */}

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8A806D]">
              <ShieldCheck size={13} />
              Secure access to your EstateHub account
            </div>
          </div>
        </div>
      </div>

      <p className="relative mt-4 text-center text-[11px] text-[#8A806D]">
        By continuing, you agree to use EstateHub responsibly.
      </p>
    </main>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center border border-[#D8B876]/30 text-[#D8B876]">
        <CheckCircle2 size={14} />
      </div>

      <span className="text-sm text-white/45">
        {text}
      </span>
    </div>
  );
}

