import { useState } from "react";
import { ArrowRight, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { Flight } from "@/types/flight";

interface FlightTableProps {
  flights: Flight[];
  selectedFlights: number[];
  onSelectionChange: (selected: number[]) => void;
  isLoading: boolean;
}

export function FlightTable({ flights, selectedFlights, onSelectionChange, isLoading }: FlightTableProps) {
  const [sortColumn, setSortColumn] = useState<string>("priority");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(flights.map(f => f.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectFlight = (flightId: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedFlights, flightId]);
    } else {
      onSelectionChange(selectedFlights.filter(id => id !== flightId));
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Delayed":
        return "bg-yellow-100 text-yellow-800";
      case "Diverted":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500 text-white";
      case "High":
        return "bg-yellow-500 text-white";
      case "Medium":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getImpactColor = (severity: string) => {
    if (severity.includes("high")) {
      return { text: "text-red-700", dot: "bg-red-500" };
    }
    return { text: "text-green-700", dot: "bg-green-500" };
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(timestamp).getTime()) / (1000 * 60));
    return `${diff} mins ago`;
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) {
      return null;
    }
    return sortDirection === "desc" ? 
      <ChevronDown className="w-4 h-4 inline ml-1 text-primary" /> :
      <ChevronUp className="w-4 h-4 inline ml-1 text-primary" />;
  };

  const allSelected = flights.length > 0 && selectedFlights.length === flights.length;
  const someSelected = selectedFlights.length > 0 && selectedFlights.length < flights.length;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Flight Selection</h3>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading flights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Flight Selection <span className="text-gray-500 font-normal">({selectedFlights.length} selected)</span>
          </h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleSelectAll(!allSelected)}
          >
            Select All
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  ref={(el) => {
                    if (el) {
                      el.indeterminate = someSelected;
                    }
                  }}
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("flightNumber")}
              >
                Flight
                <SortIcon column="flightNumber" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("origin")}
              >
                Route
                <SortIcon column="origin" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("departureTime")}
              >
                Departure
                <SortIcon column="departureTime" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("status")}
              >
                Status
                <SortIcon column="status" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("priority")}
              >
                Priority
                <SortIcon column="priority" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("passengers")}
              >
                Passengers
                <SortIcon column="passengers" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Impact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flights.map((flight) => {
              const impactColors = getImpactColor(flight.impactSeverity);
              const isSelected = selectedFlights.includes(flight.id);
              
              return (
                <tr key={flight.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectFlight(flight.id, checked as boolean)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{flight.flightNumber}</div>
                      <div className="text-xs text-gray-500">{flight.aircraft}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{flight.origin}</span>
                      <ArrowRight className="w-4 h-4 inline mx-2 text-gray-400" />
                      <span className="font-medium">{flight.destination}</span>
                    </div>
                    <div className="text-xs text-gray-500">{flight.originName} → {flight.destinationName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{flight.departureTime}</div>
                    <div className="text-xs text-gray-500">{flight.departureDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={`${getStatusColor(flight.status)} border-0`}>
                      {flight.status}
                      {flight.statusDetail && (
                        <span className="ml-1 text-opacity-80">{flight.statusDetail}</span>
                      )}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={`${getPriorityColor(flight.priority)} border-0`}>
                      {flight.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{flight.passengers}</div>
                    <div className="text-xs text-gray-500">{flight.connections} connections</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${impactColors.dot}`}></div>
                      <div>
                        <div className={`text-xs font-medium ${impactColors.text}`}>{flight.impactSeverity}</div>
                        <div className="text-xs text-gray-500">{formatTimestamp(flight.impactTimestamp)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
