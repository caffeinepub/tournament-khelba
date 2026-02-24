import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserPreferences {
    emailNotifications: boolean;
    publicProfile: boolean;
    pushNotifications: boolean;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Tournament {
    id: bigint;
    endDate: bigint;
    name: string;
    description: string;
    roomPassword?: string;
    roomVisibilityMinutes?: bigint;
    gameType: string;
    maxParticipants: bigint;
    entryFee: bigint;
    roomId?: string;
    prizePool: bigint;
    startDate: bigint;
}
export interface Payment {
    id: bigint;
    status: PaymentStatus;
    submittedAt: bigint;
    tournamentId: bigint;
    playerPrincipal: Principal;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface TournamentUpdate {
    id: bigint;
    endDate?: bigint;
    name?: string;
    description?: string;
    roomPassword?: string;
    roomVisibilityMinutes?: bigint;
    gameType?: string;
    maxParticipants?: bigint;
    entryFee?: bigint;
    roomId?: string;
    prizePool?: bigint;
    startDate?: bigint;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    bio: string;
    country: string;
    displayName: string;
    email: string;
    preferences: UserPreferences;
    avatarUrl: string;
    phone: string;
}
export enum PaymentStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAdmin(newAdmin: Principal): Promise<void>;
    approvePayment(paymentId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createProfile(profile: UserProfile): Promise<void>;
    createTournament(name: string, description: string, startDate: bigint, endDate: bigint, entryFee: bigint, maxParticipants: bigint, prizePool: bigint, gameType: string, roomId: string | null, roomPassword: string | null, roomVisibilityMinutes: bigint | null): Promise<bigint>;
    deleteOrCloseTournament(id: bigint): Promise<void>;
    deleteProfile(): Promise<void>;
    getAdmins(): Promise<Array<Principal>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyProfile(): Promise<UserProfile | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getSuperAdmin(): Promise<Principal | null>;
    getTournament(id: bigint): Promise<Tournament | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAdmin(principal: Principal): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isProfileComplete(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    isSuperAdmin(principal: Principal): Promise<boolean>;
    listPaymentsByTournament(tournamentId: bigint): Promise<Array<Payment>>;
    listPendingPayments(): Promise<Array<Payment>>;
    listTournaments(): Promise<Array<Tournament>>;
    rejectPayment(paymentId: bigint): Promise<void>;
    removeAdmin(adminToRemove: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setRoomCredentials(tournamentId: bigint, roomId: string | null, roomPassword: string | null, roomVisibilityMinutes: bigint | null): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitPayment(tournamentId: bigint): Promise<bigint>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateProfile(profile: UserProfile): Promise<void>;
    updateTournament(update: TournamentUpdate): Promise<void>;
    uploadResults(tournamentId: bigint, results: string): Promise<void>;
}
