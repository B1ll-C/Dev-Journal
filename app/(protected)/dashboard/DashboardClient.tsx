"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DashboardClient() {
  const { user, loading: authLoading } = useAuth();
  // console.log("User in DashboardClient:", user);

  const [journalEntries, setJournalEntries] = useState<
    { id: string; title: string; content: string; created_at: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const router = useRouter();
  const supabase = createClient();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    if (!user) return;
    const fetchJournals = async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false }); // optional

      if (error) {
        console.error("Error fetching journals:", error);
      } else {
        setJournalEntries(data ?? []);
      }
      console.log("Fetched journals:", data);

      setLoading(false);
    };

    fetchJournals();
  }, [user]);

  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const { user } = useAuth(); // get the logged-in user
    if (!user) return;

    if (!user) {
      alert("You must be logged in to submit!");
      return;
    }

    try {
      const { data, error } = await supabase.from("journal_entries").insert([
        {
          title: formData.title,
          content: formData.content,
          user_id: user.id, // associate with current user
        },
      ]);

      if (error) {
        console.error("Error inserting journal:", error);
        alert("Failed to save journal. Please try again.");
        return;
      }

      console.log("Journal added:", data);
      setOpen(false); // close form modal
      // Optionally, refresh journal entries in state
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong.");
    }
  };
  if (authLoading) return <p>Loading...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-indigo-900 to-purple-950 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg mb-4 md:mb-0">
            👋 Welcome back, {user?.email}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-2xl transition-all shadow-md shadow-red-500/30"
          >
            Logout
          </button>
        </header>

        {/* Journal Section Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold drop-shadow-sm">
            Your Journal Entries
          </h2>
          <button
            onClick={() => setOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-2xl transition-all shadow-md shadow-green-500/30"
          >
            + New Entry
          </button>
        </div>

        {/* Journal Entries */}
        {journalEntries.length === 0 ? (
          <p className="text-gray-300 text-center py-10 border-2 border-dashed border-indigo-500/40 rounded-xl">
            No entries yet. Create your first one!
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {journalEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-indigo-900/30 backdrop-blur-md shadow-lg rounded-2xl p-5 border border-indigo-700 hover:scale-[1.02] transition-transform"
              >
                <h3 className="text-lg md:text-xl font-semibold">
                  {entry.title}
                </h3>
                <p className="mt-2 text-gray-200">{entry.content}</p>
                <span className="block mt-3 text-xs text-gray-400">
                  {new Date(entry.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 overflow-hidden bg-transparent shadow-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
            className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden bg-white shadow-lg border border-gray-200"
          >
            {/* Modal Header */}
            <DialogHeader className="p-6 text-center relative">
              <DialogTitle className="text-xl font-bold text-gray-900">
                Create Post
              </DialogTitle>
              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </DialogHeader>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Submit
              </Button>
            </form>
          </motion.div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
