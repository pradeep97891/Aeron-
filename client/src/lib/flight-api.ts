import { apiRequest } from "./queryClient";
import type { Flight } from "@/types/flight";

export const flightApi = {
  async getFlights(): Promise<Flight[]> {
    const response = await apiRequest("GET", "/api/flights");
    return response.json();
  },

  async getFlight(id: number): Promise<Flight> {
    const response = await apiRequest("GET", `/api/flights/${id}`);
    return response.json();
  },

  async searchFlights(query: string): Promise<Flight[]> {
    const response = await apiRequest("GET", `/api/flights/search/${encodeURIComponent(query)}`);
    return response.json();
  },

  async filterFlights(filters: {
    status?: string;
    priority?: string;
    origin?: string;
  }): Promise<Flight[]> {
    const response = await apiRequest("POST", "/api/flights/filter", filters);
    return response.json();
  },

  async generateRecoveryOptions(flightIds: number[]): Promise<{
    affectedFlights: number;
    totalPassengers: number;
    estimatedRecoveryTime: string;
    options: Array<{
      id: number;
      type: string;
      description: string;
      cost: string;
      passengerImpact: string;
    }>;
  }> {
    const response = await apiRequest("POST", "/api/flights/recovery", { flightIds });
    return response.json();
  },

  async updateFlight(id: number, updates: Partial<Flight>): Promise<Flight> {
    const response = await apiRequest("PATCH", `/api/flights/${id}`, updates);
    return response.json();
  },

  async deleteFlight(id: number): Promise<void> {
    await apiRequest("DELETE", `/api/flights/${id}`);
  },
};
