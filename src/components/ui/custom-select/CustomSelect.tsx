"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  label?: string;
  labelIcon?: React.ReactNode;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  placeholder = "Select an option",
  onChange,
  className = "",
  disabled = false,
  label,
  labelIcon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get selected option label
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        selectRef.current &&
        !selectRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    // Use click event instead of mousedown to prevent flicker
    // Add listener with a small delay to avoid immediate firing when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside, true);
      document.addEventListener("keydown", handleEscape, true);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside, true);
      document.removeEventListener("keydown", handleEscape, true);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    onChange(optionValue);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          {labelIcon && (
            <span className="text-brand-600 dark:text-brand-400">
              {labelIcon}
            </span>
          )}
          {label}
        </label>
      )}
      <div ref={selectRef} className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) {
              setIsOpen(!isOpen);
            }
          }}
          disabled={disabled}
          className={`
            w-full h-11 pl-4 pr-10 py-2.5 
            appearance-none rounded-lg border-2 
            bg-white dark:bg-gray-800 
            text-gray-900 dark:text-white 
            text-sm font-medium 
            shadow-theme-xs 
            transition-all duration-200 
            focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 
            hover:border-gray-400 dark:hover:border-gray-500 
            cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            text-left
            ${
              value
                ? "border-gray-300 dark:border-gray-600"
                : "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
            }
            ${isOpen ? "border-brand-500 dark:border-brand-400 ring-2 ring-brand-500/20" : ""}
          `}
        >
          <span className={`block truncate ${value ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
            {displayValue}
          </span>
          <ChevronDown
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 pointer-events-none ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Popover */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-theme-lg overflow-hidden"
            style={{
              animation: "dropdownFadeIn 0.2s ease-out",
            }}
          >
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={(e) => handleSelect(option.value, e)}
                    className={`
                      w-full px-4 py-3 text-left 
                      flex items-center justify-between gap-3
                      transition-colors duration-150
                      ${
                        isSelected
                          ? "bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium"
                          : "text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {option.icon && (
                        <span className="flex-shrink-0 text-gray-500 dark:text-gray-400">
                          {option.icon}
                        </span>
                      )}
                      <span className="truncate">{option.label}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

