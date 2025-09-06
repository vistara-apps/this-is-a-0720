/**
 * Input Component - SyncFlow AI Design System
 * Enhanced input with icon support and validation states
 */

import React from 'react'
import { cn } from '../../utils/cn'

export default function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  error = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) {
  const baseClasses = 'w-full px-3 py-2 border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50' 
    : 'border-gray-300 focus:border-primary'
  
  const iconClasses = Icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''
  
  return (
    <div className="relative">
      {Icon && iconPosition === 'left' && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(baseClasses, stateClasses, iconClasses, className)}
        {...props}
      />
      
      {Icon && iconPosition === 'right' && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
    </div>
  )
}
