"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

export default function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      onChange([...images, url]);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative w-24 h-24 bg-cream rounded overflow-hidden group">
            <Image src={url} alt="" fill className="object-cover" sizes="96px" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 p-1 bg-charcoal/70 text-warm-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <label className="w-24 h-24 border-2 border-dashed border-stone-light rounded flex flex-col items-center justify-center cursor-pointer hover:border-stone transition-colors">
          <Upload size={18} className="text-stone mb-1" />
          <span className="text-xs text-stone">
            {uploading ? "..." : "Upload"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
