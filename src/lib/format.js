const taka = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatPrice(value) {
  return `৳${taka.format(Math.round(value || 0))}`;
}

export function formatNumber(value) {
  return taka.format(value || 0);
}

export function formatDate(value, opts = { day: "numeric", month: "short", year: "numeric" }) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", opts);
}

export function discountPercent(price, compareAt) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const SKIN_TYPES = [
  { value: "oily", label: "Oily" },
  { value: "dry", label: "Dry" },
  { value: "combination", label: "Combination" },
  { value: "normal", label: "Normal" },
  { value: "sensitive", label: "Sensitive" },
];

export const CONCERNS = [
  { value: "acne", label: "Acne & breakouts" },
  { value: "dark-spots", label: "Dark spots" },
  { value: "dullness", label: "Dullness" },
  { value: "dehydration", label: "Dehydration" },
  { value: "redness", label: "Redness" },
  { value: "pores", label: "Pores & texture" },
  { value: "aging", label: "Fine lines" },
  { value: "sun-protection", label: "Sun protection" },
];

export const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
