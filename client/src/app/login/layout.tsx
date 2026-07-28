import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Smct Job Order System Login Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
