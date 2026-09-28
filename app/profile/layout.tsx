import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile — Account Settings",
  description:
    "Manage your AWA profile, subscription status, credit balance, and account settings. View saved templates and personalize your experience.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "My Profile — Account Settings",
    description:
      "Manage your AWA account, subscription, and creative preferences.",
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
