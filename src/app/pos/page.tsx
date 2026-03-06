"use client";
import React from "react";
import { redirect } from "next/navigation";

export default function OldPOSPage() {
  React.useEffect(() => {
    redirect("/(authenticated)/pos");
  }, []);

  return null;
}
