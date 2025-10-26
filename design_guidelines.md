# Design Guidelines: Web3 Freelancing Platform

## Design Approach

**Hybrid Reference-Based + System Approach**: Drawing inspiration from Upwork's marketplace structure and Linear's modern, clean interface, combined with Web3-native visual language (glassmorphism, gradient accents, tech-forward aesthetics). This platform requires both trust-building marketplace elements and cutting-edge Web3 credibility.

## Core Design Principles

1. **Trust Through Transparency**: Emphasize blockchain verification, wallet connections, and decentralized data
2. **Progressive Disclosure**: Complex Web3 concepts simplified through intuitive UI
3. **Data Density with Breathing Room**: Information-rich without overwhelming
4. **Professional Polish**: Enterprise-grade quality that legitimizes Web3 adoption

## Typography System

**Font Families** (Google Fonts):
- Primary: Inter (400, 500, 600, 700) - UI elements, body text, navigation
- Accent: Space Grotesk (500, 600, 700) - Headers, hero statements, Web3-related callouts

**Type Scale**:
- Hero Display: text-6xl to text-7xl, font-bold, Space Grotesk
- Page Titles: text-4xl to text-5xl, font-bold, Space Grotesk
- Section Headers: text-2xl to text-3xl, font-semibold, Inter
- Card Titles: text-xl, font-semibold, Inter
- Body Text: text-base, font-normal, Inter
- Small Labels: text-sm, font-medium, Inter
- Micro Text: text-xs, font-normal, Inter

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 3, 4, 6, 8, 12, 16, 20, 24** for consistent rhythm
- Component internal padding: p-4 to p-6
- Card padding: p-6 to p-8
- Section padding: py-16 to py-24 (desktop), py-12 (mobile)
- Element gaps: gap-4, gap-6, gap-8
- Grid gutters: gap-6 to gap-8

**Container Strategy**:
- Full-width sections: w-full with max-w-7xl mx-auto px-4
- Dashboard content: max-w-6xl
- Form containers: max-w-2xl
- Reading content: max-w-prose

## Landing Page Structure

**Hero Section** (80vh):
- Large hero image showing diverse freelancers collaborating (blurred gradient overlay)
- Bold headline emphasizing "Decentralized" + "No Fees" + "Web3-Native"
- Dual CTA: "Connect Wallet" (primary) + "Explore Platform" (secondary ghost)
- Floating stats cards: "Active Projects", "Total Freelancers", "On-Chain Transactions"
- Wallet connection indicator with supported wallet icons (MetaMask, WalletConnect, Coinbase)

**Platform Features** (3-column grid on desktop, stacked mobile):
- Icon cards with Web3 advantages: Decentralized Storage (IPFS), Smart Contract Escrow, Zero Platform Fees, Crypto Payments, Transparent Reviews, Global Access
- Each card: icon (Heroicons), title, 2-3 line description
- Hover effect: subtle lift with shadow increase

**How It Works** (Timeline/stepper layout):
- For Clients: Post Project → Review Proposals → Fund Escrow → Release Payment
- For Freelancers: Create Profile → Submit Proposals → Deliver Work → Receive Crypto
- Visual connector lines between steps, numbered badges

**Trust Indicators**:
- Blockchain verification badges
- Sample wallet addresses (truncated format)
- Transaction transparency callout
- IPFS storage security highlight

**Social Proof** (2-column testimonials):
- Client and freelancer testimonials with wallet addresses
- Project success stories with crypto payment amounts
- Platform statistics dashboard preview

**Footer**: 
- Multi-column layout: Platform links, Resources, Community, Legal
- Newsletter signup with Web3 emphasis
- Supported blockchain networks icons
- Social links + "Join our Discord" CTA

## Dashboard Layouts

