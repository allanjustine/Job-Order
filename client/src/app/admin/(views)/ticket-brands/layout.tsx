import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ticket Brands",
  description: "Smct Job Order System Ticket Brands Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
