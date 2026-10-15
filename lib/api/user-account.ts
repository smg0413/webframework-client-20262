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