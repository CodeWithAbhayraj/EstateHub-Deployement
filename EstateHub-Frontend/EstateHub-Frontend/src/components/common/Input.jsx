
function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  disabled = false,
  required = false,
  className = "",
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-semibold text-[#403A31]"
        >
          {label}

          {required && (
            <span className="ml-1 text-[#B3564B]" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`
          min-h-11 w-full rounded-xl border
          bg-[#FBF8F1] px-3.5 py-2.5
          text-sm font-medium text-[#201C15]
          outline-none
          transition-all duration-200
          placeholder:text-[#9A9180]
          disabled:cursor-not-allowed
          disabled:bg-[#EEE9DE]
          disabled:text-[#9A9180]
          disabled:opacity-80
          ${
            error
              ? `
                border-[#D79A91]
                bg-[#FFF9F7]
                focus:border-[#B3564B]
                focus:ring-2
                focus:ring-[#B3564B]/10
              `
              : `
                border-[#D8CFB9]
                hover:border-[#B9AA8D]
                focus:border-[#AD8332]
                focus:ring-2
                focus:ring-[#AD8332]/10
              `
          }
          ${className}
        `}
      />

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-1.5 text-xs font-medium text-[#B3564B]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;

