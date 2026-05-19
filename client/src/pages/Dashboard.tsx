import { useState, type JSX } from "react";

// ── Types ──────────────────────────────────────────────────────
type Page = "overview" | "users" | "logs" | "settings";

type User = {
  id: number;
  name: string;
  email: string;
  enrolledAt: string;
  lastLogin: string;
  status: "active" | "inactive" | "flagged";
};

type Log = {
  id: number;
  user: string;
  event: "login_success" | "login_failed" | "enrolled" | "deleted";
  time: string;
  ip: string;
};

// ── Mock Data ──────────────────────────────────────────────────
const MOCK_USERS: User[] = [
  {
    id: 1,
    name: "Amara Okafor",
    email: "amara@company.com",
    enrolledAt: "2025-04-01",
    lastLogin: "2025-05-18",
    status: "active",
  },
  {
    id: 2,
    name: "Chidi Eze",
    email: "chidi@company.com",
    enrolledAt: "2025-04-03",
    lastLogin: "2025-05-17",
    status: "active",
  },
  {
    id: 3,
    name: "Ngozi Adeyemi",
    email: "ngozi@company.com",
    enrolledAt: "2025-04-10",
    lastLogin: "2025-05-10",
    status: "inactive",
  },
  {
    id: 4,
    name: "Emeka Nwosu",
    email: "emeka@company.com",
    enrolledAt: "2025-04-12",
    lastLogin: "2025-05-18",
    status: "flagged",
  },
  {
    id: 5,
    name: "Fatima Aliyu",
    email: "fatima@company.com",
    enrolledAt: "2025-04-15",
    lastLogin: "2025-05-16",
    status: "active",
  },
  {
    id: 6,
    name: "Seun Bello",
    email: "seun@company.com",
    enrolledAt: "2025-04-20",
    lastLogin: "2025-05-14",
    status: "active",
  },
  {
    id: 7,
    name: "Tunde Adebayo",
    email: "tunde@company.com",
    enrolledAt: "2025-04-22",
    lastLogin: "2025-05-12",
    status: "inactive",
  },
];

const MOCK_LOGS: Log[] = [
  {
    id: 1,
    user: "Amara Okafor",
    event: "login_success",
    time: "2025-05-18 09:14",
    ip: "192.168.1.4",
  },
  {
    id: 2,
    user: "Emeka Nwosu",
    event: "login_failed",
    time: "2025-05-18 08:52",
    ip: "192.168.1.9",
  },
  {
    id: 3,
    user: "Fatima Aliyu",
    event: "login_success",
    time: "2025-05-18 08:30",
    ip: "10.0.0.14",
  },
  {
    id: 4,
    user: "Seun Bello",
    event: "enrolled",
    time: "2025-05-17 14:00",
    ip: "10.0.0.3",
  },
  {
    id: 5,
    user: "Ngozi Adeyemi",
    event: "login_failed",
    time: "2025-05-17 11:44",
    ip: "192.168.1.7",
  },
  {
    id: 6,
    user: "Chidi Eze",
    event: "login_success",
    time: "2025-05-17 09:20",
    ip: "192.168.1.2",
  },
  {
    id: 7,
    user: "Tunde Adebayo",
    event: "deleted",
    time: "2025-05-16 16:05",
    ip: "10.0.0.1",
  },
  {
    id: 8,
    user: "Amara Okafor",
    event: "enrolled",
    time: "2025-04-01 10:00",
    ip: "10.0.0.1",
  },
];

