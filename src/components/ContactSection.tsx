import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Calendar, Check, Clock, Copy, Mail } from 'lucide-react';
import { STUDIO_EMAIL } from '../data/studioContent';
import {
  getUpcomingCallDays,
  validateCallBooking,
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

const CALL_SLOTS = ['9:30 AM', '11:00 AM', '2:00 PM', '4:30 PM'];

export function ContactSection({ preselectedService }: ContactSectionProps) {
  const [formData, setFormData] = useState<EnquiryFormData>({
    name: '',
    email: '',
    location: '',
    service: preselectedService || SERVICE_OPTIONS[0],
    budget: BUDGET_OPTIONS[1],
    message: '',
  });
  const [errors, setErrors] = useState<EnquiryFormErrors>({});
  const [submittedEnquiry, setSubmittedEnquiry] = useState<EnquiryFormData | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const upcomingDays = useMemo(() => getUpcomingCallDays(new Date(), 4), []);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(upcomingDays[0]?.id ?? '');
  const [selectedSlot, setSelectedSlot] = useState(CALL_SLOTS[0]);
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookedCall, setBookedCall] = useState<{
    dayLabel: string;
    slot: string;
    email: string;
  } | null>(null);

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateEnquiryForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setSubmittedEnquiry({ ...formData });
  };

  const handleReset = () => {
    setSubmittedEnquiry(null);
    setErrors({});
    setFormData({
      name: '',
      email: '',
      location: '',
      service: preselectedService || SERVICE_OPTIONS[0],
      budget: BUDGET_OPTIONS[1],
      message: '',
    });
  };

  const handleConfirmCall = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const check = validateCallBooking({
      day: selectedDay,
      slot: selectedSlot,
      email: bookingEmail,
    });
    if (!check.isValid) {
      setBookingError(check.error ?? 'Please complete all fields.');
      return;
    }
    const dayObj = upcomingDays.find((d) => d.id === selectedDay);
    setBookingError(null);
    setBookedCall({
      dayLabel: dayObj?.label ?? selectedDay,
      slot: selectedSlot,
      email: bookingEmail.trim(),
    });
  };

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

              {/* Instant discovery call booking block */}
              <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] shrink-0">
                      <Calendar className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[0.8125rem] font-medium text-[var(--muted)]">
                        Prefer to talk live?
                      </p>
                      <p className="text-[0.95rem] font-semibold text-[var(--ink)]">
                        Book a free 15-min discovery call right away
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingOpen((prev) => !prev);
                      setBookingError(null);
                    }}
                    aria-expanded={bookingOpen}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 text-[0.8125rem] font-semibold text-[var(--accent-ink)] transition-colors hover:bg-[var(--accent-hover)] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {bookingOpen ? 'Close' : 'Book a call'}
                  </button>
                </div>

                {bookingOpen && (
                  <div className="mt-5 border-t border-[var(--border)] pt-5">
                    {bookedCall ? (
                      <div
                        role="status"
                        data-testid="call-booking-confirmation"
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2 text-[0.875rem] font-semibold text-[var(--ink)]">
                          <Check className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                          <span>
                            Call reserved for {bookedCall.dayLabel} at {bookedCall.slot}
                          </span>
                        </div>
                        <p className="text-[0.8125rem] leading-[1.55] text-[var(--muted)]">
                          Calendar invite prepared for{' '}
                          <strong className="text-[var(--ink)]">{bookedCall.email}</strong>.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setBookedCall(null);
                            setBookingEmail('');
                          }}
                          className="text-[0.8125rem] font-semibold text-[var(--accent)] hover:underline cursor-pointer"
                        >
                          Change time slot
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleConfirmCall} noValidate className="space-y-4">
                        <div>
                          <span className="block text-[0.75rem] font-semibold text-[var(--muted)]">
                            1. Select a day
                          </span>
                          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {upcomingDays.map((day) => {
                              const active = selectedDay === day.id;
                              return (
                                <button
                                  key={day.id}
                                  type="button"
                                  onClick={() => setSelectedDay(day.id)}
                                  aria-pressed={active}
                                  className={`rounded-[10px] px-2.5 py-2 text-[0.8125rem] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                                    active
                                      ? 'bg-[var(--accent)] text-[var(--accent-ink)]'
                                      : 'border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)]'
                                  }`}
                                >
                                  {day.shortLabel}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <span className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-[var(--muted)]">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>2. Pick a 15-min slot (your local time)</span>
                          </span>
                          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {CALL_SLOTS.map((slot) => {
                              const active = selectedSlot === slot;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => setSelectedSlot(slot)}
                                  aria-pressed={active}
                                  className={`rounded-[10px] px-2.5 py-2 text-[0.8125rem] font-semibold tabular-nums transition-colors cursor-pointer whitespace-nowrap ${
                                    active
                                      ? 'bg-[var(--accent)] text-[var(--accent-ink)]'
                                      : 'border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)]'
                                  }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="booking-email"
                            className="block text-[0.75rem] font-semibold text-[var(--muted)]"
                          >
                            3. Email for calendar invite
                          </label>
                          <div className="mt-1.5 flex gap-2">
                            <input
                              id="booking-email"
                              type="email"
                              value={bookingEmail}
                              onChange={(e) => {
                                setBookingEmail(e.target.value);
                                if (bookingError) setBookingError(null);
                              }}
                              placeholder="you@company.com"
                              className="min-w-0 flex-1 rounded-[10px] border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2 text-[0.875rem] text-[var(--ink)] placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)] focus:outline-none"
                            />
                            <button
                              type="submit"
                              className="rounded-[10px] bg-[var(--accent)] px-4 py-2 text-[0.8125rem] font-semibold text-[var(--accent-ink)] transition-colors hover:bg-[var(--accent-hover)] cursor-pointer whitespace-nowrap shrink-0"
                            >
                              Confirm
                            </button>
                          </div>
                          {bookingError && (
                            <p
                              role="alert"
                              className="mt-1.5 text-[0.8125rem] font-medium text-rose-600 dark:text-rose-400"
                            >
                              {bookingError}
                            </p>
                          )}
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column: Validated interactive project enquiry form */}
          <div className="lg:col-span-7">
            <div className="rounded-[26px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-9">
              {submittedEnquiry ? (
                <div
                  role="status"
                  aria-live="polite"
                  data-testid="enquiry-confirmation"
                  className="py-4"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Check className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-[1.6rem] font-bold text-[var(--ink)]">
                    Enquiry received, {submittedEnquiry.name}.
                  </h3>
                  <p className="mt-2 max-w-[50ch] text-[0.9625rem] leading-[1.65] text-[var(--muted)]">
                    We have logged your brief for <strong className="text-[var(--ink)]">{submittedEnquiry.service}</strong> and will reply to <strong className="text-[var(--ink)]">{submittedEnquiry.email}</strong> within one business day with next steps.
                  </p>

                  <dl className="mt-6 grid grid-cols-1 gap-4 rounded-[18px] border border-[var(--border)] bg-[var(--bg)] p-5 sm:grid-cols-3 text-[0.875rem]">
                    <div>
                      <dt className="text-[var(--muted)]">Service</dt>
                      <dd className="mt-1 font-semibold text-[var(--ink)]">
                        {submittedEnquiry.service}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[var(--muted)]">Estimated Budget</dt>
                      <dd className="mt-1 font-semibold text-[var(--ink)] tabular-nums">
                        {submittedEnquiry.budget}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[var(--muted)]">Location</dt>
                      <dd className="mt-1 font-semibold text-[var(--ink)]">
                        {submittedEnquiry.location.trim() || 'Remote / Worldwide'}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <RollButton
                      label="Send another enquiry"
                      variant="surface"
                      size="md"
                      onClick={handleReset}
                    />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                      label="Send project enquiry"
                      variant="primary"
                      size="lg"
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
