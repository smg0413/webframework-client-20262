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

export default async function apiFetch(path: string, options: ApiOptions = {}): Promise<Response> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL을 설정하세요.")
    }

    const { accessToken, ...init } = options
    const headers = new Headers(init.headers)

    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`)
    }

    const response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers,
        credentials: init.credentials ?? "omit",
        cache: init.cache
    })

    if (!response.ok) {
        const message = response.status === 401?
        "다시 로그인하세요.":response.status ===403?
        "접근 권한이 없습니다.":`요청에 실패했습니다. ${response.status}`

        throw new ApiError(response.status, message)
    }

    return response
}