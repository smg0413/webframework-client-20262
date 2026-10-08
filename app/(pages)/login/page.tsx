"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api/user-account";
import { useAuthStore } from "@/providers/auth-store-providers";


import { SubmitEvent, useState } from "react";

type  LoginResponse = {
    accessToken: string
    tokenType: string
    expiersIn: number
}

export default function LoginPage() {
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState("")

    const accessToken = useAuthStore((state) => state.accessToken)
    const setAccessToken = useAuthStore((state) => state.setAccessToken)
    const clearAccessToken = useAuthStore((state) => state.clearAccessToken)


    // const { accessToken, setAccessToken, clearAccessToken } = useAtuhStore<AuthState>((state) => stata)

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        const form = event.currentTarget
        const formData = new FormData(form)

        const email = String(formData.get("email") ?? "")
        const password = String(formData.get("password") ?? "")

        

        setIsSubmitting(true)
        setErrorMessage("")
        clearAccessToken()

        try {
            // login api 공통 함수로 구현
         
            const data: LoginResponse = await login({email, password})
            setAccessToken(data.accessToken, data.expiersIn)

            form.reset()

        } catch {
            setErrorMessage("알 수 없는 에러가 발생했습니다.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex items-center justify-center p=4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle> 로그인 </CardTitle>
                </CardHeader>

                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label> 이메일 </Label>
                            <Input id="email" name="email" type="email" placeholder="example@email.com" required disabled={isSubmitting} />
                        </div>

                        <div className="space-y-2">
                            <Label> 비밀번호 </Label>
                            <Input id="password" name="password" type="password" maxLength={64} required disabled={isSubmitting} />
                        </div>

                        {errorMessage && (
                            <p className="text-sm text-red-600"> {errorMessage} </p>
                        )}

                        {accessToken && (
                            <p className="text-sm text-green-700">
                                로그인 성공! {accessToken}
                            </p>
                        )}

                        <Button type="submit" className="w-full" disabled={isSubmitting}> 로그인 </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}