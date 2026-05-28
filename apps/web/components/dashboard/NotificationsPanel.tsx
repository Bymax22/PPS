// components/dashboard/NotificationsPanel.tsx
import { Bell, MessageCircle, Calendar, Award, CreditCard, AlertCircle, CheckCircle, BookOpen, Clock, FileText } from 'lucide-react'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  title: string
  body: string
  link?: string
  read: boolean
  readAt?: Date
  createdAt: Date
  metadata?: string
}

interface NotificationsPanelProps {
  notifications: Notification[]
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
}

export default function NotificationsPanel({ notifications, onMarkAsRead, onMarkAllAsRead }: NotificationsPanelProps) {
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'LESSON_STARTING':
        return <Calendar className="w-4 h-4" />
      case 'HOMEWORK_DUE':
        return <AlertCircle className="w-4 h-4" />
      case 'GRADE_PUBLISHED':
        return <Award className="w-4 h-4" />
      case 'EXAM_SCORE':
        return <CheckCircle className="w-4 h-4" />
      case 'ATTENDANCE_LOW':
        return <AlertCircle className="w-4 h-4" />
      case 'PAYMENT_EXPIRING':
        return <CreditCard className="w-4 h-4" />
      case 'ANNOUNCEMENT':
        return <Bell className="w-4 h-4" />
      case 'MESSAGE':
        return <MessageCircle className="w-4 h-4" />
      case 'ASSIGNMENT_FEEDBACK':
        return <FileText className="w-4 h-4" />
      case 'CATCH_UP_RECOMMENDED':
        return <Clock className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch(type) {
      case 'LESSON_STARTING':
        return '#0EF117'
      case 'PAYMENT_EXPIRING':
        return '#dc2626'
      case 'GRADE_PUBLISHED':
      case 'EXAM_SCORE':
        return '#003087'
      case 'ATTENDANCE_LOW':
        return '#f59e0b'
      case 'MESSAGE':
        return '#003087'
      case 'CATCH_UP_RECOMMENDED':
        return '#0EF117'
      default:
        return '#003087'
    }
  }

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    return new Date(date).toLocaleDateString()
  }

  const handleMarkAsRead = (id: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(id)
    }
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No new notifications</p>
        <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-4">
      {/* Header with mark all as read button */}
      {unreadCount > 0 && onMarkAllAsRead && (
        <div className="flex justify-end">
          <button
            onClick={onMarkAllAsRead}
            className="text-xs font-medium hover:opacity-80 transition-opacity px-2 py-1 rounded"
            style={{ color: '#003087' }}
          >
            Mark all as read
          </button>
        </div>
      )}

      {/* Notifications list */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-4 rounded-lg transition-all cursor-pointer ${
              !notification.read ? 'bg-gray-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => !notification.read && handleMarkAsRead(notification.id)}
          >
            <div className="flex gap-3">
              {/* Icon */}
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${getNotificationColor(notification.type)}15` }}
              >
                <div style={{ color: getNotificationColor(notification.type) }}>
                  {getNotificationIcon(notification.type)}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {notification.title}
                    {!notification.read && (
                      <span 
                        className="inline-block w-2 h-2 rounded-full ml-2"
                        style={{ backgroundColor: '#0EF117' }}
                      />
                    )}
                  </h4>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {getTimeAgo(notification.createdAt)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {notification.body}
                </p>
                
                {/* Metadata if present */}
                {notification.metadata && (
                  <div className="mt-2 text-xs text-gray-400 bg-gray-100 p-2 rounded">
                    {notification.metadata}
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="flex items-center gap-3 mt-2">
                  {notification.link && (
                    <Link 
                      href={notification.link}
                      className="text-xs font-medium hover:opacity-80 transition-opacity inline-flex items-center gap-1"
                      style={{ color: '#003087' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Details →
                    </Link>
                  )}
                  
                  {!notification.read && onMarkAsRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsRead(notification.id)
                      }}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* View all link */}
      <Link 
        href="/student/notifications"
        className="block text-center py-3 text-sm font-medium hover:opacity-80 transition-opacity mt-2 border-t border-gray-100 pt-4"
        style={{ color: '#003087' }}
      >
        View All Notifications
      </Link>
    </div>
  )
}