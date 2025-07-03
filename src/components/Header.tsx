import React from "react";
import { FiBell, FiUser, FiSearch, FiMenu } from "react-icons/fi";

export default function Header({
  onBurgerClick,
}: {
  onBurgerClick?: () => void;
}) {
  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="max-w-full mx-auto flex items-center justify-between px-6 py-3">
        {/* Left: Burger and Logo/Title */}
        <div className="flex items-center gap-3">
          {/* Burger menu for mobile/tablet */}
          <button
            className="block md:hidden mr-2 p-2 rounded hover:bg-gray-100 focus:outline-none"
            onClick={onBurgerClick}
            aria-label="Open sidebar menu"
          >
            <FiMenu className="text-2xl text-gray-800" />
          </button>
          {/* Logo and title hidden on small screens when burger is visible */}
          <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg hidden md:flex">
            F
          </div>
          <span className="text-xl font-bold text-gray-900 hidden md:block">
            Marketplace
          </span>
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
