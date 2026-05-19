import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex bg-[#e8ecef] min-h-screen">
      <div className="">
        <Sidebar />
      </div>
      <main className="flex-1 flex-col min-h-screen">
        <Header />
        <div className="p-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
