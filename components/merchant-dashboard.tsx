"use client"

import { useState } from "react"

interface MerchantDashboardProps {
  walletAddress: string
  onLogout: () => void
}

export default function MerchantDashboard({ walletAddress, onLogout }: MerchantDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "settings">("overview")

  return (
    <div className="w-full max-w-sm min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">₹</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">MudraPay</h1>
              <p className="text-[10px] text-primary font-medium -mt-0.5">Resolver</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-500 font-medium">Active</span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-muted rounded-lg transition"
              title="Logout"
            >
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-6 py-4">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-5 animate-fade-in">
          <p className="text-xs text-muted-foreground mb-1">Total Earnings</p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-foreground">$0.00</span>
            <span className="text-sm text-muted-foreground">USDC</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-foreground">0</p>
              <p className="text-[10px] text-muted-foreground">Orders</p>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-foreground">100</p>
              <p className="text-[10px] text-muted-foreground">Staked</p>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-emerald-500">100%</p>
              <p className="text-[10px] text-muted-foreground">Success</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Info */}
      <div className="px-6 pb-4">
        <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground">Primary Wallet</p>
            <p className="text-xs font-mono text-foreground truncate">{walletAddress}</p>
          </div>
          <button className="p-1.5 hover:bg-muted rounded transition">
            <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 pb-2">
        <div className="flex bg-muted rounded-xl p-1">
          {(["overview", "orders", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition ${
                activeTab === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-6 py-4">
        {activeTab === "overview" && (
          <div className="space-y-4 animate-fade-in">
            {/* Quick Actions */}
            <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-foreground">Go Online</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-foreground">Withdraw</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-foreground">Add Stake</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-foreground">Analytics</span>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Recent Activity</h3>
              <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center">
                <svg className="w-12 h-12 text-muted-foreground/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-sm text-muted-foreground">No recent activity</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Go online to start receiving orders</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <svg className="w-16 h-16 text-muted-foreground/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="text-lg font-bold text-foreground mb-1">No Orders Yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Your resolved orders will appear here. Go online to start receiving payment requests.
            </p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-semibold text-foreground">Resolver Settings</h3>

            {/* Pricing */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-medium text-foreground">Pricing Strategy</h4>
              <p className="text-xs text-muted-foreground">Configure your pricing model for resolving orders.</p>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground text-center">Coming Soon</p>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-foreground">Push Notifications</h4>
                  <p className="text-xs text-muted-foreground">Get notified for new orders</p>
                </div>
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 transition-all" />
                </div>
              </div>
            </div>

            {/* KYC Status */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-foreground">KYC Status</h4>
                  <p className="text-xs text-muted-foreground">Identity verification</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-medium rounded-full">
                  Verified
                </span>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-card border border-destructive/20 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
              <button className="w-full py-2.5 border border-destructive/30 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/5 transition">
                Unstake & Deactivate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-border bg-background px-6 py-3">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex flex-col items-center gap-1 p-1 ${activeTab === "overview" ? "text-primary" : "text-muted-foreground"}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex flex-col items-center gap-1 p-1 ${activeTab === "orders" ? "text-primary" : "text-muted-foreground"}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-[10px] font-medium">Orders</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center gap-1 p-1 ${activeTab === "settings" ? "text-primary" : "text-muted-foreground"}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[10px] font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}
