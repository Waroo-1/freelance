import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProfileSchema, insertGigSchema, insertProjectSchema, registrationProfileSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, accountType, firstName, lastName, country, phone } = req.body;

      // Validate user data
      const userValidation = insertUserSchema.safeParse({ email, password, accountType });
      if (!userValidation.success) {
        return res.status(400).json({ error: "Invalid user data", details: userValidation.error.errors });
      }

      // Validate profile data with Zod
      const profileValidation = registrationProfileSchema.safeParse({ firstName, lastName, country, phone });
      if (!profileValidation.success) {
        return res.status(400).json({ error: "Invalid profile data", details: profileValidation.error.errors });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // NOTE: In production, hash passwords using bcrypt or argon2 before storing
      const user = await storage.createUser({
        email,
        password,
        accountType,
      });

      // Create profile with userId attached
      const profile = await storage.createProfile({
        userId: user.id,
        firstName,
        lastName,
        country,
        phone,
      });

      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, profile });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const profile = await storage.getProfile(user.id);

      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, profile });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/connect-wallet", async (req, res) => {
    try {
      const { userId, walletAddress } = req.body;

      const user = await storage.updateUserWallet(userId, walletAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Wallet connection error:", error);
      res.status(500).json({ error: "Wallet connection failed" });
    }
  });

  // Profile Routes
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.patch("/api/profile/:id", async (req, res) => {
    try {
      // Validate partial profile data
      const validatedData = insertProfileSchema.partial().parse(req.body);
      const profile = await storage.updateProfile(req.params.id, validatedData);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  app.get("/api/freelancers", async (req, res) => {
    try {
      const profiles = await storage.getAllFreelancerProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch freelancers" });
    }
  });

  // Gig Routes
  app.get("/api/gigs", async (req, res) => {
    try {
      const { freelancerId } = req.query;
      if (freelancerId) {
        const gigs = await storage.getGigsByFreelancer(freelancerId as string);
        return res.json(gigs);
      }
      const gigs = await storage.getAllGigs();
      res.json(gigs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gigs" });
    }
  });

  app.get("/api/gigs/:id", async (req, res) => {
    try {
      const gig = await storage.getGig(req.params.id);
      if (!gig) {
        return res.status(404).json({ error: "Gig not found" });
      }
      res.json(gig);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gig" });
    }
  });

  app.post("/api/gigs", async (req, res) => {
    try {
      const validatedData = insertGigSchema.parse(req.body);
      const gig = await storage.createGig(validatedData);
      res.status(201).json(gig);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Create gig error:", error);
      res.status(500).json({ error: "Failed to create gig" });
    }
  });

  app.patch("/api/gigs/:id", async (req, res) => {
    try {
      const gig = await storage.updateGig(req.params.id, req.body);
      if (!gig) {
        return res.status(404).json({ error: "Gig not found" });
      }
      res.json(gig);
    } catch (error) {
      res.status(500).json({ error: "Failed to update gig" });
    }
  });

  app.delete("/api/gigs/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteGig(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Gig not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete gig" });
    }
  });

  // Order Routes
  app.get("/api/orders/client/:clientId", async (req, res) => {
    try {
      const orders = await storage.getOrdersByClient(req.params.clientId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/freelancer/:freelancerId", async (req, res) => {
    try {
      const orders = await storage.getOrdersByFreelancer(req.params.freelancerId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      // Basic validation for required fields
      const { gigId, clientId, freelancerId, amount } = req.body;
      if (!gigId || !clientId || !freelancerId || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const order = await storage.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      // Validate allowed updates
      const allowedFields = ['status', 'escrowStatus', 'deliveryDate'];
      const updates = Object.keys(req.body).reduce((acc, key) => {
        if (allowedFields.includes(key)) {
          acc[key] = req.body[key];
        }
        return acc;
      }, {} as any);

      const order = await storage.updateOrder(req.params.id, updates);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  // Connection Routes
  app.get("/api/connections/:clientId", async (req, res) => {
    try {
      const connections = await storage.getConnectionsByClient(req.params.clientId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch connections" });
    }
  });

  app.post("/api/connections", async (req, res) => {
    try {
      const connection = await storage.createConnection(req.body);
      res.status(201).json(connection);
    } catch (error) {
      res.status(500).json({ error: "Failed to create connection" });
    }
  });

  // Project Routes
  app.get("/api/projects", async (req, res) => {
    try {
      const { clientId } = req.query;
      if (clientId) {
        const projects = await storage.getProjectsByClient(clientId as string);
        return res.json(projects);
      }
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Create project error:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Notification Routes
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByUser(req.params.userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notification = await storage.createNotification(req.body);
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ error: "Failed to create notification" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const notification = await storage.markNotificationAsRead(req.params.id);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
