import { UserRound, ShieldCheck, ShieldX } from "lucide-react";

const AccessLogs = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Enrollment Actions */}
      <div className="bg-white rounded-xl p-5 shadow">
        <h2 className="font-semibold mb-4">Enrollment Actions</h2>

        <div className="flex justify-between">
          <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition">
            <UserRound size={30} />
            <p className="text-sm mt-2">Enroll New Staff</p>
          </div>

          <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition">
            <UserRound size={30} />
            <p className="text-sm mt-2">Generate Token</p>
          </div>
        </div>
      </div>

      {/* Access Logs */}
      <div className="bg-white rounded-xl p-5 shadow">
        <h2 className="font-semibold mb-4">Recent Access Logs</h2>

        <div className="flex flex-col gap-4 text-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-green-500" />
            <p>14:30 Ikechukwu (Verified)</p>
          </div>

          <div className="flex items-center gap-3">
            <ShieldX className="text-red-500" />
            <p>14:31 Unknown (Access Denied)</p>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="text-green-500" />
            <p>14:32 John Doe (Verified)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessLogs;
