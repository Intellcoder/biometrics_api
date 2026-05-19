import React, { useState } from "react";

type Props = {};

function SettingsPage() {
  const [settings, setSettings] = useState({
    matchThreshold: 85,
    maxFailedAttempts: 3,
    lockoutMinutes: 15,
    enrollmentRequiresAdmin: true,
    alertOnFailure: true,
    retainLogsDays: 90,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleSwitch = ({
    on,
    onToggle,
  }: {
    on: boolean;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-green-500" : "bg-[#2e3448]"}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${on ? "translate-x-5" : ""}`}
      />
    </button>
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          System Settings
        </h2>
        <p className="text-[#4a5270] text-sm mt-1">
          Configure biometric matching and security policies
        </p>
      </div>

      {/* Biometric */}
      <div className="bg-[#0f1117] border border-[#1e2230] rounded-2xl p-5 flex flex-col gap-5">
        <span className="text-xs font-semibold tracking-widest text-[#4a5270] uppercase">
          Biometric Matching
        </span>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label className="text-sm text-white">
              Match Confidence Threshold
            </label>
            <span className="text-sm text-green-400 font-bold">
              {settings.matchThreshold}%
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={99}
            value={settings.matchThreshold}
            onChange={(e) =>
              setSettings((s) => ({ ...s, matchThreshold: +e.target.value }))
            }
            className="w-full accent-green-500"
          />
          <span className="text-xs text-[#4a5270]">
            Higher values require closer facial match
          </span>
        </div>
      </div>

      {/* Security */}
      <div className="bg-[#0f1117] border border-[#1e2230] rounded-2xl p-5 flex flex-col gap-5">
        <span className="text-xs font-semibold tracking-widest text-[#4a5270] uppercase">
          Security Policy
        </span>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white">Max Failed Attempts</div>
            <div className="text-xs text-[#4a5270]">
              Attempts before account lockout
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setSettings((s) => ({
                  ...s,
                  maxFailedAttempts: Math.max(1, s.maxFailedAttempts - 1),
                }))
              }
              className="w-7 h-7 rounded-lg bg-[#1e2230] text-white hover:bg-[#2e3448] text-sm flex items-center justify-center transition-colors"
            >
              −
            </button>
            <span className="w-6 text-center text-white font-bold text-sm">
              {settings.maxFailedAttempts}
            </span>
            <button
              onClick={() =>
                setSettings((s) => ({
                  ...s,
                  maxFailedAttempts: Math.min(10, s.maxFailedAttempts + 1),
                }))
              }
              className="w-7 h-7 rounded-lg bg-[#1e2230] text-white hover:bg-[#2e3448] text-sm flex items-center justify-center transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="h-px bg-[#1e2230]" />

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white">Lockout Duration</div>
            <div className="text-xs text-[#4a5270]">
              Minutes before retry is allowed
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setSettings((s) => ({
                  ...s,
                  lockoutMinutes: Math.max(1, s.lockoutMinutes - 5),
                }))
              }
              className="w-7 h-7 rounded-lg bg-[#1e2230] text-white hover:bg-[#2e3448] text-sm flex items-center justify-center transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center text-white font-bold text-sm">
              {settings.lockoutMinutes}m
            </span>
            <button
              onClick={() =>
                setSettings((s) => ({
                  ...s,
                  lockoutMinutes: Math.min(60, s.lockoutMinutes + 5),
                }))
              }
              className="w-7 h-7 rounded-lg bg-[#1e2230] text-white hover:bg-[#2e3448] text-sm flex items-center justify-center transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="h-px bg-[#1e2230]" />

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white">Admin-only Enrollment</div>
            <div className="text-xs text-[#4a5270]">
              Only admins can enroll new users
            </div>
          </div>
          <ToggleSwitch
            on={settings.enrollmentRequiresAdmin}
            onToggle={() => toggle("enrollmentRequiresAdmin")}
          />
        </div>

        <div className="h-px bg-[#1e2230]" />

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white">Alert on Auth Failure</div>
            <div className="text-xs text-[#4a5270]">
              Notify admin on repeated failures
            </div>
          </div>
          <ToggleSwitch
            on={settings.alertOnFailure}
            onToggle={() => toggle("alertOnFailure")}
          />
        </div>
      </div>

      {/* Logs */}
      <div className="bg-[#0f1117] border border-[#1e2230] rounded-2xl p-5 flex flex-col gap-4">
        <span className="text-xs font-semibold tracking-widest text-[#4a5270] uppercase">
          Audit Logs
        </span>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white">Log Retention</div>
            <div className="text-xs text-[#4a5270]">
              Days to keep access logs
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[30, 60, 90, 180].map((d) => (
              <button
                key={d}
                onClick={() =>
                  setSettings((s: any) => ({ ...s, retainLogsDays: d }))
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  settings.retainLogsDays === d
                    ? "bg-green-500/15 text-green-400 border-green-500/30"
                    : "text-[#4a5270] border-[#1e2230] hover:border-[#2e3448]"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="bg-green-600 hover:bg-green-500 active:scale-95 transition-all text-white py-3 rounded-xl font-semibold text-sm">
        Save Settings
      </button>
    </div>
  );
}

export default SettingsPage;
