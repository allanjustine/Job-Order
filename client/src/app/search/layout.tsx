import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Smct Job Order System Search Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
