import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMemberToFamily } from "../services/familyservices";
import Navbar from "../components/Navbar";

function AddMember() {

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleAddMember = async () => {

    if (!email) {
      alert("Email required");
      return;
    }

    try {

      setIsSubmitting(true);
      const data = await addMemberToFamily({ email });
      console.log(data);
      alert("Member added successfully");
      setEmail("");
      navigate("/dashboard");

    } catch (error) {

      console.log(error);
      alert(error.message || "Failed to add member");

    } finally {

      setIsSubmitting(false);

    }

  };

  return (

    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe,#f8fafc_50%,#eef2ff_100%)]">

      <Navbar />

      <div className="mx-auto flex max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">

          <div className="rounded-[34px] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">
              Add Member
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Invite a family member with one email.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Family ko organized rakho aur documents access ko simple banao. Bas member ka email add karo.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-slate-900 p-5 text-white">
                <p className="text-sm text-slate-300">Fast invite flow</p>
                <p className="mt-2 text-2xl font-bold">1 Step</p>
              </div>
              <div className="rounded-[24px] bg-blue-600 p-5 text-white">
                <p className="text-sm text-blue-100">Member access</p>
                <p className="mt-2 text-2xl font-bold">Secure</p>
              </div>
            </div>
          </div>

          <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
            <h2 className="text-2xl font-bold text-slate-900">Family Invite</h2>
            <p className="mt-2 text-sm text-slate-500">
              Invite bhejne ke liye member ka registered email enter karein.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Member Email
                </label>
                <input
                  type="email"
                  placeholder="Enter member email"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                onClick={handleAddMember}
                disabled={isSubmitting}
                className={`w-full rounded-2xl px-5 py-3 font-semibold transition ${
                  isSubmitting
                    ? "cursor-not-allowed bg-slate-300 text-slate-600"
                    : "bg-slate-900 text-white hover:-translate-y-0.5 hover:bg-slate-800"
                }`}
              >
                {isSubmitting ? "Adding Member..." : "Add Member"}
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>

  );

}

export default AddMember;
