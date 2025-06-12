import { flights, type Flight, type InsertFlight } from "@shared/schema";

export interface IStorage {
  getFlights(): Promise<Flight[]>;
  getFlight(id: number): Promise<Flight | undefined>;
  createFlight(flight: InsertFlight): Promise<Flight>;
  updateFlight(id: number, flight: Partial<InsertFlight>): Promise<Flight | undefined>;
  deleteFlight(id: number): Promise<boolean>;
  searchFlights(query: string): Promise<Flight[]>;
  filterFlights(filters: {
    status?: string;
    priority?: string;
    origin?: string;
  }): Promise<Flight[]>;
}

export class MemStorage implements IStorage {
  private flights: Map<number, Flight>;
  private currentId: number;

  constructor() {
    this.flights = new Map();
    this.currentId = 1;
    this.initializeData();
  }

  private initializeData(): void {
    const sampleFlights: InsertFlight[] = [
      {
        flightNumber: "EK203",
        aircraft: "B777-300ER",
        origin: "JFK",
        destination: "LHR",
        originName: "New York",
        destinationName: "London",
        departureTime: "16:45",
        departureDate: "Jun 6",
        status: "Cancelled",
        statusDetail: null,
        priority: "Critical",
        passengers: 354,
        connections: 8,
        impactSeverity: "high severity",
        impactTimestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
      },
      {
        flightNumber: "EK215",
        aircraft: "A380-800",
        origin: "JFK",
        destination: "DXB",
        originName: "New York",
        destinationName: "Dubai",
        departureTime: "15:30",
        departureDate: "Jun 6",
        status: "Delayed",
        statusDetail: "+120m",
        priority: "High",
        passengers: 487,
        connections: 12,
        impactSeverity: "high severity",
        impactTimestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 mins ago
      },
      {
        flightNumber: "EK235",
        aircraft: "A380-800",
        origin: "DXB",
        destination: "JFK",
        originName: "Dubai",
        destinationName: "New York",
        departureTime: "08:30",
        departureDate: "Jun 6",
        status: "Diverted",
        statusDetail: "+180m",
        priority: "High",
        passengers: 511,
        connections: 15,
        impactSeverity: "medium severity",
        impactTimestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 mins ago
      },
      {
        flightNumber: "EK147",
        aircraft: "B777-300ER",
        origin: "LHR",
        destination: "DXB",
        originName: "London",
        destinationName: "Dubai",
        departureTime: "21:15",
        departureDate: "Jun 6",
        status: "Delayed",
        statusDetail: "+45m",
        priority: "Medium",
        passengers: 342,
        connections: 6,
        impactSeverity: "medium severity",
        impactTimestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 mins ago
      },
      {
        flightNumber: "EK181",
        aircraft: "A350-900",
        origin: "DXB",
        destination: "SIN",
        originName: "Dubai",
        destinationName: "Singapore",
        departureTime: "14:20",
        departureDate: "Jun 6",
        status: "Delayed",
        statusDetail: "+90m",
        priority: "Medium",
        passengers: 298,
        connections: 4,
        impactSeverity: "medium severity",
        impactTimestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
      },
    ];

    sampleFlights.forEach((flight) => {
      this.createFlight(flight);
    });
  }

  async getFlights(): Promise<Flight[]> {
    return Array.from(this.flights.values()).sort((a, b) => {
      // Sort by priority (Critical > High > Medium), then by timestamp
      const priorityOrder = { Critical: 3, High: 2, Medium: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return new Date(b.impactTimestamp).getTime() - new Date(a.impactTimestamp).getTime();
    });
  }

  async getFlight(id: number): Promise<Flight | undefined> {
    return this.flights.get(id);
  }

  async createFlight(insertFlight: InsertFlight): Promise<Flight> {
    const id = this.currentId++;
    const flight: Flight = {
      ...insertFlight,
      id,
      updatedAt: new Date(),
    };
    this.flights.set(id, flight);
    return flight;
  }

  async updateFlight(id: number, update: Partial<InsertFlight>): Promise<Flight | undefined> {
    const existing = this.flights.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: Flight = {
      ...existing,
      ...update,
      updatedAt: new Date(),
    };
    this.flights.set(id, updated);
    return updated;
  }

  async deleteFlight(id: number): Promise<boolean> {
    return this.flights.delete(id);
  }

  async searchFlights(query: string): Promise<Flight[]> {
    const allFlights = await this.getFlights();
    const searchTerm = query.toLowerCase();
    
    return allFlights.filter(flight => 
      flight.flightNumber.toLowerCase().includes(searchTerm) ||
      flight.origin.toLowerCase().includes(searchTerm) ||
      flight.destination.toLowerCase().includes(searchTerm) ||
      flight.originName.toLowerCase().includes(searchTerm) ||
      flight.destinationName.toLowerCase().includes(searchTerm)
    );
  }

  async filterFlights(filters: {
    status?: string;
    priority?: string;
    origin?: string;
  }): Promise<Flight[]> {
    const allFlights = await this.getFlights();
    
    return allFlights.filter(flight => {
      if (filters.status && filters.status !== "All Statuses" && flight.status !== filters.status) {
        return false;
      }
      if (filters.priority && filters.priority !== "All Priorities" && flight.priority !== filters.priority) {
        return false;
      }
      if (filters.origin && filters.origin !== "All Origins" && flight.origin !== filters.origin) {
        return false;
      }
      return true;
    });
  }
}

export const storage = new MemStorage();
