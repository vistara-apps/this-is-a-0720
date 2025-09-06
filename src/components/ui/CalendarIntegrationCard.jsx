/**
 * CalendarIntegrationCard Component - SyncFlow AI Design System
 * Enhanced calendar integration with OAuth flows and status management
 */

import React, { useState } from 'react'
import { Calendar, CheckCircle, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import apiService from '../../services/api'
import Button from './Button'
import Modal from './Modal'

export default function CalendarIntegrationCard({ 
  provider, 
  connected = false, 
  email = null,
  variant = 'disconnected' 
}) {
  const { dispatch } = useApp()
  const [isConnecting, setIsConnecting] = useState(false)
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)
  const [lastSync, setLastSync] = useState(null)

  const providerConfig = {
    Google: {
      name: 'Google Calendar',
      icon: '🗓️',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      authUrl: 'https://accounts.google.com/oauth/authorize',
      scopes: ['https://www.googleapis.com/auth/calendar']
    },
    Outlook: {
      name: 'Microsoft Outlook',
      icon: '📅',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      scopes: ['https://graph.microsoft.com/calendars.read']
    }
  }

  const config = providerConfig[provider] || providerConfig.Google

  const handleConnect = async () => {
    setIsConnecting(true)
    
    try {
      // In a real implementation, this would redirect to OAuth flow
      // For demo purposes, we'll simulate the connection
      
      // Generate OAuth URL
      const authUrl = generateOAuthUrl(provider)
      
      // Open OAuth popup
      const popup = window.open(
        authUrl,
        'oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      )

      // Listen for OAuth callback
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          // Simulate successful connection
          handleOAuthSuccess()
        }
      }, 1000)

    } catch (error) {
      console.error('Connection error:', error)
      setIsConnecting(false)
    }
  }

  const generateOAuthUrl = (provider) => {
    const config = providerConfig[provider]
    const params = new URLSearchParams({
      client_id: 'your-client-id',
      redirect_uri: `${window.location.origin}/oauth/callback`,
      scope: config.scopes.join(' '),
      response_type: 'code',
      access_type: 'offline'
    })

    return `${config.authUrl}?${params.toString()}`
  }

  const handleOAuthSuccess = async () => {
    try {
      // Simulate API call to connect calendar
      const mockEmail = provider === 'Google' ? 'user@gmail.com' : 'user@outlook.com'
      
      // In real implementation, this would use the auth code from OAuth callback
      await apiService.connectGoogleCalendar('mock-auth-code')
      
      dispatch({
        type: 'CONNECT_CALENDAR',
        payload: { provider, email: mockEmail }
      })

      setLastSync(new Date())
      setIsConnecting(false)
    } catch (error) {
      console.error('OAuth success handling error:', error)
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      // API call to disconnect calendar
      // await apiService.disconnectCalendar(provider)
      
      dispatch({
        type: 'DISCONNECT_CALENDAR',
        payload: { provider }
      })

      setShowDisconnectModal(false)
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }

  const handleSync = async () => {
    try {
      setIsConnecting(true)
      
      // Sync calendar events
      const events = await apiService.getGoogleCalendarEvents(
        new Date().toISOString(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      )

      setLastSync(new Date())
      setIsConnecting(false)
    } catch (error) {
      console.error('Sync error:', error)
      setIsConnecting(false)
    }
  }

  return (
    <>
      <div className={`p-6 rounded-lg border-2 transition-all duration-200 ${
        connected 
          ? `${config.bgColor} ${config.borderColor} border-solid` 
          : 'bg-gray-50 border-gray-200 border-dashed hover:border-gray-300'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${connected ? config.bgColor : 'bg-gray-100'}`}>
              <span className="text-2xl">{config.icon}</span>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{config.name}</h3>
              {connected && email && (
                <p className="text-sm text-text-secondary">{email}</p>
              )}
              {connected && lastSync && (
                <p className="text-xs text-text-secondary">
                  Last synced: {lastSync.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {connected ? (
              <CheckCircle className={`h-5 w-5 ${config.color}`} />
            ) : (
              <AlertCircle className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>

        <div className="mt-4">
          {connected ? (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSync}
                loading={isConnecting}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Sync Now
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDisconnectModal(true)}
                className="text-red-600 hover:text-red-700"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-text-secondary mb-3">
                Connect your {config.name} to enable automatic scheduling and availability checking.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConnect}
                loading={isConnecting}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Connect {provider}
              </Button>
            </div>
          )}
        </div>

        {/* Connection Status Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Status</span>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                connected ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <span className={connected ? 'text-green-600' : 'text-gray-500'}>
                {connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Disconnect Confirmation Modal */}
      <Modal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        title="Disconnect Calendar"
        variant="confirmation"
        onConfirm={handleDisconnect}
        onCancel={() => setShowDisconnectModal(false)}
        confirmText="Disconnect"
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Are you sure you want to disconnect your {config.name}? This will:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary">
            <li>Stop automatic availability checking</li>
            <li>Disable calendar event creation</li>
            <li>Remove access to your calendar data</li>
          </ul>
          <p className="text-sm text-text-secondary">
            You can reconnect at any time.
          </p>
        </div>
      </Modal>
    </>
  )
}
