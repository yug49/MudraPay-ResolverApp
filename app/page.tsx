"use client"

import { useState, useEffect } from "react"
import LoadingScreen from "@/components/loading-screen"
import LoginScreen from "@/components/login-screen"
import KYCForm from "@/components/kyc-form"
import KYCStatus from "@/components/kyc-status"
import StakingScreen from "@/components/staking-screen"
import MerchantDashboard from "@/components/merchant-dashboard"

type AppScreen = "loading" | "login" | "kyc-form" | "kyc-status" | "staking" | "dashboard"

interface UserState {
  loginMethod: string
  identifier: string
  walletAddress: string
  kycApproved: boolean
  staked: boolean
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("loading")
  const [userState, setUserState] = useState<UserState>({
    loginMethod: "",
    identifier: "",
    walletAddress: "",
    kycApproved: false,
    staked: false,
  })

  // Loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user has saved session
      const savedState = localStorage.getItem("mudrapay-resolver-state")
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState)
          setUserState(parsed)
          if (parsed.staked) {
            setCurrentScreen("dashboard")
          } else if (parsed.kycApproved) {
            setCurrentScreen("staking")
          } else if (parsed.walletAddress) {
            setCurrentScreen("kyc-status")
          } else if (parsed.identifier) {
            setCurrentScreen("kyc-form")
          } else {
            setCurrentScreen("login")
          }
        } catch {
          setCurrentScreen("login")
        }
      } else {
        setCurrentScreen("login")
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  // Persist user state
  const updateUserState = (updates: Partial<UserState>) => {
    const newState = { ...userState, ...updates }
    setUserState(newState)
    localStorage.setItem("mudrapay-resolver-state", JSON.stringify(newState))
  }

  const handleLoginSuccess = (method: string, identifier: string) => {
    updateUserState({ loginMethod: method, identifier })
    setCurrentScreen("kyc-form")
  }

  const handleKYCSubmit = (data: any) => {
    // Save wallet address from KYC form
    updateUserState({ walletAddress: data.walletAddress || userState.walletAddress })
    setCurrentScreen("kyc-status")
  }

  const handleKYCApproved = () => {
    updateUserState({ kycApproved: true })
    setCurrentScreen("staking")
  }

  const handleStakeComplete = () => {
    updateUserState({ staked: true })
    setCurrentScreen("dashboard")
  }

  const handleLogout = () => {
    localStorage.removeItem("mudrapay-resolver-state")
    setUserState({
      loginMethod: "",
      identifier: "",
      walletAddress: "",
      kycApproved: false,
      staked: false,
    })
    setCurrentScreen("login")
  }

  const handleDisconnectWallet = () => {
    // Clear wallet and downstream state, send user back to KYC wallet step
    updateUserState({
      walletAddress: "",
      kycApproved: false,
      staked: false,
    })
    setCurrentScreen("kyc-form")
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "loading":
        return <LoadingScreen />

      case "login":
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />

      case "kyc-form":
        return (
          <KYCForm
            onSubmit={handleKYCSubmit}
            onBack={() => setCurrentScreen("login")}
          />
        )

      case "kyc-status":
        return (
          <KYCStatus
            onApproved={handleKYCApproved}
            onBack={() => setCurrentScreen("kyc-form")}
          />
        )

      case "staking":
        return (
          <StakingScreen
            walletAddress={userState.walletAddress || "0x..."}
            onStakeComplete={handleStakeComplete}
            onBack={() => setCurrentScreen("kyc-status")}
          />
        )

      case "dashboard":
        return (
          <MerchantDashboard
            walletAddress={userState.walletAddress || "0x..."}
            onLogout={handleLogout}
            onDisconnectWallet={handleDisconnectWallet}
          />
        )

      default:
        return <LoadingScreen />
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {renderScreen()}
    </div>
  )
}
