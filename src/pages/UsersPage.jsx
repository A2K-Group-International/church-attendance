import Sidebar from "@/components/ui/Sidebar";
import Table from "../layout/Table";

const headers = ["Name", "Telephone", "Email"];




export default function UsersPage() {
  return (
    <Sidebar>
      <main className="p-4 lg:p-8">
        <h1 className="text-2xl font-bold">Users</h1>
        <Table headers={headers} />
      </main>
    </Sidebar>
  );
}
