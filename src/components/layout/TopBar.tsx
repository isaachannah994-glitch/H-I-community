"use client";
import React from "react";
import { Bell, Clock, Wifi } from "lucide-react";

export default function TopBar() {
  const [time, setTime] = React.useState<string>("");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("es-ES"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 md:px-8">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Clock className="w-4 h-4" />
          <span className="font-mono">{time}</span>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
          <Wifi className="w-3 h-3" />
          <span>Terminal Activa</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-zinc-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-zinc-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>

        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-zinc-800">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center font-bold text-white text-xs">
            IC
          </div>
          <div>
            <p className="text-xs font-bold">Isaac Castillo</p>
            <p className="text-xs text-zinc-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
