import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activity Logs",
  description: "Smct Job Order System Activity Logs Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
