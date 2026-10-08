"use client"

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/providers/auth-store-providers";

import Link from "next/link";

export default function Home() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken)

  return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold"> 웹 프레임워크 </h1>
        <p>
          Spring boot + next.js
        </p>
      </div>
  );
}