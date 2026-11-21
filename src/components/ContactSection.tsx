import { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Mail, MessageCircle, Send, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { PageRoute } from '../types/routing';

interface ContactSectionProps {
  onNavigate: (route: PageRoute) => void;
}

const PROJECT_TYPES = [
  'Meta & Google Paid Ads',
  'Social Media & Content Growth',
  'Reels & Video Ad Production',
  'Conversion Landing Pages & CRO',
  'Technical SEO & Search Growth',
  'Full-Funnel Growth Package',
];

const BUDGET_RANGES = [
  'Under ₹15,000',
  '₹15,000 – ₹35,000',
  '₹35,000 – ₹75,000',
  '₹75,000+',
];

export function ContactSection({ onNavigate }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [budget, setBudget] = useState(BUDGET_RANGES[1]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = `Hi X.MAX,\n\nI would like to submit a project enquiry:\n• Name: ${name || 'Prospective Client'}\n• Contact: ${contact || 'Not provided'}\n• Service: ${projectType}\n• Budget: ${budget}\n• Brief: ${message || 'Please share your availability and quote.'}`;
    const waUrl = `https://wa.me/917829035362?text=${encodeURIComponent(formatted)}`;
    setSubmitted(true);
    // Open WhatsApp in new tab / app
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="contact"
      aria-label="07 Contact"
      className="mx-auto max-w-[1360px] px-[20px] md:px-[60px] py-[80px] md:py-[110px]"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#111418]/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111418] text-white text-[12px] font-mono tracking-wider uppercase mb-3">
            <span className="text-[#ff5512] font-bold">07</span>
            <span>CONTACT</span>
          </div>
          <h2 className="text-[32px] sm:text-[42px] md:text-[50px] font-medium tracking-[-0.025em] leading-[1.04] text-[#111418]">
            Launch your digital marketing brief.
          </h2>
        </div>
        <p className="text-[15px] md:text-[16px] text-[#111418]/65 max-w-md leading-relaxed">
          Share your target channels, ROAS goals, or creative volume. Receive a structured campaign plan and quote within hours.
        </p>
      </div>

      {/* Grid: Interactive Form & Direct Connect Desk */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Project Enquiry Form */}
        <div className="lg:col-span-7 rounded-[26px] bg-white border border-[#111418]/10 p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_rgba(17,20,24,0.05)]">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#22c55e]/15 text-[#16a34a] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="mt-4 text-[24px] font-medium text-[#111418]">
                Enquiry Opened in WhatsApp!
              </h3>
              <p className="mt-2 text-[15px] text-[#111418]/65 max-w-md mx-auto">
                Your project brief has been formatted and opened directly on our WhatsApp desk (+91 78290 35362). We will reply with recommendations and pricing.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 text-[13px] font-medium text-[#ff5512] hover:underline cursor-pointer"
              >
                ← Submit another enquiry
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-[12px] font-mono uppercase tracking-wider text-[#111418]/60 mb-1.5"
                  >
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#f4f7fb] border border-[#111418]/10 text-[14px] text-[#111418] focus:outline-none focus:border-[#ff5512] transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-info"
                    className="block text-[12px] font-mono uppercase tracking-wider text-[#111418]/60 mb-1.5"
                  >
                    WhatsApp / Email *
                  </label>
                  <input
                    id="contact-info"
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. +91 98765 43210 or email"
                    className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#f4f7fb] border border-[#111418]/10 text-[14px] text-[#111418] focus:outline-none focus:border-[#ff5512] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-mono uppercase tracking-wider text-[#111418]/60 mb-2">
                  Project Domain / Service
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_TYPES.map((type) => {
                    const active = projectType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setProjectType(type)}
                        className={`px-3 py-1.5 rounded-[9px] text-[12.5px] font-medium transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#111418] text-white'
                            : 'bg-[#f4f7fb] text-[#111418]/75 hover:bg-[#e9eef5]'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-mono uppercase tracking-wider text-[#111418]/60 mb-2">
                  Estimated Budget
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BUDGET_RANGES.map((b) => {
                    const active = budget === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBudget(b)}
                        className={`py-2 px-2 rounded-[9px] text-[12px] font-mono text-center transition-colors cursor-pointer truncate ${
                          active
                            ? 'bg-[#ff5512] text-white font-semibold'
                            : 'bg-[#f4f7fb] text-[#111418]/70 hover:bg-[#e9eef5]'
                        }`}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-[12px] font-mono uppercase tracking-wider text-[#111418]/60 mb-1.5"
                >
                  Project Brief &amp; Requirements
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details about your deliverables, timeline, and goals..."
                  className="w-full p-3.5 rounded-[12px] bg-[#f4f7fb] border border-[#111418]/10 text-[14px] text-[#111418] focus:outline-none focus:border-[#ff5512] transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[12px] text-[#111418]/55 text-center sm:text-left">
                  ⚡ Guaranteed response within 2–4 business hours.
                </span>
                <button
                  type="submit"
                  className="w-full sm:w-auto h-[48px] px-7 rounded-[12px] bg-[#111418] hover:bg-[#2b3140] text-white text-[14px] font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Submit Project Enquiry</span>
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right: Direct Desk Options & WhatsApp CTA */}
        <div className="lg:col-span-5 space-y-5">
          {/* WhatsApp Direct Connect Card */}
          <div className="rounded-[24px] bg-[#12151b] text-white p-7 sm:p-8 border border-white/10">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#25D366] font-semibold block mb-2">
              INSTANT CHAT DESK
            </span>
            <h3 className="text-[22px] sm:text-[26px] font-medium tracking-tight">
              Direct Growth Desk
            </h3>
            <p className="mt-2 text-[14px] text-white/70 leading-relaxed">
              Connect directly with our performance marketing strategists on WhatsApp for campaign audits, ad creative volume, and launch timelines.
            </p>

            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-white/40 uppercase font-mono">WhatsApp Number</p>
                <p className="text-[17px] font-mono text-white font-semibold mt-0.5">
                  +91 78290 35362
                </p>
              </div>
              <a
                href="https://wa.me/917829035362?text=Hi%20X.MAX%2C%20I%20have%20a%20project%20enquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-[42px] px-4 rounded-[10px] bg-[#25D366] text-[#071f11] text-[13px] font-semibold hover:bg-[#2ee372] transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                Chat Now
              </a>
            </div>
          </div>

          {/* Email & Scope Card */}
          <div className="rounded-[24px] bg-[#f4f7fb] border border-[#111418]/10 p-7 sm:p-8">
            <div className="flex items-center gap-2 text-[#ff5512] font-mono text-[11px] font-semibold tracking-wider uppercase mb-2">
              <Mail className="w-3.5 h-3.5" />
              <span>EMAIL &amp; SCOPE INQUIRIES</span>
            </div>
            <h4 className="text-[19px] font-medium text-[#111418]">
              hello@xmax.studio
            </h4>
            <p className="mt-2 text-[13.5px] text-[#111418]/65 leading-relaxed">
              Send formal briefs, RFP documents, or vendor registration requirements.
            </p>

            <div className="mt-6 pt-4 border-t border-[#111418]/10 flex items-center justify-between">
              <span className="text-[12px] text-[#111418]/50">Prefer an itemized quote?</span>
              <button
                type="button"
                onClick={() => onNavigate('quote')}
                className="text-[13px] font-medium text-[#ff5512] hover:underline cursor-pointer"
              >
                Use Quote Builder →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
