export type ThemeMode = 'light' | 'dark';

export interface LocalStudioClock {
  time: string;
  city: string;
  fullLabel: string;
}

export interface EnquiryFormData {
  name: string;
  email: string;
  location: string;
  service: string;
  budget: string;
  message: string;
}

export interface EnquiryFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function resolveInitialTheme(
  savedTheme: string | null | undefined,
  prefersDark = false
): ThemeMode {
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  return prefersDark ? 'dark' : 'light';
}

export function getNextTheme(current: ThemeMode): ThemeMode {
  return current === 'dark' ? 'light' : 'dark';
}

export function extractCityFromTimeZone(timeZone: string | undefined): string {
  if (!timeZone || typeof timeZone !== 'string') {
    return 'Local';
  }
  const trimmed = timeZone.trim();
  if (!trimmed || trimmed === 'UTC' || trimmed === 'Etc/UTC' || trimmed === 'GMT') {
    return 'UTC';
  }
  const segments = trimmed.split('/').filter(Boolean);
  const rawCity = segments[segments.length - 1] ?? trimmed;
  return rawCity.replace(/_/g, ' ');
}

export function formatLocalStudioTime(
  date: Date,
  timeZone?: string,
  cityOverride?: string | null
): LocalStudioClock {
  const resolvedTz =
    timeZone ??
    (typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'UTC');

  let formattedTime: string;
  try {
    formattedTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: resolvedTz,
    }).format(date);
  } catch {
    formattedTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    }).format(date);
  }

  const trimmedOverride = cityOverride?.trim();
  const city = trimmedOverride || extractCityFromTimeZone(resolvedTz);
  return {
    time: formattedTime,
    city,
    fullLabel: `${formattedTime} · ${city}`,
  };
}

export interface ReverseGeocodePayload {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
  address?: {
    city?: string;
    town?: string;
    municipality?: string;
    village?: string;
    county?: string;
    state?: string;
  };
}

export function parseReverseGeocodeCity(
  payload: ReverseGeocodePayload | null | undefined
): string | null {
  if (!payload || typeof payload !== 'object') return null;

  const candidates = [
    payload.city,
    payload.locality,
    payload.address?.city,
    payload.address?.town,
    payload.address?.municipality,
    payload.address?.village,
    payload.principalSubdivision,
    payload.address?.state,
    payload.address?.county,
    payload.countryName,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  return null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEnquiryForm(data: EnquiryFormData): {
  isValid: boolean;
  errors: EnquiryFormErrors;
} {
  const errors: EnquiryFormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Please enter your name.';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  const normalizedEmail = data.email.trim();
  if (!normalizedEmail) {
    errors.email = 'Please enter your email address.';
  } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!data.message.trim()) {
    errors.message = 'Tell us briefly what you are looking to build.';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Please share at least a sentence about your project.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface CallDayOption {
  id: string;
  label: string;
  shortLabel: string;
}

export function getUpcomingCallDays(fromDate: Date, count = 4): CallDayOption[] {
  const days: CallDayOption[] = [];
  const cursor = new Date(fromDate.getTime());

  while (days.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    const dayOfWeek = cursor.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const id = cursor.toISOString().slice(0, 10);
    const label = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(cursor);
    const shortLabel = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      day: 'numeric',
    }).format(cursor);

    days.push({ id, label, shortLabel });
  }

  return days;
}

export function validateCallBooking(input: {
  day: string;
  slot: string;
  email: string;
}): { isValid: boolean; error?: string } {
  if (!input.day.trim() || !input.slot.trim()) {
    return { isValid: false, error: 'Please choose a day and time slot.' };
  }
  const normalized = input.email.trim();
  if (!normalized || !EMAIL_PATTERN.test(normalized)) {
    return { isValid: false, error: 'Enter a valid email to receive your calendar invite.' };
  }
  return { isValid: true };
}

export function buildEnquiryPlainText(data: EnquiryFormData): string {
  const location = data.location.trim() || 'Remote / Worldwide';
  const lines = [
    'Hi WebVibe Studio,',
    '',
    'I would like to start a project enquiry with the details below:',
    '',
    `Name: ${data.name.trim()}`,
    `Email: ${data.email.trim()}`,
    `Service: ${data.service.trim()}`,
    `Estimated Budget: ${data.budget.trim()}`,
    `City / Time Zone: ${location}`,
    '',
    'Project Brief:',
    data.message.trim(),
  ];
  return lines.join('\n');
}

export function buildEnquiryMailtoUrl(
  recipientEmail: string,
  data: EnquiryFormData
): string {
  const subject = `Project Enquiry: ${data.service.trim()} — ${data.name.trim()}`;
  const body = buildEnquiryPlainText(data);
  return `mailto:${recipientEmail.trim()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}


