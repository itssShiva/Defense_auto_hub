import React, { useState, useRef, useEffect } from "react";

/**
 * CustomSelect – A fully styled replacement for native <select> elements.
 * Props:
 *   id           – element id (for label association)
 *   name         – field name
 *   value        – currently selected value (string)
 *   onChange     – function({ target: { name, value } })
 *   options      – [{ value, label }]
 *   placeholder  – shown when no option selected
 *   disabled     – disables the dropdown
 *   error        – if truthy, applies error border styles
 */
const CustomSelect = ({
    id,
    name,
    value,
    onChange,
    options = [],
    placeholder = "Select an option",
    disabled = false,
    error = false,
}) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedLabel = options.find((o) => String(o.value) === String(value))?.label || "";

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((v) => !v); }
        if (e.key === "Escape") setOpen(false);
        if (e.key === "ArrowDown" && open) {
            const idx = options.findIndex((o) => String(o.value) === String(value));
            const next = options[idx + 1];
            if (next) onChange({ target: { name, value: next.value } });
        }
        if (e.key === "ArrowUp" && open) {
            const idx = options.findIndex((o) => String(o.value) === String(value));
            const prev = options[idx - 1];
            if (prev) onChange({ target: { name, value: prev.value } });
        }
    };

    const baseCls = `
        w-full px-4 py-3 rounded-xl border transition-all bg-white text-[#19456d] font-medium
        flex items-center justify-between cursor-pointer select-none
        ${error
            ? "border-red-400 focus:border-red-500 focus:ring-red-400"
            : "border-[#708ca4]/40 focus:border-[#19456d] focus:ring-[#19456d]"
        }
        ${disabled ? "opacity-60 cursor-not-allowed bg-slate-50" : "hover:border-[#19456d]/60"}
        focus:outline-none focus:ring-1
    `;

    return (
        <div ref={containerRef} className={`relative w-full ${open ? "z-50" : ""}`}>
            {/* Trigger button */}
            <div
                id={id}
                tabIndex={disabled ? -1 : 0}
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-disabled={disabled}
                className={baseCls}
                onClick={() => { if (!disabled) setOpen((v) => !v); }}
                onKeyDown={handleKeyDown}
            >
                <span className={selectedLabel ? "text-[#19456d]" : "text-[#708ca4]"}>
                    {selectedLabel || placeholder}
                </span>
                <svg
                    className={`w-4 h-4 text-[#708ca4] transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Dropdown panel */}
            {open && !disabled && (
                <div
                    role="listbox"
                    className="absolute z-50 w-full mt-1 bg-white border border-[#708ca4]/30 rounded-xl shadow-xl overflow-auto max-h-56"
                >
                    {options.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-[#708ca4] italic">No options available</div>
                    ) : (
                        options.map((opt) => {
                            const isSelected = String(opt.value) === String(value);
                            return (
                                <div
                                    key={opt.value}
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => {
                                        onChange({ target: { name, value: opt.value } });
                                        setOpen(false);
                                    }}
                                    className={`
                                        px-4 py-3 text-sm cursor-pointer transition-colors
                                        ${isSelected
                                            ? "bg-[#19456d] text-white font-semibold"
                                            : "text-[#19456d] hover:bg-[#19456d]/8 hover:text-[#19456d] font-medium"
                                        }
                                    `}
                                >
                                    {opt.label}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
