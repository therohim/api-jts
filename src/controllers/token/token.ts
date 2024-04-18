import { generate } from "../../../config/jwt/jwt";
import { Token } from "../../models/token";
import { created, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse } from "../protocols";

export class TokenController {

  async createToken(): Promise<HttpResponse<Token | string>> {
    try {
      const token = await generate({userName: 'admin'})
      return ok<Token>(token);
    } catch (error) {
      console.log(error)
      return serverError();
    }
  }

}
