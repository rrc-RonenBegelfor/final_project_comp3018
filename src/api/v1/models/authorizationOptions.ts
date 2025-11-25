/**
 * @param hasRole - An array of allowed roles (limited to 'admin', 'manager', 'historian', and 'user')
 * @param allowSameUser - Optional boolean flag indicating whether a user can access their own resources
 * @example { hasRole: ["admin", "manager"], allowSameUser: true } as AuthorizationOptions
 */
export interface AuthorizationOptions {
    hasRole: Array<"admin" | "manager" | "historian" | "user">;
    allowSameUser?: boolean;
}
