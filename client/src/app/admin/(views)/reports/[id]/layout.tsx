import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit",
  description: "Smct Job Order System Edit Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
