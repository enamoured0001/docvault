import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../services/authservices";

function Navbar() {

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const data = await getCurrentUser();
        setUser(data.data);

      } catch (err) {

        setUser(null);
        console.log(err);

      } finally {

        setLoadingUser(false);

      }

    };

    fetchUser();

  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navButtonClass = (path) => (
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      location.pathname === path
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`
  );

  return (

    <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2563eb,#0f172a)] text-lg font-bold text-white shadow-lg shadow-blue-200">
            D
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            DocuVault
          </span>
        </button>

        {loadingUser ? (
          <div className="h-10 w-28 animate-pulse rounded-full bg-slate-200" />
        ) : user ? (

          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate("/dashboard")}
              className={`hidden md:block ${navButtonClass("/dashboard")}`}
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-2 shadow-sm transition hover:shadow-md"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                  {user.username?.[0]?.toUpperCase() || "U"}
                </span>
              )}
              <span className="hidden pr-2 text-sm font-medium text-slate-700 md:block">
                {user.username}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 md:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            </button>

          </div>

        ) : (

          <>
            <div className="hidden items-center gap-3 md:flex">

              <button
                onClick={() => navigate("/login")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  location.pathname === "/login"
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  location.pathname === "/register"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 text-white hover:-translate-y-0.5 hover:bg-slate-800"
                }`}
              >
                Sign Up
              </button>

            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 md:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            </button>
          </>

        )}

      </div>

      {mobileOpen && !loadingUser && (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="rounded-2xl bg-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-800"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="rounded-2xl bg-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-800"
                >
                  My Profile
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-2xl bg-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-800"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-left text-sm font-semibold text-white"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </nav>

  );

}

export default Navbar;
