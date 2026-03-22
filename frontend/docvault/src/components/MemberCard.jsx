function MemberCard({ member, canManage = false, onRemove, isRemoving = false, isSelf = false, onOpen }) {

  return (

    <div
      onClick={onOpen}
      className="group cursor-pointer overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_45px_rgba(37,99,235,0.14)]"
    >

      <div className="flex items-center justify-between">
        <img
          src={member.user.avatar}
          alt="avatar"
          className="h-16 w-16 rounded-2xl object-cover ring-4 ring-blue-50"
        />

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {member.role}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-bold text-slate-900">
          {member.user.username}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {member.user.email}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 transition group-hover:bg-blue-50">
        <span className="text-sm font-medium text-slate-700">View Documents</span>
        <span className="text-lg text-blue-600">&rarr;</span>
      </div>

      {canManage && !isSelf && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(member.user._id);
          }}
          disabled={isRemoving}
          className={`mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            isRemoving
              ? "cursor-not-allowed bg-slate-200 text-slate-500"
              : "bg-rose-50 text-rose-600 hover:bg-rose-100"
          }`}
        >
          {isRemoving ? "Removing..." : "Delete Member"}
        </button>
      )}

    </div>

  );

}

export default MemberCard;
