import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AppLayout() {
  return (
     <div className="flex h-screen bg-slate-900 text-slate-100">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <Header />

        <main className="flex-1 overflow-hidden px-4 py-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}