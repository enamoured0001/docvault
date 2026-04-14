import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { resendVerificationOtp, verifyEmailOtp } from "../services/authservices";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryEmail = useMemo(
    () => new URLSearchParams(location.search).get("email") || "",
    [location.search]
  );

  const [email, setEmail] = useState(queryEmail);
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !otp.trim()) {
      setErrorMessage("Email and OTP are required");
      return;
    }

    try {
      setIsVerifying(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await verifyEmailOtp({
        email: normalizedEmail,
        otp: otp.trim()
      });

      setSuccessMessage(response.message || "Email verified successfully");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setErrorMessage(error?.message || "OTP verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMessage("Email is required to resend OTP");
      return;
    }

    try {
      setIsResending(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await resendVerificationOtp({ email: normalizedEmail });
      setSuccessMessage(response.message || "OTP sent successfully");
    } catch (error) {
      setErrorMessage(error?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ecfeff_0%,#f8fafc_45%,#eff6ff_100%)]">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,#082f49,#0f766e,#22c55e)] p-8 text-white shadow-[0_22px_70px_rgba(8,47,73,0.22)]">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-100">
              Email Verification
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Confirm your email with a one-time password.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-emerald-50/90">
              We&apos;ve protected registration with OTP verification so only verified email addresses can sign in.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-emerald-100">Code length</p>
                <p className="mt-2 text-2xl font-bold">6 digits</p>
              </div>
              <div className="rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-emerald-100">Expiry</p>
                <p className="mt-2 text-2xl font-bold">10 mins</p>
              </div>
            </div>
          </section>

          <section className="rounded-[36px] border border-slate-200 bg-white/95 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <h2 className="text-3xl font-bold text-slate-900">Verify Email</h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter the OTP sent to your email to finish registration.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-500 focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  OTP Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  placeholder="Enter 6-digit OTP"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 tracking-[0.4em] outline-none transition focus:border-emerald-500 focus:bg-white"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
              </div>

              {errorMessage && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {successMessage}
                </div>
              )}

              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className={`w-full rounded-2xl px-5 py-3 font-semibold transition ${
                  isVerifying
                    ? "cursor-not-allowed bg-slate-300 text-slate-600"
                    : "bg-slate-900 text-white hover:-translate-y-0.5 hover:bg-slate-800"
                }`}
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </button>

              <button
                onClick={handleResend}
                disabled={isResending}
                className={`w-full rounded-2xl border px-5 py-3 font-semibold transition ${
                  isResending
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:-translate-y-0.5 hover:bg-emerald-100"
                }`}
              >
                {isResending ? "Sending OTP..." : "Resend OTP"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
