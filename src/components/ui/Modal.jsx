/**
 * Modal Component - SyncFlow AI Design System
 * Accessible modal with confirmation and settings variants
 */

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from './Button'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  variant = 'default',
  size = 'md',
  showCloseButton = true,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmLoading = false
}) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className={cn(
          'bg-surface rounded-lg shadow-modal w-full transform transition-all duration-200',
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer for confirmation variant */}
        {variant === 'confirmation' && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={onCancel || onClose}
            >
              {cancelText}
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              loading={confirmLoading}
            >
              {confirmText}
            </Button>
          </div>
        )}

        {/* Footer for settings variant */}
        {variant === 'settings' && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              loading={confirmLoading}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
