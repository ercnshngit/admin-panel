import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Providers from "./providers";
import TailwindBreakpoint from "@/components/Helpers/TailwindBreakPoint";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Panel",
};
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen">{children}</div>
          <ToastContainer />
          {process.env.NODE_ENV === "development" && <TailwindBreakpoint />}
        </Providers>
      </body>
    </html>
  );
}
