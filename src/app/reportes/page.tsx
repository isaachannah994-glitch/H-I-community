"use client";
import React from "react";
import { redirect } from "next/navigation";

export default function OldReportesPage() {
  React.useEffect(() => {
    redirect("/(authenticated)/reportes");
  }, []);

  return null;
}
