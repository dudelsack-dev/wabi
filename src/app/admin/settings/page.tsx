"use client";

import { useEffect, useState } from "react";
import { Upload } from "lucide-react";

const HERO_FALLBACK =
  "https://images.unsplash.com/photo-1725917482778-472d78c69278?w=1600&q=80";

export default function AdminSettingsPage() {
  const [heroUrl, setHeroUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setHeroUrl(data.hero_image_url ?? HERO_FALLBACK);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setHeroUrl(url);
    } catch {
      setStatus({ type: "error", message: "Image upload failed. Please try again." });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero_image_url: heroUrl }),
      });
      if (!res.ok) throw new Error("Save failed");
      setStatus({ type: "success", message: "Settings saved." });
    } catch {
      setStatus({ type: "error", message: "Failed to save settings. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-stone">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-2xl text-charcoal mb-8">Settings</h1>

      <form onSubmit={handleSave} className="bg-warm-white border border-cream rounded-md p-6 space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-wide text-stone mb-2">
            Hero Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={heroUrl}
              onChange={(e) => setHeroUrl(e.target.value)}
              placeholder={HERO_FALLBACK}
              className="flex-1 px-3 py-2 text-sm border border-stone-light/50 rounded bg-cream-light focus:outline-none focus:border-stone"
            />
            <label className="flex items-center gap-1.5 px-3 py-2 text-xs text-stone-dark border border-stone-light/50 rounded cursor-pointer hover:bg-cream transition-colors whitespace-nowrap">
              <Upload size={14} />
              {uploading ? "Uploading…" : "Upload"}
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          {heroUrl && (
            <div className="mt-3 relative h-32 rounded overflow-hidden bg-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroUrl}
                alt="Hero preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {status && (
          <p
            className={`text-sm ${
              status.type === "success" ? "text-green-700" : "text-earth-red"
            }`}
          >
            {status.message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 bg-charcoal text-warm-white text-sm rounded hover:bg-charcoal/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
