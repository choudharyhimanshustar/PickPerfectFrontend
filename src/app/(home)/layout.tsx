import type { Metadata } from "next";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      {children}
    </ReactQueryProvider>
  );
}
