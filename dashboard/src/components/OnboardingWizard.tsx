"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Shield, 
  Terminal, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Code, 
  Search, 
  Settings, 
  Plus, 
  Lock, 
  Zap,
  Globe,
  Database,
  Key,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const TEMPLATES = [
  {
    id: "researcher",
    name: "AI Researcher",
    description: "Web search and information synthesis.",
    icon: <Search className="w-5 h-5" />,
    scopes: ["web_search:*", "wikipedia:*", "read_url:*"],
    color: "blue"
  },
  {
    id: "engineer",
    name: "Software Engineer",
    description: "Code generation and local execution.",
    icon: <Code className="w-5 h-5" />,
    scopes: ["read_file:*", "write_file:*", "run_command:*", "git:*"],
    color: "emerald"
  },
  {
    id: "admin",
    name: "System Admin",
    description: "Database and infrastructure management.",
    icon: <Database className="w-5 h-5" />,
    scopes: ["db_query:*", "cloud_api:*", "secret_manager:*"],
    color: "purple"
  }
]

const SCOPES = [
  { id: "web_search:*", label: "Web Search", description: "Search the public web" },
  { id: "wikipedia:*", label: "Wikipedia", description: "Read knowledge bases" },
  { id: "read_url:*", label: "Read URL", description: "Extract content from URLs" },
  { id: "read_file:*", label: "Read File", description: "Read local filesystem" },
  { id: "write_file:*", label: "Write File", description: "Modify local filesystem" },
  { id: "run_command:*", label: "Execute", description: "Run shell commands" },
  { id: "db_query:*", label: "Database", description: "Query databases" },
  { id: "gmail:*", label: "Gmail", description: "Read/write emails" },
  { id: "slack:*", label: "Slack", description: "Post to channels" },
]

interface OnboardingWizardProps {
  onComplete: (data: { name: string; scopes: string[] }) => Promise<void>
  isSubmitting: boolean
}

