import { useState } from "react";
import { createFamily, joinFamily } from "../services/familyservices";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function CreateFamily() {
  

  const [familyname, setFamilyname] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleCreateFamily = async () => {

    if (!familyname) {
      setErrorMessage("Family name required");
      return;
    }

    try {

      setLoading(true);
      setErrorMessage("");

      const data = await createFamily(familyname);

      console.log(data);

      alert("Family created successfully");

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      setErrorMessage(error.message || "Failed to create family");

    } finally {

      setLoading(false);

    }

  };

  const handleJoinFamily = async () => {

    if (!inviteCode.trim()) {
      setErrorMessage("Enter a valid family invite code");
      return;
    }

    try {

      setJoinLoading(true);
      setErrorMessage("");
      await joinFamily(inviteCode.trim().toUpperCase());
      alert("Joined family successfully");
      navigate("/dashboard");

    } catch (error) {

      console.log(error);
      setErrorMessage(error.message || "Failed to join family");

    } finally {

      setJoinLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe,#f8fafc_45%,#eef2ff_100%)]">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">

          <div className="rounded-[34px] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">
              Create Family
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Start your own family vault</h2>
            <p className="mt-3 text-slate-600">
              Create a new family workspace and invite members with a shareable code.
            </p>

            <div className="mt-8 space-y-4">
              <input
                type="text"
                placeholder="Enter family name"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                value={familyname}
                onChange={(e) => setFamilyname(e.target.value)}
              />

              <button
                onClick={handleCreateFamily}
                className="w-full rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                {loading ? "Creating..." : "Create Family"}
              </button>
            </div>
          </div>

          <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">
              Join Family
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Already have an invite code?</h2>
            <p className="mt-3 text-slate-600">
              Enter the family invite code provided by an admin to join directly.
            </p>

            <div className="mt-8 space-y-4">
              <input
                type="text"
                placeholder="Enter invite code"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 uppercase outline-none transition focus:border-blue-500 focus:bg-white"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              />

              <button
                onClick={handleJoinFamily}
                className="w-full rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                {joinLoading ? "Joining..." : "Join Family"}
              </button>
            </div>
          </div>

        </div>

        {errorMessage && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {errorMessage}
          </div>
        )}
      </div>
    </div>

  );

}

export default CreateFamily;
