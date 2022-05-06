export interface User {
    _id?: string;
    userName: string;
    fullName: string;
    email: string;
    password: string;
}

export interface AuthenticationInformation {
    token: string;
    expirationDate: number;
}

export interface AuthenticationResponse {
    authentication: AuthenticationInformation | null;
    user: User | null;
}

export interface LoginData {
    username: string | "",
    password: string | ""
}