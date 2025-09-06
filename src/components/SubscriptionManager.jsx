/**
 * SubscriptionManager Component - SyncFlow AI
 * Handles subscription plans, billing, and Stripe integration
 */

import React, { useState, useEffect } from 'react'
import { Check, Crown, Zap, CreditCard, AlertCircle } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import apiService from '../services/api'
import Button from './ui/Button'
import Modal from './ui/Modal'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export default function SubscriptionManager() {
  const [currentPlan, setCurrentPlan] = useState('free')
  const [isLoading, setIsLoading] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [billingHistory, setBillingHistory] = useState([])

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      description: 'Perfect for trying out SyncFlow AI',
      features: [
        '5 meetings per month',
        'Basic calendar integration',
        'Email support',
        'Standard meeting templates'
      ],
      limitations: [
        'Limited AI suggestions',
        'No team features',
        'Basic analytics'
      ],
      icon: Zap,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 7,
      interval: 'month',
      description: 'Essential features for individual users',
      features: [
        'Unlimited meetings',
        'Advanced calendar integration',
        'AI-powered scheduling',
        'Priority email support',
        'Custom meeting templates',
        'Basic analytics'
      ],
      limitations: [
        'No team features',
        'Limited integrations'
      ],
      icon: Check,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      popular: false
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 15,
      interval: 'month',
      description: 'Advanced AI and team collaboration',
      features: [
        'Everything in Basic',
        'Advanced AI suggestions',
        'Team scheduling',
        'Multiple calendar accounts',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'Meeting insights',
        'Bulk scheduling'
      ],
      limitations: [],
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      popular: true
    }
  ]

  useEffect(() => {
    loadUserSubscription()
    loadBillingHistory()
  }, [])

  const loadUserSubscription = async () => {
    try {
      const profile = await apiService.getUserProfile()
      setCurrentPlan(profile.subscription?.plan || 'free')
    } catch (error) {
      console.error('Error loading subscription:', error)
    }
  }

  const loadBillingHistory = async () => {
    try {
      // Mock billing history - in real app, this would come from Stripe
      setBillingHistory([
        {
          id: '1',
          date: '2024-01-01',
          amount: 15,
          status: 'paid',
          plan: 'Professional'
        },
        {
          id: '2',
          date: '2023-12-01',
          amount: 15,
          status: 'paid',
          plan: 'Professional'
        }
      ])
    } catch (error) {
      console.error('Error loading billing history:', error)
    }
  }

  const handleUpgrade = async (planId) => {
    setSelectedPlan(planId)
    setShowUpgradeModal(true)
  }

  const confirmUpgrade = async () => {
    if (!selectedPlan) return

    setIsLoading(true)
    
    try {
      const stripe = await stripePromise
      const plan = plans.find(p => p.id === selectedPlan)
      
      if (plan.price === 0) {
        // Handle free plan
        setCurrentPlan('free')
        setShowUpgradeModal(false)
        return
      }

      // Create payment intent
      const { clientSecret } = await apiService.createPaymentIntent(
        plan.price * 100, // Convert to cents
        'usd'
      )

      // Redirect to Stripe Checkout or use Elements
      // For demo purposes, we'll simulate successful payment
      setTimeout(() => {
        setCurrentPlan(selectedPlan)
        setShowUpgradeModal(false)
        setIsLoading(false)
        
        // Show success message
        alert(`Successfully upgraded to ${plan.name} plan!`)
      }, 2000)

    } catch (error) {
      console.error('Upgrade error:', error)
      setIsLoading(false)
      alert('Upgrade failed. Please try again.')
    }
  }

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        await apiService.cancelSubscription('current-subscription-id')
        setCurrentPlan('free')
        alert('Subscription cancelled successfully.')
      } catch (error) {
        console.error('Cancellation error:', error)
        alert('Failed to cancel subscription. Please contact support.')
      }
    }
  }

  const getCurrentPlanDetails = () => {
    return plans.find(plan => plan.id === currentPlan) || plans[0]
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Current Plan Status */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Subscription</h2>
        
        <div className="bg-surface rounded-lg shadow-card p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                Current Plan: {getCurrentPlanDetails().name}
              </h3>
              <p className="text-text-secondary">
                {getCurrentPlanDetails().price > 0 
                  ? `$${getCurrentPlanDetails().price}/month`
                  : 'Free forever'
                }
              </p>
            </div>
            
            {currentPlan !== 'free' && (
              <Button
                variant="ghost"
                onClick={handleCancelSubscription}
                className="text-red-600 hover:text-red-700"
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-text-primary mb-6">Choose Your Plan</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrentPlan = currentPlan === plan.id
            
            return (
              <div
                key={plan.id}
                className={`relative p-6 rounded-lg border-2 transition-all duration-200 ${
                  plan.popular 
                    ? 'border-primary shadow-lg scale-105' 
                    : isCurrentPlan
                    ? `${plan.borderColor} ${plan.bgColor}`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <Icon className={`h-8 w-8 mx-auto mb-3 ${plan.color}`} />
                  <h4 className="text-xl font-semibold text-text-primary">{plan.name}</h4>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-text-primary">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-text-secondary">/{plan.interval}</span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-text-primary">{feature}</span>
                    </li>
                  ))}
                  
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-500">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isCurrentPlan ? 'secondary' : 'primary'}
                  className="w-full"
                  disabled={isCurrentPlan}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Billing History */}
      {billingHistory.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-4">Billing History</h3>
          
          <div className="bg-surface rounded-lg shadow-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {billingHistory.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {invoice.plan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      ${invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upgrade Confirmation Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Confirm Upgrade"
        variant="confirmation"
        onConfirm={confirmUpgrade}
        onCancel={() => setShowUpgradeModal(false)}
        confirmText="Upgrade Now"
        cancelText="Cancel"
        confirmLoading={isLoading}
      >
        {selectedPlan && (
          <div className="space-y-4">
            <p className="text-text-secondary">
              You're about to upgrade to the <strong>{plans.find(p => p.id === selectedPlan)?.name}</strong> plan.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-text-primary">Monthly charge:</span>
                <span className="font-semibold text-text-primary">
                  ${plans.find(p => p.id === selectedPlan)?.price}/month
                </span>
              </div>
            </div>
            
            <p className="text-sm text-text-secondary">
              Your subscription will be charged monthly and you can cancel at any time.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
