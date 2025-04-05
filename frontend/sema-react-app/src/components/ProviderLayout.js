import { Outlet } from "react-router-dom";
import ProviderDashboard from "./ProviderDashboard";

const ProviderLayout = () => {
  return (
    <div>
      <ProviderDashboard />
      <main>
        <Outlet /> {/* This will render the child routes */}
      </main>
    </div>
  );
};

export default ProviderLayout;