**Client Dashboard**:
- Top navigation bar with wallet connection status (address + balance + network)
- Sidebar: Dashboard, Post Project, Active Projects, Find Freelancers, Messages, Settings
- Main content: 2-column grid layout
  - Left column (60%): Active Projects cards (compact list view), Recent Activity feed
  - Right column (40%): Quick Actions panel, Wallet Overview widget, Recommended Freelancers carousel
- Project cards: Title, freelancer info, progress indicator, escrow status, deadline, action buttons

**Freelancer Dashboard**:
- Similar navigation with "Create Gig" and "Browse Projects" emphasis
- 3-column statistics: Active Gigs, Proposals Sent, Earnings (ETH/USD)
- Portfolio preview grid (2x3 masonry-style)
- Available Projects feed with filtering sidebar (category, budget range, deadline)
- Gig management cards: status badges, view counts, proposal counts

## Component Library

**Navigation**:
- Landing: Transparent header with blur backdrop (sticky)
- Dashboard: Persistent sidebar (collapsible on tablet), top bar with profile/wallet dropdown
- Mobile: Bottom navigation tabs for dashboard

**Cards**:
- Project cards: Border with subtle shadow, hover lift effect, status badges (top-right corner)
- Freelancer/Gig cards: Profile image, title, skills tags, pricing, rating stars, blockchain verification badge
- Glassmorphic info cards for Web3 elements (backdrop-blur-lg with border)

**Forms**:
- Input fields: Clear labels above, subtle border, focus state with ring
- File uploads: Drag-and-drop zones with IPFS upload indicator
- Wallet connection modals: Full-screen overlay with wallet options grid

**Buttons**:
- Primary: Solid with gradient (when appropriate for Web3 actions)
- Secondary: Outlined with hover fill
- Ghost: Transparent with hover background
- Wallet buttons: Icon + text, connection status indicator
- Sizes: Small (px-4 py-2), Medium (px-6 py-3), Large (px-8 py-4)

**Data Displays**:
- Stats widgets: Large number, label, trend indicator, icon
- Transaction history: Table with wallet address links, timestamp, amount, status
- Proposal lists: Expandable accordion cards
- Rating displays: Star icons + numerical score + review count

**Badges & Tags**:
- Status badges: Small, rounded-full, uppercase text
- Skill tags: Rounded-lg, inline-flex, dismissible (in profile edit)
- Blockchain network badges: Chain icon + name

**Modals & Overlays**:
- Wallet connection: Centered modal, wallet grid (2-column), connection steps
- Project detail: Slide-over panel from right (max-w-2xl)
- Confirmation dialogs: Smart contract interaction warnings

**Web3-Specific Components**:
- Wallet widget: Compact address display (truncated), balance, network indicator, disconnect button
- Transaction status: Loading states with blockchain confirmation steps
- IPFS file viewer: Preview with CID display, download option
- Escrow tracker: Progress visualization with milestone releases

## Images

**Hero Image**: 
Large banner image (1920x1080) showing diverse professionals working with digital interfaces, futuristic workspace setting, warm collaborative atmosphere. Apply gradient overlay (dark bottom to transparent top) for text contrast. Buttons should have backdrop-blur backgrounds.

**Feature Section**: 
No background images, use clean layout with icon emphasis

**Trust Section**: 
Abstract blockchain network visualization as subtle background pattern

**Dashboard**: 
Profile photos for freelancers (circular, 48px-64px), project thumbnails (16:9 ratio), portfolio images (square grid, responsive)

## Responsive Behavior

**Desktop (lg: 1024px+)**: Full sidebar, 3-column grids, hover interactions
**Tablet (md: 768px)**: Collapsible sidebar, 2-column grids
**Mobile (base)**: Bottom navigation, single column, stacked layout, touch-optimized targets (min 44px)

## Accessibility Standards

- Wallet connection accessible via keyboard
- Screen reader labels for transaction status
- Clear focus indicators on all interactive elements
- Color contrast minimum WCAG AA
- Form validation with clear error messages
- Skip navigation links for dashboard