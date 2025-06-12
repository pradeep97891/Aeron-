import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw, Download, Zap } from "lucide-react";
import { StatisticsCards } from "./statistics-cards";
import { FlightFilters } from "./flight-filters";
import { FlightTable } from "./flight-table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { flightApi } from "@/lib/flight-api";
import type { Flight } from "@/types/flight";

interface FlightFilters {
  search: string;
  status: string;
  priority: string;
  origin: string;
  sortBy: string;
}

export function FlightDashboard() {
  const { toast } = useToast();
  const [selectedFlights, setSelectedFlights] = useState<number[]>([]);
  const [filters, setFilters] = useState<FlightFilters>({
    search: "",
    status: "All Statuses",
    priority: "All Priorities", 
    origin: "All Origins",
    sortBy: "Priority"
  });

  const { data: flights = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/flights"],
    queryFn: () => flightApi.getFlights(),
  });

  const criticalFlights = flights.filter(f => f.priority === "Critical").length;
  const totalPassengers = flights.reduce((sum, f) => sum + f.passengers, 0);
  const totalConnections = flights.reduce((sum, f) => sum + f.connections, 0);
  
  // Calculate average delay
  const delayedFlights = flights.filter(f => f.statusDetail && f.statusDetail.includes("m"));
  const avgDelay = delayedFlights.length > 0 
    ? Math.round(delayedFlights.reduce((sum, f) => {
        const match = f.statusDetail?.match(/\+(\d+)m/);
        return sum + (match ? parseInt(match[1]) : 0);
      }, 0) / delayedFlights.length)
    : 0;

  const handleRefresh = async () => {
    try {
      await refetch();
      toast({
        title: "Data refreshed",
        description: "Flight data has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh flight data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateRecovery = async () => {
    if (selectedFlights.length === 0) {
      toast({
        title: "No flights selected",
        description: "Please select at least one flight to generate recovery options.",
        variant: "destructive",
      });
      return;
    }

    try {
      const recoveryOptions = await flightApi.generateRecoveryOptions(selectedFlights);
      toast({
        title: "Recovery options generated",
        description: `Generated ${recoveryOptions.options.length} recovery options for ${recoveryOptions.affectedFlights} flights.`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate recovery options. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    // Create CSV export
    const headers = ["Flight", "Route", "Departure", "Status", "Priority", "Passengers", "Impact"];
    const csvData = flights.map(flight => [
      flight.flightNumber,
      `${flight.origin} → ${flight.destination}`,
      `${flight.departureTime} ${flight.departureDate}`,
      flight.status + (flight.statusDetail ? ` ${flight.statusDetail}` : ""),
      flight.priority,
      flight.passengers.toString(),
      flight.impactSeverity
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `affected-flights-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Flight data has been exported to CSV.",
    });
  };

  // Filter and sort flights
  let filteredFlights = flights;
  
  if (filters.search) {
    filteredFlights = filteredFlights.filter(flight =>
      flight.flightNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
      flight.origin.toLowerCase().includes(filters.search.toLowerCase()) ||
      flight.destination.toLowerCase().includes(filters.search.toLowerCase()) ||
      flight.originName.toLowerCase().includes(filters.search.toLowerCase()) ||
      flight.destinationName.toLowerCase().includes(filters.search.toLowerCase())
    );
  }
  
  if (filters.status !== "All Statuses") {
    filteredFlights = filteredFlights.filter(flight => flight.status === filters.status);
  }
  
  if (filters.priority !== "All Priorities") {
    filteredFlights = filteredFlights.filter(flight => flight.priority === filters.priority);
  }
  
  if (filters.origin !== "All Origins") {
    filteredFlights = filteredFlights.filter(flight => flight.origin === filters.origin);
  }

  // Sort flights
  filteredFlights.sort((a, b) => {
    switch (filters.sortBy) {
      case "Priority":
        const priorityOrder = { Critical: 3, High: 2, Medium: 1 };
        return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
               (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
      case "Departure Time":
        return a.departureTime.localeCompare(b.departureTime);
      case "Flight Number":
        return a.flightNumber.localeCompare(b.flightNumber);
      case "Status":
        return a.status.localeCompare(b.status);
      case "Passengers":
        return b.passengers - a.passengers;
      default:
        return 0;
    }
  });

  const highPriorityCount = flights.filter(f => f.priority === "Critical" || f.priority === "High").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">AERON</h1>
                <p className="text-xs text-gray-500">Adaptive airline recovery with intelligent operational navigation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center px-3 py-1 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
                <span className="text-sm font-medium text-orange-800">{flights.length} Flights Affected</span>
                <span className="ml-2 text-xs text-orange-600">{highPriorityCount} High Priority</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Affected Flights Overview</h2>
              <p className="text-gray-600 mt-1">Select flights to generate AERON recovery options</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">{filteredFlights.length} flights affected</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <StatisticsCards
          criticalFlights={criticalFlights}
          totalPassengers={totalPassengers}
          totalConnections={totalConnections}
          avgDelay={avgDelay}
        />

        {/* Filters */}
        <FlightFilters 
          filters={filters}
          onFiltersChange={setFilters}
          flights={flights}
        />

        {/* Flight Table */}
        <FlightTable
          flights={filteredFlights}
          selectedFlights={selectedFlights}
          onSelectionChange={setSelectedFlights}
          isLoading={isLoading}
        />

        {/* Action Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recovery Actions</h3>
              <p className="text-sm text-gray-600 mt-1">Generate and apply AERON recovery solutions for selected flights</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button onClick={handleGenerateRecovery}>
                <Zap className="w-4 h-4 mr-2" />
                Generate Recovery Options
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
