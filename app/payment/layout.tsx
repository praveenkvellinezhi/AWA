import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Payment — Complete Your Order",
  description:
    "Complete your AWA subscription payment securely. Multiple payment options including UPI, credit/debit cards, and net banking.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Secure Payment",
    description: "Complete your AWA subscription payment securely.",
  },
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
