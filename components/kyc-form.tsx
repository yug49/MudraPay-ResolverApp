"use client"

import { useState } from "react"

interface KYCFormData {
  // Personal Information
  fullName: string
  dateOfBirth: string
  gender: string
  fatherName: string

  // PAN Details
  panNumber: string
  panFile: File | null

  // Aadhaar Details
  aadhaarNumber: string
  aadhaarFrontFile: File | null
  aadhaarBackFile: File | null

  // Address Proof
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  addressProofType: string
  addressProofFile: File | null

  // RazorpayX Details
  razorpayxAccountId: string
  razorpayxKeyId: string
  razorpayxKeySecret: string
  razorpayxWebhookSecret: string

  // Selfie / Photo
  selfieFile: File | null

  // Wallet
  walletAddress: string
  walletConnected: boolean
}

const INITIAL_FORM: KYCFormData = {
  fullName: "",
  dateOfBirth: "",
  gender: "",
  fatherName: "",
  panNumber: "",
  panFile: null,
  aadhaarNumber: "",
  aadhaarFrontFile: null,
  aadhaarBackFile: null,
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  addressProofType: "",
  addressProofFile: null,
  razorpayxAccountId: "",
  razorpayxKeyId: "",
  razorpayxKeySecret: "",
  razorpayxWebhookSecret: "",
  selfieFile: null,
  walletAddress: "",
  walletConnected: false,
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
]

const ADDRESS_PROOF_TYPES = [
  "Voter ID Card",
  "Passport",
  "Driving License",
  "Utility Bill (not older than 3 months)",
  "Bank Statement (not older than 3 months)",
  "Aadhaar Card (already provided)",
]

interface KYCFormProps {
  onSubmit: (data: KYCFormData) => void
  onBack: () => void
}

