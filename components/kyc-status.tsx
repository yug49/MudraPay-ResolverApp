"use client"

import { useState, useEffect } from "react"

type KYCState = "pending" | "under_review" | "approved" | "rejected"

interface KYCStatusProps {
  onApproved: () => void
  onBack: () => void
}

export default function KYCStatus({ onApproved, onBack }: KYCStatusProps) {
  const [status, setStatus] = useState<KYCState>("pending")
  const [submittedAt] = useState(new Date())

  // Simulate status progression
  useEffect(() => {
    if (status === "pending") {
      const timer = setTimeout(() => {
        setStatus("under_review")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [status])

  const handleTempApprove = () => {
    setStatus("approved")
  }

  useEffect(() => {
    if (status === "approved") {
      const timer = setTimeout(() => {
        onApproved()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [status, onApproved])

  const statusConfig = {
    pending: {
      icon: (
        <div className="w-16 h-16 border-4 border-muted rounded-full border-t-primary animate-spin" />
      ),
      title: "KYC Submitted",
      subtitle: "Your application has been submitted and is waiting in queue.",
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
    },
    under_review: {
      icon: (
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      ),
      title: "Under Review",
      subtitle: "Our team is verifying your documents. This usually takes 24-48 hours.",
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/10",
    },
    approved: {
      icon: (
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center animate-scale-in">
          <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ),
      title: "KYC Approved!",
      subtitle: "Your identity has been verified successfully. Redirecting to next step...",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/10",
    },
    rejected: {
      icon: (
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      ),
      title: "KYC Rejected",
      subtitle: "There was an issue with your documents. Please resubmit with correct information.",
      color: "text-destructive",
      bgColor: "bg-destructive/5",
    },
  }

  const config = statusConfig[status]

  return (
    <div className="w-full max-w-sm min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-muted rounded-lg transition"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">KYC Status</h1>
        </div>
      </div>

      {/* Status Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center space-y-6 animate-fade-in">
          {/* Status Icon */}
          <div className="flex justify-center">
            {config.icon}
          </div>

          {/* Status Text */}
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${config.color}`}>{config.title}</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">{config.subtitle}</p>
          </div>

          {/* Timeline */}
          <div className="w-full max-w-xs mx-auto">
            <div className={`${config.bgColor} rounded-xl p-4 space-y-4`}>
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Application Submitted</p>
                  <p className="text-xs text-muted-foreground">
                    {submittedAt.toLocaleString("en-IN", { 
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit" 
                    })}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  status === "pending" 
                    ? "border-2 border-muted-foreground/30" 
                    : "bg-emerald-500"
                }`}>
                  {status !== "pending" && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${status === "pending" ? "text-muted-foreground" : "text-foreground"}`}>
                    Document Review
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {status === "pending" ? "Waiting..." : "In progress"}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  status === "approved" 
                    ? "bg-emerald-500"
                    : status === "rejected"
                    ? "bg-red-500"
                    : "border-2 border-muted-foreground/30"
                }`}>
                  {status === "approved" && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {status === "rejected" && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    status === "approved" || status === "rejected" ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    Verification Complete
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {status === "approved" ? "Approved!" : status === "rejected" ? "Rejected" : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Application ID */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Application ID</p>
            <p className="text-sm font-mono text-foreground">KYC-{Date.now().toString(36).toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Temporary Approve Button (for demo) */}
      {status !== "approved" && (
        <div className="px-6 py-4 border-t border-border space-y-3">
          <button
            onClick={handleTempApprove}
            className="w-full py-3 bg-emerald-500 text-white rounded-lg font-semibold text-sm hover:bg-emerald-600 transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Approve KYC (Temporary)
          </button>
          <p className="text-center text-xs text-muted-foreground">
            This button is for testing only. In production, KYC approval comes from the server.
          </p>
        </div>
      )}
    </div>
  )
}
