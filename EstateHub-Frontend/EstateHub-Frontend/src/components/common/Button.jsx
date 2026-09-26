
const VARIANTS = {
  primary:
    "bg-[#201C15] text-[#F8F5ED] hover:bg-[#302A22] border border-[#201C15]",

  accent:
    "bg-[#AD8332] text-white hover:bg-[#8C6924] border border-[#AD8332]",

  outline:
    "border border-[#D8CFB9] bg-[#FBF8F1] text-[#403A31] hover:border-[#AD8332] hover:bg-[#F2ECDF]",

  ghost:
    "text-[#6B6252] hover:bg-[#F2ECDF] hover:text-[#201C15]",

  danger:
    "bg-[#B3564B] text-white hover:bg-[#963F36] border border-[#B3564B]",
};

function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex min-h-11 items-center justify-center gap-2
        rounded-xl px-4 py-2.5
        text-sm font-semibold
        transition-all duration-200
        disabled:cursor-not-allowed disabled:opacity-50
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#AD8332]
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[#F8F5ED]
        active:scale-[0.98]
        ${VARIANTS[variant] || VARIANTS.primary}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;

