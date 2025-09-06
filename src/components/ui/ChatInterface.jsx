/**
 * ChatInterface Component - SyncFlow AI Design System
 * Enhanced chat interface with natural language processing and smart suggestions
 */

import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, Sparkles, Calendar, Clock, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { parseSchedulingRequest, generateMeetingSuggestions, findOptimalTimeSlots } from '../../utils/scheduling'
import apiService from '../../services/api'
import Button from './Button'
import Input from './Input'

export default function ChatInterface({ variant = 'inputFocused' }) {
  const { state, dispatch } = useApp()
  const { chatHistory } = state
  const [message, setMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  // Focus input when component mounts
  useEffect(() => {
    if (variant === 'inputFocused' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [variant])

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

    try {
      // Parse the scheduling request
      const parsedRequest = parseSchedulingRequest(message)
      
      // Generate AI response using OpenAI API
      const aiResponse = await apiService.processNaturalLanguageRequest(message, {
        userPreferences: state.user,
        calendarIntegrations: state.calendarIntegrations,
        existingMeetings: state.meetings
      })

      // Generate smart suggestions
      const smartSuggestions = generateMeetingSuggestions(parsedRequest, state.user)
      setSuggestions(smartSuggestions)

      // Find optimal time slots if this is a scheduling request
      let timeSlots = []
      if (parsedRequest.attendees.length > 0 || message.toLowerCase().includes('schedule')) {
        timeSlots = findOptimalTimeSlots(parsedRequest.attendees, {
          duration: parsedRequest.duration,
          timeframe: parsedRequest.timeframe
        })
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse.message || generateFallbackResponse(parsedRequest),
        timestamp: new Date().toISOString(),
        suggestions: smartSuggestions,
        timeSlots: timeSlots,
        parsedRequest: parsedRequest
      }

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: botMessage })
    } catch (error) {
      console.error('Error processing message:', error)
      
      // Fallback to local processing
      const parsedRequest = parseSchedulingRequest(message)
      const fallbackResponse = generateFallbackResponse(parsedRequest)
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: fallbackResponse,
        timestamp: new Date().toISOString(),
        parsedRequest: parsedRequest
      }

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: botMessage })
    } finally {
      setIsProcessing(false)
    }
  }

  const generateFallbackResponse = (request) => {
    let response = "I understand you'd like to schedule a meeting. "
    
    if (request.urgency === 'urgent') {
      response += "Given the urgency, I'll prioritize finding immediate availability. "
    }
    
    if (request.attendees.length > 0) {
      response += `I'll check availability for ${request.attendees.length} attendee${request.attendees.length > 1 ? 's' : ''}. `
    }
    
    if (request.duration !== 60) {
      response += `I've noted this should be a ${request.duration}-minute meeting. `
    }
    
    response += "Let me find the best available time slots for everyone."
    
    return response
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion.message)
    inputRef.current?.focus()
  }

  const handleTimeSlotSelect = async (slot) => {
    try {
      const meetingData = {
        title: 'New Meeting',
        startTime: slot.startTime,
        endTime: slot.endTime,
        attendees: [], // Would be populated from the parsed request
        description: 'Meeting scheduled via SyncFlow AI'
      }

      const newMeeting = await apiService.createMeeting(meetingData)
      dispatch({ type: 'ADD_MEETING', payload: newMeeting })

      const confirmationMessage = {
        id: Date.now(),
        type: 'ai',
        content: `Perfect! I've scheduled your meeting for ${new Date(slot.startTime).toLocaleString()}. Calendar invites will be sent shortly.`,
        timestamp: new Date().toISOString()
      }

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: confirmationMessage })
    } catch (error) {
      console.error('Error creating meeting:', error)
    }
  }

  const quickSuggestions = [
    { icon: Calendar, text: "Schedule a team meeting for tomorrow", type: "schedule" },
    { icon: Clock, text: "Find time for a 30-minute call this week", type: "schedule" },
    { icon: Users, text: "Set up a client demo next Tuesday", type: "schedule" },
    { icon: Sparkles, text: "What's my availability today?", type: "query" }
  ]

  return (
    <div className="flex flex-col h-full bg-surface rounded-lg shadow-card">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h3 className="font-semibold text-text-primary">AI Scheduling Assistant</h3>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-accent mx-auto mb-4" />
            <h4 className="text-lg font-medium text-text-primary mb-2">
              Welcome to SyncFlow AI
            </h4>
            <p className="text-text-secondary mb-6">
              I can help you schedule meetings using natural language. Try asking me to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex items-center gap-3 p-3 text-left bg-bg hover:bg-gray-50 rounded-lg border transition-colors"
                >
                  <suggestion.icon className="h-5 w-5 text-accent" />
                  <span className="text-sm text-text-primary">{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              msg.type === 'user' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-text-primary'
            }`}>
              <p className="text-sm">{msg.content}</p>
              
              {/* Time slots for AI messages */}
              {msg.type === 'ai' && msg.timeSlots && msg.timeSlots.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium">Suggested times:</p>
                  {msg.timeSlots.slice(0, 3).map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSlotSelect(slot)}
                      className="block w-full text-left p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-xs font-medium text-text-primary">
                        {new Date(slot.startTime).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {new Date(slot.startTime).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })} - {new Date(slot.endTime).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <div className="text-xs text-green-600">
                        {slot.confidence}% confidence
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              <div className="text-xs opacity-70 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-accent border-t-transparent rounded-full"></div>
                <span className="text-sm text-text-secondary">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type your scheduling request..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isProcessing}
            size="md"
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="md"
            className="px-3"
            disabled={isProcessing}
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
