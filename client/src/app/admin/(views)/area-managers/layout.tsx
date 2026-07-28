import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Area Managers",
  description: "Smct Job Order System Area Managers Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
