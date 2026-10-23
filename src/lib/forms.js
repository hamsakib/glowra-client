import { toast } from "sonner";

/**
 * Maps API validation errors ({ field: message }) onto react-hook-form fields,
 * and shows a toast for anything that isn't tied to a field.
 */
export function applyServerErrors(err, setError) {
  const fields = err?.fields || {};
  const keys = Object.keys(fields);
  keys.forEach((key) => setError(key, { type: "server", message: fields[key] }));
  if (!keys.length) toast.error(err?.message || "Something went wrong");
  else toast.error(err.message);
}
