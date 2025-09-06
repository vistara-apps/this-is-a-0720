import React, { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  user: {
    email: 'user@example.com',
    timeZone: 'America/New_York',
    preferredMeetingTimes: ['09:00', '14:00']
  },
  calendarIntegrations: [
    { provider: 'Google', connected: true, email: 'user@gmail.com' },
    { provider: 'Outlook', connected: false, email: null }
  ],
  meetings: [
    {
      id: '1',
      title: 'Team Standup',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      attendees: ['john@example.com', 'jane@example.com'],
      status: 'Scheduled',
      meetingLink: 'https://zoom.us/j/123456789'
    },
    {
      id: '2',
      title: 'Client Demo',
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      attendees: ['client@example.com'],
      status: 'Scheduled',
      meetingLink: 'https://meet.google.com/xyz-abc-def'
    }
  ],
  chatHistory: []
}

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_MEETING':
      return {
        ...state,
        meetings: [...state.meetings, action.payload]
      }
    case 'UPDATE_MEETING':
      return {
        ...state,
        meetings: state.meetings.map(meeting => 
          meeting.id === action.payload.id ? action.payload : meeting
        )
      }
    case 'DELETE_MEETING':
      return {
        ...state,
        meetings: state.meetings.filter(meeting => meeting.id !== action.payload)
      }
    case 'CONNECT_CALENDAR':
      return {
        ...state,
        calendarIntegrations: state.calendarIntegrations.map(integration =>
          integration.provider === action.payload.provider
            ? { ...integration, connected: true, email: action.payload.email }
            : integration
        )
      }
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload]
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}