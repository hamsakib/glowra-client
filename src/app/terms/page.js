import { LegalPage } from "@/components/layout/LegalPage";

export const metadata = { title: "Terms & conditions", description: "The terms that apply when you shop or sell on Glowra." };

const SECTIONS = [
  ["Using Glowra", [
    "You must give accurate information when you create an account and keep your password private. You're responsible for activity on your account.",
  ]],
  ["Orders and payment", [
    "Placing an order is an offer to buy. Prices are confirmed at checkout and charged in Bangladeshi taka. Payment is cash on delivery.",
    "We may cancel an order if a product is out of stock or a price was listed in error. If that happens we'll tell you straight away.",
  ]],
  ["Delivery", [
    "Delivery times are estimates. Fees are shown at checkout before you confirm, and orders above the free-shipping threshold ship free.",
  ]],
  ["Returns", [
    "Sealed, unused products can be returned within 7 days of delivery. For hygiene reasons opened skincare can't be returned unless it arrived damaged or wasn't what you ordered.",
  ]],
  ["Selling", [
    "Sellers may only list authentic products they have the right to sell, with accurate descriptions and photos. We may edit, unpublish or remove listings that break these rules.",
  ]],
  ["Reviews", [
    "Reviews must reflect your own experience. We remove reviews that are abusive, off-topic or written by the seller.",
  ]],
  ["Medical disclaimer", [
    "Product descriptions and journal articles are general information, not medical advice. For persistent skin conditions please see a dermatologist.",
  ]],
];

export default function TermsPage() {
  return <LegalPage title="Terms & conditions" updated="23 October 2026" intro="By using Glowra you agree to these terms. They're written to be read, so please take two minutes." sections={SECTIONS} />;
}
