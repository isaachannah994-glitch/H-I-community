"use client";
import React, { useState } from "react";
import {
  Settings,
  User,
  Lock,
  Bell,
  Palette,
  Server,
  Save,
  Plus,
} from "lucide-react";

export default function AjustesPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "usuario", label: "Usuario", icon: User },
    { id: "seguridad", label: "Seguridad", icon: Lock },
    { id: "notificaciones", label: "Notificaciones", icon: Bell },
    { id: "apariencia", label: "Apariencia", icon: Palette },
    { id: "integraciones", label: "Integraciones", icon: Server },
  ];

  return (
    <div className="w-full h-full flex flex-col p-6 gap-6 overflow-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Personaliza tu experiencia en H&I
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-zinc-800 pb-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-400"
                  : "border-transparent text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenido */}
      <div className="flex-1">
        {activeTab === "general" && <TabGeneral />}
        {activeTab === "usuario" && <TabUsuario />}
        {activeTab === "seguridad" && <TabSeguridad />}
        {activeTab === "notificaciones" && <TabNotificaciones />}
        {activeTab === "apariencia" && <TabApariencia />}
        {activeTab === "integraciones" && <TabIntegraciones />}
      </div>
    </div>
  );
}

function TabGeneral() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="font-bold text-white mb-4">Información del Negocio</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2">
              Nombre del Comercio
            </label>
            <input
              type="text"
              defaultValue="H&I Community"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2">
              Tipo de Negocio
            </label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500">
              <option>Bodega</option>
              <option>Ferretería</option>
              <option>Restaurante</option>
              <option>Zapatería</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2">
              Moneda por Defecto
            </label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500">
              <option>USD (Dólar)</option>
              <option>VES (Bolívares)</option>
              <option>EUR (Euro)</option>
            </select>
          </div>
        </div>
      </div>
      <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-2 rounded-lg font-bold transition-colors">
        <Save className="w-4 h-4" />
        Guardar Cambios
      </button>
    </div>
  );
}

function TabUsuario() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="font-bold text-white mb-4">Perfil del Usuario</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-zinc-800">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center font-bold text-white text-xl">
              IC
            </div>
            <div>
              <p className="font-bold text-white">Isaac Castillo</p>
              <p className="text-xs text-zinc-400">Administrador</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              defaultValue="Isaac Castillo"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              defaultValue="isaac03.24castillo@gmail.com"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2">
              Rol
            </label>
            <input
              type="text"
              defaultValue="Administrador"
              disabled
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-500 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
      <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-2 rounded-lg font-bold transition-colors">
        <Save className="w-4 h-4" />
        Guardar Cambios
      </button>
    </div>
  );
}

function TabSeguridad() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="font-bold text-white mb-4">Contraseña</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2">
              Contraseña Actual
            </label>
            <input
              type="password"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="font-bold text-white mb-4">Autenticación de Dos Factores</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Aumenta la seguridad de tu cuenta con autenticación de dos factores
        </p>
        <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Activar 2FA
        </button>
      </div>

      <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-2 rounded-lg font-bold transition-colors">
        <Save className="w-4 h-4" />
        Guardar Cambios
      </button>
    </div>
  );
}

function TabNotificaciones() {
  const [notificaciones, setNotificaciones] = useState({
    ventas: true,
    inventario: true,
    reportes: false,
    sistema: true,
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="font-bold text-white mb-4">Preferencias de Notificaciones</h3>
        <div className="space-y-4">
          {Object.entries(notificaciones).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  setNotificaciones((prev) => ({
                    ...prev,
                    [key]: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 accent-emerald-500"
              />
              <span className="text-sm font-medium text-zinc-300 capitalize">
                {key === "ventas"
                  ? "Alertas de Ventas"
                  : key === "inventario"
                    ? "Alertas de Inventario Bajo"
                    : key === "reportes"
                      ? "Resumen de Reportes"
                      : "Notificaciones del Sistema"}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabApariencia() {
  const [tema, setTema] = useState("oscuro");

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="font-bold text-white mb-4">Tema</h3>
        <div className="space-y-3">
          {[
            { id: "oscuro", label: "Modo Oscuro" },
            { id: "claro", label: "Modo Claro (Próximamente)" },
            { id: "auto", label: "Sistema (Próximamente)" },
          ].map((option) => (
            <label key={option.id} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="tema"
                value={option.id}
                checked={tema === option.id}
                onChange={(e) => setTema(e.target.value)}
                disabled={option.id !== "oscuro"}
                className="w-4 h-4 accent-emerald-500 disabled:opacity-50"
              />
              <span className="text-sm font-medium text-zinc-300">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabIntegraciones() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="font-bold text-white mb-4">Integraciones Disponibles</h3>
        <div className="space-y-3">
          {[
            { name: "Firebase", status: "conectado", icon: "🔥" },
            { name: "Pago Móvil", status: "pendiente", icon: "📱" },
            { name: "Impresoras Térmicas", status: "configurado", icon: "🖨️" },
          ].map((integration) => (
            <div
              key={integration.name}
              className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg border border-zinc-700"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <p className="font-medium text-white">{integration.name}</p>
                  <p className="text-xs text-zinc-500 capitalize">
                    {integration.status}
                  </p>
                </div>
              </div>
              <button className="text-sm px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors">
                {integration.status === "conectado" ? "Desconectar" : "Conectar"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-2 rounded-lg font-bold transition-colors">
        <Plus className="w-4 h-4" />
        Agregar Integración
      </button>
    </div>
  );
}
