import type { AuthenticatedUser } from "./auth";
import type { Customer } from "./customer";

declare module "#auth-utils" {
  interface User extends AuthenticatedUser {}

  interface SecureSessionData {
    refresh_token?: string | null;
  }

  interface UserSession {
    user?: AuthenticatedUser;
    customer?: Customer | null;
    token?: string | null;
    access_token?: string | null;
    refresh_token?: string | null;
    session?: {
      access_token?: string | null;
      refresh_token?: string | null;
      expires_in?: number | null;
      token_type?: string | null;
      scope?: string | null;
      [key: string]: unknown;
    };
  }
}

export {};
