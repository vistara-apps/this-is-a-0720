/**
 * Scheduling Utilities for SyncFlow AI
 * Contains business logic for intelligent meeting scheduling and time optimization
 */

import { format, addMinutes, addDays, startOfDay, endOfDay, isWithinInterval, parseISO } from 'date-fns'

/**
 * Finds optimal meeting times based on participant availability and preferences
 */
export function findOptimalTimeSlots(participants, preferences = {}) {
  const {
    duration = 60, // minutes
    preferredTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    daysAhead = 7,
    workingHours = { start: '09:00', end: '17:00' },
    timeZone = 'America/New_York'
  } = preferences

  const slots = []
  const today = new Date()

  // Generate potential time slots for the next week
  for (let day = 1; day <= daysAhead; day++) {
    const currentDate = addDays(today, day)
    
    // Skip weekends unless specified
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      continue
    }

    preferredTimes.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number)
      const slotStart = new Date(currentDate)
      slotStart.setHours(hours, minutes, 0, 0)
      
      const slotEnd = addMinutes(slotStart, duration)
      
      // Check if slot is within working hours
      if (isWithinWorkingHours(slotStart, slotEnd, workingHours)) {
        const availability = checkParticipantAvailability(participants, slotStart, slotEnd)
        
        if (availability.allAvailable) {
          slots.push({
            startTime: slotStart.toISOString(),
            endTime: slotEnd.toISOString(),
            confidence: calculateConfidenceScore(slotStart, preferences),
            conflicts: availability.conflicts,
            participants: participants.length
          })
        }
      }
    })
  }

  // Sort by confidence score (highest first)
  return slots.sort((a, b) => b.confidence - a.confidence).slice(0, 5)
}

/**
 * Checks if a time slot is within working hours
 */
function isWithinWorkingHours(startTime, endTime, workingHours) {
  const startHour = startTime.getHours() + startTime.getMinutes() / 60
  const endHour = endTime.getHours() + endTime.getMinutes() / 60
  
  const workStart = parseTimeString(workingHours.start)
  const workEnd = parseTimeString(workingHours.end)
  
  return startHour >= workStart && endHour <= workEnd
}

/**
 * Parses time string (HH:MM) to decimal hours
 */
function parseTimeString(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours + minutes / 60
}

/**
 * Checks availability of all participants for a given time slot
 */
function checkParticipantAvailability(participants, startTime, endTime) {
  const conflicts = []
  let allAvailable = true

  participants.forEach(participant => {
    const participantConflicts = findConflicts(participant, startTime, endTime)
    if (participantConflicts.length > 0) {
      allAvailable = false
      conflicts.push({
        participant: participant.email,
        conflicts: participantConflicts
      })
    }
  })

  return { allAvailable, conflicts }
}

/**
 * Finds scheduling conflicts for a participant
 */
function findConflicts(participant, startTime, endTime) {
  if (!participant.calendar || !participant.calendar.events) {
    return []
  }

  return participant.calendar.events.filter(event => {
    const eventStart = parseISO(event.startTime)
    const eventEnd = parseISO(event.endTime)
    
    return isWithinInterval(startTime, { start: eventStart, end: eventEnd }) ||
           isWithinInterval(endTime, { start: eventStart, end: eventEnd }) ||
           isWithinInterval(eventStart, { start: startTime, end: endTime })
  })
}

/**
 * Calculates confidence score for a time slot based on various factors
 */
function calculateConfidenceScore(startTime, preferences) {
  let score = 100
  
  const hour = startTime.getHours()
  const dayOfWeek = startTime.getDay()
  
  // Prefer mid-morning and early afternoon
  if (hour >= 10 && hour <= 11) score += 20
  else if (hour >= 14 && hour <= 15) score += 15
  else if (hour >= 9 && hour <= 16) score += 10
  else score -= 20
  
  // Prefer Tuesday through Thursday
  if (dayOfWeek >= 2 && dayOfWeek <= 4) score += 15
  else if (dayOfWeek === 1 || dayOfWeek === 5) score += 5
  
  // Avoid very early or very late in the week
  const daysFromNow = Math.floor((startTime - new Date()) / (1000 * 60 * 60 * 24))
  if (daysFromNow >= 2 && daysFromNow <= 5) score += 10
  else if (daysFromNow === 1) score += 5
  
  return Math.max(0, Math.min(100, score))
}

/**
 * Processes natural language scheduling requests
 */
