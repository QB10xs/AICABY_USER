# AI CABY - Project Documentation

## Project Overview
AI CABY is a Progressive Web App (PWA) for taxi booking with advanced AI capabilities and multilingual support.

## Technical Stack
- **Frontend Framework**: React + Vite + TypeScript
- **Backend**: Supabase
- **AI Provider**: 
  - Primary: DeepSeek
  - Fallback: OpenRouter
- **Mapping**: Mapbox
- **Payment Processing**: External (No in-app processing)

## Core Features

### 1. Authentication System
- Email/password registration only
- Email verification required
- Password reset functionality
- No social logins

### 2. User Profile Features
- Profile management
- Saved addresses
- Ride history
- Personal preferences
- Communication preferences

### 3. Booking System
#### Methods
- AI Conversational Booking
- Manual Booking Interface
- Instant booking
- Advanced scheduling (up to 7 days)

#### Ride Information
- Terminal information
- Weather conditions
- Distance calculation
- ETA
- Traffic conditions
- Route details

### 4. Payment System
#### Supported Methods
- Cash payment to driver
- Tikkie (Dutch mobile payment)
- Mobile POS with driver
- No in-app payment processing

#### Pricing Features
- Fixed service fee of €1.5 per ride
- Transparent fare estimation
- No hidden charges
- Clear cost breakdown
- No advance payment through app

### 5. AI Assistant Capabilities
#### Language Support
- Unlimited language support through AI
- Real-time language adaptation
- No predefined language list
- Natural conversation flow
- Direct AI-powered translation

#### AI Features
- Web searching capability
- Web scraping for real-time data
- Context-aware communication
- Brand ambassador role
- Comprehensive information gathering

### 6. Mapping & Location (Mapbox)
- Turn-by-turn navigation
- Real-time route tracking
- Alternative routes
- ETA calculations
- Geofencing capabilities
- Precise location tracking
- Custom map styling

### 7. Data & Privacy
- Minimal data retention
- User privacy prioritization
- Anonymized booking metadata
- User-controlled data retention
- Compliance with data protection standards

### 8. Performance & Accessibility
- Fast, responsive interface
- Quick AI response times
- Efficient information retrieval
- Minimal latency
- Simple, intuitive interface
- Support for various user needs

### 9. Information Services
#### Weather Information
- AI-powered web searching
- Real-time web scraping
- No dependency on specific weather APIs
- Comprehensive weather details:
  * Current conditions
  * Temperature
  * Precipitation
  * Wind conditions
  * Forecast
  * Road safety insights

## Technical Implementation

### Frontend Architecture
- Component-based structure
- Responsive design system
- State management with Zustand
- PWA implementation
- Offline capabilities

### Backend Architecture
- Serverless with Supabase
- Real-time subscriptions
- Row-level security
- Automated backups
- Data encryption

### AI Integration
- DeepSeek primary integration
- OpenRouter fallback system
- Context management
- Prompt engineering
- Error handling

### Database Schema
- Users table
- Rides table
- Locations table
- Preferences table
- Analytics table

## Development & Deployment

### Development Workflow
- Git-based version control
- Feature branch strategy
- Code review process
- CI/CD pipeline
- Automated testing

### Testing Strategy
- Unit testing (Jest)
- Integration testing
- E2E testing (Cypress)
- AI interaction testing
- Performance testing

### Deployment
- Vercel hosting
- Environment management
- Automated deployments
- Rollback capability
- Performance monitoring

## Project Timeline (MVP)
1. Design & Prototype (4 weeks)
   - UI/UX design
   - Technical architecture
   - Prototype development
   - Stakeholder review

2. Initial Development (12 weeks)
   - Core features
   - AI integration
   - Payment system
   - Testing implementation

3. Testing & Refinement (4 weeks)
   - User testing
   - Performance optimization
   - Security audit
   - Final adjustments

Total MVP Timeline: 20 weeks

## Outstanding Questions

### Technical Decisions
1. DeepSeek model version selection
2. State management implementation
3. Database schema finalization
4. Testing framework setup
5. Security measures implementation

### Implementation Strategy
1. AI integration approach
2. Real-time data handling
3. Offline functionality
4. Error recovery
5. Performance optimization

## Next Steps
1. Finalize AI integration specifications
2. Complete database schema design
3. Implement state management
4. Set up testing framework
5. Deploy initial prototype

---

**Note**: This documentation is continuously updated as development progresses. 