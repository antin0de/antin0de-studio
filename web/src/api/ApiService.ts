const API_ENDPOINT = "http://localhost:8080";

export class ApiService {
  static async get<T>(path: string): Promise<T> {
    const response = await fetch(`${API_ENDPOINT}${path}`, {
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(response.statusText);
    }
  }

  static async post<T, K>(path: string, body: T): Promise<K> {
    const response = await fetch(`${API_ENDPOINT}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(response.statusText);
    }
  }

  static async put<T, K>(path: string, body: T): Promise<K> {
    const response = await fetch(`${API_ENDPOINT}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(response.statusText);
    }
  }

  static async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${API_ENDPOINT}${path}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(response.statusText);
    }
  }
}