export function parseSchedulingRequest(message) {
  const request = {
    duration: extractDuration(message),
    timeframe: extractTimeframe(message),
    attendees: extractAttendees(message),
    meetingType: extractMeetingType(message),
    urgency: extractUrgency(message)
  }
  
  return request
}

/**
 * Extracts meeting duration from natural language
 */
function extractDuration(message) {
  const durationPatterns = [
    /(\d+)\s*(?:hour|hr|h)(?:s)?/i,
    /(\d+)\s*(?:minute|min|m)(?:s)?/i,
    /(?:half|30)\s*(?:hour|hr)/i,
    /(?:quarter|15)\s*(?:minute|min)/i
  ]
  
  for (const pattern of durationPatterns) {
    const match = message.match(pattern)
    if (match) {
      if (pattern.source.includes('hour')) {
        return parseInt(match[1]) * 60
      } else if (pattern.source.includes('minute')) {
        return parseInt(match[1])
      } else if (match[0].includes('half') || match[0].includes('30')) {
        return 30
      } else if (match[0].includes('quarter') || match[0].includes('15')) {
        return 15
      }
    }
  }
  
  return 60 // Default to 1 hour
}

/**
 * Extracts timeframe from natural language
 */
function extractTimeframe(message) {
  const timeframes = {
    'today': 0,
    'tomorrow': 1,
    'next week': 7,
    'this week': 3,
    'monday': getNextWeekday(1),
    'tuesday': getNextWeekday(2),
    'wednesday': getNextWeekday(3),
    'thursday': getNextWeekday(4),
    'friday': getNextWeekday(5)
  }
  
  for (const [phrase, days] of Object.entries(timeframes)) {
    if (message.toLowerCase().includes(phrase)) {
      return days
    }
  }
  
  return 3 // Default to 3 days from now
}

/**
 * Gets the number of days until the next occurrence of a weekday
 */
function getNextWeekday(targetDay) {
  const today = new Date().getDay()
  const daysUntil = (targetDay - today + 7) % 7
  return daysUntil === 0 ? 7 : daysUntil
}

/**
 * Extracts attendee emails from message
 */
function extractAttendees(message) {
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  const emails = message.match(emailPattern) || []
  
  return emails.map(email => ({ email, name: email.split('@')[0] }))
}

/**
 * Determines meeting type from context
 */
function extractMeetingType(message) {
  const types = {
    'standup': ['standup', 'daily', 'scrum'],
    'demo': ['demo', 'presentation', 'showcase'],
    'interview': ['interview', 'screening', 'hiring'],
    'review': ['review', 'feedback', 'retrospective'],
    'planning': ['planning', 'strategy', 'roadmap'],
    'general': ['meeting', 'call', 'discussion']
  }
  
  const lowerMessage = message.toLowerCase()
  
  for (const [type, keywords] of Object.entries(types)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return type
    }
  }
  
  return 'general'
}

/**
 * Determines urgency level from message
 */
function extractUrgency(message) {
  const urgentKeywords = ['urgent', 'asap', 'immediately', 'emergency', 'critical']
  const highKeywords = ['important', 'priority', 'soon', 'quickly']
  
  const lowerMessage = message.toLowerCase()
  
  if (urgentKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'urgent'
  } else if (highKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'high'
  }
  
  return 'normal'
}

/**
 * Generates meeting suggestions based on AI analysis
 */
export function generateMeetingSuggestions(request, userPreferences = {}) {
  const suggestions = []
  
  // Time-based suggestions
  if (request.urgency === 'urgent') {
    suggestions.push({
      type: 'time',
      message: 'Given the urgency, I recommend scheduling this within the next 24 hours.',
      action: 'prioritize_immediate_slots'
    })
  }
  
  // Duration suggestions
  if (request.meetingType === 'standup' && request.duration > 30) {
    suggestions.push({
      type: 'duration',
      message: 'Standups are typically more effective when kept to 15-30 minutes.',
      action: 'suggest_shorter_duration'
    })
  }
  
  // Attendee suggestions
  if (request.attendees.length > 8) {
    suggestions.push({
      type: 'attendees',
      message: 'Large meetings can be less productive. Consider if all attendees are necessary.',
      action: 'review_attendee_list'
    })
  }
  
  return suggestions
}

/**
 * Formats time slots for display
 */
export function formatTimeSlot(slot) {
  const startTime = new Date(slot.startTime)
  const endTime = new Date(slot.endTime)
  
  return {
    date: format(startTime, 'EEEE, MMMM do'),
    time: `${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}`,
    duration: Math.round((endTime - startTime) / (1000 * 60)),
    confidence: slot.confidence
  }
}
