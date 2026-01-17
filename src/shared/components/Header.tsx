import { useAuth } from "../../modules/auth/useAuth";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center px-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-slate-100">
          Bersa
        </span>
        <span className="text-xs text-slate-400">App</span>
      </div>

      <div className="ml-auto text-sm text-slate-400">
        {user?.nombre || user?.email}
      </div>
    </header>
  );
}
