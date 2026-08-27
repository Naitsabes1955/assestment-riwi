import type { AuthSession } from "@/types";

interface ApiErrorBody {
  readonly error?: {
    readonly message?: string;
  };
}

export class ApiHttpClient {
  public constructor(
    private readonly baseUrl: string,
    private readonly getSession: () => AuthSession | null,
    private readonly setSession: (session: AuthSession | null) => void,
    private readonly sessionExpiredMessage: string,
  ) {}

  async request<T>(
    path: string,
    init: RequestInit = {},
    allowRefresh = true,
  ): Promise<T> {
    const response = await fetch(this.url(path), this.withHeaders(init));

    if (response.status === 401 && allowRefresh) {
      const refreshed = await this.refreshSession();
      return this.parse<T>(
        await fetch(this.url(path), this.withHeaders(init, refreshed.accessToken)),
      );
    }

    return this.parse<T>(response);
  }

  refresh(): Promise<AuthSession> {
    return this.refreshSession();
  }

  private async refreshSession(): Promise<AuthSession> {
    const refreshToken = this.getSession()?.refreshToken;

    if (!refreshToken) {
      this.setSession(null);
      throw new Error(this.sessionExpiredMessage);
    }

    const response = await fetch(this.url("/api/auth/refresh"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      this.setSession(null);
      throw new Error(this.sessionExpiredMessage);
    }

    const session = await this.parse<AuthSession>(response);
    this.setSession(session);
    return session;
  }

  private withHeaders(init: RequestInit, accessToken?: string): RequestInit {
    const headers = new Headers(init.headers);
    const token = accessToken ?? this.getSession()?.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    if (init.body && !headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }

    return { ...init, headers };
  }

  private url(path: string): string {
    return `${this.baseUrl.replace(/\/$/, "")}${path}`;
  }

  private async parse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    const data = text ? (JSON.parse(text) as T & ApiErrorBody) : undefined;

    if (!response.ok) {
      throw new Error(data?.error?.message ?? `HTTP ${response.status}`);
    }

    return data as T;
  }
}
