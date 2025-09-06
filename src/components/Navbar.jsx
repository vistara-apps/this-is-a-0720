import React from 'react'
import { Calendar, MessageCircle, Settings, BarChart3, Menu } from 'lucide-react'

export default function Navbar({ activeView, setActiveView }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'schedule', label: 'Schedule', icon: MessageCircle },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'calendar', label: 'Calendar', icon: Settings }
  ]

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <span className="text-white font-bold text-xl">SyncFlow AI</span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeView === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>

          <button className="md:hidden p-2 text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  )
}