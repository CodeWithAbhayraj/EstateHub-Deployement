
function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className = "",
}) {
  return (
    <div
      className={`
        group relative overflow-hidden
        rounded-2xl
        border border-[#D8CFB9]
        bg-[#FBF8F1]
        p-4
        shadow-[0_8px_24px_rgba(32,28,21,0.04)]
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-[#C9B98F]
        hover:shadow-[0_14px_32px_rgba(32,28,21,0.07)]
        sm:p-5
        ${className}
      `}
    >
      {/* Subtle gold accent */}
      <div
        className="
          absolute left-0 top-0
          h-full w-0.5
          bg-[#AD8332]
          opacity-60
          transition-opacity duration-200
          group-hover:opacity-100
        "
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-4">
        {/* TEXT */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-[#8A806D]">
            {title}
          </p>

          <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-[#201C15] sm:text-3xl">
            {value ?? 0}
          </p>

          {description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#8A806D] sm:text-sm">
              {description}
            </p>
          )}
        </div>

        {/* ICON */}
        {Icon && (
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              border border-[#D8CFB9]
              bg-[#F2ECDF]
              text-[#AD8332]
              transition-all duration-200
              group-hover:border-[#AD8332]
              group-hover:bg-[#EDE2CA]
              sm:h-11 sm:w-11
            "
          >
            <Icon size={19} strokeWidth={1.8} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
