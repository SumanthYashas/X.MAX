import { useMemo, useState, FormEvent } from 'react';
import { Check, Copy, Minus, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ADDITIONAL_CHARGES,
  ALL_SERVICES,
  BUNDLED_PACKAGES,
  formatINR,
} from '../data/xmaxCatalogue';
import { PageRoute } from '../types/routing';

interface QuoteBuilderProps {
  selectedPackageId: string | null;
  selectedServices: Record<string, number>;
  selectedAddons: Record<string, boolean>;
  onSelectPackage: (packageId: string | null) => void;
  onUpdateServiceQty: (serviceId: string, delta: number) => void;
  onToggleAddon: (addonId: string) => void;
  onClearAll: () => void;
  onNavigate: (route: PageRoute) => void;
}

export function QuoteBuilder({
  selectedPackageId,
  selectedServices,
  selectedAddons,
  onSelectPackage,
  onUpdateServiceQty,
  onToggleAddon,
  onClearAll,
  onNavigate,
}: QuoteBuilderProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const selectedPackage = useMemo(
    () => BUNDLED_PACKAGES.find((p) => p.id === selectedPackageId) || null,
    [selectedPackageId]
  );

  const serviceLines = useMemo(() => {
    return ALL_SERVICES.filter((s) => (selectedServices[s.id] || 0) > 0).map((s) => ({
      ...s,
      qty: selectedServices[s.id],
      lineTotal: s.price * selectedServices[s.id],
    }));
  }, [selectedServices]);

  const addonLines = useMemo(() => {
    return ADDITIONAL_CHARGES.filter((a) => selectedAddons[a.id]);
  }, [selectedAddons]);

  const { baseSubtotal, urgentFee, estimatedTotal, hasVariableRates } = useMemo(() => {
    const pkgAmount = selectedPackage ? selectedPackage.price : 0;
    const svcAmount = serviceLines.reduce((sum, line) => sum + line.lineTotal, 0);
    const fixedAddonAmount = addonLines.reduce(
      (sum, a) => sum + (a.numericPrice && !a.isPercentage ? a.numericPrice : 0),
      0
    );
    const sub = pkgAmount + svcAmount + fixedAddonAmount;
    const isUrgent = Boolean(selectedAddons['add-urgent']);
    const urgent = isUrgent ? Math.round(sub * 0.25) : 0;
    const variable =
      serviceLines.some((l) => l.onwards) ||
      addonLines.some((a) => a.priceLabel.includes('onwards'));
    return {
      baseSubtotal: sub,
      urgentFee: urgent,
      estimatedTotal: sub + urgent,
      hasVariableRates: variable,
    };
  }, [selectedPackage, serviceLines, addonLines, selectedAddons]);

  const hasSelections =
    Boolean(selectedPackage) || serviceLines.length > 0 || addonLines.length > 0;

  const buildPlainTextSummary = (refCode?: string) => {
    const lines: string[] = [
      refCode ? `X.MAX — QUOTATION REQUEST (#${refCode})` : 'X.MAX — PROJECT SCOPE & QUOTATION REQUEST',
      '',
    ];
    if (name.trim()) lines.push(`Name: ${name.trim()}`);
    if (email.trim()) lines.push(`Email: ${email.trim()}`);
    if (company.trim()) lines.push(`Brand / Company: ${company.trim()}`);
    if (phone.trim()) lines.push(`Phone: ${phone.trim()}`);
    if (name.trim() || email.trim() || company.trim() || phone.trim()) lines.push('');

    if (selectedPackage) {
      lines.push(`Bundle: ${selectedPackage.name} (${formatINR(selectedPackage.price)})`);
    }
    if (serviceLines.length > 0) {
      lines.push('Individual Services:');
      for (const s of serviceLines) {
        lines.push(
          `- ${s.name} x${s.qty}: ${formatINR(s.lineTotal)}${s.onwards ? ' onwards' : ''}`
        );
      }
    }
    if (addonLines.length > 0) {
      lines.push('Additional Items:');
      for (const a of addonLines) {
        lines.push(`- ${a.name} (${a.priceLabel})`);
      }
    }
    if (hasSelections) {
      lines.push('');
      lines.push(
        `Estimated Starting Total: ${formatINR(estimatedTotal)}${hasVariableRates ? '+' : ''} (GST extra, if applicable)`
      );
      lines.push(`50% Advance Milestone: ${formatINR(Math.round(estimatedTotal * 0.5))}`);
    }
    if (notes.trim()) {
      lines.push('');
      lines.push(`Requirements / Timeline: ${notes.trim()}`);
    }
    return lines.join('\n');
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildPlainTextSummary(submittedRef || undefined));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored cleanly
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!hasSelections && !notes.trim()) {
      setFormError(
        'Please select at least one service or package, or describe your requirements in the project brief.'
      );
      return;
    }

    const code = `XMAX-${new Date().getFullYear().toString().slice(-2)}${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const message = buildPlainTextSummary(code);
    const waLink = `https://wa.me/917829035362?text=${encodeURIComponent(message)}`;
    setWhatsappUrl(waLink);
    setSubmittedRef(code);

    const anchor = document.createElement('a');
    anchor.href = waLink;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <section
      id="quote"
      className="mx-auto max-w-[1360px] px-[20px] md:px-[60px] pt-[96px] md:pt-[144px] pb-[90px] md:pb-[130px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-[24px] md:rounded-[40px] bg-[#12151b] text-white p-5 sm:p-8 md:p-12 lg:p-14"
        style={{
          boxShadow:
            '0 40px 70px rgba(40,60,110,.22), 0 6px 14px rgba(20,30,60,.18)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div className="max-w-xl">
            <p className="text-[13px] font-medium tracking-[0.04em] text-[#ff5512] mb-2.5">
              Your Requirements. Our Pricing.
            </p>
            <h2 className="text-[30px] md:text-[44px] font-medium tracking-[-0.025em] leading-[1.06] [text-wrap:balance]">
              Build Your Custom Quotation
            </h2>
            <p className="mt-3 text-[15px] md:text-[16px] leading-[1.55] text-white/70">
              Combine individual services, select a bundled project scope, and request a formal
              quotation valid for 15 days.
            </p>
          </div>

          <AnimatePresence>
            {hasSelections && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="flex items-center gap-3"
              >
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={handleCopySummary}
                  className="whitespace-nowrap shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-[11px] bg-white/10 hover:bg-white/15 text-[13px] font-medium text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-[#ff5512]" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Scope Copied' : 'Copy Scope'}
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={onClearAll}
                  className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-[11px] border border-white/15 hover:bg-white/10 text-[13px] font-medium text-white/80 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  Reset
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Live Scope Breakdown */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[16px] font-medium text-white/90 mb-4">
                Selected Deliverables
              </h3>

              {!hasSelections ? (
                <div className="rounded-[18px] border border-white/12 bg-white/[0.03] p-6 md:p-8">
                  <p className="text-[15px] text-white/75 leading-[1.6]">
                    Your quotation builder is currently empty. Add individual services from the{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('pricing')}
                      className="underline text-white hover:text-[#ff5512] cursor-pointer"
                    >
                      Rate Card
                    </button>{' '}
                    or choose an optional{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('packages')}
                      className="underline text-white hover:text-[#ff5512] cursor-pointer"
                    >
                      Bundled Package
                    </button>{' '}
                    to calculate your starting investment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {selectedPackage && (
                      <motion.div
                        key={selectedPackage.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-between gap-4 rounded-[16px] bg-white/[0.06] px-5 py-4"
                      >
                        <div>
                          <p className="text-[12px] font-mono text-[#ff5512] mb-0.5">
                            Selected Bundle
                          </p>
                          <p className="text-[16px] font-medium text-white">
                            {selectedPackage.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[16px] font-medium tabular-nums">
                            {formatINR(selectedPackage.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => onSelectPackage(null)}
                            aria-label={`Remove ${selectedPackage.name}`}
                            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {serviceLines.length > 0 && (
                    <ul className="divide-y divide-white/10 rounded-[16px] bg-white/[0.04] px-4 sm:px-5">
                      <AnimatePresence initial={false}>
                        {serviceLines.map((line) => (
                          <motion.li
                            key={line.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 py-3.5 text-[14px]"
                          >
                            <div className="min-w-0 sm:pr-2">
                              <p className="font-medium text-white leading-snug">{line.name}</p>
                              <p className="text-[12px] text-white/55 tabular-nums">
                                {formatINR(line.price)}
                                {line.onwards ? ' onwards' : ''} each
                              </p>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                              <div className="inline-flex items-center rounded-[8px] bg-white/10 p-0.5">
                                <button
                                  type="button"
                                  onClick={() => onUpdateServiceQty(line.id, -1)}
                                  aria-label={`Decrease ${line.name}`}
                                  className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded-[6px] hover:bg-white/15 cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-[13px] tabular-nums">
                                  {line.qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateServiceQty(line.id, 1)}
                                  aria-label={`Increase ${line.name}`}
                                  className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded-[6px] hover:bg-white/15 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="w-[82px] text-right font-medium tabular-nums">
                                {formatINR(line.lineTotal)}
                              </span>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}

                  {addonLines.length > 0 && (
                    <ul className="divide-y divide-white/10 rounded-[16px] bg-white/[0.04] px-5">
                      <AnimatePresence initial={false}>
                        {addonLines.map((addon) => (
                          <motion.li
                            key={addon.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-between gap-3 py-3 text-[14px]"
                          >
                            <span className="text-white/85">{addon.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-white/75 tabular-nums">
                                {addon.id === 'add-urgent'
                                  ? `+${formatINR(urgentFee)} (25%)`
                                  : addon.priceLabel}
                              </span>
                              <button
                                type="button"
                                onClick={() => onToggleAddon(addon.id)}
                                aria-label={`Remove ${addon.name}`}
                                className="p-1 text-white/50 hover:text-white cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Totals Summary */}
            <div className="mt-8 pt-6 border-t border-white/12 space-y-2.5">
              <div className="flex items-center justify-between text-[14px] text-white/65">
                <span>Base Scope Subtotal</span>
                <span className="tabular-nums">{formatINR(baseSubtotal)}</span>
              </div>
              {urgentFee > 0 && (
                <div className="flex items-center justify-between text-[14px] text-white/65">
                  <span>Urgent Delivery (+25%)</span>
                  <span className="tabular-nums">{formatINR(urgentFee)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between pt-2">
                <span className="text-[16px] font-medium text-white">Estimated Starting Total</span>
                <motion.span
                  key={estimatedTotal}
                  initial={{ opacity: 0.6, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[28px] md:text-[34px] font-medium tracking-[-0.02em] text-white tabular-nums"
                >
                  {formatINR(estimatedTotal)}
                  {hasVariableRates ? '+' : ''}
                </motion.span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-white/55 pt-1">
                <span className="tabular-nums">
                  50% Advance to start: {formatINR(Math.round(estimatedTotal * 0.5))}
                </span>
                <span>GST extra, if applicable · Valid 15 days</span>
              </div>
            </div>
          </div>

          {/* Right Column: Client Quotation Form */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              {submittedRef ? (
                <motion.div
                  key="submitted"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-[22px] bg-white/[0.06] border border-white/12 p-7 md:p-9 flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-flex items-center gap-2 text-[13px] font-mono text-[#ff5512]">
                      <Check className="w-4 h-4" aria-hidden="true" />
                      Quotation Request Prepared
                    </span>
                    <h3 className="mt-3 text-[24px] md:text-[28px] font-medium tracking-[-0.015em]">
                      Reference #{submittedRef}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.6] text-white/75">
                      Thank you, {name}. Your scope summary for{' '}
                      <span className="text-white font-medium">
                        {formatINR(estimatedTotal)}
                        {hasVariableRates ? '+' : ''}
                      </span>{' '}
                      has been compiled. Our team reviews deliverables, complexity, and timeline
                      before issuing your formal quotation (50% advance to begin work, 2 revision
                      rounds per major deliverable).
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whitespace-nowrap shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-[12px] bg-[#25D366] hover:bg-[#20bd5a] text-[#0b1f13] text-[14px] font-semibold transition-colors cursor-pointer"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                          <path d="M12.03 2a10 10 0 0 0-8.66 15l-1.3 4.74 4.86-1.27A10 10 0 1 0 12.03 2Zm5.84 14.12c-.25.7-1.44 1.33-2 1.41-.51.08-1.17.11-1.88-.12a16.8 16.8 0 0 1-1.71-.63c-3-1.3-4.97-4.35-5.12-4.55-.15-.2-1.22-1.62-1.22-3.1s.77-2.2 1.05-2.5c.27-.3.6-.38.8-.38h.58c.19 0 .44-.07.69.52.25.6.86 2.1.94 2.25.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.53-.15.15-.3.31-.13.61.18.3.78 1.29 1.68 2.09 1.15 1.02 2.12 1.34 2.42 1.49.3.15.48.13.66-.08.18-.2.75-.88.95-1.18.2-.3.4-.25.67-.15.28.1 1.75.83 2.05.98.3.15.5.22.58.35.07.12.07.72-.18 1.42Z" />
                        </svg>
                        Open WhatsApp Chat
                      </a>
                    )}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={handleCopySummary}
                      className="whitespace-nowrap shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-[12px] bg-white/10 hover:bg-white/15 text-white text-[14px] font-medium transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-4 h-4 text-[#25D366]" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied to Clipboard' : 'Copy Scope'}
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => setSubmittedRef(null)}
                      className="whitespace-nowrap shrink-0 px-4 py-3 rounded-[12px] border border-white/20 hover:bg-white/10 text-white text-[14px] font-medium transition-colors cursor-pointer"
                    >
                      Edit Details
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="q-name" className="block text-[13px] text-white/75 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        id="q-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Aarav Mehta"
                        className="w-full h-[46px] px-4 rounded-[12px] bg-white/[0.07] border border-white/12 text-[15px] text-white placeholder:text-white/35 focus:outline-none focus:border-[#ff5512] transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="q-email" className="block text-[13px] text-white/75 mb-1.5">
                        Work Email *
                      </label>
                      <input
                        id="q-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full h-[46px] px-4 rounded-[12px] bg-white/[0.07] border border-white/12 text-[15px] text-white placeholder:text-white/35 focus:outline-none focus:border-[#ff5512] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="q-company" className="block text-[13px] text-white/75 mb-1.5">
                        Brand / Company Name
                      </label>
                      <input
                        id="q-company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Optional"
                        className="w-full h-[46px] px-4 rounded-[12px] bg-white/[0.07] border border-white/12 text-[15px] text-white placeholder:text-white/35 focus:outline-none focus:border-[#ff5512] transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="q-phone" className="block text-[13px] text-white/75 mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        id="q-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98XXX XXXXX"
                        className="w-full h-[46px] px-4 rounded-[12px] bg-white/[0.07] border border-white/12 text-[15px] text-white placeholder:text-white/35 focus:outline-none focus:border-[#ff5512] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="q-notes" className="block text-[13px] text-white/75 mb-1.5">
                      Project Requirements &amp; Target Timeline
                    </label>
                    <textarea
                      id="q-notes"
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Share your goals, deliverables, or target launch date..."
                      className="w-full p-4 rounded-[12px] bg-white/[0.07] border border-white/12 text-[15px] text-white placeholder:text-white/35 focus:outline-none focus:border-[#ff5512] resize-none transition-colors"
                    />
                  </div>

                  {formError && (
                    <p role="alert" className="text-[13px] text-[#ff7a45]">
                      {formError}
                    </p>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-[12px] text-white/50">
                      Work begins after written quotation approval &amp; 50% advance.
                    </p>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      className="whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-2.5 h-[48px] px-7 rounded-[13px] bg-[#25D366] hover:bg-[#20bd5a] text-[#0b1f13] text-[15px] font-semibold transition-colors cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current shrink-0" aria-hidden="true">
                        <path d="M12.03 2a10 10 0 0 0-8.66 15l-1.3 4.74 4.86-1.27A10 10 0 1 0 12.03 2Zm5.84 14.12c-.25.7-1.44 1.33-2 1.41-.51.08-1.17.11-1.88-.12a16.8 16.8 0 0 1-1.71-.63c-3-1.3-4.97-4.35-5.12-4.55-.15-.2-1.22-1.62-1.22-3.1s.77-2.2 1.05-2.5c.27-.3.6-.38.8-.38h.58c.19 0 .44-.07.69.52.25.6.86 2.1.94 2.25.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.53-.15.15-.3.31-.13.61.18.3.78 1.29 1.68 2.09 1.15 1.02 2.12 1.34 2.42 1.49.3.15.48.13.66-.08.18-.2.75-.88.95-1.18.2-.3.4-.25.67-.15.28.1 1.75.83 2.05.98.3.15.5.22.58.35.07.12.07.72-.18 1.42Z" />
                      </svg>
                      Send via WhatsApp
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
