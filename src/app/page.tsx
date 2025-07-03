"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { FiSearch } from "react-icons/fi";
import Header from "../components/Header";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

const categories = [
  "Vehicles",
  "Property Rentals",
  "Apparel",
  "Classifieds",
  "Electronics",
  "Entertainment",
  "Family",
  "Free Stuff",
  "Garden & Outdoor",
  "Hobbies",
  "Home Goods",
  "Home Improvement",
  "Home Sales",
  "Musical Instruments",
  "Office Supplies",
  "Pet Supplies",
  "Sporting Goods",
  "Toys & Games",
  "Buy and sell groups",
];

const listingTypes = [
  {
    title: "Item for sale",
    desc: "Lorem ipsum dolor sit",
    icon: null,
  },
  {
    title: "Create multiple listings",
    desc: "Lorem ipsum dolor sit",
    icon: null,
  },
  {
    title: "Vehicle for sale",
    desc: "Lorem ipsum dolor sit",
    icon: null,
  },
  {
    title: "Home for sale or rent",
    desc: "Lorem ipsum dolor sit",
    icon: null,
  },
];

const CreateListing = dynamic(() => import("../components/createListing"), {
  ssr: false,
});

type MainView =
  | "choose"
  | "yourListings"
  | "sellerHelp"
  | "category"
  | "createListing";

type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  email: string;
  category: string;
  image_url: string;
  location: string;
  created_at: string;
};

