import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authservices";
import { getMyFamily, removeMemberFromFamily } from "../services/familyservices";
import Navbar from "../components/Navbar";
import MemberCard from "../components/MemberCard";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const [user, setUser] = useState(null);
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState(false);

  const navigate = useNavigate();

  const loadData = async () => {

    try {

      const userData = await getCurrentUser();
      setUser(userData.data);

      const familyData = await getMyFamily();

      if (!familyData.data.hasFamily) {
        navigate("/create-family");
        return;
      }

      setFamily(familyData.data.family);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    loadData();
  }, [navigate]);

  const currentMember = family?.members?.find(
    (member) => member.user._id === user?._id
  );
  const isAdmin = currentMember?.role === "admin";

  const handleRemoveMember = async (memberId) => {

    try {

      setRemovingId(memberId);
      await removeMemberFromFamily(memberId);
      await loadData();

    } catch (error) {

      console.log(error);
      alert(error.message || "Failed to remove member");

    } finally {

      setRemovingId(null);

    }

  };

  const handleCopyInviteCode = async () => {

    try {

      await navigator.clipboard.writeText(family?.inviteCode || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

    } catch (error) {

      console.log(error);
      alert("Failed to copy invite code");

    }

  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-slate-500 sm:px-6 lg:px-8">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe,#f8fafc_45%,#eef2ff_100%)]">

      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        <section className="rounded-[34px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">
                Family Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Welcome to {family?.name}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                {user?.username}, manage your family members and their documents from one clean dashboard.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[28px] bg-slate-900 p-5 text-white shadow-xl">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Members</p>
                <p className="mt-3 text-4xl font-bold">{family?.members?.length || 0}</p>
                <p className="mt-2 text-sm text-slate-300">Connected family accounts</p>
              </div>

              {isAdmin ? (
                <button
                  onClick={() => navigate("/add-member")}
                  className="rounded-[28px] bg-[linear-gradient(135deg,#2563eb,#1d4ed8)] p-5 text-left text-white shadow-xl transition hover:-translate-y-1"
                >
                  <p className="text-sm uppercase tracking-[0.24em] text-blue-100">Admin Action</p>
                  <p className="mt-3 text-2xl font-bold">Add Member</p>
                  <p className="mt-2 text-sm text-blue-100">Only admins can invite and remove family members.</p>
                </button>
              ) : (
                <div className="rounded-[28px] bg-slate-100 p-5 text-slate-700">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Member Access</p>
                  <p className="mt-3 text-2xl font-bold">Viewer Mode</p>
                  <p className="mt-2 text-sm text-slate-500">You can view family documents, but member changes are admin-only.</p>
                </div>
              )}
            </div>

          </div>

        </section>

        <section className="mt-8 rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-[0_12px_45px_rgba(15,23,42,0.08)] backdrop-blur">

          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Family Members
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Your trusted circle
              </h2>
            </div>

            {isAdmin && (
              <button
                onClick={() => navigate("/add-member")}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Add Member
              </button>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {family?.members?.map((member) => (
              <MemberCard
                key={member._id}
                member={member}
                canManage={isAdmin}
                isSelf={member.user._id === user?._id}
                isRemoving={removingId === member.user._id}
                onRemove={handleRemoveMember}
                onOpen={() => navigate(`/member/${member.user._id}`)}
              />
            ))}
          </div>

          {isAdmin && family?.inviteCode && (
            <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Invite Member
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Open the invite code to help a new member join your family.
                  </p>
                </div>

                <button
                  onClick={() => setShowInviteCode((prev) => !prev)}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {showInviteCode ? "Hide Invite Code" : "Invite Member"}
                </button>
              </div>

              {showInviteCode && (
                <div className="mt-5 rounded-[24px] border border-blue-100 bg-[linear-gradient(135deg,#eff6ff,#dbeafe)] p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
                        Family Invite Code
                      </p>
                      <p className="mt-3 text-3xl font-bold tracking-[0.28em] text-slate-900">
                        {family.inviteCode}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        Share this code with a new member so they can join the family.
                      </p>
                    </div>

                    <button
                      onClick={handleCopyInviteCode}
                      className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      {copied ? "Copied" : "Copy Code"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </section>

      </div>

    </div>

  );

}

export default Dashboard;
