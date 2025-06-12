import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFlightSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all flights
  app.get("/api/flights", async (req, res) => {
    try {
      const flights = await storage.getFlights();
      res.json(flights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flights" });
    }
  });

  // Get flight by ID
  app.get("/api/flights/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid flight ID" });
        return;
      }

      const flight = await storage.getFlight(id);
      if (!flight) {
        res.status(404).json({ message: "Flight not found" });
        return;
      }

      res.json(flight);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flight" });
    }
  });

  // Search flights
  app.get("/api/flights/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      if (!query || query.trim().length === 0) {
        const flights = await storage.getFlights();
        res.json(flights);
        return;
      }

      const flights = await storage.searchFlights(query);
      res.json(flights);
    } catch (error) {
      res.status(500).json({ message: "Failed to search flights" });
    }
  });

  // Filter flights
  app.post("/api/flights/filter", async (req, res) => {
    try {
      const filters = req.body;
      const flights = await storage.filterFlights(filters);
      res.json(flights);
    } catch (error) {
      res.status(500).json({ message: "Failed to filter flights" });
    }
  });

  // Create flight
  app.post("/api/flights", async (req, res) => {
    try {
      const result = insertFlightSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ message: "Invalid flight data", errors: result.error.errors });
        return;
      }

      const flight = await storage.createFlight(result.data);
      res.status(201).json(flight);
    } catch (error) {
      res.status(500).json({ message: "Failed to create flight" });
    }
  });

  // Update flight
  app.patch("/api/flights/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid flight ID" });
        return;
      }

      const flight = await storage.updateFlight(id, req.body);
      if (!flight) {
        res.status(404).json({ message: "Flight not found" });
        return;
      }

      res.json(flight);
    } catch (error) {
      res.status(500).json({ message: "Failed to update flight" });
    }
  });

  // Delete flight
  app.delete("/api/flights/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid flight ID" });
        return;
      }

      const deleted = await storage.deleteFlight(id);
      if (!deleted) {
        res.status(404).json({ message: "Flight not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete flight" });
    }
  });

  // Generate recovery options for selected flights
  app.post("/api/flights/recovery", async (req, res) => {
    try {
      const { flightIds } = req.body;
      if (!Array.isArray(flightIds) || flightIds.length === 0) {
        res.status(400).json({ message: "Flight IDs are required" });
        return;
      }

      // Simulate recovery option generation
      const recoveryOptions = {
        affectedFlights: flightIds.length,
        totalPassengers: 0,
        estimatedRecoveryTime: "4-6 hours",
        options: [
          {
            id: 1,
            type: "Aircraft Substitution",
            description: "Replace cancelled flights with available aircraft",
            cost: "$125,000",
            passengerImpact: "Minimal delays"
          },
          {
            id: 2,
            type: "Route Optimization",
            description: "Optimize routes to minimize delays",
            cost: "$75,000",
            passengerImpact: "15-30 minute delays"
          }
        ]
      };

      res.json(recoveryOptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate recovery options" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
