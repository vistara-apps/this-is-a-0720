import React, { useState } from 'react'
import { Send, Calendar, Clock, Users, Mic, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function SchedulingInterface() {
  const { state, dispatch } = useApp()
  const { chatHistory } = state
  const [message, setMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage })
    setMessage('')
    setIsProcessing(true)

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(message)
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiResponse })
      setIsProcessing(false)
    }, 2000)
  }

  const generateAIResponse = (userMessage) => {
    let response = "I understand you'd like to schedule a meeting. "
    
    if (userMessage.toLowerCase().includes('tomorrow')) {
      response += "I've checked your availability for tomorrow and found these options: 10:00 AM, 2:00 PM, or 4:00 PM. Which works best for you?"
    } else if (userMessage.toLowerCase().includes('next week')) {
      response += "Looking at next week, I can see open slots on Tuesday at 11:00 AM, Wednesday at 3:00 PM, and Friday at 9:00 AM. Shall I book one of these?"
    } else if (userMessage.toLowerCase().includes('meeting')) {
      response += "I can help schedule that meeting. Could you please specify: the duration, preferred date/time, and who should be invited?"
    } else {
      response += "Let me help you schedule that. What time frame works best for you, and who would you like to invite?"
    }

    return {
      id: Date.now() + 1,
      type: 'ai',
      content: response,
      timestamp: new Date().toISOString(),
      suggestions: [
        'Schedule for tomorrow at 10 AM',
        'Find time next week',
        'Check my availability'
      ]
    }
  }

  const quickActions = [
    { text: 'Schedule a team meeting for next week', icon: Users },
    { text: 'Find time for a 30-minute call tomorrow', icon: Clock },
    { text: 'Book a client demo this Friday', icon: Calendar },
    { text: 'Schedule daily standup recurring', icon: Sparkles }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white">AI Scheduling Assistant</h1>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Just tell me what meeting you need, and I'll handle the scheduling for you
        </p>
      </div>

      {/* Chat Interface */}
      <div className="glass-card rounded-lg overflow-hidden">
        {/* Chat Header */}
        <div className="bg-white/10 px-6 py-4 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium">SyncFlow AI Assistant</h3>
              <p className="text-white/70 text-sm">Ready to help you schedule meetings</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {chatHistory.length === 0 ? (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/70 mb-4">Hi! I'm your AI scheduling assistant.</p>
              <p className="text-white/60 text-sm">Try saying something like "Schedule a meeting with John tomorrow at 2 PM"</p>
            </div>
          ) : (
            chatHistory.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-white border border-white/20'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setMessage(suggestion)}
                          className="block w-full text-left px-3 py-2 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-white border border-white/20 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="bg-white/5 p-4 border-t border-white/20">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your scheduling request..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-white/60 hover:text-white transition-colors">
                <Mic className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isProcessing}
              className="bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-white p-3 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                onClick={() => setMessage(action.text)}
                className="flex items-center space-x-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 text-left border border-white/20"
              >
                <Icon className="w-5 h-5 text-accent" />
                <span className="text-white text-sm">{action.text}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-lg p-6 text-center">
          <Calendar className="w-8 h-8 text-accent mx-auto mb-3" />
          <h4 className="text-white font-medium mb-2">Smart Scheduling</h4>
          <p className="text-white/70 text-sm">AI finds the best times based on everyone's availability</p>
        </div>
        
        <div className="glass-card rounded-lg p-6 text-center">
          <Clock className="w-8 h-8 text-accent mx-auto mb-3" />
          <h4 className="text-white font-medium mb-2">Time Zone Aware</h4>
          <p className="text-white/70 text-sm">Automatically handles different time zones for global teams</p>
        </div>
        
        <div className="glass-card rounded-lg p-6 text-center">
          <Users className="w-8 h-8 text-accent mx-auto mb-3" />
          <h4 className="text-white font-medium mb-2">Auto Invites</h4>
          <p className="text-white/70 text-sm">Sends professional invites with meeting links automatically</p>
        </div>
      </div>
    </div>
  )
}