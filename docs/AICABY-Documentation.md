# AICABY Chat Interface & Booking System Documentation

## Overview
AICABY is a modern chat-based ride booking system that combines AI-powered booking assistance with traditional manual booking options. The system provides an intuitive interface for users to book rides through natural conversation or structured forms.

## Core Features

### 1. Dual Booking Modes
- **AI Booking Mode**
  - Natural language conversation interface
  - Real-time AI responses with typing indicators
  - Message history with timestamps
  - Voice input support
  
- **Manual Booking Mode**
  - Structured form interface
  - Direct input for pickup/dropoff locations
  - Vehicle type selection
  - Payment method integration
  - Scheduling options

### 2. Quick Actions
Four quick action buttons that provide immediate functionality with minimal user interaction:

1. **Location Button** 
   - Primary Function: Instant location sharing
   - Flow:
     1. User clicks location button
     2. System checks location permission status:
        - If OFF: Shows notification "Please enable location services to use this feature"
        - If ON: Shows prompt "Use current location?"
     3. On confirmation:
        - Captures current coordinates
        - Automatically sends to chat: "My current location is [address]"
   - States:
     - Default: Ready to use
     - Loading: While fetching location
     - Error: When location services unavailable
   - Error Messages:
     - "Location services are disabled"
     - "Unable to get current location"
     - "Please enable location access in settings"

2. **Photo Button**
   - Primary Function: Quick photo capture for driver location assistance
   - Flow:
     1. User clicks photo button
     2. Opens native camera directly
     3. After photo taken:
        - Shows preview
        - Auto-sends to driver with message "Here's my location photo"
   - States:
     - Default: Ready to capture
     - Camera active: While taking photo
     - Sending: While uploading
   - Error Messages:
     - "Camera permission required"
     - "Unable to access camera"
     - "Failed to send photo"

3. **Map Button**
   - Primary Function: Real-time driver location tracking
   - Flow:
     1. User clicks map button
     2. Opens live map view showing:
        - Driver's current location
        - ETA
        - Route to user
     3. Auto-refreshes every 10 seconds
   - States:
     - Default: View map
     - Loading: While fetching driver location
     - Active: Showing live tracking
   - Error Messages:
     - "Driver location unavailable"
     - "Unable to load map"
     - "Connection lost, retrying..."

4. **Payment Button**
   - Primary Function: Quick payment method selection
   - Flow:
     1. User clicks payment button
     2. Shows payment options overlay:
        - Cash
        - Credit/Debit Card
        - Digital Wallet
        - Corporate Account
     3. On selection:
        - Automatically sends to chat: "I'll pay with [selected method]"
   - States:
     - Default: Select payment
     - Loading: While fetching payment methods
     - Selected: After choice made
   - Error Messages:
     - "Unable to load payment methods"
     - "Payment selection failed"
     - "Please try again"

### Quick Action Implementation Notes

#### Interaction Design
- Single click activation
- No multi-step processes
- Immediate feedback
- Auto-send to chat

#### Permission Handling
- Location: One-time or Always allow
- Camera: When needed only
- Notifications: For driver updates

#### Performance
- Preload camera when possible
- Cache map data
- Store payment preferences

#### Security
- Secure location transmission
- Encrypted payment data
- Temporary photo storage only

### Action Button Implementation Guidelines

#### State Management
- Each button maintains its own loading state
- Active state indication during processing
- Disabled state handling during concurrent actions

#### Dialog Design
1. **Permission Dialogs**
   - Clear purpose explanation
   - Remember choice option
   - Link to settings if denied

2. **Confirmation Dialogs**
   - Clear action description
   - Prominent confirm/cancel buttons
   - Warning indicators for destructive actions
   - Option to "Don't show again" for repetitive actions

3. **Error Dialogs**
   - Clear error description
   - Suggested resolution steps
   - Support contact option
   - Retry mechanism where applicable

#### Action Flow
1. Button Press → Validation → Confirmation → Action
2. Success/Error Feedback
3. State Update
4. UI Refresh

#### Accessibility Considerations
- ARIA labels for all buttons
- Keyboard navigation support
- Screen reader descriptions
- Focus management in dialogs

### 3. User Interface Components

#### Chat Interface
- Message bubbles with distinct styling:
  - User messages: Yellow gradient background, right-aligned
  - AI messages: Transparent background with yellow border, left-aligned
- Timestamps for all messages
- Typing indicator for AI responses
- 3-4 second natural delay in AI responses

#### Input Controls
- Text input field with placeholder text
- Voice input toggle button
- Send message button
- Disabled state during AI response

#### Navigation
- Mode toggle buttons (AI/Manual)
- Back button in manual mode
- Scrollable message history

### 4. Technical Features

#### State Management
- Message history tracking
- Booking mode state
- Loading states
- User authentication state
- Voice recognition state

#### Database Integration
- Supabase backend integration
- User profile management
- Booking data storage
- Real-time updates

#### Security Features
- User authentication required
- Secure API communication
- Protected booking endpoints

## Styling Guidelines

### Colors
- Primary: `#F7C948` (Yellow)
- Background: Gradient from `#2A2A2A` to `#1A1A1A`
- Text: White with various opacity levels
- Borders: Yellow with 20% opacity

### Typography
- Font weights: 
  - Extra Bold: AI booking button
  - Bold: User messages
  - Semi-bold: AI messages
  - Medium: Quick actions
- Text sizes:
  - Base: 16px (1rem)
  - Small: 14px (0.875rem)
  - Extra Small: 12px (0.75rem)

### Components
- Buttons: Rounded corners (8px)
- Input fields: Light background with yellow focus ring
- Message bubbles: Large border radius (16px)
- Quick actions: Equal width grid layout

## User Experience

### Message Flow
1. User inputs message (text/voice)
2. Message appears in chat
3. Typing indicator shows
4. AI response appears after 3-4 seconds
5. Input field refocuses

### Accessibility
- Voice input option
- Clear visual hierarchy
- Responsive design
- Keyboard navigation support

## Error Handling
- Network error messages
- Booking submission validation
- Graceful AI response failures
- Input validation

## Performance Considerations
- Message history pagination
- Optimized re-renders
- Efficient state updates
- Background loading states

## Future Enhancements
- Message attachments
- Rich media support
- Location sharing
- Payment integration
- Route optimization
- Ride tracking

## Technical Dependencies
- React
- TypeScript
- Supabase
- TailwindCSS
- Lucide Icons
- React Hot Toast

---

*Last Updated: [Current Date]*
*Version: 1.0.0* 