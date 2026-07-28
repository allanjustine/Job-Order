import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
  description: "Smct Job Order System Customers Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
