import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "Smct Job Order System Users Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
