import React from 'react'
import { Calendar, Clock, Users, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { format, isToday, isTomorrow } from 'date-fns'

export default function Dashboard() {
  const { state } = useApp()
  const { meetings, calendarIntegrations } = state

  const upcomingMeetings = meetings
    .filter(meeting => new Date(meeting.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 3)

  const todaysMeetings = meetings.filter(meeting => 
    isToday(new Date(meeting.startTime))
  )

  const connectedCalendars = calendarIntegrations.filter(cal => cal.connected).length

  const stats = [
    {
      title: 'Today\'s Meetings',
      value: todaysMeetings.length,
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'This Week',
      value: meetings.length,
      icon: Clock,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Connected Calendars',
      value: connectedCalendars,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'Success Rate',
      value: '98%',
      icon: TrendingUp,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    }
  ]

  const getTimeDisplay = (startTime) => {
    const date = new Date(startTime)
    if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`
    if (isTomorrow(date)) return `Tomorrow at ${format(date, 'h:mm a')}`
    return format(date, 'MMM d, h:mm a')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          Welcome to SyncFlow AI
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Effortless AI-powered meeting scheduling that integrates seamlessly with your calendar.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="glass-card rounded-lg p-6 animate-slide-up" style={{animationDelay: `${index * 100}ms`}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Meetings */}
        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Upcoming Meetings</h2>
            <Calendar className="w-5 h-5 text-white/70" />
          </div>
          
          <div className="space-y-4">
            {upcomingMeetings.length > 0 ? (
              upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{meeting.title}</h3>
                      <p className="text-white/70 text-sm mt-1">
                        {getTimeDisplay(meeting.startTime)}
                      </p>
                      <p className="text-white/60 text-xs mt-1">
                        {meeting.attendees.length} attendee(s)
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-white/70">Confirmed</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/70">No upcoming meetings scheduled</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <button className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Schedule New Meeting</span>
            </button>
            
            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Check Availability</span>
            </button>
            
            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Manage Calendars</span>
            </button>
          </div>

          {/* Calendar Status */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <h3 className="text-white font-medium mb-3">Calendar Status</h3>
            <div className="space-y-2">
              {calendarIntegrations.map((integration, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white/70">{integration.provider}</span>
                  <div className="flex items-center space-x-2">
                    {integration.connected ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">Connected</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400 text-sm">Not Connected</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}