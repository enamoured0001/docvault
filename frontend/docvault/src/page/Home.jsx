import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-[linear-gradient(180deg,#eff6ff_0%,#f8fafc_35%,#e2e8f0_100%)] text-slate-900">

      <Navbar />

      <main>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#bfdbfe_0%,transparent_32%),radial-gradient(circle_at_bottom_right,#c7d2fe_0%,transparent_28%)]" />

          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">

            <div className="flex flex-col justify-center">
              <p className="inline-flex w-fit rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-blue-700 shadow-sm backdrop-blur">
                Family Document Cloud
              </p>

              <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
                Family documents, organized in one premium workspace.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Aadhaar, PAN, certificates, insurance files aur family records ko beautifully organized, instantly accessible aur securely shared rakho.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Create Account
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
                >
                  Login
                </button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
                  <p className="text-3xl font-bold text-slate-900">24/7</p>
                  <p className="mt-2 text-sm text-slate-500">Document access anytime</p>
                </div>
                <div className="rounded-[24px] border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
                  <p className="text-3xl font-bold text-slate-900">Admin</p>
                  <p className="mt-2 text-sm text-slate-500">Family management control</p>
                </div>
                <div className="rounded-[24px] border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
                  <p className="text-3xl font-bold text-slate-900">Cloud</p>
                  <p className="mt-2 text-sm text-slate-500">Safe online backup</p>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute -top-8 right-10 h-32 w-32 rounded-full bg-blue-300/50 blur-3xl" />
              <div className="absolute bottom-0 left-6 h-40 w-40 rounded-full bg-cyan-200/60 blur-3xl" />

              <div className="relative w-full max-w-xl rounded-[36px] border border-white/80 bg-white/80 p-6 shadow-[0_22px_80px_rgba(37,99,235,0.18)] backdrop-blur">
                <div className="rounded-[28px] bg-[linear-gradient(145deg,#0f172a,#1d4ed8)] p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-blue-200">Vault Snapshot</p>
                      <h2 className="mt-2 text-2xl font-bold">Everything in one place</h2>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3 text-right backdrop-blur">
                      <p className="text-sm text-blue-100">Storage</p>
                      <p className="text-xl font-bold">Active</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Aadhaar Card</p>
                          <p className="mt-1 text-sm text-blue-100">Verified identity document</p>
                        </div>
                        <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                          Synced
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Insurance Policy</p>
                          <p className="mt-1 text-sm text-blue-100">Ready for instant access</p>
                        </div>
                        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-blue-50">
                          Protected
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Family Certificates</p>
                          <p className="mt-1 text-sm text-blue-100">Shared with trusted members</p>
                        </div>
                        <span className="rounded-full bg-amber-300/20 px-3 py-1 text-xs font-semibold text-amber-100">
                          Shared
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[28px] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Secure Access</p>
              <h3 className="mt-3 text-2xl font-bold">Protected storage</h3>
              <p className="mt-3 text-slate-600">Important documents ko clean interface ke saath safe cloud access milega.</p>
            </div>
            <div className="rounded-[28px] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Family Roles</p>
              <h3 className="mt-3 text-2xl font-bold">Admin control</h3>
              <p className="mt-3 text-slate-600">Admins members ko add ya remove kar sakte hain, baaki members documents manage kar sakte hain.</p>
            </div>
            <div className="rounded-[28px] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Instant Access</p>
              <h3 className="mt-3 text-2xl font-bold">View and download fast</h3>
              <p className="mt-3 text-slate-600">Document library se directly dekhna, download karna aur organize karna easy hai.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-[36px] bg-slate-900 px-8 py-12 text-center text-white shadow-[0_20px_70px_rgba(15,23,42,0.22)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Ready To Start</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight">
              Build your family vault today.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Ek professional workspace jahan documents safe bhi rahen aur easily accessible bhi.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="mt-8 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Get Started Now
            </button>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 DocuVault. All rights reserved.</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="transition hover:text-slate-900"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="transition hover:text-slate-900"
            >
              Register
            </button>
          </div>
        </div>
      </footer>

    </div>

  );

}

export default Home;
