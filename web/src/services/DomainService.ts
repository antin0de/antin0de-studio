import { ApiService } from "../api/ApiService";

export interface Domain {
  id: string;
  fqdn: string;
  createdAt: string;
}

export class DomainService {
  static async listDomains(): Promise<Domain[]> {
    const response = await ApiService.get<{ domains: Domain[] }>("/v1/domains");
    return response.domains;
  }
}
