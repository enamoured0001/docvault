import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCurrentUser, logoutUser, updateCurrentUser } from "../services/authservices";

function Profile() {

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {

    const loadUser = async () => {

      try {

        const data = await getCurrentUser();
        setUser(data.data);
        setUsername(data.data.username || "");
        setEmail(data.data.email || "");

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    loadUser();

  }, []);

  const handleSave = async (e) => {

    e.preventDefault();

    if (!username.trim() || !email.trim()) {
      alert("Username and email required");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
      alert("Username must be 3-20 characters and only use letters, numbers, or underscore");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      alert("Enter a valid email address");
      return;
    }

    try {

      setIsSaving(true);
      const formData = new FormData();
      formData.append("username", username.trim());
      formData.append("email", email.trim());

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const data = await updateCurrentUser(formData);
      setUser(data.data);
      setAvatar(null);
      alert("Profile updated successfully");

    } catch (error) {

      console.log(error);
      alert(error.message || "Profile update failed");

    } finally {

      setIsSaving(false);

    }

  };

  const handleLogout = async () => {

    try {

      setIsLoggingOut(true);
      await logoutUser();
      navigate("/");

    } catch (error) {

      console.log(error);
      alert("Logout failed");

    } finally {

      setIsLoggingOut(false);

    }

  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-slate-500 sm:px-6 lg:px-8">
          Loading profile...
        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe,#f8fafc_45%,#eef2ff_100%)]">

      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">

          <section className="rounded-[34px] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">
              Profile
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Your account
            </h1>
            <p className="mt-3 text-slate-600">
              Update your details and manage your account from here.
            </p>

            <div className="mt-8 flex flex-col items-center rounded-[28px] bg-slate-50 p-6 text-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="h-28 w-28 rounded-3xl object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-blue-100 text-4xl font-bold text-blue-700">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <h2 className="mt-4 text-2xl font-bold text-slate-900">{user?.username}</h2>
              <p className="mt-1 text-slate-500">{user?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`mt-6 w-full rounded-2xl px-5 py-3 font-semibold transition ${
                isLoggingOut
                  ? "cursor-not-allowed bg-slate-300 text-slate-600"
                  : "bg-rose-50 text-rose-600 hover:bg-rose-100"
              }`}
            >
              {isLoggingOut ? "Logging Out..." : "Logout"}
            </button>
          </section>

          <section className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-bold text-slate-900">Edit Details</h2>
            <p className="mt-2 text-sm text-slate-500">
              Keep your profile up to date by editing your username, email, and avatar.
            </p>

            <form onSubmit={handleSave} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  minLength="3"
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Change Avatar
                </label>
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
                  <input
                    type="file"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    className="w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:font-medium file:text-blue-700 hover:file:bg-blue-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className={`w-full rounded-2xl px-5 py-3 font-semibold transition ${
                  isSaving
                    ? "cursor-not-allowed bg-slate-300 text-slate-600"
                    : "bg-slate-900 text-white hover:-translate-y-0.5 hover:bg-slate-800"
                }`}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </section>

        </div>

      </div>

    </div>

  );

}

export default Profile;
