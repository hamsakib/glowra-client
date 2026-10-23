"use client";

import { ImagePlus, Link2, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { api } from "@/lib/api";

const MAX_BYTES = 3 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** Uploads a file to the API (resized to WebP server-side) and returns its URL. */
export async function uploadImageFile(file, purpose = "product") {
  if (!TYPES.includes(file.type)) throw new Error("Only JPG, PNG, WebP or AVIF images are allowed.");
  if (file.size > MAX_BYTES) throw new Error("Image must be 3 MB or smaller.");
  const body = new FormData();
  body.append("image", file);
  const res = await api(`/images?purpose=${purpose}`, { method: "POST", body });
  return res.url;
}

/** Controlled list of image URLs: upload files or paste links, remove, first image is the cover. */
export function ImageUploader({ value = [], onChange, error, max = 6 }) {
  const inputId = useId();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const onFiles = async (files) => {
    const list = [...files].slice(0, max - value.length);
    if (!list.length) return;
    setUploading(true);
    const added = [];
    for (const file of list) {
      try {
        added.push(await uploadImageFile(file));
      } catch (err) {
        toast.error(err.message);
      }
    }
    onChange([...value, ...added]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const addUrl = () => {
    const v = url.trim();
    if (!/^https?:\/\/\S+$/.test(v)) return setUrlError("Enter a valid image URL starting with http(s)://");
    if (value.includes(v)) return setUrlError("That image is already added");
    onChange([...value, v]);
    setUrl("");
    setUrlError("");
  };

  return (
    <fieldset>
      <legend className="text-sm font-medium">Photos <span className="text-primary">*</span></legend>
      <p className="mt-0.5 text-xs text-muted-fg">Up to {max} images. The first one is the cover. JPG/PNG/WebP, max 3 MB each.</p>
      <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {value.map((src, i) => (
          <li key={src} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
            <SmartImage src={src} alt={`Photo ${i + 1}`} fill sizes="120px" className="object-cover" />
            {i === 0 && <span className="absolute bottom-1 left-1 rounded-xl bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white">Cover</span>}
            <button type="button" onClick={() => onChange(value.filter((v) => v !== src))} className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded-xl bg-black/70 text-white opacity-90 hover:opacity-100" aria-label={`Remove photo ${i + 1}`}>
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
        {value.length < max && (
          <li>
            <label htmlFor={inputId} className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-xs font-medium text-muted-fg transition hover:border-primary hover:text-primary">
              {uploading ? <span className="animate-pulse">Uploading…</span> : <><ImagePlus className="h-6 w-6" /> Upload</>}
            </label>
            <input ref={fileRef} id={inputId} type="file" accept={TYPES.join(",")} multiple className="sr-only" disabled={uploading} onChange={(e) => onFiles(e.target.files)} />
          </li>
        )}
      </ul>
      {value.length < max && (
        <div className="mt-3 flex gap-2">
          <label htmlFor={`${inputId}-url`} className="sr-only">Image URL</label>
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-fg" aria-hidden="true" />
            <input
              id={`${inputId}-url`}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
              placeholder="…or paste an image URL"
              aria-invalid={urlError ? true : undefined}
              className="h-10 w-full rounded-xl border border-border bg-surface pr-3 pl-9 text-sm outline-none focus:border-primary"
            />
          </div>
          <Button variant="outline" size="sm" className="h-10" onClick={addUrl}>Add</Button>
        </div>
      )}
      {(urlError || error) && <p role="alert" className="mt-1 text-xs font-medium text-danger">{urlError || error}</p>}
    </fieldset>
  );
}
