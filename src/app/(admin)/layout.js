"use client";

import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md overflow-x-hidden">
      <AdminSidebar />
      <main className="ml-64 min-h-screen">
        <AdminHeader />
        <div className="p-8 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
