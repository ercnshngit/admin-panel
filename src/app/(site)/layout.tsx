import { cn } from "@/libs/utils";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import "/node_modules/flag-icons/css/flag-icons.min.css";
const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});
export const metadata: Metadata = {
  title: "Site",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(montserrat.variable, "w-full h-full font-sans bg-white")}
    >
      <main>{children}</main>
    </div>
  );
}
