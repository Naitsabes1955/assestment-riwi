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
    private readonly apiUnavailableMessage: string,
  ) {}

  async request<T>(
    path: string,
    init: RequestInit = {},
    allowRefresh = true,
  ): Promise<T> {
    const method = init.method ?? "GET";
    const response = await this.fetchWithDiagnostics(path, init);

    if (response.status === 401 && allowRefresh) {
      const refreshed = await this.refreshSession();
      return this.parse<T>(
        await this.fetchWithDiagnostics(path, init, refreshed.accessToken),
        path,
        method,
      );
    }

    return this.parse<T>(response, path, method);
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

    const response = await this.fetchWithDiagnostics(
      "/api/auth/refresh",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      },
      undefined,
      false,
    );

    if (!response.ok) {
      this.setSession(null);
      throw new Error(this.sessionExpiredMessage);
    }

    const session = await this.parse<AuthSession>(response, "/api/auth/refresh", "POST");
    this.setSession(session);
    return session;
  }

  private async fetchWithDiagnostics(
    path: string,
    init: RequestInit = {},
    accessToken?: string,
    allowApiUnavailableMessage = true,
  ): Promise<Response> {
    const method = init.method ?? "GET";

    try {
      return await fetch(this.url(path), this.withHeaders(init, accessToken));
    } catch (error) {
      this.logApiIssue(path, method, "network", error);

      if (allowApiUnavailableMessage) {
        throw new Error(this.apiUnavailableMessage);
      }

      throw error;
    }
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

  private async parse<T>(response: Response, path: string, method: string): Promise<T> {
    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    const data = this.parseJson<T & ApiErrorBody>(text, path, response.status);

    if (!response.ok) {
      this.logApiIssue(path, method, response.status, data?.error?.message);
      throw new Error(data?.error?.message ?? `HTTP ${response.status}`);
    }

    return data as T;
  }

  private parseJson<T>(text: string, path: string, status: number): T | undefined {
    if (!text) {
      return undefined;
    }

    try {
      return JSON.parse(text) as T;
    } catch (error) {
      this.logApiIssue(path, "parse", status, error);
      throw new Error(`Invalid API response from ${path}`);
    }
  }

  private logApiIssue(
    path: string,
    methodOrPhase: string,
    status: number | "network",
    detail: unknown,
  ): void {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    console.error("[api]", {
      detail,
      endpoint: path,
      methodOrPhase,
      status,
    });
  }
}
