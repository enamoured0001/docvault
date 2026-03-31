import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authservices";
import Navbar from "../components/Navbar";

function Register() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {

    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim();
    const nextErrors = {};

    if (!normalizedUsername || !normalizedEmail || !password || !avatar) {
      if (!normalizedUsername) nextErrors.username = "Username is required";
      if (!normalizedEmail) nextErrors.email = "Email is required";
      if (!password) nextErrors.password = "Password is required";
      if (!avatar) nextErrors.avatar = "Avatar is required";
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(normalizedUsername)) {
      nextErrors.username = "Use 3-20 characters: letters, numbers, underscore only";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email like name@example.com";
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password)) {
      nextErrors.password = "Use at least 6 characters with 1 letter and 1 number";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;

  };

  const handleRegister = async () => {

    if (!validateForm()) {
      return;
    }

    try {

      setIsSubmitting(true);
      setErrors({});
      const formData = new FormData();

      formData.append("username", username.trim());
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("avatar", avatar);

      const data = await registerUser(formData);
      console.log(data);
      alert("Registration successful");
      navigate("/login");

    } catch (error) {

      console.log(error);
      setErrors({ form: error.message || "Registration failed" });

    } finally {

      setIsSubmitting(false);

    }

  };

  return (

    <div className="min-h-screen bg-[linear-gradient(180deg,#eff6ff_0%,#f8fafc_45%,#eef2ff_100%)]">

      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">

          <div className="rounded-[34px] border border-white/70 bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">
              Create Account
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              Start your secure document vault.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-blue-100">
              Create your account to organize, access, and manage family documents securely.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">Cloud storage</p>
                <p className="mt-2 text-2xl font-bold">Ready</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">Family access</p>
                <p className="mt-2 text-2xl font-bold">Connected</p>
              </div>
            </div>
          </div>

          <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-bold text-slate-900">Register</h2>
            <p className="mt-2 text-sm text-slate-500">
              Create your account to start a family vault or join one with an invite code.
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  minLength="3"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <p className="mt-2 text-xs text-slate-500">
                  Username: `3-20` chars, letters/numbers/underscore only.
                </p>
                {errors.username && <p className="mt-1 text-sm text-rose-600">{errors.username}</p>}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="mt-2 text-xs text-slate-500">
                  Email format: `name@example.com`
                </p>
                {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  minLength="6"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="mt-2 text-xs text-slate-500">
                  Password: minimum `6` chars, at least `1` letter and `1` number.
                </p>
                {errors.password && <p className="mt-1 text-sm text-rose-600">{errors.password}</p>}
              </div>

              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
                <p className="mb-3 text-sm font-medium text-slate-700">Upload Avatar</p>
                <input
                  type="file"
                  className="w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:font-medium file:text-blue-700 hover:file:bg-blue-200"
                  onChange={(e) => setAvatar(e.target.files[0])}
                />
                <p className="mt-3 text-xs text-slate-500">
                  Choose a profile image to use as your avatar.
                </p>
              </div>
              {errors.avatar && <p className="text-sm text-rose-600">{errors.avatar}</p>}
              {errors.form && <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{errors.form}</p>}

              <button
                onClick={handleRegister}
                disabled={isSubmitting}
                className={`w-full rounded-2xl px-5 py-3 font-semibold transition ${
                  isSubmitting
                    ? "cursor-not-allowed bg-slate-300 text-slate-600"
                    : "bg-slate-900 text-white hover:-translate-y-0.5 hover:bg-slate-800"
                }`}
              >
                {isSubmitting ? "Creating Account..." : "Register"}
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>

  );

}

export default Register;
