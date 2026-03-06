"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const MENU_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "pos",
    label: "Punto de Venta",
    href: "/pos",
    icon: ShoppingCart,
  },
  {
    id: "inventario",
    label: "Inventario",
    href: "/inventario",
    icon: Package,
  },
  {
    id: "reportes",
    label: "Reportes",
    href: "/reportes",
    icon: BarChart3,
  },
  {
    id: "settings",
    label: "Configuración",
    href: "/ajustes",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-800 rounded-lg text-white"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-300 z-40 ${
          isOpen ? "left-0" : "-left-64 md:left-0"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-zinc-800 bg-zinc-950">
          <div className="h-10 w-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">
            H&I
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  active
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-zinc-800 p-4 space-y-3">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Cerrar Sesión</span>
          </button>
          <div className="px-4 py-3 bg-zinc-800/50 rounded-lg">
            <p className="text-xs text-zinc-500">Usuario</p>
            <p className="text-sm font-medium text-white mt-1">Isaac Castillo</p>
            <p className="text-xs text-zinc-400 mt-1">Administrador</p>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
