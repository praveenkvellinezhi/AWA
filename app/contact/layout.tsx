import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Get in Touch",
  description:
    "Have questions about AWA? Reach out to our team for support, partnership inquiries, or feedback about the AI creation platform.",
  openGraph: {
    title: "Contact Us — Get in Touch",
    description:
      "Contact the AWA team for support, partnerships, and feedback about our AI prompt engineering platform.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
