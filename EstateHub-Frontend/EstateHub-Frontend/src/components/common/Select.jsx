
function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select",
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

      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          min-h-11 w-full rounded-xl border
          border-[#D8CFB9]
          bg-[#FBF8F1]
          px-3.5 py-2.5
          text-sm font-medium text-[#201C15]
          outline-none
          transition-all duration-200
          hover:border-[#B9AA8D]
          focus:border-[#AD8332]
          focus:ring-2
          focus:ring-[#AD8332]/10
          disabled:cursor-not-allowed
          disabled:bg-[#EEE9DE]
          disabled:text-[#9A9180]
          disabled:opacity-80
          ${className}
        `}
      >
        <option value="" disabled={required}>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
