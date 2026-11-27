import { useEffect, useState, type FormEvent } from 'react';
import { ArrowUpRight, Calendar, Check, Copy, Mail } from 'lucide-react';
import { STUDIO_BOOKING_URL, STUDIO_EMAIL } from '../data/studioContent';
import {
  buildEnquiryMailtoUrl,
  buildEnquiryPlainText,
  submitWeb3FormsEnquiry,
  validateEnquiryForm,
  type EnquiryFormData,
  type EnquiryFormErrors,
} from '../utils/studioLogic';
import { RollButton } from './RollButton';
import { SectionEyebrow } from './SectionEyebrow';

interface ContactSectionProps {
  preselectedService: string;
}

const SERVICE_OPTIONS = [
  'Website Design & Build',
  'Website Refresh',
  'Ongoing Website Care',
  'Brand & Digital Consulting',
];

const BUDGET_OPTIONS = [
  '$2.5k – $5k',
  '$5k – $10k',
  '$10k – $20k',
  '$20k+',
];

interface SubmissionResult {
  mode: 'web3forms' | 'mailto-fallback';
  enquiry: EnquiryFormData;
  fallbackFromError?: boolean;
}

export function ContactSection({ preselectedService }: ContactSectionProps) {
  const createEmptyForm = (service?: string): EnquiryFormData => ({
    name: '',
    email: '',
    location: '',
    service: service || preselectedService || SERVICE_OPTIONS[0],
    budget: BUDGET_OPTIONS[1],
    message: '',
  });

  const [formData, setFormData] = useState<EnquiryFormData>(() =>
    createEmptyForm(preselectedService)
  );
  const [botcheck, setBotcheck] = useState(false);
  const [errors, setErrors] = useState<EnquiryFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(STUDIO_EMAIL);
    } catch {
      // Clipboard API may be unavailable in restricted contexts; still provide clean UI state
    }
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 2400);
  };

  const handleCopyDraft = async (enquiry: EnquiryFormData) => {
    const plainText = buildEnquiryPlainText(enquiry);
    try {
      await navigator.clipboard.writeText(plainText);
    } catch {
      // Clipboard API may be unavailable in restricted contexts; still provide clean UI state
    }
    setCopiedDraft(true);
    window.setTimeout(() => setCopiedDraft(false), 2400);
  };

  const triggerMailtoFallback = (snapshot: EnquiryFormData, fallbackFromError: boolean) => {
    const mailtoUrl = buildEnquiryMailtoUrl(STUDIO_EMAIL, snapshot);
    setSubmissionResult({
      mode: 'mailto-fallback',
      enquiry: snapshot,
      fallbackFromError,
    });
    window.location.href = mailtoUrl;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const validation = validateEnquiryForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const snapshot: EnquiryFormData = { ...formData };
    setErrors({});
    setCopiedDraft(false);

    const web3FormsKey = (import.meta.env.VITE_WEB3FORMS_KEY ?? '').trim();
    if (!web3FormsKey) {
      triggerMailtoFallback(snapshot, false);
      return;
    }

    setIsSubmitting(true);
    const result = await submitWeb3FormsEnquiry(web3FormsKey, snapshot, botcheck);
    setIsSubmitting(false);

    if (result.ok) {
      setFormData(createEmptyForm(preselectedService));
      setBotcheck(false);
      setSubmissionResult({
        mode: 'web3forms',
        enquiry: snapshot,
      });
      return;
    }

    triggerMailtoFallback(snapshot, true);
  };

  const handleReset = () => {
    setSubmissionResult(null);
    setErrors({});
    setCopiedDraft(false);
    setBotcheck(false);
    setFormData(createEmptyForm(preselectedService));
  };

  const submittedMailtoUrl = submissionResult
    ? buildEnquiryMailtoUrl(STUDIO_EMAIL, submissionResult.enquiry)
    : '';

  return (
    <section
      id="contact"
      className="scroll-mt-24 sm:scroll-mt-28 border-t border-[var(--border)] bg-[var(--bg)] py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left column: Intro & direct studio channels */}
          <div className="lg:col-span-5">
            <SectionEyebrow number="5" label="Start a project" />
            <h2 className="mt-5 text-[clamp(1.85rem,4vw,3.25rem)] font-bold leading-[1.09] tracking-[-0.035em] text-[var(--ink)] [text-wrap:balance]">
              Have a project in mind? Let’s make a good thing.
            </h2>
            <p className="mt-4 max-w-[46ch] text-[1rem] leading-[1.68] text-[var(--muted)]">
              Tell us what you are building, your timeline, and where you want to take your brand next. We review every enquiry directly and reply within one business day.
            </p>

            <div className="mt-9 space-y-5 border-t border-[var(--border)] pt-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] shrink-0">
                    <Mail className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[0.8125rem] font-medium text-[var(--muted)]">
                      Direct studio email
                    </p>
                    <a
                      href={`mailto:${STUDIO_EMAIL}`}
                      className="text-[1rem] font-semibold text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
                    >
                      {STUDIO_EMAIL}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy studio email address"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 text-[0.8125rem] font-semibold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer whitespace-nowrap shrink-0"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Cal.com discovery call booking block */}
              <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3.5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] shrink-0">
                      <Calendar className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.8125rem] font-medium text-[var(--muted)]">
                        Prefer to talk live?
                      </p>
                      <p className="text-[0.95rem] font-semibold text-[var(--ink)]">
                        Book a free 15-min discovery call
                      </p>
                      <p className="mt-0.5 text-[0.8125rem] text-[var(--muted)]">
                        Instant invite via Cal.com
                      </p>
                    </div>
                  </div>
                  <a
                    href={STUDIO_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-fit items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 text-[0.8125rem] font-semibold text-[var(--accent-ink)] transition-colors hover:bg-[var(--accent-hover)] whitespace-nowrap shrink-0"
                  >
                    <span>Book a call</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Validated interactive project enquiry form */}
          <div className="lg:col-span-7">
            <div className="rounded-[26px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-9">
              {submissionResult ? (
                <div
                  role="status"
                  aria-live="polite"
                  data-testid="enquiry-confirmation"
                  data-delivery-mode={submissionResult.mode}
                  className="py-4"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                    {submissionResult.mode === 'web3forms' ? (
                      <Check className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Mail className="h-6 w-6" aria-hidden="true" />
                    )}
                  </span>

                  {submissionResult.mode === 'web3forms' ? (
                    <>
                      <h3 className="mt-5 text-[1.6rem] font-bold text-[var(--ink)]">
                        Inquiry sent, {submissionResult.enquiry.name}.
                      </h3>
                      <p className="mt-2 max-w-[52ch] text-[0.9625rem] leading-[1.65] text-[var(--muted)]">
                        Thank you for reaching out. Your project brief for{' '}
                        <strong className="text-[var(--ink)]">
                          {submissionResult.enquiry.service}
                        </strong>{' '}
                        has been delivered to{' '}
                        <strong className="text-[var(--ink)]">{STUDIO_EMAIL}</strong>, and we will
                        reply to{' '}
                        <strong className="text-[var(--ink)]">
                          {submissionResult.enquiry.email}
                        </strong>{' '}
                        within one business day.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="mt-5 text-[1.6rem] font-bold text-[var(--ink)]">
                        Your inquiry draft is ready, {submissionResult.enquiry.name}.
                      </h3>
                      <p className="mt-2 max-w-[52ch] text-[0.9625rem] leading-[1.65] text-[var(--muted)]">
                        {submissionResult.fallbackFromError ? (
                          <>
                            Direct submission couldn&apos;t complete right now, so we prepared a
                            pre-filled email draft to{' '}
                            <strong className="text-[var(--ink)]">{STUDIO_EMAIL}</strong> instead.
                            Hit <strong className="text-[var(--ink)]">Send</strong> in your email
                            app—or copy the message below if it didn&apos;t open automatically.
                          </>
                        ) : (
                          <>
                            Your email app should open with a pre-filled draft to{' '}
                            <strong className="text-[var(--ink)]">{STUDIO_EMAIL}</strong>. Hit{' '}
                            <strong className="text-[var(--ink)]">Send</strong> there to deliver
                            your brief—or use the buttons below if your email app didn&apos;t open.
                          </>
                        )}
                      </p>
                    </>
                  )}

                  <dl className="mt-6 grid grid-cols-1 gap-4 rounded-[18px] border border-[var(--border)] bg-[var(--bg)] p-5 sm:grid-cols-3 text-[0.875rem]">
                    <div>
                      <dt className="text-[var(--muted)]">Service</dt>
                      <dd className="mt-1 font-semibold text-[var(--ink)]">
                        {submissionResult.enquiry.service}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[var(--muted)]">Estimated Budget</dt>
                      <dd className="mt-1 font-semibold text-[var(--ink)] tabular-nums">
                        {submissionResult.enquiry.budget}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[var(--muted)]">Location</dt>
                      <dd className="mt-1 font-semibold text-[var(--ink)]">
                        {submissionResult.enquiry.location.trim() || 'Remote / Worldwide'}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {submissionResult.mode === 'web3forms' ? (
                      <RollButton
                        label="Send another inquiry"
                        variant="surface"
                        size="md"
                        onClick={handleReset}
                      />
                    ) : (
                      <>
                        <RollButton
                          label="Open in email app"
                          href={submittedMailtoUrl}
                          variant="primary"
                          size="md"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopyDraft(submissionResult.enquiry)}
                          className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-5 text-[0.875rem] font-semibold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer whitespace-nowrap"
                        >
                          {copiedDraft ? (
                            <>
                              <Check
                                className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                                aria-hidden="true"
                              />
                              <span>Message copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" aria-hidden="true" />
                              <span>Copy message</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="inline-flex h-11 items-center px-3 text-[0.875rem] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)] cursor-pointer whitespace-nowrap"
                        >
                          Start over
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Hidden honeypot field for Web3Forms spam protection */}
                  <input
                    type="checkbox"
                    name="botcheck"
                    checked={botcheck}
                    onChange={(e) => setBotcheck(e.target.checked)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="enquiry-name"
                        className="block text-[0.8125rem] font-semibold text-[var(--ink)]"
                      >
                        Your name *
                      </label>
                      <input
                        id="enquiry-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, name: e.target.value }));
                          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        placeholder="Alex Morgan"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'enquiry-name-error' : undefined}
                        className="mt-1.5 w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[0.9375rem] text-[var(--ink)] placeholder:text-[var(--muted)]/70 transition-colors focus:border-[var(--accent)] focus:outline-none"
                      />
                      {errors.name && (
                        <p
                          id="enquiry-name-error"
                          role="alert"
                          className="mt-1.5 text-[0.8125rem] font-medium text-rose-600 dark:text-rose-400"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="enquiry-email"
                        className="block text-[0.8125rem] font-semibold text-[var(--ink)]"
                      >
                        Email address *
                      </label>
                      <input
                        id="enquiry-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, email: e.target.value }));
                          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        placeholder="alex@company.com"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'enquiry-email-error' : undefined}
                        className="mt-1.5 w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[0.9375rem] text-[var(--ink)] placeholder:text-[var(--muted)]/70 transition-colors focus:border-[var(--accent)] focus:outline-none"
                      />
                      {errors.email && (
                        <p
                          id="enquiry-email-error"
                          role="alert"
                          className="mt-1.5 text-[0.8125rem] font-medium text-rose-600 dark:text-rose-400"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="enquiry-service"
                        className="block text-[0.8125rem] font-semibold text-[var(--ink)]"
                      >
                        What can we help with?
                      </label>
                      <select
                        id="enquiry-service"
                        name="service"
                        value={formData.service}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, service: e.target.value }))
                        }
                        className="mt-1.5 w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[0.9375rem] text-[var(--ink)] transition-colors focus:border-[var(--accent)] focus:outline-none"
                      >
                        {SERVICE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="enquiry-location"
                        className="block text-[0.8125rem] font-semibold text-[var(--ink)]"
                      >
                        City or time zone
                      </label>
                      <input
                        id="enquiry-location"
                        name="location"
                        type="text"
                        autoComplete="country-name"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, location: e.target.value }))
                        }
                        placeholder="e.g. San Francisco, PST"
                        className="mt-1.5 w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[0.9375rem] text-[var(--ink)] placeholder:text-[var(--muted)]/70 transition-colors focus:border-[var(--accent)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-[0.8125rem] font-semibold text-[var(--ink)]">
                      Estimated budget
                    </span>
                    <div
                      role="group"
                      aria-label="Estimated project budget"
                      className="mt-2 flex flex-wrap gap-2"
                    >
                      {BUDGET_OPTIONS.map((tier) => {
                        const selected = formData.budget === tier;
                        return (
                          <button
                            key={tier}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, budget: tier }))
                            }
                            aria-pressed={selected}
                            className={`rounded-full px-4 py-2 text-[0.8125rem] font-semibold tabular-nums transition-colors cursor-pointer whitespace-nowrap ${
                              selected
                                ? 'bg-[var(--accent)] text-[var(--accent-ink)]'
                                : 'border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--ink)]'
                            }`}
                          >
                            {tier}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-message"
                      className="block text-[0.8125rem] font-semibold text-[var(--ink)]"
                    >
                      Project brief *
                    </label>
                    <textarea
                      id="enquiry-message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, message: e.target.value }));
                        if (errors.message)
                          setErrors((prev) => ({ ...prev, message: undefined }));
                      }}
                      placeholder="Share your goals, current website (if any), and target launch window..."
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'enquiry-message-error' : undefined}
                      className="mt-1.5 w-full resize-y rounded-[12px] border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[0.9375rem] text-[var(--ink)] placeholder:text-[var(--muted)]/70 transition-colors focus:border-[var(--accent)] focus:outline-none"
                    />
                    {errors.message && (
                      <p
                        id="enquiry-message-error"
                        role="alert"
                        className="mt-1.5 text-[0.8125rem] font-medium text-rose-600 dark:text-rose-400"
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <p className="text-[0.8125rem] text-[var(--muted)]">
                      No spam, no automated drip sequences—just a direct reply.
                    </p>
                    <RollButton
                      type="submit"
                      label={isSubmitting ? 'Sending...' : 'Send project enquiry'}
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
