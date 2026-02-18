"use client"

import { useState } from "react"

type LoginMethod = "mobile" | "email" | "gmail"

interface LoginScreenProps {
  onLoginSuccess: (method: LoginMethod, identifier: string) => void
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<LoginMethod | null>(null)
  const [identifier, setIdentifier] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendOtp = () => {
    if (!identifier.trim()) {
      setError(selectedMethod === "mobile" ? "Please enter your mobile number" : "Please enter your email")
      return
    }

    if (selectedMethod === "mobile" && !/^[6-9]\d{9}$/.test(identifier)) {
      setError("Please enter a valid 10-digit Indian mobile number")
      return
    }

    if (selectedMethod === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      setError("Please enter a valid email address")
      return
    }

    setError("")
    setIsLoading(true)

    // Simulate OTP send
    setTimeout(() => {
      setOtpSent(true)
      setIsLoading(false)
    }, 1500)
  }

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setError("")
    setIsLoading(true)

    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess(selectedMethod!, identifier)
    }, 1500)
  }

  const handleGmailLogin = () => {
    setIsLoading(true)
    setError("")

    // Simulate Gmail OAuth
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess("gmail", "resolver@gmail.com")
    }, 2000)
  }

  const handleBack = () => {
    if (otpSent) {
      setOtpSent(false)
      setOtp("")
      setError("")
    } else {
      setSelectedMethod(null)
      setIdentifier("")
      setError("")
    }
  }

  return (
    <div className="w-full max-w-sm min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">₹</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">MudraPay</h1>
            <p className="text-xs text-primary font-medium">Resolver Portal</p>
          </div>
        </div>

        {!selectedMethod ? (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome</h2>
            <p className="text-muted-foreground text-sm">
              Sign in to register as a MudraPay Resolver and start facilitating payments.
            </p>
          </div>
        ) : (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Back</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-8">
        {!selectedMethod ? (
          /* Method Selection */
          <div className="space-y-3 animate-slide-up">
            <button
              onClick={() => setSelectedMethod("mobile")}
              className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:bg-primary/5 transition group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-foreground">Mobile Number</p>
                <p className="text-xs text-muted-foreground">Get OTP on your mobile</p>
              </div>
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setSelectedMethod("email")}
              className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:bg-primary/5 transition group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-foreground">Email ID</p>
                <p className="text-xs text-muted-foreground">Get OTP on your email</p>
              </div>
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={handleGmailLogin}
              disabled={isLoading}
              className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:bg-primary/5 transition group disabled:opacity-60"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition">
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-foreground">Continue with Google</p>
                <p className="text-xs text-muted-foreground">Sign in with your Gmail account</p>
              </div>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-muted rounded-full border-t-primary animate-spin" />
              ) : (
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>

            {/* Divider */}
            <div className="pt-4">
              <p className="text-center text-xs text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        ) : !otpSent ? (
          /* Input Form */
          <div className="animate-slide-up">
            <h2 className="text-xl font-bold text-foreground mb-2">
              {selectedMethod === "mobile" ? "Enter Mobile Number" : "Enter Email Address"}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              We&apos;ll send a 6-digit OTP to verify your identity.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {selectedMethod === "mobile" ? "Mobile Number" : "Email Address"}
                </label>
                <div className="flex items-center gap-2">
                  {selectedMethod === "mobile" && (
                    <div className="flex items-center gap-1 px-3 py-3 bg-muted border border-border rounded-lg text-sm text-foreground">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                  )}
                  <input
                    type={selectedMethod === "mobile" ? "tel" : "email"}
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value)
                      setError("")
                    }}
                    placeholder={selectedMethod === "mobile" ? "9876543210" : "you@example.com"}
                    className="flex-1 px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                    maxLength={selectedMethod === "mobile" ? 10 : undefined}
                  />
                </div>
              </div>

              {error && (
                <p className="text-destructive text-xs">{error}</p>
              )}

              <button
                onClick={handleSendOtp}
                disabled={isLoading || !identifier.trim()}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 rounded-full border-t-primary-foreground animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </div>
        ) : (
          /* OTP Verification */
          <div className="animate-slide-up">
            <h2 className="text-xl font-bold text-foreground mb-2">Verify OTP</h2>
            <p className="text-muted-foreground text-sm mb-1">
              Enter the 6-digit code sent to
            </p>
            <p className="text-foreground text-sm font-medium mb-6">
              {selectedMethod === "mobile" ? `+91 ${identifier}` : identifier}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  OTP Code
                </label>
                <div className="flex gap-2 justify-center">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i] || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "")
                        const newOtp = otp.split("")
                        newOtp[i] = val
                        setOtp(newOtp.join(""))
                        setError("")

                        // Auto-focus next input
                        if (val && i < 5) {
                          const next = e.target.parentElement?.children[i + 1] as HTMLInputElement
                          next?.focus()
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[i] && i > 0) {
                          const prev = (e.target as HTMLElement).parentElement?.children[i - 1] as HTMLInputElement
                          prev?.focus()
                        }
                      }}
                      className="w-11 h-12 text-center text-lg font-semibold bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-destructive text-xs text-center">{error}</p>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 6}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 rounded-full border-t-primary-foreground animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </button>

              <button
                onClick={() => {
                  setOtp("")
                  handleSendOtp()
                }}
                disabled={isLoading}
                className="w-full py-2 text-primary text-sm font-medium hover:opacity-80 transition disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border">
        <p className="text-center text-xs text-muted-foreground">
          Powered by Yellow Network &bull; Secure & Encrypted
        </p>
      </div>
    </div>
  )
}
