import { Route } from "react-router-dom";
import PosShell from "./PosShell";
import PosPage from "./PosPage";
import RoleRoute from "@/shared/layouts/RoleRoute";

export const PosRoutes = (
  <Route
    path="/pos"
    element={
      <RoleRoute allow={["CAJERO", "ENCARGADO", "ADMIN"]}>
        <PosShell />
      </RoleRoute>
    }
  >
    <Route index element={<PosPage />} />
  </Route>
);