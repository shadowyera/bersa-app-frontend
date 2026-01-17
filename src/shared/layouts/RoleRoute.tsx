import { Navigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/useAuth";

interface RoleRouteProps {
  allow: Array<"ADMIN" | "ENCARGADO" | "CAJERO" | "BODEGUERO">;
  children: React.ReactNode;
}

export default function RoleRoute({ allow, children }: RoleRouteProps) {
  const { user } = useAuth();

  if (!user) return null;

  if (!allow.includes(user.rol)) {
    return <Navigate to="/pos" replace />;
  }

  return <>{children}</>;
}