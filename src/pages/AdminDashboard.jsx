import Sidebar from "@/components/ui/Sidebar";
export default function AdminDashboard() {
  return (
    <Sidebar>
      <main className="p-4 lg:p-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Dashboard.</p>
      </main>
    </Sidebar>
  );
}
