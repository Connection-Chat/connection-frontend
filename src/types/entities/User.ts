export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
}

export interface SignUpUser extends Omit<User, "_id" | "profilePic"> {}

export interface AuthUser extends Pick<User, "fullName" | "email"> {
  password: string;
}
