"use client"

import { useState } from "react"

interface StakingScreenProps {
  walletAddress: string
  onStakeComplete: () => void
  onBack: () => void
}

const MIN_STAKE_AMOUNT = 100 // Minimum stake in USD
const STAKE_TOKEN = "USDC"

export default function StakingScreen({ walletAddress, onStakeComplete, onBack }: StakingScreenProps) {
  const [stakeAmount, setStakeAmount] = useState(MIN_STAKE_AMOUNT.toString())
  const [isStaking, setIsStaking] = useState(false)
  const [staked, setStaked] = useState(false)
  const [error, setError] = useState("")

  const parsedAmount = parseFloat(stakeAmount) || 0

  const handleStake = () => {
    if (parsedAmount < MIN_STAKE_AMOUNT) {
      setError(`Minimum stake amount is ${MIN_STAKE_AMOUNT} ${STAKE_TOKEN}`)
      return
    }

    setError("")
    setIsStaking(true)

    // Simulate staking transaction
    setTimeout(() => {
      setIsStaking(false)
      setStaked(true)

      // Auto-proceed after showing success
      setTimeout(() => {
        onStakeComplete()
      }, 2500)
    }, 3000)
  }

  const quickAmounts = [100, 250, 500, 1000]

  if (staked) {
    return (
      <div className="w-full max-w-sm min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="text-center space-y-6 animate-scale-in">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-emerald-500 mb-2">Stake Successful!</h2>
              <p className="text-muted-foreground text-sm">
                You have staked {parsedAmount} {STAKE_TOKEN} successfully.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 w-full max-w-xs mx-auto">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Amount Staked</span>
                <span className="font-bold text-foreground">{parsedAmount} {STAKE_TOKEN}</span>
              </div>
              <div className="h-px bg-border my-3" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="text-emerald-500 font-medium">Active</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Redirecting to dashboard...</p>
            <div className="w-8 h-8 border-2 border-muted rounded-full border-t-primary animate-spin mx-auto" />
          </div>
        </div>
      </div>
    )
  }

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
          <h1 className="text-lg font-bold text-foreground">Stake to Activate</h1>
          <p className="text-xs text-muted-foreground">Final step to become a resolver</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Info Card */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Why Staking?</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Staking ensures resolvers have skin in the game. It acts as collateral for honest behavior and is returned when you exit the network.
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Info */}
        <div className="bg-card border border-border rounded-xl p-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Primary Wallet</p>
              <p className="text-sm font-mono text-foreground truncate">{walletAddress}</p>
            </div>
          </div>
        </div>

        {/* Stake Amount */}
        <div className="space-y-3 animate-slide-up">
          <label className="block text-sm font-medium text-foreground">Stake Amount ({STAKE_TOKEN})</label>
          
          <div className="relative">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => {
                setStakeAmount(e.target.value)
                setError("")
              }}
              min={MIN_STAKE_AMOUNT}
              className="w-full px-4 py-4 bg-input border border-border rounded-xl text-foreground text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={MIN_STAKE_AMOUNT.toString()}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
              {STAKE_TOKEN}
            </span>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Minimum stake: {MIN_STAKE_AMOUNT} {STAKE_TOKEN}
          </p>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setStakeAmount(amount.toString())
                  setError("")
                }}
                className={`py-2.5 rounded-lg text-sm font-medium transition border ${
                  parsedAmount === amount
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-foreground hover:border-primary/30"
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-destructive text-xs text-center">{error}</p>
          )}
        </div>

        {/* Stake Details */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Stake Amount</span>
            <span className="font-semibold text-foreground">{parsedAmount || 0} {STAKE_TOKEN}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Network Fee (est.)</span>
            <span className="text-foreground">~0.50 {STAKE_TOKEN}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Lock Period</span>
            <span className="text-foreground">None (withdraw anytime)</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-foreground">Total</span>
            <span className="text-primary">{(parsedAmount + 0.5).toFixed(2)} {STAKE_TOKEN}</span>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="px-6 py-4 border-t border-border bg-background">
        <button
          onClick={handleStake}
          disabled={isStaking || parsedAmount < MIN_STAKE_AMOUNT}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isStaking ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 rounded-full border-t-primary-foreground animate-spin" />
              Staking {parsedAmount} {STAKE_TOKEN}...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Stake {parsedAmount} {STAKE_TOKEN}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
