import React from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

interface DropdownProps {
  items: string[];
  selectedItem: string | null;
  onSelect: (item: string) => void;
  error?: string | null;
}

export const Dropdown = ({
  items,
  selectedItem,
  onSelect,
  error,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="bg-white border rounded-full px-4 py-2 shadow-sm flex items-center justify-between"
      >
        <span>{selectedItem || "Cargando..."}</span>
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {isOpen && items.length > 0 && (
        <ul
          className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg w-48 z-10"
          role="listbox"
        >
          {items.map((item) => (
            <li
              key={item}
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={item === selectedItem}
              tabIndex={0}
              className={clsx(
                "px-4 py-2 cursor-pointer hover:bg-gray-100",
                item === selectedItem && "font-bold bg-gray-100"
              )}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
