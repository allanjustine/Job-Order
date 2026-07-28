import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Smct Job Order System Register Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
