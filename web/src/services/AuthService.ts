import { ApiService } from "../api/ApiService";

export class AuthService {
  static async login(password: string): Promise<void> {
    await ApiService.post("/v1/login", {
      password,
    });
  }

  static async getLoginStatus(): Promise<boolean> {
    const response = await ApiService.get<{ loggedin: boolean }>(
      "/v1/loginStatus"
    );
    return response.loggedin;
  }
}
