"use client"

import { useState , useRef, FocusEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, SubmitEvent } from "react";
import { cn } from "@/lib/utils"

export default function SignUpPage() {
    const [ isSubmitting, setIsSubmiting ] = useState(false)
    const [ emailMessage, setEmailMessage ] = useState("")
    const [ emailValid, setEmailValid ] = useState<boolean | null>(null)
    const emailCheckVersion = useRef(0) // 이전 요총의 늦은 응답을 구분하기 위한 번호

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

        // blur

        try {
            const params = new URLSearchParams({email})

            const response = await fetch(
                `http://localhost:8080/user-account/check-email?${params}`,
                { cache: "no-store" }
            )

            if (!response.ok) {
                throw new Error("이메일 확인 실패")
            }

            const duplicated = await response.json()

             if (version !== emailCheckVersion.current) {
                return
            }

            setEmailMessage(
                duplicated? "이미 사용 중인 이메일입니다.":"사용 가능한 이메일입니다."
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

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) { // SubmitEvent는 react에서 import
        event.preventDefault()

        if (isSubmitting) {
            return
        }

        const formData = new FormData(event.currentTarget)
        
        const email = String(formData.get("email"))
        const password = String(formData.get("password"))
        const nickname = String(formData.get("nickname"))

        console.log(email, password, nickname); // email, password, nickname 출력

        // spring 회원가입 api 호출
        // fetch -> axios
    try {
        const response = await fetch("http://localhost:8080/user-account/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ // javascript object notaion
                email, password, nickname
            }) 
        })

        if (!response.ok) {
            alert(`회원가입에 실패했습니다. ${response.status}`)
            return
        }

        const data = await response.json()
        alert(`회원가입 완료! ID :${data.id}`)

    } catch {
        alert("회원가입 중 오류가 발생했습니다.")
    }finally {
            setIsSubmiting(false) 
    }
}
    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            
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
                                { emailMessage }
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password"> 비밀번호 </Label>
                            <Input id="password" name="password" type="password" placeholder="8자 이상 입력하세요"
                            autoComplete="new-password" minLength={8} maxLength={64} required/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nickname"> 닉네임 </Label>
                            <Input id="nickname" name="nickname" type="nickname" placeholder="2~20자로 입력하세요"
                            minLength={2} maxLength={20} required />
                        
                        </div>

                        <Button type="submit" className="w-full"> 
                             { isSubmitting ? "가입 중..":"회원가입" }
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}