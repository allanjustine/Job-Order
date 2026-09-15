import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tickets",
  description: "Smct Job Order System Tickets Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
