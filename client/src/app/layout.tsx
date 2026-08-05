import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "@/context/authContext";
import BaseContent from "@/components/layouts/BaseContent";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SMCT Job Order",
    template: "%s | SMCT Job Order",
  },
  description: "Smct Job Order System Home Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [bg-size:16px_16px] scroll-smooth font-sans`}
      >
        <AuthContextProvider>
          <TooltipProvider>
            <Toaster />
            <BaseContent children={children} />
          </TooltipProvider>
        </AuthContextProvider>
        <script>
          console.info("%c 𝒮𝑀𝒞𝒯", "font-family:monospace; font-weight: 900;
          font-size: 120px;color: red; text-shadow: 3px 3px 0 rgb(217,324, 422)
          , 6px 6px 0 rgb(333,91,14) , 9px 9px 0 rgb(122,221,8) , 12px 12px 0
          rgb(5,45,68) , 15px 15px 0 rgb(2,22,206) , 18px 18px 0 rgb(4,77,155) ,
          21px 21px 0 rgb(42,21,155)"), console.info("%c 𝓙𝓸𝓫 𝓞𝓻𝓭𝓮𝓻",
          "font-family:monospace; font-weight: 900; font-size: 120px;color: red;
          text-shadow: 3px 3px 0 rgb(217,324, 422) , 6px 6px 0 rgb(333,91,14) ,
          9px 9px 0 rgb(122,221,8) , 12px 12px 0 rgb(5,45,68) , 15px 15px 0
          rgb(2,22,206) , 18px 18px 0 rgb(4,77,155) , 21px 21px 0
          rgb(42,21,155)"), console.info("%c 𝓢𝔂𝓼𝓽𝓮𝓶", "font-family:monospace;
          font-weight: 900; font-size: 120px;color: red; text-shadow: 3px 3px 0
          rgb(217,324, 422) , 6px 6px 0 rgb(333,91,14) , 9px 9px 0
          rgb(122,221,8) , 12px 12px 0 rgb(5,45,68) , 15px 15px 0 rgb(2,22,206)
          , 18px 18px 0 rgb(4,77,155) , 21px 21px 0 rgb(42,21,155)")
        </script>
      </body>
    </html>
  );
}
