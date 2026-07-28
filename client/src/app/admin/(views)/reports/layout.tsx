import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
  description: "Smct Job Order System Reports Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
