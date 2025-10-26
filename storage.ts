import {
  type User,
  type InsertUser,
  type Profile,
  type InsertProfile,
  type Gig,
  type InsertGig,
  type Order,
  type InsertOrder,
  type Connection,
  type InsertConnection,
  type Project,
  type InsertProject,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserWallet(userId: string, walletAddress: string): Promise<User | undefined>;

  // Profiles
  getProfile(userId: string): Promise<Profile | undefined>;
  getProfileById(id: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  getAllFreelancerProfiles(): Promise<Profile[]>;

  // Gigs
  getGig(id: string): Promise<Gig | undefined>;
  getGigsByFreelancer(freelancerId: string): Promise<Gig[]>;
  getAllGigs(): Promise<Gig[]>;
  createGig(gig: InsertGig): Promise<Gig>;
  updateGig(id: string, gig: Partial<InsertGig>): Promise<Gig | undefined>;
  deleteGig(id: string): Promise<boolean>;

  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByClient(clientId: string): Promise<Order[]>;
  getOrdersByFreelancer(freelancerId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined>;

  // Connections
  getConnection(id: string): Promise<Connection | undefined>;
  getConnectionsByClient(clientId: string): Promise<Connection[]>;
  createConnection(connection: InsertConnection): Promise<Connection>;

  // Projects
  getProject(id: string): Promise<Project | undefined>;
  getProjectsByClient(clientId: string): Promise<Project[]>;
  getAllProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Notifications
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<Notification | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, Profile>;
  private gigs: Map<string, Gig>;
  private orders: Map<string, Order>;
  private connections: Map<string, Connection>;
  private projects: Map<string, Project>;
  private notifications: Map<string, Notification>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.gigs = new Map();
    this.orders = new Map();
    this.connections = new Map();
    this.projects = new Map();
    this.notifications = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    // NOTE: In production, hash passwords with bcrypt/argon2 before storing
    const user: User = {
      ...insertUser,
      id,
      walletAddress: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserWallet(userId: string, walletAddress: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    const updatedUser = { ...user, walletAddress };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Profiles
  async getProfile(userId: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find((p) => p.userId === userId);
  }

  async getProfileById(id: string): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const profile: Profile = {
      ...insertProfile,
      id,
      bio: insertProfile.bio || null,
      skills: insertProfile.skills || null,
      hourlyRate: insertProfile.hourlyRate || null,
      avatar: insertProfile.avatar || null,
      portfolio: insertProfile.portfolio || null,
      verified: insertProfile.verified || false,
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(id: string, updates: Partial<InsertProfile>): Promise<Profile | undefined> {
    const profile = this.profiles.get(id);
    if (!profile) return undefined;
    const updatedProfile = { ...profile, ...updates };
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  async getAllFreelancerProfiles(): Promise<Profile[]> {
    const freelancerIds = Array.from(this.users.values())
      .filter((u) => u.accountType === 'freelancer')
      .map((u) => u.id);
    return Array.from(this.profiles.values()).filter((p) =>
      freelancerIds.includes(p.userId)
    );
  }

  // Gigs
  async getGig(id: string): Promise<Gig | undefined> {
    return this.gigs.get(id);
  }

  async getGigsByFreelancer(freelancerId: string): Promise<Gig[]> {
    return Array.from(this.gigs.values()).filter((g) => g.freelancerId === freelancerId);
  }

  async getAllGigs(): Promise<Gig[]> {
    return Array.from(this.gigs.values());
  }

  async createGig(insertGig: InsertGig): Promise<Gig> {
    const id = randomUUID();
    const gig: Gig = {
      ...insertGig,
      id,
      skills: insertGig.skills || null,
      images: insertGig.images || null,
      views: 0,
      createdAt: new Date(),
    };
    this.gigs.set(id, gig);
    return gig;
  }

  async updateGig(id: string, updates: Partial<InsertGig>): Promise<Gig | undefined> {
    const gig = this.gigs.get(id);
    if (!gig) return undefined;
    const updatedGig = { ...gig, ...updates };
    this.gigs.set(id, updatedGig);
    return updatedGig;
  }

  async deleteGig(id: string): Promise<boolean> {
    return this.gigs.delete(id);
  }

  // Orders
  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByClient(clientId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter((o) => o.clientId === clientId);
  }

  async getOrdersByFreelancer(freelancerId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter((o) => o.freelancerId === freelancerId);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      deliveryDate: insertOrder.deliveryDate || null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const updatedOrder = { ...order, ...updates };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Connections
  async getConnection(id: string): Promise<Connection | undefined> {
    return this.connections.get(id);
  }

  async getConnectionsByClient(clientId: string): Promise<Connection[]> {
    return Array.from(this.connections.values()).filter((c) => c.clientId === clientId);
  }

  async createConnection(insertConnection: InsertConnection): Promise<Connection> {
    const id = randomUUID();
    const connection: Connection = {
      ...insertConnection,
      id,
      createdAt: new Date(),
    };
    this.connections.set(id, connection);
    return connection;
  }

  // Projects
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByClient(clientId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter((p) => p.clientId === clientId);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      skills: insertProject.skills || null,
      deadline: insertProject.deadline || null,
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    const updatedProject = { ...project, ...updates };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Notifications
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter((n) => n.userId === userId);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = {
      ...insertNotification,
      id,
      link: insertNotification.link || null,
      createdAt: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    const updatedNotification = { ...notification, read: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
}

export const storage = new MemStorage();
