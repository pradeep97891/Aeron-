import { AlertTriangle, Users, Link, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatisticsCardsProps {
  criticalFlights: number;
  totalPassengers: number;
  totalConnections: number;
  avgDelay: number;
}

export function StatisticsCards({ 
  criticalFlights, 
  totalPassengers, 
  totalConnections, 
  avgDelay 
}: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Flights</p>
              <p className="text-3xl font-bold text-gray-900">{criticalFlights}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Passengers</p>
              <p className="text-3xl font-bold text-gray-900">{totalPassengers.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <Link className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Connections</p>
              <p className="text-3xl font-bold text-gray-900">{totalConnections}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Delay</p>
              <p className="text-3xl font-bold text-gray-900">{avgDelay}m</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
