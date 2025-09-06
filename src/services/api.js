/**
 * API Service Layer for SyncFlow AI
 * Handles all external API integrations including Google Calendar, Outlook, OpenAI, Zoom, and Stripe
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

class APIService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Google Calendar API Integration
  async connectGoogleCalendar(authCode) {
    return this.request('/calendar/google/connect', {
      method: 'POST',
      body: JSON.stringify({ authCode })
    })
  }

  async getGoogleCalendarEvents(startDate, endDate) {
    return this.request(`/calendar/google/events?start=${startDate}&end=${endDate}`)
  }

  async createGoogleCalendarEvent(eventData) {
    return this.request('/calendar/google/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    })
  }

  // Microsoft Graph (Outlook) API Integration
  async connectOutlookCalendar(authCode) {
    return this.request('/calendar/outlook/connect', {
      method: 'POST',
      body: JSON.stringify({ authCode })
    })
  }

  async getOutlookCalendarEvents(startDate, endDate) {
    return this.request(`/calendar/outlook/events?start=${startDate}&end=${endDate}`)
  }

  async createOutlookCalendarEvent(eventData) {
    return this.request('/calendar/outlook/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    })
  }

  // OpenAI API Integration
  async processNaturalLanguageRequest(message, context = {}) {
    return this.request('/ai/process-scheduling-request', {
      method: 'POST',
      body: JSON.stringify({ message, context })
    })
  }

  async generateSmartSuggestions(meetingData) {
    return this.request('/ai/smart-suggestions', {
      method: 'POST',
      body: JSON.stringify(meetingData)
    })
  }

  // Zoom API Integration
  async createZoomMeeting(meetingData) {
    return this.request('/zoom/meetings', {
      method: 'POST',
      body: JSON.stringify(meetingData)
    })
  }

  async updateZoomMeeting(meetingId, updateData) {
    return this.request(`/zoom/meetings/${meetingId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    })
  }

  async deleteZoomMeeting(meetingId) {
    return this.request(`/zoom/meetings/${meetingId}`, {
      method: 'DELETE'
    })
  }

  // Stripe Payment Integration
  async createPaymentIntent(amount, currency = 'usd') {
    return this.request('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, currency })
    })
  }

  async createSubscription(priceId, customerId) {
    return this.request('/payments/create-subscription', {
      method: 'POST',
      body: JSON.stringify({ priceId, customerId })
    })
  }

  async cancelSubscription(subscriptionId) {
    return this.request(`/payments/cancel-subscription/${subscriptionId}`, {
      method: 'POST'
    })
  }

  // User Management
  async getUserProfile() {
    return this.request('/user/profile')
  }

  async updateUserProfile(profileData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  }

  async getUserCalendarIntegrations() {
    return this.request('/user/calendar-integrations')
  }

  // Meeting Management
  async getMeetings(startDate, endDate) {
    return this.request(`/meetings?start=${startDate}&end=${endDate}`)
  }

  async createMeeting(meetingData) {
    return this.request('/meetings', {
      method: 'POST',
      body: JSON.stringify(meetingData)
    })
  }

  async updateMeeting(meetingId, updateData) {
    return this.request(`/meetings/${meetingId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    })
  }

  async deleteMeeting(meetingId) {
    return this.request(`/meetings/${meetingId}`, {
      method: 'DELETE'
    })
  }

  async sendMeetingInvites(meetingId) {
    return this.request(`/meetings/${meetingId}/send-invites`, {
      method: 'POST'
    })
  }

  // Availability Checking
  async checkAvailability(attendees, startDate, endDate, duration) {
    return this.request('/availability/check', {
      method: 'POST',
      body: JSON.stringify({ attendees, startDate, endDate, duration })
    })
  }

  async findOptimalTimeSlots(attendees, preferences) {
    return this.request('/availability/optimal-slots', {
      method: 'POST',
      body: JSON.stringify({ attendees, preferences })
    })
  }
}

export default new APIService()
