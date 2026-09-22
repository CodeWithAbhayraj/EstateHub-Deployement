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

const FRASER = { fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif" };

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
        err.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F2ECDF] px-4 py-10 sm:px-6">
      <div className="relative w-full max-w-5xl">
        <div className="grid overflow-hidden border border-[#D8CFB9] bg-white shadow-[0_16px_48px_-24px_rgba(23,27,33,0.35)] lg:grid-cols-2">
          {/* LEFT BRAND PANEL */}
          <div className="relative hidden overflow-hidden bg-[#171B21] p-10 lg:flex lg:flex-col lg:justify-between">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center border border-white/20 bg-white/5 text-white">
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

              <div className="mt-20 max-w-md">
                <div className="inline-flex items-center gap-2 border border-white/10 px-3 py-1.5 text-xs text-white/60">
                  <ShieldCheck size={14} className="text-[#D8B876]" />
                  Trusted property platform
                </div>

                <h2 className="mt-6 text-4xl leading-tight text-white" style={FRASER}>
                  Welcome back
                  <br />
                  to EstateHub.
                </h2>

                <p className="mt-5 text-sm leading-7 text-white/45">
                  Discover properties, manage your listings and connect with
                  the right people — all from one simple platform.
                </p>
              </div>
            </div>

            <div className="relative space-y-3">
              <Feature text="Discover properties easily" />
              <Feature text="Save your favorite properties" />
              <Feature text="Connect with agents securely" />
            </div>
          </div>

          {/* LOGIN PANEL */}
          <div className="bg-white p-6 sm:p-10 lg:p-12">
            {/* Mobile logo */}
            <div className="mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center border border-[#171B21] bg-[#171B21] text-white">
                  <Building2 size={20} strokeWidth={1.75} />
                </div>

                <div>
                  <span className="block text-lg text-[#201C15]" style={FRASER}>
                    Estate<span className="text-[#8C6924]">Hub</span>
                  </span>
                  <span className="text-[11px] text-[#8A806D]">
                    Property listing index
                  </span>
                </div>
              </Link>
            </div>

            {/* HEADER */}
            <div className="mb-7">
              <div className="flex h-12 w-12 items-center justify-center border border-[#D8CFB9] text-[#8C6924]">
                <ShieldCheck size={22} />
              </div>

              <h1 className="mt-5 text-3xl text-[#201C15]" style={FRASER}>
                Welcome back
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#6B6252]">
                Sign in to continue to your EstateHub account.
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 border border-[#B3564B]/30 bg-[#B3564B]/5 p-4 text-sm leading-5 text-[#B3564B]">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#4A4436]"
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
                  className="w-full border border-[#D8CFB9] bg-[#F2ECDF]/40 px-4 py-3 text-sm text-[#201C15] outline-none transition placeholder:text-[#8A806D] focus:border-[#AD8332] focus:bg-white focus:ring-2 focus:ring-[#AD8332]/15 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#4A4436]"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                    className="w-full border border-[#D8CFB9] bg-[#F2ECDF]/40 px-4 py-3 pr-12 text-sm text-[#201C15] outline-none transition placeholder:text-[#8A806D] focus:border-[#AD8332] focus:bg-white focus:ring-2 focus:ring-[#AD8332]/15 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center p-1.5 text-[#8A806D] transition hover:text-[#201C15] disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 bg-[#171B21] py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#AD8332] hover:text-[#171B21] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in…
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

            {/* REGISTER */}
            <div className="mt-7 border-t border-[#EAE2CF] pt-6 text-center">
              <p className="text-sm text-[#6B6252]">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-[#8C6924] transition hover:text-[#AD8332]"
                >
                  Create one
                </Link>
              </p>
            </div>

            {/* TRUST NOTE */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8A806D]">
              <ShieldCheck size={13} />
              Secure access to your EstateHub account
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-[#8A806D]">
          By continuing, you agree to use EstateHub responsibly.
        </p>
      </div>
    </main>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 items-center justify-center border border-[#D8B876]/30 text-[#D8B876]">
        <CheckCircle2 size={14} />
      </div>

      <span className="text-sm text-white/45">{text}</span>
    </div>
  );
}