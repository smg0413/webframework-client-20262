"use client"

import { Button } from "@/components/ui/button";
import { refresh } from "@/lib/api/user-account";
import { useAuthStore } from "@/providers/auth-store-providers";

export default function Home() {
  const setAccessToken = useAuthStore(state => state.setAccessToken)

  return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold"> 웹 프레임워크 </h1>
        <p>
          Spring boot + next.js
        </p>
        <div>
          <Button 
          onClick={async () => {
            const data = await refresh()
            console.log('data : ', data)
            setAccessToken(data.accessToken, data.expiresIn)

            console.log("새로운 accessToken 저장")
          }}
          > 리프레시 </Button>
        </div>
      </div>
  )
}