import { LoginRequest, LoginResponse, MeResponse, SignUpRequest, SignUpResponse } from "@/types/user";
import apiFetch from "./http";

export async function getMe(accessToken: string, signal? : AbortSignal): Promise<MeResponse> {
    const response = await apiFetch("/user-account/me", {
        accessToken, signal
    })
    return response.json()
}
    
export async function login(
    request: LoginRequest
): Promise<LoginResponse> {
    const response = await apiFetch("/user-account/login", {
        method: "POST",
        credentials: "include", // 쿠키도 함께 보낼게.
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })
    return response.json()
}

export async function checkEmail(email: string): Promise<boolean> {
    const params = new URLSearchParams({email})

    const response = await apiFetch(`/user-account/check-email?${params}`)

    return response.json()
}

export async function signUp(request: SignUpRequest): Promise<SignUpResponse> {
    const response = await apiFetch("/user-account/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })

    return response.json()
}

// 1. 기존 api가 accessToken이 만료되면 만료시간이 다 된 것으로 실패
// 2. 만료 시간이 다 되면 자동으로 refresh api를 호출
// 3. 새로운 accessToken을 저장. (기존 accessToken은 폐기)
// 4. 실패했던 api를 새로운 accessToken으로 재실행

export async function refresh() {
    const response = await apiFetch("/user-account/refresh", {
        method: "POST",
        credentials: "include"
    })

    console.log("response.status " + response.status)

    return response.json()
    
    // 새 AccessToken 저장
    // 실패했던 API 재호출
}