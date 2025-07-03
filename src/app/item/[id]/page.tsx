"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";
import Header from "../../../components/Header";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

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

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [message, setMessage] = useState("I'm interested in your item!");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();
      if (error) setError("Item not found.");
      setItem(data as Listing);
      setLoading(false);
    };
    fetchItem();
  }, [id]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setSent(false);
    setError("");
    if (!buyerEmail || !message) {
      setError("Please fill in your email and message.");
      setSending(false);
      return;
    }
    try {
      const { error: msgError } = await supabase.from("messages").insert([
        {
          listing_id: id,
          sender_email: buyerEmail,
          message,
        },
      ]);
      if (msgError) throw msgError;
      setSent(true);
      setBuyerEmail("");
      setMessage("I'm interested in your item!");
    } catch (err) {
      setError((err as Error).message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button
          className="text-blue-700 text-sm mb-4"
          onClick={() => router.push("/")}
        >
          {"<"} Back to Marketplace
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            F
          </div>
          <span className="text-xl font-bold text-gray-900">Marketplace</span>
        </div>
        {loading ? (
          <div className="text-center text-gray-700">Loading...</div>
        ) : error || !item ? (
          <div className="text-center text-red-600">
            {error || "Item not found."}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Image */}
            <div className="flex-1 flex items-center justify-center">
              <Image
                src={item.image_url}
                alt={item.title}
                className="rounded-lg bg-white"
                width={500}
                height={500}
                style={{ objectFit: "contain", maxHeight: 500, width: "100%" }}
              />
            </div>
            {/* Right: Details */}
            <div className="flex-1 max-w-md">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {item.title}
              </div>
              <div className="text-xl font-bold text-gray-800 mb-2">
                ${item.price}
              </div>
              <div className="text-sm text-gray-700 mb-2">
                Listed{" "}
                {item.created_at
                  ? formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })
                  : "just now"}
              </div>
              <div className="text-sm text-gray-700 mb-2">
                in {item.location}
              </div>
              <div className="text-sm text-gray-700 mb-2">
                Category: {item.category}
              </div>
              <div className="font-semibold mt-4 mb-1 text-gray-800">
                Description
              </div>
              <div className="mb-4 text-gray-800">{item.description}</div>
              <div className="font-semibold mb-1 text-gray-800">
                Seller Information
              </div>
              <div className="mb-4 text-gray-800">{item.email}</div>
              <form onSubmit={handleSendMessage} className="mt-6">
                <div className="font-semibold mb-2 text-gray-800">
                  Message Seller
                </div>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded h-8 p-3 mb-2 text-gray-800 placeholder-gray-500"
                  placeholder="Your Email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  required
                />
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 mb-2 text-gray-800 placeholder-gray-500"
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-400 text-white py-2 px-4 rounded-md font-semibold mt-2 disabled:opacity-60"
                  disabled={sending}
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
                {sent && (
                  <div className="text-green-600 mt-2">
                    Message sent successfully! The seller will receive an email
                    notification
                  </div>
                )}
                {error && <div className="text-red-600 mt-2">{error}</div>}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
