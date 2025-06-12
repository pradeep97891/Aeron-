export interface Flight {
  id: number;
  flightNumber: string;
  aircraft: string;
  origin: string;
  destination: string;
  originName: string;
  destinationName: string;
  departureTime: string;
  departureDate: string;
  status: "Cancelled" | "Delayed" | "Diverted";
  statusDetail?: string | null;
  priority: "Critical" | "High" | "Medium";
  passengers: number;
  connections: number;
  impactSeverity: string;
  impactTimestamp: Date;
  updatedAt: Date;
}

export interface FlightFilters {
  search: string;
  status: string;
  priority: string;
  origin: string;
  sortBy: string;
}

export interface RecoveryOption {
  id: number;
  type: string;
  description: string;
  cost: string;
  passengerImpact: string;
}

export interface RecoveryResponse {
  affectedFlights: number;
  totalPassengers: number;
  estimatedRecoveryTime: string;
  options: RecoveryOption[];
}