export default function KYCForm({ onSubmit, onBack }: KYCFormProps) {
  const [formData, setFormData] = useState<KYCFormData>(INITIAL_FORM)
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isConnecting, setIsConnecting] = useState(false)

  const totalSteps = 5

  const updateField = (field: keyof KYCFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1: // Personal Info
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
        if (!formData.gender) newErrors.gender = "Gender is required"
        if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required"
        break

      case 2: // Identity Documents
        if (!formData.panNumber.trim()) {
          newErrors.panNumber = "PAN number is required"
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.panNumber.toUpperCase())) {
          newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)"
        }
        if (!formData.aadhaarNumber.trim()) {
          newErrors.aadhaarNumber = "Aadhaar number is required"
        } else if (!/^\d{12}$/.test(formData.aadhaarNumber.replace(/\s/g, ""))) {
          newErrors.aadhaarNumber = "Aadhaar must be 12 digits"
        }
        break

      case 3: // Address
        if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address is required"
        if (!formData.city.trim()) newErrors.city = "City is required"
        if (!formData.state) newErrors.state = "State is required"
        if (!formData.pincode.trim()) {
          newErrors.pincode = "Pincode is required"
        } else if (!/^\d{6}$/.test(formData.pincode)) {
          newErrors.pincode = "Invalid pincode"
        }
        break

      case 4: // RazorpayX
        if (!formData.razorpayxAccountId.trim()) newErrors.razorpayxAccountId = "RazorpayX Account ID is required"
        if (!formData.razorpayxKeyId.trim()) newErrors.razorpayxKeyId = "API Key ID is required"
        if (!formData.razorpayxKeySecret.trim()) newErrors.razorpayxKeySecret = "API Key Secret is required"
        break

      case 5: // Wallet & Selfie
        if (!formData.walletConnected) newErrors.walletAddress = "Please connect your wallet"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      } else {
        onSubmit(formData)
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  const handleSkip = () => {
    const mockFile = new File(["mock"], "mock-document.png", { type: "image/png" })

    switch (currentStep) {
      case 1:
        setFormData((prev) => ({
          ...prev,
          fullName: "Rahul Sharma",
          dateOfBirth: "1995-06-15",
          gender: "male",
          fatherName: "Suresh Sharma",
        }))
        break
      case 2:
        setFormData((prev) => ({
          ...prev,
          panNumber: "ABCDE1234F",
          panFile: mockFile,
          aadhaarNumber: "1234 5678 9012",
          aadhaarFrontFile: mockFile,
          aadhaarBackFile: mockFile,
        }))
        break
      case 3:
        setFormData((prev) => ({
          ...prev,
          addressLine1: "42, Sunshine Apartments",
          addressLine2: "MG Road, Koramangala",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560034",
          addressProofType: "Aadhaar Card (already provided)",
        }))
        break
      case 4:
        setFormData((prev) => ({
          ...prev,
          razorpayxAccountId: "acc_DemoResolver123",
          razorpayxKeyId: "rzp_live_DemoKeyId12345",
          razorpayxKeySecret: "DemoSecretXYZ789",
          razorpayxWebhookSecret: "whsec_DemoWebhook456",
        }))
        break
      case 5: {
        const mockAddr = "0x" + Array.from({ length: 40 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("")
        setFormData((prev) => ({
          ...prev,
          walletAddress: mockAddr,
          walletConnected: true,
          selfieFile: mockFile,
        }))
        break
      }
    }

    setErrors({})
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // For last step, let user click submit after skip fills data
    }
  }

  const connectWallet = async () => {
    setIsConnecting(true)

    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        })
        if (accounts && accounts.length > 0) {
          updateField("walletAddress", accounts[0])
          updateField("walletConnected", true)
        }
      } else {
        // Simulate wallet connection for demo
        setTimeout(() => {
          const mockAddress = "0x" + Array.from({ length: 40 }, () => 
            Math.floor(Math.random() * 16).toString(16)
          ).join("")
          updateField("walletAddress", mockAddress)
          updateField("walletConnected", true)
          setIsConnecting(false)
        }, 1500)
        return
      }
    } catch (err) {
      console.error("Wallet connection error:", err)
    }

    setIsConnecting(false)
  }

  const renderProgressBar = () => (
    <div className="px-6 py-4 border-b border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">Step {currentStep} of {totalSteps}</span>
        <span className="text-xs text-muted-foreground">
          {["Personal Info", "Identity Documents", "Address Details", "RazorpayX Account", "Wallet & Selfie"][currentStep - 1]}
        </span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  )

  const renderInput = (
    label: string,
    field: keyof KYCFormData,
    placeholder: string,
    type: string = "text",
    props: Record<string, any> = {}
  ) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={formData[field] as string}
        onChange={(e) => updateField(field, type === "text" ? e.target.value : e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
        {...props}
      />
      {errors[field] && <p className="text-destructive text-xs mt-1">{errors[field]}</p>}
    </div>
  )

  const renderFileUpload = (label: string, field: keyof KYCFormData, description: string) => {
    const file = formData[field] as File | null
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-4 text-center transition cursor-pointer hover:border-primary/40 ${
            file ? "border-primary/30 bg-primary/5" : "border-border"
          }`}
          onClick={() => document.getElementById(`file-${field}`)?.click()}
        >
          <input
            id={`file-${field}`}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                updateField(field, e.target.files[0])
              }
            }}
          />
          {file ? (
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-foreground font-medium">{file.name}</span>
            </div>
          ) : (
            <>
              <svg className="w-8 h-8 text-muted-foreground mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-muted-foreground">{description}</p>
            </>
          )}
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 animate-slide-up">
            <h3 className="text-lg font-bold text-foreground">Personal Information</h3>
            <p className="text-sm text-muted-foreground mb-4">
              As per Indian KYC regulations (RBI &amp; SEBI guidelines), we need your basic personal details.
            </p>
            {renderInput("Full Name (as on PAN)", "fullName", "Rahul Sharma")}
            {renderInput("Father's Name", "fatherName", "Suresh Sharma")}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateField("dateOfBirth", e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              {errors.dateOfBirth && <p className="text-destructive text-xs mt-1">{errors.dateOfBirth}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Gender</label>
              <div className="flex gap-3">
                {["Male", "Female", "Other"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => updateField("gender", g.toLowerCase())}
                    className={`flex-1 py-3 rounded-lg border text-sm font-medium transition ${
                      formData.gender === g.toLowerCase()
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-foreground hover:border-primary/30"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {errors.gender && <p className="text-destructive text-xs mt-1">{errors.gender}</p>}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4 animate-slide-up">
            <h3 className="text-lg font-bold text-foreground">Identity Documents</h3>
            <p className="text-sm text-muted-foreground mb-4">
              PAN and Aadhaar are mandatory for KYC verification under Indian law (Prevention of Money Laundering Act).
            </p>

            {/* PAN */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">PAN</span>
                </div>
                <h4 className="font-semibold text-foreground text-sm">PAN Card</h4>
              </div>
              {renderInput("PAN Number", "panNumber", "ABCDE1234F", "text", {
                maxLength: 10,
                style: { textTransform: "uppercase" },
              })}
              {renderFileUpload("Upload PAN Card", "panFile", "Upload PAN card image or PDF")}
            </div>

            {/* Aadhaar */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <h4 className="font-semibold text-foreground text-sm">Aadhaar Card</h4>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Aadhaar Number</label>
                <input
                  type="text"
                  value={formData.aadhaarNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "")
                    if (val.length <= 12) {
                      // Format as XXXX XXXX XXXX
                      const formatted = val.replace(/(\d{4})(?=\d)/g, "$1 ")
                      updateField("aadhaarNumber", formatted)
                    }
                  }}
                  placeholder="XXXX XXXX XXXX"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm tracking-wider"
                  maxLength={14}
                />
                {errors.aadhaarNumber && <p className="text-destructive text-xs mt-1">{errors.aadhaarNumber}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {renderFileUpload("Front Side", "aadhaarFrontFile", "Upload front")}
                {renderFileUpload("Back Side", "aadhaarBackFile", "Upload back")}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4 animate-slide-up">
            <h3 className="text-lg font-bold text-foreground">Address Details</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Current residential address as per RBI KYC norms.
            </p>
            {renderInput("Address Line 1", "addressLine1", "House/Flat No., Building Name")}
            {renderInput("Address Line 2", "addressLine2", "Street, Landmark (optional)")}
            <div className="grid grid-cols-2 gap-3">
              {renderInput("City", "city", "Mumbai")}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                >
                  <option value="">Select</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p className="text-destructive text-xs mt-1">{errors.state}</p>}
              </div>
            </div>
            {renderInput("Pincode", "pincode", "400001", "text", { maxLength: 6, inputMode: "numeric" })}

            {/* Address Proof */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3 mt-2">
              <h4 className="font-semibold text-foreground text-sm">Address Proof Document</h4>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Document Type</label>
                <select
                  value={formData.addressProofType}
                  onChange={(e) => updateField("addressProofType", e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                >
                  <option value="">Select document type</option>
                  {ADDRESS_PROOF_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              {formData.addressProofType && formData.addressProofType !== "Aadhaar Card (already provided)" && (
                renderFileUpload("Upload Document", "addressProofFile", "Upload address proof document")
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4 animate-slide-up">
            <h3 className="text-lg font-bold text-foreground">RazorpayX Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your RazorpayX account will be used to make INR payouts when resolving payment orders.
            </p>

            {/* Info Banner */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-foreground font-medium">Why RazorpayX?</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  As a resolver, you will use RazorpayX to send INR payouts to users&apos; UPI / bank accounts. Make sure you have an active RazorpayX account with payout permissions.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="font-semibold text-foreground text-sm">Account Details</h4>
              </div>
              {renderInput("RazorpayX Account ID", "razorpayxAccountId", "acc_XXXXXXXXXXXXXX")}
              <p className="text-xs text-muted-foreground -mt-1">
                Found in your RazorpayX Dashboard → Account & Settings
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-foreground text-sm">API Credentials</h4>
              </div>
              {renderInput("API Key ID", "razorpayxKeyId", "rzp_live_XXXXXXXXXXXXXX")}
              {renderInput("API Key Secret", "razorpayxKeySecret", "••••••••••••••••••••", "password")}
              <p className="text-xs text-muted-foreground">
                Generate API keys from RazorpayX Dashboard → API Keys. Use <span className="font-medium">Live mode</span> keys.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h4 className="font-semibold text-foreground text-sm">Webhook Secret (Optional)</h4>
              </div>
              {renderInput("Webhook Secret", "razorpayxWebhookSecret", "whsec_XXXXXXXXXXXXXX")}
              <p className="text-xs text-muted-foreground">
                Optional — used to verify webhook callbacks for payout status updates.
              </p>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4 animate-slide-up">
            <h3 className="text-lg font-bold text-foreground">Wallet & Selfie Verification</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your crypto wallet (will be set as primary) and take a selfie for liveness verification.
            </p>

            {/* Wallet Connection */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3" />
                </svg>
                <h4 className="font-semibold text-foreground text-sm">Primary Wallet</h4>
              </div>

              {formData.walletConnected ? (
                <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Connected Wallet</p>
                    <p className="text-sm font-mono text-foreground truncate">
                      {formData.walletAddress}
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 rounded-full border-t-primary-foreground animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Connect MetaMask Wallet
                    </>
                  )}
                </button>
              )}
              {errors.walletAddress && <p className="text-destructive text-xs">{errors.walletAddress}</p>}
              <p className="text-xs text-muted-foreground">
                This wallet will be set as your primary wallet for all resolver operations.
              </p>
            </div>

            {/* Selfie */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h4 className="font-semibold text-foreground text-sm">Selfie / Photo</h4>
              </div>
              {renderFileUpload("Take a selfie or upload photo", "selfieFile", "Clear front-facing photo for liveness verification")}
              <p className="text-xs text-muted-foreground">
                Required for liveness verification as per RBI's Video KYC guidelines.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-sm min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4 flex items-center gap-3">
        <button
          onClick={handlePrev}
          className="p-2 hover:bg-muted rounded-lg transition"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">KYC Verification</h1>
          <p className="text-xs text-muted-foreground">Complete your identity verification</p>
        </div>
      </div>

      {renderProgressBar()}

      {/* Form Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {renderStep()}
      </div>

      {/* Bottom Action */}
      <div className="px-6 py-4 border-t border-border bg-background space-y-2">
        {/* Dev-only skip button */}
        <button
          onClick={handleSkip}
          className="w-full py-2.5 border border-dashed border-amber-500/40 text-amber-500 rounded-lg text-xs font-medium hover:bg-amber-500/5 transition flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          Skip with mock data (dev only)
        </button>
        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          {currentStep === totalSteps ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Submit KYC Application
            </>
          ) : (
            <>
              Continue
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
