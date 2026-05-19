import { useState } from "react";
import {
  ShieldUser,
  LayoutDashboard,
  Database,
  ScrollText,
  HeartPulse,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: <LayoutDashboard size={18} /> },
  {
    label: "Biometric Database",
    to: "/biometric",
    icon: <Database size={18} />,
  },
  {
    label: "Enroll User",
    to: "/enrollment",
    icon: <UserCheck size={18} />,
  },
  { label: "Access Logs", to: "/logs", icon: <ScrollText size={18} /> },
  { label: "System Health", to: "/health", icon: <HeartPulse size={18} /> },
  { label: "Admin Settings", to: "/settings", icon: <Settings size={18} /> },
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className="relative flex flex-col min-h-full bg-[#0d1b2a] transition-all duration-300 ease-in-out"
      style={{ width: expanded ? "220px" : "68px" }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="absolute -right-3 top-7 z-10 flex items-center justify-center
                   w-6 h-6 rounded-full bg-[#0d1b2a] border border-emerald-500/40
                   text-emerald-400 hover:bg-emerald-500/10 transition-colors"
      >
        {expanded ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
      </button>

      {/* Header */}
      <header
        className={`flex items-center gap-3 px-4 pt-6 pb-4 overflow-hidden
                    ${expanded ? "justify-start" : "justify-center"}`}
      >
        <ShieldUser className="text-emerald-400 shrink-0" size={30} />
        {expanded && (
          <h1 className="text-xs font-bold tracking-[0.18em] text-gray-200 uppercase whitespace-nowrap">
            Sentinel Alpha
          </h1>
        )}
      </header>

      <hr className="border-white/10 mx-3 mb-3" />

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-2 flex-1">
        {navItems.map(({ label, to, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
               transition-all duration-200 overflow-hidden whitespace-nowrap
               ${expanded ? "justify-start" : "justify-center"}
               ${
                 isActive
                   ? "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-400 rounded-l-none"
                   : "text-gray-400 hover:bg-white/5 hover:text-gray-200 border-l-2 border-transparent"
               }`
            }
            title={!expanded ? label : undefined}
          >
            <span className="shrink-0">{icon}</span>
            {expanded && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* System status (only when expanded) */}
      {expanded && (
        <div className="mx-3 mb-3 px-3 py-2.5 rounded-lg bg-emerald-500/8 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <span className="text-emerald-400 text-[10px] font-semibold tracking-widest">
              SYSTEM ONLINE
            </span>
          </div>
          <p className="text-[10px] text-gray-500">All sensors operational</p>
        </div>
      )}

      {/* Log Out */}
      <div className={`px-3 pb-5 ${expanded ? "" : "flex justify-center"}`}>
        <button
          className={`flex items-center gap-2 text-gray-500 hover:text-gray-300
                      bg-white/5 hover:bg-white/10 border border-white/10
                      rounded-lg transition-colors text-xs font-medium
                      ${expanded ? "px-3 py-2 w-full" : "p-2"}`}
          title={!expanded ? "Log Out" : undefined}
        >
          <LogOut size={14} className="shrink-0" />
          {expanded && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