export function OnboardingWizard({ onComplete, isSubmitting }: OnboardingWizardProps) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    selectedScopes: [] as string[],
    template: ""
  })
  const [error, setError] = useState("")

  const nextStep = () => {
    if (step === 0 && !formData.name.trim()) {
      setError("Please give your agent a name.")
      return
    }
    setError("")
    setStep(s => s + 1)
  }

  const prevStep = () => setStep(s => s - 1)

  const toggleScope = (scope: string) => {
    setFormData(prev => ({
      ...prev,
      selectedScopes: prev.selectedScopes.includes(scope)
        ? prev.selectedScopes.filter(s => s !== scope)
        : [...prev.selectedScopes, scope]
    }))
  }

  const selectTemplate = (template: typeof TEMPLATES[0]) => {
    setFormData(prev => ({
      ...prev,
      template: template.id,
      selectedScopes: Array.from(new Set([...prev.selectedScopes, ...template.scopes]))
    }))
  }

  const handleFinish = async () => {
    try {
      await onComplete({
        name: formData.name,
        scopes: formData.selectedScopes.length > 0 ? formData.selectedScopes : ["*:*"]
      })
    } catch (e) {
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      {/* Progress Bar */}
      <div className="flex justify-between mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0 px-12" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="relative z-10 flex flex-col items-center gap-2">
            <div 
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 scale-110 ${
                step >= i 
                  ? "bg-emerald-500 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                  : "bg-neutral-900 border-white/10 text-neutral-500"
              }`}
            >
              {step > i ? <Check className="w-5 h-5 text-black" /> : <span className={`text-sm font-black ${step >= i ? "text-black" : ""}`}>{i + 1}</span>}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${step >= i ? "text-emerald-400" : "text-neutral-600"}`}>
              {i === 0 ? "Identity" : i === 1 ? "Governance" : "Provision"}
            </span>
          </div>
        ))}
      </div>

      <div className="min-h-[500px] flex flex-col">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 flex-grow"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">Define Your Agent</h2>
                <p className="text-neutral-500 text-sm">Every agent in SupraWall acts as a secure cryptographic identity.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Agent Designation</label>
                  <Input 
                    placeholder="e.g. Research-Hacker-01" 
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="bg-white/5 border-white/10 h-14 text-xl font-black tracking-tight focus:border-emerald-500/50 focus:ring-emerald-500/20"
                  />
                  {error && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {error}</p>}
                </div>

                <div className="space-y-3 pt-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Persona Templates (Optional)</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => selectTemplate(t)}
                        className={`text-left p-4 rounded-xl border transition-all group relative overflow-hidden ${
                          formData.template === t.id 
                            ? "bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/50" 
                            : "bg-white/5 border-white/5 hover:border-white/10"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                          formData.template === t.id ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "bg-white/5 text-neutral-400"
                        }`}>
                          {t.icon}
                        </div>
                        <p className="text-xs font-black text-white uppercase tracking-tight mb-1">{t.name}</p>
                        <p className="text-[10px] text-neutral-500 leading-tight">{t.description}</p>
                        {formData.template === t.id && (
                          <div className="absolute top-2 right-2">
                            <Check className="w-4 h-4 text-emerald-500" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 flex-grow"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">Zero-Trust Scopes</h2>
                <p className="text-neutral-500 text-sm">Select the exact boundaries for this agent. Any action outside these scopes will be blocked.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {SCOPES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => toggleScope(s.id)}
                    className={`text-left px-4 py-3 rounded-lg border flex items-center justify-between transition-all ${
                      formData.selectedScopes.includes(s.id)
                        ? "bg-blue-500/10 border-blue-500/40 text-blue-100"
                        : "bg-white/5 border-white/5 hover:bg-white/10 text-neutral-400"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase tracking-tight">{s.label}</span>
                      <span className="text-[9px] opacity-50 font-mono italic">{s.id}</span>
                    </div>
                    {formData.selectedScopes.includes(s.id) ? (
                      <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-black" />
                      </div>
                    ) : (
                      <Plus className="w-3 h-3 opacity-20" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Protection</p>
                  <p className="text-[11px] text-neutral-400">All allowed scopes will be automatically logged and verified in the forensic chain.</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 flex-grow"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">Security Provision</h2>
                <p className="text-neutral-500 text-sm">Review the cryptographic identity configuration before deployment.</p>
              </div>

              <div className="space-y-6">
                <Card className="bg-white/5 border-white/5 p-6 space-y-4">
                  <div className="flex justify-between items-start border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Designation</p>
                      <p className="text-xl font-black text-white tracking-tight">{formData.name}</p>
                    </div>
                    <Badge className="bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px]">Ready</Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Configured Scopes</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedScopes.length > 0 ? (
                        formData.selectedScopes.map(s => (
                          <span key={s} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-400">{s}</span>
                        ))
                      ) : (
                        <span className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400">*:* (Full Access)</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3 text-xs text-neutral-500 italic">
                    <Lock className="w-4 h-4 shrink-0" />
                    <p>Generating this agent will create a unique SHA-256 hash. You will only see the raw API key once.</p>
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                      <Zap className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Latency Impact</p>
                      <p className="text-sm font-black text-white">&lt; 15ms</p>
                   </div>
                   <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                      <Globe className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Compliance</p>
                      <p className="text-sm font-black text-white">SOC2 Ready</p>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex justify-between items-center pt-12 mt-auto border-t border-white/5">
          {step > 0 ? (
            <Button 
                variant="ghost" 
                onClick={prevStep}
                className="text-neutral-500 hover:text-white font-black uppercase tracking-widest text-[10px] gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < 2 ? (
            <Button 
              onClick={nextStep}
              className="bg-white text-black hover:bg-neutral-200 font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-full shadow-2xl shadow-white/10 gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              disabled={isSubmitting}
              onClick={handleFinish}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-[10px] h-12 px-10 rounded-full shadow-2xl shadow-emerald-500/20 gap-2"
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Provisioning...</> : <><Key className="w-4 h-4" /> Finalize & Deploy</>}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function Loader2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
