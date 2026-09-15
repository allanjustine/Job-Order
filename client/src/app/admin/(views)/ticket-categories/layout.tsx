import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ticket Categories",
  description: "Smct Job Order System Ticket Categories Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
