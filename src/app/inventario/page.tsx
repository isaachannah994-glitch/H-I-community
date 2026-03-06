"use client";
import React from "react";
import { redirect } from "next/navigation";

export default function OldInventarioPage() {
  React.useEffect(() => {
    redirect("/(authenticated)/inventario");
  }, []);

  return null;
}
