import { User } from "../../models/user";

export interface CreateUserParams {
  userName: string;
  accountNumber: string;
  emailAddress: string;
  identityNumber: string;
}

export interface UpdateUserParams {
  userName: string;
  accountNumber: string;
  emailAddress: string;
  identityNumber: string;
}

export interface IUserRepository {
  createUser(params: CreateUserParams): Promise<User>;
  deleteUser(id: string): Promise<User>;
  getUsers(): Promise<User[]>;
  updateUser(id: string, params: UpdateUserParams): Promise<User>;
  getUserByAccountNumber(accountNumber: string): Promise<User>;
  getUserByIdentityNumber(identityNumber: string): Promise<User>;
}
