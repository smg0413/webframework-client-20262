"use client"

import { useState, useRef, FocusEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"
import { checkEmail, signUp } from "@/lib/api/user-account";

export default function SignUpPage() {
    const [isSubmitting, setIsSubmiting] = useState(false)
    const [emailMessage, setEmailMessage] = useState("")
    const [emailValid, setEmailValid] = useState<boolean | null>(null)
    const emailCheckVersion = useRef(0) // 이전 요청의 늦은 응답을 구분하기 위한 번호

    async function handleEmailBlur(event: FocusEvent<HTMLInputElement>) {
        const input = event.currentTarget
        const email = input.value.trim()

        const version = ++emailCheckVersion.current

        if (!email) {
            setEmailMessage("")
            setEmailValid(null)
            return
        }

        if (!input.validity.valid) {
            setEmailMessage("올바른 이메일 형식이 아닙니다")
            setEmailValid(null)
        }

        setEmailMessage("이메일 확인 중 ....")
        setEmailValid(null)

        try {
            const duplicated: boolean = await checkEmail(email)

            if (version !== emailCheckVersion.current) {
                return
            }

            setEmailMessage(
                duplicated ? "이미 사용 중인 이메일입니다." : "사용 가능한 이메일입니다."
            )
            setEmailValid(!duplicated)
        } catch {
            if (version !== emailCheckVersion.current) {
                return
            }

            setEmailMessage("이메일을 확인할 수 없습니다. 다시 시도해 주세요")
            setEmailValid(false)
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (isSubmitting) {
            return
        }

        const formData = new FormData(event.currentTarget)

        const email = String(formData.get("email"))
        const password = String(formData.get("password"))
        const nickname = String(formData.get("nickname"))

        setIsSubmiting(true)

        try {
            const data = await signUp({ email, password, nickname })
            alert(`회원가입 완료! ID: ${data.id}`)
        } catch {
            alert("회원가입 중 오류가 발생했습니다.")
        } finally {
            setIsSubmiting(false)
        }
    }

    return (
        <main className="flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle> 회원가입 </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form className="space-y-2" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email"> 이메일 </Label>
                            <Input
                                id="email" name="email" type="email" placeholder="example@email.com" autoComplete="email" required
                                onBlur={handleEmailBlur}
                                onChange={() => {
                                    emailCheckVersion.current += 1
                                    setEmailMessage("")
                                    setEmailValid(null)
                                }}
                            />

                            <p className={cn("text-sm font-semibold", emailValid ? "text-green-600" : "text-red-600")}>
                                {emailMessage}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password"> 비밀번호 </Label>
                            <Input id="password" name="password" type="password" placeholder="8자 이상 입력하세요"
                                autoComplete="new-password" minLength={8} maxLength={64} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nickname"> 닉네임 </Label>
                            <Input id="nickname" name="nickname" type="nickname" placeholder="2~20자로 입력하세요"
                                minLength={2} maxLength={20} required />
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "가입 중.." : "회원가입"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}