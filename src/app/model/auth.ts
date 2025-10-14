// LOGIN
export interface LoginApiResponse {
  data: {
    token: string;
    expirationDate: string;
    roles: string[];
  };
  success: boolean;
  errorMessage: string;
}
export interface LoginRequestBody {
  username: string;
  password: string;
}

//REGISTER
//usado en register
export interface RegisterApiResponse {
  data: {
    userId: string;
    token: string;
    expirationDate: string;
    roles: string[];
  };
  success: boolean;
  errorMessage: string;
}

//usado en register
export interface RegisterRequestBody {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  confirmPassword: string;
}

//FORGOT PASSWORD
export interface ForgotPasswordApiResponse {
  success: boolean;
  errorMessage: string;
}

export interface ChangePasswordApiResponse {
  success: boolean;
  errorMessage: string;
}

//FORGOT PASSWORD
export interface ForgotPasswordRequestBody {
  numeroDocumento: string;
}

export interface ChangePasswordRequestBody {
  oldPassword: string;
  newPassword: string;
}
