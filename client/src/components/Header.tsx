import React from "react";
import { Bell, Clock } from "lucide-react";

type Props = {
  username?: string;
  facility?: string;
};

const Header = ({
  username = "Admin",
  facility = "FUTO Cybersecurity Research Centre",
}: Props) => {
  const now = new Date();
  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = now.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex items-center justify-between bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
      {/* Left — greeting */}
      <div>
        <p className="text-gray-400 text-xs font-medium tracking-wide uppercase mb-0.5">
          Welcome back
        </p>
        <h2 className="text-gray-800 text-base font-semibold leading-snug">
          <span className="text-gray-500 font-normal">
            Welcome to the {facility}.
          </span>
        </h2>
      </div>

      {/* Right — status + time + bell + avatar */}
      <div className="flex items-center gap-4">
        {/* Date & time */}
        <div className="hidden sm:flex items-center gap-1.5 text-gray-400 text-xs">
          <Clock size={13} />
          <span>
            {date} · {time}
          </span>
        </div>

        {/* Online badge */}
        <div className="flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold tracking-widest px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(52,211,153,0.4)]">
          <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
          ONLINE
        </div>

        {/* Notification bell */}
        <button className="relative p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
          <Bell size={16} />
          {/* unread dot */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm select-none">
            {username
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-gray-700 leading-none">
              {username.split(" ")[0]}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
