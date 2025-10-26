# DecentraWork - Web3 Freelancing Platform

## Overview

DecentraWork is a decentralized freelancing platform built with Web3-native technologies. The platform connects freelancers and clients in a trustless environment, enabling crypto-based payments, wallet authentication, and blockchain-verified transactions. The application supports two distinct user types: freelancers who offer services through gigs, and clients who post projects and hire talent.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, providing fast HMR and optimized production builds
- **Wouter** for lightweight client-side routing instead of React Router
- Custom Vite plugins for Replit integration (error overlay, cartographer, dev banner)

**UI Component System**
- **shadcn/ui** component library built on Radix UI primitives
- **TailwindCSS** for utility-first styling with custom design tokens
- **New York** style variant from shadcn/ui
- Custom theme system supporting light/dark modes via CSS variables
- Typography: Inter (primary UI) and Space Grotesk (headers/Web3 elements)

**State Management**
- **React Context API** for authentication state (`AuthContext`)
- **TanStack Query (React Query)** for server state management, data fetching, and caching
- Local state with React hooks for component-level state

**Design System**
- Custom CSS variables for theming (background, foreground, primary, secondary, etc.)
- Elevation system using opacity-based overlays (`--elevate-1`, `--elevate-2`)
- Consistent spacing primitives based on Tailwind's spacing scale
- Glassmorphism and gradient effects for Web3-native visual language

### Backend Architecture

**Server Framework**
- **Express.js** REST API server with TypeScript
- Middleware for JSON parsing, URL encoding, and request/response logging
- Custom middleware for capturing response JSON and timing API requests
- Session-based authentication (infrastructure in place via `connect-pg-simple`)

**API Structure**
- RESTful endpoints organized by resource type:
  - `/api/auth/*` - Authentication (register, login)
  - `/api/gigs/*` - Freelancer service offerings
  - `/api/orders/*` - Client orders and transactions
  - `/api/projects/*` - Client project postings
  - `/api/connections/*` - Client-freelancer relationships
  - `/api/freelancers` - Freelancer profile listings
  - `/api/notifications` - User notifications

**Request/Response Handling**
- Request body validation using Zod schemas before database operations
- Error responses include detailed validation errors from Zod
- Password handling note: Current implementation stores plaintext (marked for production upgrade to bcrypt/argon2)

### Data Storage

**Database**
- **PostgreSQL** via Neon Database serverless driver (`@neondatabase/serverless`)
- **Drizzle ORM** for type-safe database queries and schema management
- Schema definitions in TypeScript with Zod integration for runtime validation

**Database Schema**
- **users**: Core user accounts (email, password, accountType, walletAddress)
- **profiles**: Extended user information (name, country, phone, bio, skills, hourlyRate, portfolio)
- **gigs**: Freelancer service listings (title, description, category, price, deliveryTime, skills)
- **orders**: Client-freelancer transactions (gigId, status, amount, deliveryDate)
- **projects**: Client project postings (title, description, budget, deadline, skills)
- **connections**: Client-freelancer relationships (status, notes)
- **notifications**: User notification system (type, message, read status)

**Storage Interface**
- Abstract storage interface (`IStorage`) defined in `server/storage.ts`
- CRUD operations for all entities
- Relationship queries (e.g., getOrdersByClient, getGigsByFreelancer)
- Currently uses in-memory storage with UUID generation

### Authentication & Authorization

**Authentication Flow**
- Email/password registration with account type selection (client/freelancer)
- Profile creation during registration (firstName, lastName, country, phone)
- Session-based authentication with user data stored in localStorage
- Web3 wallet connection support (MetaMask integration prepared)

**User Roles**
- **Client**: Can post projects, browse freelancers, place orders
- **Freelancer**: Can create gigs, receive orders, connect with clients
- Role-based route protection with dashboard redirects

**Web3 Integration**
- Wallet address storage in user model
- MetaMask connection flow via `window.ethereum` API
- Wallet address update endpoint (`updateUserWallet`)

### Application Pages & Features

**Landing Page**
- Hero section with background image and gradient overlay
- Dual CTAs for registration and login
- Web3-focused value propositions (decentralized, no fees, blockchain-verified)

**Dashboards**
- **Freelancer Dashboard**: Gig management, order tracking, earnings overview
- **Client Dashboard**: Project management, freelancer discovery, order monitoring
- Both include stats cards, search functionality, and navigation

**Core Features**
- **Explore Page**: Browse freelancers and gigs with search/filter capabilities
- **Create Gig**: Form for freelancers to create service offerings
- **Post Project**: Form for clients to publish project requirements
- Form validation using react-hook-form with Zod resolvers

### Form Handling & Validation

**Validation Strategy**
- **Zod** schemas for runtime validation on both client and server
- `drizzle-zod` for generating schemas from Drizzle table definitions
- `@hookform/resolvers` for integrating Zod with react-hook-form
- Server-side validation before database writes with detailed error responses

**Form Components**
- Reusable form components from shadcn/ui (Form, FormField, FormItem, FormLabel, FormMessage)
- Input components: Input, Textarea, Select, Checkbox, RadioGroup
- Custom validation messages rendered inline

## External Dependencies

### UI & Styling
- **@radix-ui/react-***: Headless UI primitives (25+ component packages)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx** + **tailwind-merge**: Conditional class name handling

### Database & ORM
- **@neondatabase/serverless**: PostgreSQL serverless driver for Neon
- **drizzle-orm**: TypeScript ORM for SQL databases
- **drizzle-kit**: Schema migration and push tooling
- **drizzle-zod**: Zod schema generation from Drizzle schemas

### Data Fetching & State
- **@tanstack/react-query**: Server state management and data synchronization
- **react-hook-form**: Form state management with validation

### Routing & Navigation
- **wouter**: Minimal client-side routing library

### Date Handling
- **date-fns**: Modern date utility library

### Development Tools
- **tsx**: TypeScript execution for development server
- **esbuild**: Fast bundler for production server build
- **vite**: Frontend build tool and dev server
- **@vitejs/plugin-react**: React support for Vite

### Fonts
- **Google Fonts**: Inter and Space Grotesk loaded from CDN

### Planned Integrations
- **Web3 Wallet**: MetaMask (window.ethereum interface defined)
- **IPFS**: Pinata for decentralized file storage (mentioned in project brief)
- **Smart Contracts**: ethers.js for blockchain interactions (mentioned but not yet implemented)