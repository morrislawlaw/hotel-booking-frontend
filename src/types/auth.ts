// Matches UserDto.cs used for Loginv2 payload
export interface UserLoginDto {
  user_id?: string | null;
  password?: string | null;
  Email?: string | null;
}

// Matches RegisterDto.cs
export interface RegisterDto {
  Name: string;
  Email: string;
  Phone?: string | null;
  Password: string;
}

// Represents the decrypted structured claims inside your client-side session store
export interface CurrentUser {
  customerId: string;
  email: string;
  name: string;
}