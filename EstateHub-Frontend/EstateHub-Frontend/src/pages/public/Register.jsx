import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Eye, EyeOff, Loader2, ShieldCheck, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const FRASER = { fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif" };

const inputClass =
  "w-full border border-[#D8CFB9] bg-[#F2ECDF]/40 px-4 py-2.5 text-sm text-[#201C15] outline-none transition placeholder:text-[#8A806D] focus:border-[#AD8332] focus:bg-white focus:ring-2 focus:ring-[#AD8332]/15 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass = "mb-1.5 block text-sm font-medium text-[#4A4436]";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", password: "", role: "BUYER" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await register(formData);
      setSuccess("Registration successful! Please login.");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2ECDF] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center border border-[#171B21] bg-[#171B21] text-white">
              <Building2 size={18} strokeWidth={1.75} />
            </div>
            <span className="text-xl text-[#201C15]" style={FRASER}>
              Estate<span className="text-[#8C6924]">Hub</span>
            </span>
          </Link>
          <p className="mt-2 text-sm text-[#6B6252]">Create your account and get started.</p>
        </div>

        <div className="border border-[#D8CFB9] bg-white p-6 shadow-[0_12px_36px_-20px_rgba(23,27,33,0.25)]">
          <div className="mb-5">
            <div className="flex h-10 w-10 items-center justify-center border border-[#D8CFB9] text-[#8C6924]">
              <UserPlus size={18} />
            </div>
            <h1 className="mt-4 text-2xl text-[#201C15]" style={FRASER}>Create account</h1>
            <p className="text-sm text-[#6B6252]">Join as a buyer or seller.</p>
          </div>

          {error && (
            <div className="mb-4 border border-[#B3564B]/30 bg-[#B3564B]/5 p-3 text-sm text-[#B3564B]">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-1.5 border border-[#3F6B52]/30 bg-[#3F6B52]/5 p-3 text-sm text-[#3F6B52]">
              <ShieldCheck size={16} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Full name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={loading}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={loading}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Mobile number</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                required
                disabled={loading}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  disabled={loading}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A806D] transition hover:text-[#201C15]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>Register as</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
                className={inputClass}
              >
                <option value="BUYER">Buyer</option>
                <option value="SELLER">Seller</option>
              </select>
              <p className="mt-1.5 text-xs text-[#8A806D]">Choose how you want to use EstateHub.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 bg-[#171B21] py-3 text-sm font-semibold text-white transition hover:bg-[#AD8332] hover:text-[#171B21] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 border-t border-[#EAE2CF] pt-4 text-center text-sm">
            <p className="text-[#6B6252]">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-[#8C6924] transition hover:text-[#AD8332]">
                Login
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-[#8A806D]">
          Create your account to start exploring properties.
        </p>
      </div>
    </div>
  );
}