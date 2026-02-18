"use client"

export default function LoadingScreen() {
  return (
    <div className="w-full max-w-sm h-screen flex flex-col items-center justify-center bg-background">
      {/* Logo */}
      <div className="mb-8 animate-fade-in">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-foreground">₹</span>
        </div>
      </div>

      {/* Brand Name */}
      <h1 className="text-2xl font-bold text-foreground mb-1">MudraPay</h1>
      <p className="text-primary text-sm font-medium mb-1">Resolver</p>
      <p className="text-muted-foreground text-xs">Setting things up...</p>

      {/* Loading Spinner */}
      <div className="mt-12">
        <div className="w-12 h-12 border-2 border-muted rounded-full border-t-primary animate-spin"></div>
      </div>
    </div>
  )
}
