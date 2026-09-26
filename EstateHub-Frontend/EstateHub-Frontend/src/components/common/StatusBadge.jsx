
// Consistent EstateHub status tones.
// Keeps status colors restrained and avoids too many bright colors
// across the same screen.

const TONES = {
  neutral: "bg-[#EEE9DE] text-[#6B6252] border-[#D8CFB9]",
  info: "bg-[#EEF3F6] text-[#486477] border-[#D5E0E7]",
  warning: "bg-[#F7F0DF] text-[#8C6924] border-[#E4D3A8]",
  success: "bg-[#EAF1EC] text-[#3F6B52] border-[#C9D9CE]",
  danger: "bg-[#F8EAE7] text-[#9A463D] border-[#E4C5C0]",
};

const STATUS_TONE = {
  DRAFT: "neutral",

  PENDING_APPROVAL: "warning",
  PENDING: "warning",

  PUBLISHED: "success",
  PAID: "success",
  COMPLETED: "success",
  CLOSED: "success",

  REJECTED: "danger",
  CANCELLED: "danger",

  NEW: "info",
  CONTACTED: "info",
  VISIT_SCHEDULED: "info",

  NEGOTIATION: "warning",
};

function StatusBadge({ status }) {
  const tone = TONES[STATUS_TONE[status]] || TONES.neutral;
  const label = status ? status.replaceAll("_", " ") : "UNKNOWN";

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-2.5
        py-1
        text-[11px]
        font-bold
        uppercase
        tracking-[0.08em]
        ${tone}
      `}
    >
      <span
        className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70"
        aria-hidden="true"
      />

      {label}
    </span>
  );
}

export default StatusBadge;
