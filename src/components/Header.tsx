import React from "react";
import { FiBell, FiUser, FiSearch } from "react-icons/fi";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="max-w-full mx-auto flex items-center justify-between px-6 py-3">
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            F
          </div>
          <span className="text-xl font-bold text-gray-900">Marketplace</span>
        </div>
        {/* Right: Icons */}
        <div className="flex items-center gap-5 text-gray-500 text-xl">
          <FiSearch className="cursor-pointer hover:text-gray-700" />
          <FiBell className="cursor-pointer hover:text-gray-700" />
          <FiUser className="cursor-pointer hover:text-gray-700" />
        </div>
      </div>
    </header>
  );
}
