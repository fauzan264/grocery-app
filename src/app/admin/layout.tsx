"use client";

import Sidebar from "@/components/layouts/Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return <Sidebar>{children}</Sidebar>;
}
