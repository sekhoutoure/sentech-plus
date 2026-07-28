// Centralized Notification & Multi-Channel Alert Service for SenTech Plus
import toast from 'react-hot-toast'

// 1. Toast Notifications (Client-side immediate feedback)
export const notifyToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  dismiss: (id?: string) => toast.dismiss(id),
}

// 2. Email Notifications (Transactional Emails via Resend / Nodemailer)
export interface EmailPayload {
  to: string
  subject: string
  html: string
}

export async function sendEmailNotification(payload: EmailPayload) {
  try {
    const res = await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return await res.json()
  } catch (err) {
    console.error('Email Notification Error:', err)
    return { success: false, error: err }
  }
}

// 3. SMS Notifications (Sénégal Mobile SMS via Twilio / Orange SMS API)
export interface SMSPayload {
  phoneNumber: string // Ex: +221770000000
  message: string
}

export async function sendSMSNotification(payload: SMSPayload) {
  try {
    const res = await fetch('/api/notifications/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return await res.json()
  } catch (err) {
    console.error('SMS Notification Error:', err)
    return { success: false, error: err }
  }
}

// 4. Web Push Notifications (Browser PWA Push API)
export interface PushPayload {
  userId: string
  title: string
  body: string
  icon?: string
  url?: string
}

export async function sendPushNotification(payload: PushPayload) {
  try {
    const res = await fetch('/api/notifications/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return await res.json()
  } catch (err) {
    console.error('Push Notification Error:', err)
    return { success: false, error: err }
  }
}