// ── Icon Components ────────────────────────────────────────────
const Icon = ({ path, size = 20 }: { path: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={path} />
  </svg>
);

const ICONS = {
  grid: "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z",
  users:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  logs: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8m8 4H8m2-8H8",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6.93-3c0-.46-.04-.92-.1-1.36l2.23-1.72-2.12-3.64-2.61 1.04A7.93 7.93 0 0 0 14 5.07L13.59 2h-3.18L10 5.07a7.93 7.93 0 0 0-2.33 1.25L5.06 5.28 2.94 8.92l2.23 1.72A7.9 7.9 0 0 0 5.07 12c0 .46.04.92.1 1.36L2.94 15.08l2.12 3.64 2.61-1.04c.72.48 1.5.87 2.33 1.25L10.41 22h3.18l.41-3.07a7.93 7.93 0 0 0 2.33-1.25l2.61 1.04 2.12-3.64-2.23-1.72c.06-.44.1-.9.1-1.36z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  fingerprint:
    "M12 11c0-1.66-1.34-3-3-3s-3 1.34-3 3v2.5M12 11c0-1.66 1.34-3 3-3s3 1.34 3 3v2.5M8 14.5c0 2.21 1.79 4 4 4s4-1.79 4-4V11",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9m-4.27 13a2 2 0 0 1-3.46 0",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  alert:
    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01",
  trash:
    "M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  eye: "M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7zm11-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
};

// ── Stat Card ──────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  iconPath,
  accent,
}: {
  label: string;
  value: string | number;
  sub: string;
  iconPath: string;
  accent: string;
}) {
  return (
    <div className="bg-[#0f1117] border border-[#1e2230] rounded-2xl p-5 flex flex-col gap-4 hover:border-[#2e3448] transition-colors">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold tracking-widest text-[#4a5270] uppercase">
          {label}
        </span>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}
        >
          <Icon path={iconPath} size={17} />
        </div>
      </div>
      <div>
        <div className="text-4xl font-bold text-white tracking-tight">
          {value}
        </div>
        <div className="text-xs text-[#4a5270] mt-1">{sub}</div>
      </div>
    </div>
  );
}

