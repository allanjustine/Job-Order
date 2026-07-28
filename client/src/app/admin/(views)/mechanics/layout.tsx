import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mechanics",
  description: "Smct Job Order System Mechanics Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
