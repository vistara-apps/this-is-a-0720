# SyncFlow AI - Intelligent Meeting Scheduling Assistant

![SyncFlow AI](https://img.shields.io/badge/SyncFlow-AI%20Powered-blue?style=for-the-badge&logo=calendar)

**Effortless AI-powered meeting scheduling that integrates seamlessly with your calendar.**

## 🚀 Overview

SyncFlow AI is an intelligent meeting scheduling assistant that uses artificial intelligence to automatically find optimal meeting times, integrate with popular calendar platforms, and provide natural language scheduling capabilities.

### ✨ Key Features

- **🤖 AI-Powered Scheduling**: Natural language processing for intuitive meeting requests
- **📅 Smart Calendar Integration**: Seamless sync with Google Calendar and Outlook
- **⚡ Intelligent Time Suggestions**: AI analyzes availability and preferences to suggest optimal meeting times
- **🔄 Automated Invites & Reminders**: Professional meeting requests and timely notifications
- **💬 Natural Language Interface**: Schedule meetings through simple chat commands
- **📊 Advanced Analytics**: Meeting insights and scheduling patterns
- **💳 Flexible Subscription Plans**: From free tier to professional features

## 🏗️ Architecture

### Frontend Stack
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first styling with custom design system
- **Lucide React** - Beautiful, customizable icons
- **Date-fns** - Comprehensive date manipulation
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Server state management
- **React Hook Form** - Form handling and validation

### Backend Integration
- **Google Calendar API** - Calendar sync and event management
- **Microsoft Graph API** - Outlook integration
- **OpenAI API** - Natural language processing and AI suggestions
- **Zoom API** - Video meeting link generation
- **Stripe API** - Payment processing and subscription management

### Design System
- **Colors**: HSL-based color palette with semantic naming
- **Typography**: Inter font family with responsive sizing
- **Spacing**: Consistent 8px grid system
- **Shadows**: Layered shadow system for depth
- **Animations**: Smooth transitions with easing functions

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- API keys for integrated services

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/syncflow-ai.git
   cd syncflow-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your API keys:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_OPENAI_API_KEY=your_openai_api_key
   # ... other API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📋 API Requirements

### Required API Keys

| Service | Purpose | Documentation |
|---------|---------|---------------|
| Google Calendar API | Calendar integration and event management | [Google Calendar API Docs](https://developers.google.com/calendar) |
| Microsoft Graph API | Outlook calendar integration | [Microsoft Graph Docs](https://learn.microsoft.com/en-us/graph/) |
| OpenAI API | Natural language processing and AI suggestions | [OpenAI API Docs](https://platform.openai.com/docs) |
| Zoom API | Video meeting link generation | [Zoom API Docs](https://marketplace.zoom.us/docs/api-reference) |
| Stripe API | Payment processing and subscriptions | [Stripe API Docs](https://stripe.com/docs/api) |

### OAuth Setup

1. **Google Calendar**
   - Create project in Google Cloud Console
   - Enable Calendar API
   - Configure OAuth consent screen
   - Create OAuth 2.0 credentials

2. **Microsoft Outlook**
   - Register app in Azure Portal
   - Configure API permissions for Calendar
   - Set up OAuth redirect URIs

## 🎨 Design System

### Color Palette
```css
:root {
  --color-bg: hsl(210 40% 98%);
  --color-accent: hsl(204 96% 60%);
  --color-primary: hsl(220 89.8% 52.2%);
  --color-surface: hsl(0 0% 100%);
  --color-text-primary: hsl(220 13% 13%);
  --color-text-secondary: hsl(220 33% 40%);
}
```

### Component Variants

#### Button Component
- **Primary**: Main action buttons
- **Secondary**: Secondary actions
- **Ghost**: Subtle interactions
- **Destructive**: Delete/cancel actions

#### Input Component
- **Default**: Standard text input
- **With Icon**: Icon-enhanced inputs
- **Error State**: Validation feedback

#### Modal Component
- **Confirmation**: Action confirmations
- **Settings**: Configuration dialogs

## 🔧 Core Features Implementation

### 1. Natural Language Scheduling
```javascript
// Example usage
parseSchedulingRequest("Schedule a 30-minute call with john@example.com tomorrow at 2 PM")
// Returns: { duration: 30, attendees: [...], timeframe: 1, urgency: 'normal' }
```

### 2. Intelligent Time Slot Generation
```javascript
// Find optimal meeting times
const timeSlots = findOptimalTimeSlots(participants, {
  duration: 60,
  preferredTimes: ['09:00', '14:00', '15:00'],
  workingHours: { start: '09:00', end: '17:00' }
})
```

### 3. Calendar Integration
```javascript
// Connect calendar
await apiService.connectGoogleCalendar(authCode)

// Create meeting
await apiService.createMeeting({
  title: 'Team Standup',
  startTime: '2024-01-15T10:00:00Z',
  endTime: '2024-01-15T10:30:00Z',
  attendees: ['team@example.com']
})
```

## 💰 Business Model

### Subscription Tiers

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0/month | 5 meetings/month, basic integration |
| **Basic** | $7/month | Unlimited meetings, AI scheduling |
| **Professional** | $15/month | Team features, advanced AI, analytics |

### Payment Integration
- Stripe-powered subscription management
- Secure payment processing
- Automatic billing and invoicing
- Subscription lifecycle management

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration testing
- **E2E Tests**: Full user workflow testing

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Ensure all production environment variables are configured:
- API endpoints
- Production API keys
- Stripe live keys
- OAuth redirect URIs

### Deployment Platforms
- **Vercel**: Recommended for frontend deployment
- **Netlify**: Alternative frontend hosting
- **Docker**: Containerized deployment option

## 📊 Analytics & Monitoring

### Key Metrics
- Meeting scheduling success rate
- User engagement metrics
- API response times
- Subscription conversion rates

### Monitoring Tools
- Error tracking with Sentry
- Performance monitoring
- User analytics
- API usage metrics

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- ESLint configuration for code quality
- Prettier for code formatting
- Conventional commits for clear history
- Component documentation with JSDoc

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Component Library](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### Community
- [GitHub Issues](https://github.com/vistara-apps/syncflow-ai/issues)
- [Discussions](https://github.com/vistara-apps/syncflow-ai/discussions)
- Email: support@syncflow.ai

---

**Built with ❤️ by the SyncFlow AI Team**

*Making meeting scheduling effortless through the power of AI*
