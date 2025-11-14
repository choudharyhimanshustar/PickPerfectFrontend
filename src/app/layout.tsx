import "@/app/globals.css";
import { Inter } from "next/font/google"
import Header from "@/components/Headers";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "My App",
  description: "Example app with global header",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-background text-foreground antialiased flex flex-col `}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
