import { AdminSidebar } from "@/components/Admin/sidebar";



export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="flex min-h-screen bg-muted">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">{children}</main>
    </div>
  );
}
