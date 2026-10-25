import type { Metadata } from "next";
import { atma, jakarta } from "@/app/fonts";
import "./globals.css";
import { PetCycleProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "PetCycle | Real Change Begins With A Bottle",
  description:
    "Empowering communities through IoT-enabled recycling incentives that automatically feed stray animals.",
  icons: {
    icon: [
      { url: "/images/petcycle-logo-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/images/petcycle-logo-512.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${atma.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-slate-800 bg-white min-h-screen selection:bg-emerald-100 selection:text-emerald-900">
        <PetCycleProvider>{children}</PetCycleProvider>
      </body>
    </html>
  );
}
