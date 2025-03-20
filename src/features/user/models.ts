export interface IAuthForm {
  email: string;
  password: string;
}

export interface ILoginResponse {
  access_token: string;
}

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export enum UserRole {
  User = 'USER',
  Reviewer = 'REVIEWER',
}
