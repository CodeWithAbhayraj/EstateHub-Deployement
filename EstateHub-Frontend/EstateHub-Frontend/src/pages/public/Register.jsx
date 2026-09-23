
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
  UserPlus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

const inputClass =
  "h-12 w-full border border-[#D8CFB9] bg-white px-4 text-sm text-[#201C15] outline-none transition placeholder:text-[#AAA294] hover:border-[#C9BE9F] focus:border-[#AD8332] focus:ring-2 focus:ring-[#AD8332]/10 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wide text-[#4A4436]";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "BUYER",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(formData);

      setSuccess("Registration successful! Please login.");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F2ECDF] px-4 py-6 sm:px-6 sm:py-10">
      {/* Background grid */}

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

          <div className="relative hidden min-h-[680px] overflow-hidden bg-[#171B21] p-10 lg:flex lg:flex-col lg:justify-between xl:p-12">
            {/* Blueprint grid */}

            <div
              className="pointer-events-none absolute inset-0 opacity-[0.055]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
                backgroundSize: "42px 42px",
              }}
            />

            {/* Soft gold glow */}

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

              {/* Main message */}

              <div className="mt-24 max-w-md">
                <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[11px] text-white/55">
                  <UserPlus
                    size={14}
                    className="text-[#D8B876]"
                  />

                  Start your journey
                </div>

                <h2
                  className="mt-6 text-4xl leading-[1.08] text-white xl:text-5xl"
                  style={FRASER}
                >
                  Find your place
                  <br />
                  with Estate
                  <span className="text-[#D8B876]">
                    Hub.
                  </span>
                </h2>

                <p className="mt-6 max-w-sm text-sm leading-7 text-white/45">
                  Create your account and discover a
                  simpler way to explore properties,
                  save favorites and connect with the
                  right people.
                </p>
              </div>
            </div>

            {/* Features */}

            <div className="relative space-y-3.5">
              <Feature text="Explore available properties" />
              <Feature text="Save properties you love" />
              <Feature text="Book visits with ease" />
            </div>
          </div>

          {/* =================================================
              REGISTER PANEL
              ================================================= */}

          <div className="flex min-h-[680px] flex-col justify-center bg-[#FBF8F1] p-6 sm:p-10 lg:p-12 xl:p-14">
            {/* Mobile brand */}

            <div className="mb-9 lg:hidden">
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
                <UserPlus size={21} />
              </div>

              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6924]">
                Create account
              </p>

              <h1
                className="mt-2 text-3xl text-[#201C15] sm:text-4xl"
                style={FRASER}
              >
                Join EstateHub
              </h1>

              <p className="mt-3 max-w-sm text-sm leading-6 text-[#6B6252]">
                Create your account and start exploring
                properties.
              </p>
            </div>

            {/* Error */}

            {error && (
              <div className="mt-6 border border-[#B3564B]/25 bg-[#B3564B]/[0.06] p-4 text-sm leading-5 text-[#B3564B]">
                {error}
              </div>
            )}

            {/* Success */}

            {success && (
              <div className="mt-6 flex items-start gap-2.5 border border-[#3F6B52]/25 bg-[#3F6B52]/[0.06] p-4 text-sm leading-5 text-[#3F6B52]">
                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <span>{success}</span>
              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              {/* Name */}

              <div>
                <label
                  htmlFor="name"
                  className={labelClass}
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                  autoComplete="name"
                  className={inputClass}
                />
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className={labelClass}
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
                  className={inputClass}
                />
              </div>

              {/* Mobile */}

              <div>
                <label
                  htmlFor="mobile"
                  className={labelClass}
                >
                  Mobile number
                </label>

                <input
                  id="mobile"
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  required
                  disabled={loading}
                  autoComplete="tel"
                  className={inputClass}
                />
              </div>

              {/* Password */}

              <div>
                <label
                  htmlFor="password"
                  className={labelClass}
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
                    placeholder="Create a password"
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    className={`${inputClass} pr-12`}
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

              {/* Role */}

              <div>
                <label
                  htmlFor="role"
                  className={labelClass}
                >
                  Register as
                </label>

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="BUYER">
                    Buyer
                  </option>

                  <option value="SELLER">
                    Seller
                  </option>
                </select>

                <p className="mt-2 text-xs leading-5 text-[#8A806D]">
                  Choose how you want to use
                  EstateHub.
                </p>
              </div>

              {/* Submit */}

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

                    Creating account...
                  </>
                ) : (
                  <>
                    Create account

                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Login */}

            <div className="mt-7 border-t border-[#EAE2CF] pt-6 text-center">
              <p className="text-sm text-[#6B6252]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#8C6924] transition hover:text-[#AD8332]"
                >
                  Login
                </Link>
              </p>
            </div>

            {/* Security note */}

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#8A806D]">
              <ShieldCheck size={13} />
              Your account details are handled securely
            </div>
          </div>
        </div>
      </div>

      <p className="relative mt-4 text-center text-[11px] text-[#8A806D]">
        Create your account to start exploring EstateHub.
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

