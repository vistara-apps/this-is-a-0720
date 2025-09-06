import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import CalendarIntegration from './components/CalendarIntegration'
import SchedulingInterface from './components/SchedulingInterface'
import MeetingManager from './components/MeetingManager'
import SubscriptionManager from './components/SubscriptionManager'
import ChatInterface from './components/ui/ChatInterface'
import { AppProvider } from './context/AppContext'

function App() {
  const [activeView, setActiveView] = useState('dashboard')

  const renderView = () => {
    switch(activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'calendar':
        return <CalendarIntegration />
      case 'schedule':
        return <ChatInterface />
      case 'meetings':
        return <MeetingManager />
      case 'subscription':
        return <SubscriptionManager />
      default:
        return <Dashboard />
    }
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-700">
        <Navbar activeView={activeView} setActiveView={setActiveView} />
        <main className="container mx-auto px-4 py-8">
          {renderView()}
        </main>
      </div>
    </AppProvider>
  )
}

export default App
