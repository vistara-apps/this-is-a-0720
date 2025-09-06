import React, { useState } from 'react'
import { Calendar, Clock, Users, Video, Edit3, Trash2, Copy, MoreHorizontal } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { format, isToday, isTomorrow, isPast } from 'date-fns'

export default function MeetingManager() {
  const { state, dispatch } = useApp()
  const { meetings } = state
  const [filter, setFilter] = useState('all')
  const [selectedMeeting, setSelectedMeeting] = useState(null)

  const filterMeetings = (meetings, filter) => {
    const now = new Date()
    switch(filter) {
      case 'today':
        return meetings.filter(meeting => isToday(new Date(meeting.startTime)))
      case 'upcoming':
        return meetings.filter(meeting => new Date(meeting.startTime) > now)
      case 'past':
        return meetings.filter(meeting => isPast(new Date(meeting.startTime)))
      default:
        return meetings
    }
  }

  const filteredMeetings = filterMeetings(meetings, filter)

  const getTimeDisplay = (startTime, endTime) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    
    if (isToday(start)) {
      return `Today, ${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`
    } else if (isTomorrow(start)) {
      return `Tomorrow, ${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`
    } else {
      return `${format(start, 'MMM d, h:mm a')} - ${format(end, 'h:mm a')}`
    }
  }

  const getMeetingStatus = (meeting) => {
    const now = new Date()
    const startTime = new Date(meeting.startTime)
    const endTime = new Date(meeting.endTime)

    if (isPast(endTime)) return { status: 'completed', color: 'text-green-400' }
    if (now >= startTime && now <= endTime) return { status: 'in-progress', color: 'text-blue-400' }
    if (startTime > now) return { status: 'upcoming', color: 'text-orange-400' }
    return { status: 'scheduled', color: 'text-white/70' }
  }

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link)
    // You would typically show a toast notification here
  }

  const handleDeleteMeeting = (meetingId) => {
    dispatch({ type: 'DELETE_MEETING', payload: meetingId })
  }

  const filterOptions = [
    { value: 'all', label: 'All Meetings' },
    { value: 'today', label: 'Today' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Meeting Manager</h1>
          <p className="text-lg text-white/80 mt-2">View and manage all your scheduled meetings</p>
        </div>
        
        <button className="bg-primary hover:bg-primary/80 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Schedule New Meeting</span>
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                filter === option.value
                  ? 'bg-primary text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map((meeting) => {
            const meetingStatus = getMeetingStatus(meeting)
            
            return (
              <div key={meeting.id} className="glass-card rounded-lg p-6 hover:bg-white/15 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{meeting.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full bg-white/10 ${meetingStatus.color}`}>
                        {meetingStatus.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-white/70">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{getTimeDisplay(meeting.startTime, meeting.endTime)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">
                          {meeting.attendees.length} attendee{meeting.attendees.length !== 1 ? 's' : ''}
                        </span>
                        <span className="text-xs text-white/50">
                          ({meeting.attendees.slice(0, 2).join(', ')}{meeting.attendees.length > 2 && `, +${meeting.attendees.length - 2} more`})
                        </span>
                      </div>
                      
                      {meeting.meetingLink && (
                        <div className="flex items-center space-x-2">
                          <Video className="w-4 h-4" />
                          <span className="text-sm">Meeting link available</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {meeting.meetingLink && (
                      <button
                        onClick={() => handleCopyLink(meeting.meetingLink)}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Copy meeting link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => setSelectedMeeting(meeting)}
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Edit meeting"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteMeeting(meeting.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete meeting"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex flex-wrap gap-2">
                    {meeting.meetingLink && (
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full hover:bg-green-500/30 transition-colors"
                      >
                        <Video className="w-3 h-3" />
                        <span>Join Meeting</span>
                      </a>
                    )}
                    
                    <button className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full hover:bg-blue-500/30 transition-colors">
                      <Calendar className="w-3 h-3" />
                      <span>View in Calendar</span>
                    </button>
                    
                    <button className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full hover:bg-purple-500/30 transition-colors">
                      <Users className="w-3 h-3" />
                      <span>Manage Attendees</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="glass-card rounded-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No meetings found</h3>
            <p className="text-white/70 mb-6">
              {filter === 'all' 
                ? "You don't have any meetings scheduled yet."
                : `No ${filter} meetings to show.`
              }
            </p>
            <button className="bg-primary hover:bg-primary/80 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Schedule Your First Meeting
            </button>
          </div>
        )}
      </div>

      {/* Meeting Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-white mb-2">
            {meetings.filter(m => isToday(new Date(m.startTime))).length}
          </div>
          <div className="text-white/70 text-sm">Today's Meetings</div>
        </div>
        
        <div className="glass-card rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-white mb-2">
            {meetings.filter(m => new Date(m.startTime) > new Date()).length}
          </div>
          <div className="text-white/70 text-sm">Upcoming Meetings</div>
        </div>
        
        <div className="glass-card rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-white mb-2">
            {meetings.reduce((total, meeting) => total + meeting.attendees.length, 0)}
          </div>
          <div className="text-white/70 text-sm">Total Participants</div>
        </div>
      </div>
    </div>
  )
}