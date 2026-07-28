import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Smct Job Order System Dashboard Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
