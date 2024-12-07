import { Inter, Poppins } from "next/font/google";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import AppWrapper from "./appwrapper";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "700"],
});

// Metadata for the page
export const metadata: Metadata = {
  title: "MIRAJ",
  description: "A NEW GENERATION EMAIL MANAGEMENT SYSTEM",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${poppins.variable} antialiased`}
      >
        <body>
          <TRPCReactProvider>
            <Toaster />
            <AppWrapper>{children}</AppWrapper>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
