"use client";
import React from "react";
import { redirect } from "next/navigation";

export default function OldDashboardPage() {
  React.useEffect(() => {
    redirect("/(authenticated)/dashboard");
  }, []);

  return null;
}
