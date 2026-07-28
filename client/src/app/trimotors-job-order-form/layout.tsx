import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trimotors Form",
  description: "Smct Job Order System Trimotors Form Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
