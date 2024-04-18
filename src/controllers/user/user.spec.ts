import { User } from "../../models/user";
import { CreateUserParams, IUserRepository, UpdateUserParams } from "./protocols";
import { UserController } from "./user";
import { HttpStatusCode } from "../protocols";

class UserRepositoryMock implements IUserRepository {
  async createUser(params: CreateUserParams): Promise<User> {
    return Promise.resolve({
      id: "user-id",
      userName: params.userName || "Tom",
      accountNumber: params.accountNumber || "812937",
      emailAddress: "tom.cruise@example.com",
      identityNumber: params.identityNumber || "12313123",
    });
  }
  async deleteUser(id: string): Promise<User> {
    return Promise.resolve({
      id: "user-id",
      userName: "Tom",
      accountNumber: "812937",
      emailAddress: "tom.cruise@example.com",
      identityNumber: "12313123",
    });
  }
  async getUsers(): Promise<User[]> {
    return Promise.resolve([{
      id: "user-id",
      userName: "Tom",
      accountNumber: "812937",
      emailAddress: "tom.cruise@example.com",
      identityNumber: "12313123",
    }]);
  }
  async updateUser(id: string, params: UpdateUserParams): Promise<User> {
    return Promise.resolve({
      id: "user-id",
      userName: params.userName || "Tom",
      accountNumber: params.accountNumber || "812937",
      emailAddress: "tom.cruise@example.com",
      identityNumber: params.identityNumber || "12313123",
    });
  }
  async getUserByAccountNumber(accountNumber: string): Promise<User> {
    return Promise.resolve({
      id: "user-id",
      userName: "Tom",
      accountNumber: "812937",
      emailAddress: "tom.cruise@example.com",
      identityNumber: "12313123",
    });
  }
  
  async getUserByIdentityNumber(accountNumber: string): Promise<User> {
    return Promise.resolve({
      id: "user-id",
      userName: "Tom",
      accountNumber: "812937",
      emailAddress: "tom.cruise@example.com",
      identityNumber: "12313123",
    });
  }
}

describe("UserController:Create User", () => {
  it("should return 400 if email is invalid", async () => {
    const controller = new UserController(new UserRepositoryMock());
    const response = await controller.create({
      body: {
        userName: "Tom",
        accountNumber: "812937",
        emailAddress: "invalid-email",
        identityNumber: "12313123",
      },
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe("E-mail is invalid");
  });

  it("should create user and return 200 if input is valid", async () => {
    const controller = new UserController(new UserRepositoryMock());
    const validBody : CreateUserParams = {
      userName: "Tom",
      accountNumber: "812937",
      emailAddress: "tom.cruise@example.com",
      identityNumber: "12313123",
    };
    const response = await controller.create({body: validBody});
    expect(response.statusCode).toBe(HttpStatusCode.OK);
    const user : User = {
      id: "user-id",
      userName: "Tom",
      accountNumber: "812937",
      emailAddress: "tom.cruise@example.com",
      identityNumber: "12313123",
    }
    expect(response.body).toEqual(user);
  });
});