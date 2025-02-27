# AI CABY Technical Implementation Specifications

## 1. AI Integration

### AI Model Selection
- **Primary AI Model**: DeepSeek
  * Model: DeepSeek-V2 (latest stable release)
  * Context window: 32k tokens
  * Response time target: < 2 seconds
  * Multilingual capabilities prioritized
  * Temperature: 0.7 for natural responses

### Prompt Engineering
```javascript
const taxiBookingPromptTemplate = (context) => `
You are AI CABY, a helpful taxi booking assistant. 
Your goal is to assist users in booking a taxi efficiently and helpfully.

Conversation Context:
- Language: ${context.language}
- User Location: ${context.userLocation}
- Booking Preferences: ${context.bookingPreferences}

Key Interaction Guidelines:
1. Be concise and helpful
2. Understand user intent quickly
3. Provide clear, actionable information
4. Adapt to user's communication style

Current Conversation:
${context.conversationHistory}

Respond appropriately:`;
```

### Failover Implementation
```javascript
async function handleAIResponse(userMessage) {
  try {
    // Primary DeepSeek AI call
    const deepSeekResponse = await DeepSeekAI.generateResponse(userMessage);
    return deepSeekResponse;
  } catch (deepSeekError) {
    console.warn('DeepSeek AI failed, attempting OpenRouter fallback');
    
    try {
      // OpenRouter fallback
      const openRouterResponse = await OpenRouterAI.generateResponse(userMessage);
      return openRouterResponse;
    } catch (openRouterError) {
      return {
        type: 'error',
        message: 'AI assistants currently unavailable. Please try again later.'
      };
    }
  }
}
```

## 2. Language Processing

### Language Detection
```javascript
const LanguageProcessor = {
  async detectLanguage(text) {
    try {
      const detectedLang = await DeepSeekAI.detectLanguage(text);
      return {
        code: detectedLang.code,
        confidence: detectedLang.confidence,
        name: detectedLang.name
      };
    } catch (error) {
      console.error('Language detection failed:', error);
      return { code: 'en', confidence: 1, name: 'English' }; // Fallback
    }
  }
};
```

### Translation Pipeline
```javascript
class TranslationService {
  static async translate(text, targetLang) {
    const context = await this.getTranslationContext(text);
    return DeepSeekAI.translate(text, {
      targetLanguage: targetLang,
      context: context,
      preserveFormatting: true
    });
  }

  static async getTranslationContext(text) {
    // Implement context gathering logic
    return {
      domain: 'taxi-booking',
      formalityLevel: 'casual',
      preserveEmojis: true
    };
  }
}
```

## 3. Weather Information System

### Data Collection Service
```javascript
class WeatherService {
  constructor() {
    this.cache = new Map();
    this.CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  }

  async getWeatherInfo(location) {
    const cacheKey = `weather-${location}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    const weatherData = await this.fetchWeatherData(location);
    this.cache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now()
    });

    return weatherData;
  }

  async fetchWeatherData(location) {
    // Implement web scraping logic for weather data
    return {
      temperature: null,
      conditions: null,
      forecast: null
    };
  }
}
```

## 4. State Management

### Zustand Store Configuration
```javascript
import create from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set) => ({
      // User State
      user: null,
      setUser: (user) => set({ user }),
      
      // Booking State
      currentBooking: null,
      bookingHistory: [],
      setCurrentBooking: (booking) => set({ currentBooking: booking }),
      
      // Language State
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      
      // Offline Queue
      offlineQueue: [],
      addToOfflineQueue: (item) => 
        set((state) => ({ 
          offlineQueue: [...state.offlineQueue, item] 
        })),
      
      // Clear States
      clearStore: () => set({
        user: null,
        currentBooking: null,
        bookingHistory: [],
        offlineQueue: []
      })
    }),
    {
      name: 'ai-caby-storage',
      getStorage: () => localStorage
    }
  )
);

export default useAppStore;
```

## 5. Database Schema (Supabase)

### Core Tables
```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  language TEXT DEFAULT 'en',
  preferences JSONB DEFAULT '{}'::jsonb,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Bookings Table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  pickup_location JSONB NOT NULL,
  dropoff_location JSONB NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  fare_estimate DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  weather_conditions JSONB,
  route_details JSONB
);

-- Saved Locations Table
CREATE TABLE saved_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  coordinates POINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_saved_locations_user_id ON saved_locations(user_id);
```

## 6. Error Handling

### Global Error Handler
```javascript
class ErrorHandler {
  static async handle(error, context = {}) {
    // Log error
    await this.logError(error, context);

    // Determine error type
    const errorType = this.categorizeError(error);

    // Handle based on type
    switch (errorType) {
      case 'AI_SERVICE_ERROR':
        return this.handleAIError(error);
      case 'NETWORK_ERROR':
        return this.handleNetworkError(error);
      case 'DATABASE_ERROR':
        return this.handleDatabaseError(error);
      default:
        return this.handleGenericError(error);
    }
  }

  static categorizeError(error) {
    if (error.name === 'AIServiceError') return 'AI_SERVICE_ERROR';
    if (error.name === 'NetworkError') return 'NETWORK_ERROR';
    if (error.name === 'DatabaseError') return 'DATABASE_ERROR';
    return 'GENERIC_ERROR';
  }

  static async logError(error, context) {
    // Implement error logging
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  }
}
```

## 7. Testing Strategy

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/serviceWorker.ts'
  ]
};
```

### Example Test Suite
```typescript
// booking.test.ts
import { render, screen, fireEvent } from '@testing-library/react';
import { BookingForm } from '@/components/BookingForm';

describe('BookingForm', () => {
  it('should handle location input correctly', () => {
    render(<BookingForm />);
    
    const pickupInput = screen.getByLabelText('Pickup Location');
    fireEvent.change(pickupInput, { 
      target: { value: 'Amsterdam Central' } 
    });
    
    expect(pickupInput.value).toBe('Amsterdam Central');
  });

  it('should validate required fields', async () => {
    render(<BookingForm />);
    
    const submitButton = screen.getByText('Book Now');
    fireEvent.click(submitButton);
    
    expect(await screen.findByText('Pickup location is required'))
      .toBeInTheDocument();
  });
});
```

## 8. Development Workflow

### Git Workflow
```bash
# Feature development workflow
git checkout develop
git pull origin develop
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Create PR to develop

# Release workflow
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0
# Version bump and final testing
git push origin release/v1.0.0
# Create PR to main
```

### CI/CD Pipeline
```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run linter
        run: npm run lint

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Add deployment steps
```

---

**Note**: This technical specification provides implementation details and code examples for the AI CABY platform. Regular updates and refinements should be made based on development feedback and changing requirements. 