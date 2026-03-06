"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al dashboard por defecto
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="animate-pulse text-center">
        <h1 className="text-2xl font-bold text-white mb-4">H&I Community</h1>
        <p className="text-zinc-400">Cargando sistema...</p>
      </div>
    </div>
  );
}