export default function HomePage() {
  const [selectedSidebar, setSelectedSidebar] = useState<MainView>("choose");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Fetch listings from Supabase
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      let query = supabase.from("listings").select("*", { count: "exact" });
      if (
        selectedSidebar === "category" &&
        selectedCategory &&
        selectedCategory !== "Today's picks"
      ) {
        query = query.eq("category", selectedCategory);
      }
      // For search
      if (selectedSidebar === "category" && search) {
        query = query.ilike("title", `%${search}%`);
      }
      // For Today's picks, just get all and randomize below
      const { data, error } = await query;
      if (!error) {
        setListings(data || []);
      } else {
        setListings([]);
      }
      setLoading(false);
    };
    if (selectedSidebar === "category" || selectedSidebar === "choose") {
      fetchListings();
    }
  }, [selectedSidebar, selectedCategory, search]);

  // For Today's picks: select up to 10 random items
  const getTodaysPicks = (allListings: Listing[]) => {
    if (!allListings.length) return [];
    const shuffled = [...allListings].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  };

  // Filtered listings for category or today's picks
  let filteredListings: Listing[] = [];
  if (selectedSidebar === "category" && selectedCategory === "Today's picks") {
    filteredListings = getTodaysPicks(listings);
  } else if (selectedSidebar === "category") {
    filteredListings = listings;
  }

  // Sidebar click handlers
  const handleSidebarClick = (view: MainView) => {
    setSelectedSidebar(view);
    setSelectedCategory("");
    setShowCreateForm(false);
  };

  // Category click handler
  const handleCategoryClick = (cat: string) => {
    setSelectedSidebar("category");
    setSelectedCategory(cat);
    setShowCreateForm(false);
  };

  // Main area rendering
  let mainContent = null;
  if (selectedSidebar === "choose") {
    if (showCreateForm) {
      mainContent = <CreateListing />;
    } else {
      mainContent = (
        <>
          <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
            Choose listing type
          </h1>
          <div className="flex flex-wrap justify-center gap-8">
            {listingTypes.map((type) => (
              <div
                key={type.title}
                className="bg-white rounded-lg shadow p-8 flex flex-col items-center w-64 cursor-pointer hover:shadow-lg transition border"
                onClick={() => setShowCreateForm(true)}
              >
                <div className="h-16 w-16 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
                  {/* Placeholder for icon */}
                  <svg
                    width="32"
                    height="32"
                    fill="none"
                    className="text-gray-300"
                    viewBox="0 0 32 32"
                  >
                    <circle cx="16" cy="16" r="16" fill="#E5E7EB" />
                  </svg>
                </div>
                <div className="font-bold text-lg text-center mb-2 text-gray-800">
                  {type.title}
                </div>
                <div className="text-gray-800 text-center text-sm">
                  {type.desc}
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }
  } else if (
    selectedSidebar === "yourListings" ||
    selectedSidebar === "sellerHelp"
  ) {
    mainContent = <div className="w-full h-full" />;
  } else if (selectedSidebar === "category") {
    mainContent = (
      <>
        <h1 className="text-2xl text-gray-800 font-bold mb-6">
          {selectedCategory === "Today's picks"
            ? "Today's picks"
            : selectedCategory}
        </h1>
        <div className="flex items-center mb-8 w-full">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            />
          </div>
          <button className="ml-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Search
          </button>
        </div>
        {loading ? (
          <div className="text-center text-gray-700">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/item/${listing.id}`}
                  className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-lg transition cursor-pointer"
                  prefetch={false}
                >
                  <div className="h-40 w-full bg-gray-100 rounded mb-4 flex items-center justify-center overflow-hidden">
                    <Image
                      src={listing.image_url}
                      alt={listing.title}
                      width={400}
                      height={160}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div className="font-bold text-lg mb-1 text-gray-800">
                    ${listing.price}
                  </div>
                  <div className="text-md font-semibold mb-1 text-gray-800">
                    {listing.title}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    Listed{" "}
                    {listing.created_at
                      ? formatDistanceToNow(new Date(listing.created_at), {
                          addSuffix: true,
                        })
                      : "just now"}
                  </div>
                  <div className="text-xs text-gray-800">
                    {listing.location}
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-700">
                No listings found.
              </div>
            )}
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBurgerClick={() => setSidebarOpen(true)} />
      <div className="flex">
        {/* Offcanvas sidebar for mobile/tablet */}
        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`fixed z-50 top-0 left-0 h-full w-64 bg-white border-r flex flex-col p-6 transform transition-transform duration-300 md:static md:translate-x-0 md:flex md:min-h-screen ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:z-0`}
          style={{ minHeight: "100vh" }}
        >
          {/* Close button for mobile */}
          <button
            className="block md:hidden mb-4 self-end p-2 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="mb-8">
            <h2 className="font-bold text-lg mb-2 text-gray-800">
              Create new listing
            </h2>
            <ul className="space-y-2 text-sm">
              <li
                className={`flex items-center gap-2 text-gray-800 cursor-pointer hover:text-blue-600 ${
                  selectedSidebar === "choose" ? "font-bold" : ""
                }`}
                onClick={() => handleSidebarClick("choose")}
              >
                <span>📝</span> Choose listing type
              </li>
              <li
                className={`flex items-center gap-2 text-gray-800 cursor-pointer hover:text-blue-600 ${
                  selectedSidebar === "yourListings" ? "font-bold" : ""
                }`}
                onClick={() => handleSidebarClick("yourListings")}
              >
                <span>📄</span> Your listings
              </li>
              <li
                className={`flex items-center gap-2 text-gray-800 cursor-pointer hover:text-blue-600 ${
                  selectedSidebar === "sellerHelp" ? "font-bold" : ""
                }`}
                onClick={() => handleSidebarClick("sellerHelp")}
              >
                <span>❓</span> Seller help
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-md mb-2 text-gray-800">
              Categories
            </h3>
            <ul className="space-y-1">
              <li
                key="Today's picks"
                className={`px-2 py-1 rounded cursor-pointer text-sm ${
                  selectedCategory === "Today's picks" &&
                  selectedSidebar === "category"
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100 text-gray-800"
                }`}
                onClick={() => handleCategoryClick("Today's picks")}
              >
                Today&apos;s picks
              </li>
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={`px-2 py-1 rounded cursor-pointer text-sm ${
                    selectedCategory === cat && selectedSidebar === "category"
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-gray-100 text-gray-800"
                  }`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8 md:ml-0" style={{ marginLeft: 0 }}>
          {mainContent}
        </main>
      </div>
    </div>
  );
}
