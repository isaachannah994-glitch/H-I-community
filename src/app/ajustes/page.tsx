"use client";
import React from "react";
import { redirect } from "next/navigation";

export default function OldAjustesPage() {
  React.useEffect(() => {
    redirect("/(authenticated)/ajustes");
  }, []);

  return null;
}
