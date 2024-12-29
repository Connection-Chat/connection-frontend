export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignUpUser
  extends Pick<User, "fullName" | "email" | "profilePic"> {}

export interface AuthUser extends Pick<User, "fullName" | "email"> {
  password: string;
}

export interface LoginUser extends Pick<AuthUser, "email" | "password"> {}

export interface UpdateUser extends Pick<User, "profilePic"> {}
