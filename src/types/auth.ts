// Matches RegisterDto.cs
export interface RegisterDto {
  name: string;
  email: string;
  phone?: string | null;
  password: string;
}

// Represents the decrypted structured claims inside your client-side session store
export interface CurrentUser {
  customerId: string;
  email: string;
  name: string;
}

// Matches UserDto.cs used for Loginv2 payload
export interface LoginInputDto {
  user_id: string;
  password?: string;
}

export interface RegisterInputDto {
  name: string;
  email: string;
  phone?: string | null;
  password?: string;
}

export interface ApiResponseWrapperDto<T> {
  code: number;
  message?: string | null;
  data: T;
}

export interface AuthResponseDataDto {
  token: string;
}