// ── Overview Page ──────────────────────────────────────────────
function OverviewPage() {
  const active = MOCK_USERS.filter((u) => u.status === "active").length;
  const flagged = MOCK_USERS.filter((u) => u.status === "flagged").length;
  const failed = MOCK_LOGS.filter((l) => l.event === "login_failed").length;

  const recentLogs = MOCK_LOGS.slice(0, 5);

  const eventStyles: Record<
    Log["event"],
    { label: string; color: string; icon: string }
  > = {
    login_success: {
      label: "Login Success",
      color: "text-emerald-400 bg-emerald-400/10",
      icon: ICONS.check,
    },
    login_failed: {
      label: "Login Failed",
      color: "text-red-400 bg-red-400/10",
      icon: ICONS.x,
    },
    enrolled: {
      label: "Enrolled",
      color: "text-sky-400 bg-sky-400/10",
      icon: ICONS.fingerprint,
    },
    deleted: {
      label: "Deleted",
      color: "text-amber-400 bg-amber-400/10",
      icon: ICONS.trash,
    },
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          System Overview
        </h2>
        <p className="text-[#4a5270] text-sm mt-1">
          Live status of your biometric access system
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={MOCK_USERS.length}
          sub="enrolled in system"
          iconPath={ICONS.users}
          accent="bg-sky-500/15 text-sky-400"
        />
        <StatCard
          label="Active"
          value={active}
          sub="logged in recently"
          iconPath={ICONS.activity}
          accent="bg-emerald-500/15 text-emerald-400"
        />
        <StatCard
          label="Flagged"
          value={flagged}
          sub="require attention"
          iconPath={ICONS.alert}
          accent="bg-amber-500/15 text-amber-400"
        />
        <StatCard
          label="Auth Failures"
          value={failed}
          sub="in recent logs"
          iconPath={ICONS.x}
          accent="bg-red-500/15 text-red-400"
        />
      </div>

      {/* Activity bar chart (CSS only) */}
      <div className="bg-[#0f1117] border border-[#1e2230] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-white">
            Weekly Authentication Activity
          </span>
          <span className="text-xs text-[#4a5270]">Last 7 days</span>
        </div>
        <div className="flex items-end gap-2 h-24">
          {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-green-700 to-green-400 opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${h}%` }}
              />
              <span className="text-[10px] text-[#4a5270]">
                {["M", "T", "W", "T", "F", "S", "S"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#0f1117] border border-[#1e2230] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-white">
            Recent Activity
          </span>
        </div>
        <div className="flex flex-col divide-y divide-[#1e2230]">
          {recentLogs.map((log) => {
            const s = eventStyles[log.event];
            return (
              <div
                key={log.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}
                  >
                    <Icon path={s.icon} size={14} />
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">
                      {log.user}
                    </div>
                    <div className="text-xs text-[#4a5270]">{s.label}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#4a5270]">{log.time}</div>
                  <div className="text-xs text-[#2e3448]">{log.ip}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Users Page ─────────────────────────────────────────────────
function UsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(MOCK_USERS);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const statusStyle: Record<User["status"], string> = {
    active: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    inactive: "text-[#4a5270] bg-white/5 border-white/10",
    flagged: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  };

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Enrolled Users
          </h2>
          <p className="text-[#4a5270] text-sm mt-1">
            {users.length} users registered in the system
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5270]">
          <Icon path={ICONS.search} size={16} />
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0f1117] border border-[#1e2230] rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder-[#4a5270] outline-none focus:border-green-500/50 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-[#0f1117] border border-[#1e2230] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-[#1e2230]">
          {["Name", "Email", "Enrolled", "Last Login", ""].map((h, i) => (
            <span
              key={i}
              className="text-[10px] font-semibold tracking-widest text-[#4a5270] uppercase"
            >
              {h}
            </span>
          ))}
        </div>

        <div className="divide-y divide-[#1e2230]">
          {filtered.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-center px-5 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-white font-medium truncate">
                    {user.name}
                  </div>
                  <span
                    className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[user.status]}`}
                  >
                    {user.status}
                  </span>
                </div>
              </div>
              <div className="text-sm text-[#4a5270] truncate">
                {user.email}
              </div>
              <div className="text-xs text-[#4a5270] whitespace-nowrap">
                {user.enrolledAt}
              </div>
              <div className="text-xs text-[#4a5270] whitespace-nowrap">
                {user.lastLogin}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setConfirmDelete(user.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4a5270] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Icon path={ICONS.trash} size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-[#4a5270] text-sm">
            No users found.
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0f1117] border border-[#2e3448] rounded-2xl p-6 w-80 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <Icon path={ICONS.trash} size={22} />
            </div>
            <div>
              <div className="text-white font-semibold">Delete user?</div>
              <div className="text-[#4a5270] text-sm mt-1">
                This will permanently remove the user and their biometric data.
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#2e3448] text-[#4a5270] hover:text-white text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-500 text-white text-sm font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Logs Page ──────────────────────────────────────────────────
function LogsPage() {
  const [filter, setFilter] = useState<"all" | Log["event"]>("all");

  const filtered =
    filter === "all" ? MOCK_LOGS : MOCK_LOGS.filter((l) => l.event === filter);

  const eventStyles: Record<
    Log["event"],
    { label: string; color: string; dot: string }
  > = {
    login_success: {
      label: "Login Success",
      color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      dot: "bg-emerald-400",
    },
    login_failed: {
      label: "Login Failed",
      color: "text-red-400 bg-red-400/10 border-red-400/20",
      dot: "bg-red-400",
    },
    enrolled: {
      label: "Enrolled",
      color: "text-sky-400 bg-sky-400/10 border-sky-400/20",
      dot: "bg-sky-400",
    },
    deleted: {
      label: "Deleted",
      color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
      dot: "bg-amber-400",
    },
  };

  const filters: { label: string; value: "all" | Log["event"] }[] = [
    { label: "All", value: "all" },
    { label: "Login Success", value: "login_success" },
    { label: "Login Failed", value: "login_failed" },
    { label: "Enrolled", value: "enrolled" },
    { label: "Deleted", value: "deleted" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Access Logs
        </h2>
        <p className="text-[#4a5270] text-sm mt-1">
          Full audit trail of biometric events
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              filter === f.value
                ? "bg-green-500/15 text-green-400 border-green-500/30"
                : "bg-transparent text-[#4a5270] border-[#1e2230] hover:border-[#2e3448] hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-[#0f1117] border border-[#1e2230] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-5 py-3 border-b border-[#1e2230]">
          {["Event", "User", "IP Address", "Time"].map((h) => (
            <span
              key={h}
              className="text-[10px] font-semibold tracking-widest text-[#4a5270] uppercase"
            >
              {h}
            </span>
          ))}
        </div>
        <div className="divide-y divide-[#1e2230]">
          {filtered.map((log) => {
            const s = eventStyles[log.event];
            return (
              <div
                key={log.id}
                className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
              >
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${s.color}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
                <span className="text-sm text-white truncate">{log.user}</span>
                <span className="text-xs text-[#4a5270] font-mono whitespace-nowrap">
                  {log.ip}
                </span>
                <span className="text-xs text-[#4a5270] whitespace-nowrap">
                  {log.time}
                </span>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-[#4a5270] text-sm">
            No logs found.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable page content */}
        <div className="flex-1 overflow-y-auto p-5">
          <OverviewPage />
        </div>
      </main>
    </div>
  );
}
