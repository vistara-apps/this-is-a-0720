import React, { useState } from 'react'
import { Calendar, CheckCircle, Plus, Settings, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function CalendarIntegration() {
  const { state, dispatch } = useApp()
  const { calendarIntegrations } = state
  const [isConnecting, setIsConnecting] = useState(null)

  const handleConnect = async (provider) => {
    setIsConnecting(provider)
    
    // Simulate OAuth flow
    setTimeout(() => {
      dispatch({
        type: 'CONNECT_CALENDAR',
        payload: {
          provider,
          email: provider === 'Google' ? 'user@gmail.com' : 'user@outlook.com'
        }
      })
      setIsConnecting(null)
    }, 2000)
  }

  const calendarProviders = [
    {
      name: 'Google Calendar',
      provider: 'Google',
      logo: '🟡', // Using emoji for demo
      description: 'Connect your Google Calendar to sync events and availability',
      features: ['Read calendar events', 'Create new meetings', 'Check availability', 'Send invites']
    },
    {
      name: 'Microsoft Outlook',
      provider: 'Outlook',
      logo: '🔵',
      description: 'Connect your Outlook calendar for seamless scheduling',
      features: ['Read calendar events', 'Create new meetings', 'Check availability', 'Send invites']
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Calendar Integration</h1>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Connect your calendars to enable smart scheduling and availability checking
        </p>
      </div>

      {/* Integration Status */}
      <div className="glass-card rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Connected Calendars</h2>
        
        <div className="space-y-3">
          {calendarIntegrations.map((integration, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    {integration.provider === 'Google' ? '🟡' : '🔵'}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{integration.provider} Calendar</h3>
                    <p className="text-white/70 text-sm">
                      {integration.connected ? integration.email : 'Not connected'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {integration.connected ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium">Connected</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                      <span className="text-orange-400 font-medium">Disconnected</span>
                    </div>
                  )}
                  
                  <button className="p-2 text-white/70 hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {calendarProviders.map((provider) => {
          const integration = calendarIntegrations.find(int => int.provider === provider.provider)
          const isConnected = integration?.connected
          const connecting = isConnecting === provider.provider

          return (
            <div key={provider.provider} className="glass-card rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                  {provider.logo}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{provider.name}</h3>
                  <p className="text-white/70 text-sm mb-4">{provider.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <h4 className="text-white font-medium text-sm">Features:</h4>
                    <ul className="space-y-1">
                      {provider.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-white/70 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => !isConnected && handleConnect(provider.provider)}
                    disabled={isConnected || connecting}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                      isConnected
                        ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                        : connecting
                        ? 'bg-white/10 text-white/50 cursor-not-allowed'
                        : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Connected</span>
                      </>
                    ) : connecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Connect {provider.provider}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips */}
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">💡 Integration Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-white font-medium">For Best Results:</h4>
            <ul className="space-y-1 text-white/70 text-sm">
              <li>• Connect all calendars you use regularly</li>
              <li>• Keep your calendars up-to-date</li>
              <li>• Set proper working hours in each calendar</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-white font-medium">Privacy & Security:</h4>
            <ul className="space-y-1 text-white/70 text-sm">
              <li>• We only read availability, not content</li>
              <li>• Your data is encrypted and secure</li>
              <li>• Disconnect anytime in settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}