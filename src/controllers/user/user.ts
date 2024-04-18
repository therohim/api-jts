import validator from "validator";

import { User } from "../../models/user";
import { badRequest, created, serverError, ok } from "../helpers";
import { HttpRequest, HttpResponse } from "../protocols";
import { CreateUserParams, IUserRepository, UpdateUserParams } from "./protocols";

export class UserController {

  constructor(private readonly userRepository: IUserRepository) {}

  async list(): Promise<HttpResponse<User[] | string>> {
    try {
      const users = await this.userRepository.getUsers();

      return ok<User[]>(users);
    } catch (error) {
      return serverError();
    }
  }

  async create(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User | string>> {
    try {
      const requiredFields = ["userName", "accountNumber", "emailAddress", "identityNumber"];

      for (const field of requiredFields) {
        if (!httpRequest?.body?.[field as keyof CreateUserParams]?.length) {
          return badRequest(`Field ${field} is required`);
        }
      }

      const emailIsValid = validator.isEmail(httpRequest.body!.emailAddress);

      if (!emailIsValid) {
        return badRequest("E-mail is invalid");
      }

      const user = await this.userRepository.createUser(
        httpRequest.body!
      );

      return created<User>(user);
    } catch (error) {
      console.log(error)
      return serverError();
    }
  }

  async delete(
    httpRequest: HttpRequest<any>
  ): Promise<HttpResponse<User | string>> {
    try {
      const id = httpRequest?.params?.id;

      if (!id) {
        return badRequest("Missing user id");
      }

      const user = await this.userRepository.deleteUser(id);

      return ok<User>(user);
    } catch (error) {
      return serverError();
    }
  }

  async update(
    httpRequest: HttpRequest<UpdateUserParams>
  ): Promise<HttpResponse<User | string>> {
    try {
      const id = httpRequest?.params?.id;
      const body = httpRequest?.body;

      if (!body) {
        return badRequest("Missing fields.");
      }

      if (!id) {
        return badRequest("Missing user id");
      }

      const allowedFieldsToUpdate: (keyof UpdateUserParams)[] = [
        "userName",
        "accountNumber",
        "emailAddress",
        "identityNumber",
      ];

      const someFieldIsNotAllowedToUpdate = Object.keys(body).some(
        (key) => !allowedFieldsToUpdate.includes(key as keyof UpdateUserParams)
      );

      if (someFieldIsNotAllowedToUpdate) {
        return badRequest("Some received field is not allowed");
      }

      const user = await this.userRepository.updateUser(id, body);

      return ok<User>(user);
    } catch (error) {
      console.log(error)
      return serverError();
    }
  }

  async getUserByAccountNumber(
    httpRequest: HttpRequest<any>
  ): Promise<HttpResponse<User | string>> {
    try {
      const accountNumber = httpRequest?.params?.identity;

      if (!accountNumber) {
        return badRequest("Missing account number");
      }

      const user = await this.userRepository.getUserByAccountNumber(accountNumber);

      return ok<User>(user);
    } catch (error:any) {
      return serverError(error.message);
    }
  }

  async getUserByIdentityNumber(
    httpRequest: HttpRequest<any>
  ): Promise<HttpResponse<User | string>> {
    try {
      const identityNumber = httpRequest?.params?.identity;

      if (!identityNumber) {
        return badRequest("Missing account number");
      }

      const user = await this.userRepository.getUserByIdentityNumber(identityNumber);

      return ok<User>(user);
    } catch (error:any) {
      console.log(error)
      return serverError(error.message);
    }
  }

}
