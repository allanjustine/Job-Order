import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Reports",
    template: "%s | Reports | SMCT Job Order",
  },
  description: "Smct Job Order System Reports Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
