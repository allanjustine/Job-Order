import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Target Incomes",
  description: "Smct Job Order System Target Incomes Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
