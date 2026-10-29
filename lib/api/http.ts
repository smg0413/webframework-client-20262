import { createAuthStore } from "@/stores/auth-strore"
import { LoginResponse } from "@/types/user"

type AuthStore = ReturnType<typeof createAuthStore>

let authStore: AuthStore | null = null
let refreshPromise: Promise<string> | null = null

// Provider에서 만든 저장소 연결
export function connectAuthStore(store: AuthStore | null) {
    authStore = store 
}

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string
    ) {
        super(message)
        this.name = "ApiError"
    }
}

type ApiOptions = RequestInit & {
    accessToken?: string | null
}

// Refresh Token으로 Access Token 재발급
function refreshAccessToekn(baseUrl: string): Promise<string> {
    const store = authStore
    const previuesToken = store?.getState().accessToken

    if (!store || !previuesToken) {
        return Promise.reject(new ApiError(401, "다시 로그인하세요."))
    }

    
    // 갱신 중인 요청이 있으면 대기
    if(!refreshPromise) {
        refreshPromise = (async () => {
            const response = await fetch(`${baseUrl}/user-account/refresh`, {
                method: "POST",
                credentials: "include"
            })

            console.log("response", response)

            const data: LoginResponse | null = response.ok? await response.json() : null

            // 로그아웃하거나 계정이 변경된 경우
            if (authStore !== store || store.getState().accessToken !== previuesToken) {
                throw new ApiError(401, "로그인 상태가 변경되었습니다.")
            }

            if(!data) {
                if(response.status === 401) {
                    store.getState().clearAccessToken()
                }

                throw new ApiError(response.status, "토큰 갱신에 실패했습니다.")
            }


            store.getState().setAccessToken(data.accessToken, data.expiresIn)

            return data.accessToken
        }) ().finally(() => {
            refreshPromise = null
        })

    }

     return refreshPromise
}



export default async function apiFetch(path: string, options: ApiOptions = {}): Promise<Response> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL을 설정하세요.")
    }

    const { accessToken, ...init } = options
    let token = accessToken 


    if (accessToken && authStore) {
        token = authStore.getState().accessToken

        if (!token) {
            throw new ApiError(401, "다시 로그인 하세요")
        }
    }

    const request = (token?: string | null) => {
        const headers = new Headers(init.headers)

        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        }
    

        return fetch(`${baseUrl}${path}`, {
            ...init,
            headers,
            credentials: init.credentials ?? "omit",
            cache: init.cache?? "no-store"
        })
    }

    let response = await request(token)

    const canRefresh = Boolean(accessToken) && path !== "/user-account/login"&& path !== "/user-account/refresh"

    if(response.status === 401 && canRefresh) {
        init.signal?.throwIfAborted()
    
        const newToken = await refreshAccessToekn(baseUrl)

        response = await request(newToken)
    }

    if (!response.ok) {
        const message = response.status === 401?
        "다시 로그인하세요.":response.status ===403?
        "접근 권한이 없습니다.":`요청에 실패했습니다. ${response.status}`

        throw new ApiError(response.status, message)
    }

    return response
}