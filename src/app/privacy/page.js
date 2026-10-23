import { LegalPage } from "@/components/layout/LegalPage";

export const metadata = { title: "Privacy policy", description: "What personal data Glowra collects, why, and how it is protected." };

const SECTIONS = [
  ["Information we collect", [
    "Account details you give us: your name, email address and a password, which is stored only as a bcrypt hash and never in readable form.",
    "Order details: delivery name, phone number, city and address, plus the products you ordered.",
    "Optional profile details such as your skin type, bio and profile photo.",
  ]],
  ["How we use it", [
    "To create and secure your account, process and deliver orders, and answer messages you send through the contact form.",
    "To send the newsletter, only if you subscribed. You can switch it off in Dashboard → Settings at any time.",
  ]],
  ["What we don't do", [
    "We don't sell your personal data, and we don't share it with advertisers. Delivery partners receive only what they need to bring you the parcel.",
  ]],
  ["Security", [
    "Sessions use signed JSON Web Tokens that expire automatically. Passwords are hashed with bcrypt. All traffic to the live site is encrypted with HTTPS.",
  ]],
  ["Your choices", [
    "You can update your profile, change your password and manage email preferences from your dashboard. To close your account, contact us and we'll remove your data except what we must keep for accounting.",
  ]],
  ["Contact", ["Questions about this policy can be sent through the contact page."]],
];

export default function PrivacyPage() {
  return <LegalPage title="Privacy policy" updated="23 October 2026" intro="This policy explains what information Glowra collects when you use the site, why we need it, and the choices you have." sections={SECTIONS} />;
}
