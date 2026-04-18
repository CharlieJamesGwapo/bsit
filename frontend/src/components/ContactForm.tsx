import { useState } from "react";
import type { ContactFormData } from "../types";
import { api } from "../lib/api";

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  function validate(): boolean {
    const e: Partial<ContactFormData> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email format";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch(api("/api/contact"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  function handleChange(field: keyof ContactFormData, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border bg-surface/50 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-all text-sm font-display";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-display font-semibold text-navy/40 uppercase tracking-wider mb-1.5">Name *</label>
          <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} className={`${inputClass} ${errors.name ? "border-red-300" : "border-navy/8"}`} placeholder="Your name" />
          {errors.name && <p className="text-red-500 text-xs mt-1 font-display">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-[11px] font-display font-semibold text-navy/40 uppercase tracking-wider mb-1.5">Email *</label>
          <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className={`${inputClass} ${errors.email ? "border-red-300" : "border-navy/8"}`} placeholder="your@email.com" />
          {errors.email && <p className="text-red-500 text-xs mt-1 font-display">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-display font-semibold text-navy/40 uppercase tracking-wider mb-1.5">Subject</label>
        <input type="text" value={form.subject} onChange={(e) => handleChange("subject", e.target.value)} className={`${inputClass} border-navy/8`} placeholder="What is this about?" />
      </div>

      <div>
        <label className="block text-[11px] font-display font-semibold text-navy/40 uppercase tracking-wider mb-1.5">Message *</label>
        <textarea value={form.message} onChange={(e) => handleChange("message", e.target.value)} rows={5} className={`${inputClass} resize-none ${errors.message ? "border-red-300" : "border-navy/8"}`} placeholder="Your message..." />
        {errors.message && <p className="text-red-500 text-xs mt-1 font-display">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="cursor-pointer w-full py-3.5 px-6 bg-teal hover:bg-teal-dark text-white font-display font-semibold rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {status === "sending" ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
        ) : (
          <>Send Message <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></>
        )}
      </button>

      {status === "success" && (
        <div className="p-4 bg-teal-light rounded-xl text-teal-dark text-sm font-display font-medium flex items-center gap-2 animate-fade-in-up">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Message sent successfully! We'll get back to you soon.
        </div>
      )}
      {status === "error" && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-display font-medium flex items-center gap-2 animate-fade-in-up">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Failed to send. Please try again.
        </div>
      )}
    </form>
  );
}
