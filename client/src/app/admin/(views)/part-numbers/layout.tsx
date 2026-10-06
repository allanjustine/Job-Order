import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Part Numbers",
  description: "Smct Job Order System Part Numbers Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
