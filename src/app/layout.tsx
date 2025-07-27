import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "AttendEase",
  description: "Labour Attendance Web App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body
        className="font-body antialiased"
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
