import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAdmin(principalText: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getMyPrincipal(): Promise<string>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isProfileComplete(): Promise<boolean>;
    registerForTournament(_tournamentId: string): Promise<void>;
    removeAdmin(principalText: string): Promise<void>;
}
