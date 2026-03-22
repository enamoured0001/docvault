import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authservices";
import Navbar from "../components/Navbar";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    if (!email || !password) {
      setErrorMessage("Email and password required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Enter a valid email address");
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password)) {
      setErrorMessage("Password must be at least 6 characters and include at least one letter and one number");
      return;
    }

    try {

      setIsSubmitting(true);
      setErrorMessage("");
      const data = await loginUser({
        email: email.trim(),
        password
      });

      if (data.success) {
        navigate("/dashboard");
      }

    } catch (error) {

      console.log(error);
      setErrorMessage(error?.message || error?.response?.data?.message || "Invalid email or password");

    } finally {

      setIsSubmitting(false);

    }

  };

  return (

    <div className="min-h-screen bg-[linear-gradient(180deg,#e0f2fe_0%,#f8fafc_45%,#eef2ff_100%)]">

      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">

          <section className="overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,#0f172a,#2563eb,#38bdf8)] p-8 text-white shadow-[0_22px_70px_rgba(37,99,235,0.22)]">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-100">
                Welcome Back
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                Login to your family document workspace.
              </h1>
              <p className="mt-5 text-base leading-7 text-blue-50/90">
                Important files, member access, aur family records ko ek hi secure dashboard se handle karein.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">Access</p>
                <p className="mt-2 text-2xl font-bold">Instant</p>
              </div>
              <div className="rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">Sharing</p>
                <p className="mt-2 text-2xl font-bold">Family Ready</p>
              </div>
              <div className="rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">Security</p>
                <p className="mt-2 text-2xl font-bold">Protected</p>
              </div>
            </div>
          </section>

          <section className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <h2 className="text-3xl font-bold text-slate-900">Login</h2>
            <p className="mt-2 text-sm text-slate-500">
              Account access ke liye apni credentials enter karein.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  minLength="6"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {errorMessage && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                  {errorMessage}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={isSubmitting}
                className={`w-full rounded-2xl px-5 py-3 font-semibold transition ${
                  isSubmitting
                    ? "cursor-not-allowed bg-slate-300 text-slate-600"
                    : "bg-slate-900 text-white hover:-translate-y-0.5 hover:bg-slate-800"
                }`}
              >
                {isSubmitting ? "Logging In..." : "Login"}
              </button>

              <p className="text-center text-sm text-slate-500">
                New user?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Register here
                </button>
              </p>
            </div>
          </section>

        </div>

      </div>

    </div>

  );

}

export default Login;
