"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// Use the same categories as in the main page
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

export default function CreateItemPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Only allow numbers in price
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    let imageUrl = "";

    // Validate required fields
    if (!title || !category || !price || !contactEmail || !location) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      // Upload image if present
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: storageData, error: storageError } =
          await supabase.storage
            .from("image-uploads")
            .upload(fileName, imageFile);
        if (storageError) throw storageError;
        const { data: publicUrlData } = supabase.storage
          .from("image-uploads")
          .getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      } else {
        imageUrl = "/placeholder-stock.jpg";
      }
      // Insert into listings table
      const { error: insertError } = await supabase.from("listings").insert([
        {
          title,
          description: description ? description : "No description",
          price: price ? parseFloat(price) : null,
          email: contactEmail,
          category,
          image_url: imageUrl,
          location,
        },
      ]);
      if (insertError) throw insertError;
      setSuccess("Listing created successfully!");
      setTitle("");
      setCategory("");
      setPrice("");
      setLocation("");
      setContactEmail("");
      setDescription("");
      setImageFile(null);
    } catch (err) {
      setError((err as Error).message || "Failed to create listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col w-full">
        {/* Header is handled by the app layout */}
        <div className="flex flex-col md:flex-row gap-8 mt-6">
          {/* Left: Form */}
          <div className="flex-1 max-w-md flex flex-col justify-start w-full md:w-auto order-2 md:order-1 mx-auto">
            <h1 className="text-xl font-bold mb-6 text-gray-800">
              Marketplace
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="photos"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Photos
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded p-8 text-center bg-gray-50 cursor-pointer"
                  onClick={() =>
                    document.getElementById("image-upload-input")?.click()
                  }
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      document.getElementById("image-upload-input")?.click();
                  }}
                >
                  <input
                    id="image-upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">Add photos</p>
                  <p className="text-xs text-gray-500">
                    JPEG, PNG, or WebP (max 5MB)
                  </p>
                  {imageFile && (
                    <p className="text-xs text-gray-700 mt-2">
                      Selected: {imageFile.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full border-gray-300 p-3 rounded h-8 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-500 text-gray-800"
                  placeholder="What are you selling?"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full border-gray-300 px-3 rounded h-8 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800"
                  required
                >
                  <option className="text-gray-500">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price *
                </label>
                <input
                  type="text"
                  id="price"
                  value={price}
                  onChange={handlePriceChange}
                  className="mt-1 block w-full border-gray-300 p-3 rounded h-8 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-500 text-gray-800"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 block w-full border-gray-300 p-3 rounded h-8 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-500 text-gray-800"
                  placeholder="Location"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="mt-1 block w-full border-gray-300 p-3 rounded h-8 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-500 text-gray-800"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full border-gray-300 p-3 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-500 text-gray-800"
                  placeholder="Describe your item..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Listing"}
              </button>
              {success && (
                <div className="mt-4 text-green-600 font-semibold">
                  {success}
                </div>
              )}
              {error && (
                <div className="mt-4 text-red-600 font-semibold">{error}</div>
              )}
            </form>
          </div>
          {/* Right: Preview */}
          <div className="flex-1 flex flex-col items-center w-full md:w-auto order-1 md:order-2">
            <div className="w-full max-w-xl">
              <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
                Preview
              </h2>
              <div className="bg-white rounded-lg shadow p-8">
                <div
                  className="w-full h-64 rounded-lg mb-6 flex items-center justify-center border"
                  style={{
                    background:
                      "repeating-linear-gradient(135deg, #e5e7eb, #e5e7eb 8px, #f3f4f6 8px, #f3f4f6 16px)",
                  }}
                >
                  {/* Image preview placeholder */}
                  {imageFile ? (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="h-full max-h-60 object-contain"
                    />
                  ) : (
                    <img
                      src="/placeholder-stock.jpg"
                      alt="Preview"
                      className="h-full max-h-60 object-contain opacity-60"
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-1 text-gray-800">
                  {title || "Title"}
                </h3>
                <p className="text-lg text-gray-800 mb-2">
                  {price ? `$${price}` : "Price"}
                </p>
                <p className="text-sm text-gray-700 mb-1">Listed just now</p>
                <p className="text-sm text-gray-700 mb-4">in {location}</p>
                <h4 className="font-semibold text-gray-800 mb-1">
                  Seller Information
                </h4>
                <p className="text-sm text-gray-800">
                  {contactEmail || "seller@email.com"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
