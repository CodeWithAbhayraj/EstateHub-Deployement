
import { useEffect } from "react";
import { X } from "lucide-react";

function Modal({
  open,
  onClose,
  title = "Modal",
  children,
  size = "md",
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        overflow-y-auto
        bg-[#171B21]/65
        p-4 sm:p-6
        backdrop-blur-[3px]
      "
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`
          relative flex max-h-[90vh] w-full flex-col
          overflow-hidden
          rounded-2xl
          border border-[#D8CFB9]
          bg-[#FBF8F1]
          shadow-[0_24px_80px_rgba(32,28,21,0.25)]
          animate-in fade-in zoom-in-95 duration-200
          ${sizeClasses[size] || sizeClasses.md}
        `}
      >
        {/* TOP ACCENT */}
        <div className="h-1 w-full bg-[#AD8332]" />

        {/* HEADER */}
        <div
          className="
            flex shrink-0 items-center justify-between
            border-b border-[#E4DCC9]
            bg-[#F8F5ED]
            px-5 py-4
            sm:px-6 sm:py-5
          "
        >
          <div className="min-w-0 pr-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#AD8332]">
              EstateHub
            </p>

            <h2
              id="modal-title"
              className="
                truncate
                text-base font-semibold
                text-[#201C15]
                sm:text-lg
              "
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-xl
              border border-[#D8CFB9]
              bg-[#FBF8F1]
              text-[#6B6252]
              transition-all duration-200
              hover:border-[#AD8332]
              hover:bg-[#F2ECDF]
              hover:text-[#201C15]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#AD8332]
              focus-visible:ring-offset-2
              focus-visible:ring-offset-[#F8F5ED]
              active:scale-95
            "
            aria-label="Close modal"
          >
            <X size={17} strokeWidth={2} />
          </button>
        </div>

        {/* CONTENT */}
        <div
          className="
            min-h-0 flex-1
            overflow-y-auto
            bg-[#FBF8F1]
            px-5 py-5
            sm:px-6 sm:py-6
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
