import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supamail",
  description: "A project to learn supabase!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>
          <NuqsAdapter>{children}</NuqsAdapter>
        </main>
      </body>
    </html>
  );
}
