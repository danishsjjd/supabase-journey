import HeaderAuth from "@/components/header-auth";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Supapost",
  description: "A project to learn supabase!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <main className="space-y-4">
          <Nav />

          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}

const Nav = () => {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <Link href={"/"} className="text-3xl font-bold">
          Supapost
        </Link>
        <HeaderAuth />
      </div>
    </nav>
  );
};
