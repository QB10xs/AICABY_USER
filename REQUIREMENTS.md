# AI CABY Project Requirements Document

## 1. User Authentication

### Authentication Method
- Email and Password Registration Only
  * Secure account creation
  * Password reset functionality
  * Email verification

### User Profile Features
- Profile creation and management
- Saved addresses
- Ride history
- Personal preferences
- Communication preferences

## 2. Booking System

### Booking Methods
- AI Conversational Booking
- Manual Booking Interface
- Instant ride booking
- Advanced scheduling (up to 7 days ahead)

### Ride Information Features
- Terminal check (departure/arrival)
- Weather information
- Distance calculation
- Estimated arrival time
- Traffic conditions
- Route details

## 3. Payment and Pricing

### Payment Methods
- Cash payment to driver
- Tikkie (Dutch mobile payment)
- Mobile POS with driver
- No in-app payment processing

### Pricing
- Fixed service fee of €1.5 per ride
- Transparent fare estimation
- No hidden charges
- Clear breakdown of costs
- No advanced payment through app

## 4. AI Assistant Capabilities

### Multilingual Support
Booking and interaction support in 20 languages:
1. English
2. Spanish
3. French
4. Arabic
5. Chinese (Mandarin)
6. Hindi
7. Portuguese
8. Russian
9. German
10. Italian
11. Dutch
12. Turkish
13. Japanese
14. Korean
15. Vietnamese
16. Polish
17. Swedish
18. Danish
19. Norwegian
20. Finnish

### AI Assistant Features
- Multilingual conversational booking
- Context-aware communication
- Comprehensive taxi-related information:
  * Terminal details
  * Weather conditions
  * Travel time estimates
  * Distance calculations
  * Traffic insights
- Advanced trip planning
- Real-time travel information
- AI CABY brand ambassador role
  * Provide company information
  * Answer general inquiries
  * Represent brand personality

## 5. Mapping and Location

### Mapping Integration
- Mapbox as primary mapping service
  * Custom map styling
  * Precise location tracking
  * Route visualization
  * Geocoding capabilities

### Location Features
- Precise pickup/drop-off points
- Address autocomplete
- Saved frequent locations
- Real-time location tracking

## 6. User Interface Design

### Design Principles
- Mobile-first approach
- Intuitive, clean interface
- Accessible design
- Minimal booking steps
- Responsive across devices

### UI Components
- Large, touch-friendly buttons
- Clear navigation
- Minimal form fields
- Quick action buttons
- Multilingual interface switching

## 7. Offline & Network Experience

### Offline Capabilities
- Cached ride history
- Saved addresses
- Offline booking request queue
- Basic app navigation when offline

### Network Resilience
- Clear network status indicators
- Automatic sync when connection restored
- Graceful performance in low connectivity

## 8. Notification System

### Notification Types
- Booking confirmation
- Ride status updates
- Estimated arrival time
- Booking reminders

### Notification Channels
- Push notifications
- In-app notifications
- Email notifications

## 9. User Support

### Support Features
- In-app help center
- AI-powered support chat
- Multilingual FAQ section
- Ride issue reporting
- Feedback mechanism

## 10. Technical Implementation

### Frontend Stack
- React 18+ with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- PWA capabilities
- Zustand for state management

### Backend Services
- Supabase for backend
- DeepSeek for primary AI
- OpenRouter for AI fallback
- Mapbox for navigation
- External payment processing

### Security & Privacy
- End-to-end encryption
- GDPR compliance
- Data minimization
- User privacy controls
- Regular security audits

## 11. Minimum Viable Product (MVP)

### Must-Have Features
1. Email/password registration
2. AI-assisted booking
3. Manual booking option
4. 20-language support
5. Mapbox integration
6. Comprehensive ride information
7. AI ambassador functionality
8. Basic user profile

### Development Timeline
- Design & Prototype: 4 weeks
  * UI/UX design
  * Technical architecture
  * Prototype development
  * Stakeholder review

- Initial Development: 12 weeks
  * Core features
  * AI integration
  * Payment system
  * Testing implementation

- Testing & Refinement: 4 weeks
  * User testing
  * Performance optimization
  * Security audit
  * Final adjustments

Total MVP Timeline: 20 weeks

---

**Note**: This document represents the initial requirements for the AI CABY platform, focusing on a user-centric, multilingual taxi booking experience with advanced AI capabilities. 