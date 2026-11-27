import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractCityFromTimeZone,
  formatLocalStudioTime,
  getNextTheme,
  resolveInitialTheme,
  validateEnquiryForm,
} from './studioLogic';

test('theme resolution honors saved preference and toggles cleanly', () => {
  assert.equal(resolveInitialTheme('dark', false), 'dark');
  assert.equal(resolveInitialTheme('light', true), 'light');
  assert.equal(resolveInitialTheme(null, true), 'dark');
  assert.equal(resolveInitialTheme(null, false), 'light');
  assert.equal(getNextTheme('light'), 'dark');
  assert.equal(getNextTheme('dark'), 'light');
});

test('extractCityFromTimeZone parses nested IANA regions and underscores', () => {
  assert.equal(extractCityFromTimeZone('America/Los_Angeles'), 'Los Angeles');
  assert.equal(extractCityFromTimeZone('Asia/Manila'), 'Manila');
  assert.equal(
    extractCityFromTimeZone('America/Argentina/Buenos_Aires'),
    'Buenos Aires'
  );
  assert.equal(extractCityFromTimeZone('Etc/UTC'), 'UTC');
  assert.equal(extractCityFromTimeZone(undefined), 'Local');
});

test('formatLocalStudioTime outputs 12-hour clock and city', () => {
  const sampleDate = new Date('2026-03-15T16:35:00Z');
  const result = formatLocalStudioTime(sampleDate, 'America/New_York');
  assert.equal(result.time, '12:35 PM');
  assert.equal(result.city, 'New York');
  assert.equal(result.fullLabel, '12:35 PM · New York');

  const morning = formatLocalStudioTime(
    new Date('2026-03-15T01:05:00Z'),
    'Asia/Manila'
  );
  assert.equal(morning.time, '9:05 AM');
  assert.equal(morning.city, 'Manila');
});

test('validateEnquiryForm rejects missing or malformed inputs and accepts valid data', () => {
  const emptyCheck = validateEnquiryForm({
    name: '',
    email: '',
    location: '',
    service: 'Website Design & Build',
    budget: '$3k – $6k',
    message: '',
  });
  assert.equal(emptyCheck.isValid, false);
  assert.ok(emptyCheck.errors.name);
  assert.ok(emptyCheck.errors.email);
  assert.ok(emptyCheck.errors.message);

  const badEmailCheck = validateEnquiryForm({
    name: 'Alex Morgan',
    email: 'not-an-email',
    location: 'London',
    service: 'Website Refresh',
    budget: '$3k – $6k',
    message: 'We need a redesign of our boutique architecture website.',
  });
  assert.equal(badEmailCheck.isValid, false);
  assert.equal(badEmailCheck.errors.name, undefined);
  assert.ok(badEmailCheck.errors.email);
  assert.equal(badEmailCheck.errors.message, undefined);

  const validCheck = validateEnquiryForm({
    name: 'Alex Morgan',
    email: 'alex@studio.co',
    location: 'London',
    service: 'Website Design & Build',
    budget: '$6k – $12k',
    message: 'Launching a new brand storefront and booking system in Q1.',
  });
  assert.equal(validCheck.isValid, true);
  assert.deepEqual(validCheck.errors, {});
});

test('getUpcomingCallDays skips weekends and validateCallBooking validates invite email', async () => {
  const { getUpcomingCallDays, validateCallBooking } = await import('./studioLogic');
  // Friday Nov 27, 2026 -> next 4 business days should skip Sat/Sun
  const friday = new Date('2026-11-27T12:00:00Z');
  const days = getUpcomingCallDays(friday, 4);
  assert.equal(days.length, 4);
  assert.equal(days[0].id, '2026-11-30');
  assert.equal(days[1].id, '2026-12-01');

  assert.equal(validateCallBooking({ day: '2026-11-30', slot: '10:00 AM', email: '' }).isValid, false);
  assert.equal(validateCallBooking({ day: '2026-11-30', slot: '10:00 AM', email: 'bad' }).isValid, false);
  assert.equal(
    validateCallBooking({ day: '2026-11-30', slot: '10:00 AM', email: 'founder@brand.co' }).isValid,
    true
  );
});

test('formatLocalStudioTime honors precise cityOverride and parseReverseGeocodeCity extracts real city', async () => {
  const { parseReverseGeocodeCity } = await import('./studioLogic');

  const withOverride = formatLocalStudioTime(
    new Date('2026-03-15T01:05:00Z'),
    'Asia/Shanghai',
    'Manila'
  );
  assert.equal(withOverride.city, 'Manila');
  assert.equal(withOverride.fullLabel, '9:05 AM · Manila');

  assert.equal(
    parseReverseGeocodeCity({ city: 'Makati', principalSubdivision: 'Metro Manila' }),
    'Makati'
  );
  assert.equal(
    parseReverseGeocodeCity({ city: '', locality: 'Cebu City' }),
    'Cebu City'
  );
  assert.equal(
    parseReverseGeocodeCity({ address: { town: 'Taguig', state: 'Metro Manila' } }),
    'Taguig'
  );
  assert.equal(parseReverseGeocodeCity({}), null);
});

test('buildEnquiryMailtoUrl encodes subject and body with all enquiry fields', async () => {
  const { buildEnquiryMailtoUrl, buildEnquiryPlainText } = await import('./studioLogic');
  const form = {
    name: 'Alex Morgan',
    email: 'alex@brand.co',
    location: '',
    service: 'Website Design & Build',
    budget: '$5k – $10k',
    message: 'Need a fast storefront & brand refresh? Launching Q2.',
  };

  const plainText = buildEnquiryPlainText(form);
  assert.ok(plainText.includes('Name: Alex Morgan'));
  assert.ok(plainText.includes('Email: alex@brand.co'));
  assert.ok(plainText.includes('Service: Website Design & Build'));
  assert.ok(plainText.includes('Estimated Budget: $5k – $10k'));
  assert.ok(plainText.includes('City / Time Zone: Remote / Worldwide'));
  assert.ok(plainText.includes('Need a fast storefront & brand refresh? Launching Q2.'));

  const url = buildEnquiryMailtoUrl('steve@webvi.be', form);
  assert.ok(url.startsWith('mailto:steve@webvi.be?subject='));
  assert.ok(url.includes('&body='));

  const query = url.split('?')[1] ?? '';
  const params = new URLSearchParams(query);
  assert.equal(params.get('subject'), 'Project Enquiry: Website Design & Build — Alex Morgan');
  assert.equal(params.get('body'), plainText);
});

test('buildWeb3FormsPayload formats all fields including replyto and botcheck', async () => {
  const { buildWeb3FormsPayload } = await import('./studioLogic');
  const payload = buildWeb3FormsPayload(
    '  test-uuid-key  ',
    {
      name: 'Sam Rivera',
      email: 'sam@northstar.io',
      location: 'Austin, CST',
      service: 'Website Refresh',
      budget: '$10k – $20k',
      message: 'Modernizing our marketing site before Series A.',
    },
    false
  );

  assert.equal(payload.access_key, 'test-uuid-key');
  assert.equal(payload.subject, 'New WebVibe Studio Inquiry from Sam Rivera');
  assert.equal(payload.from_name, 'WebVibe Studio');
  assert.equal(payload.replyto, 'sam@northstar.io');
  assert.equal(payload.service, 'Website Refresh');
  assert.equal(payload.budget, '$10k – $20k');
  assert.equal(payload.location, 'Austin, CST');
  assert.equal(payload.botcheck, false);
});

test('submitWeb3FormsEnquiry handles success, missing key, non-OK HTTP, API error, and network failure', async () => {
  const { submitWeb3FormsEnquiry, WEB3FORMS_ENDPOINT } = await import('./studioLogic');
  const sampleForm = {
    name: 'Sam Rivera',
    email: 'sam@northstar.io',
    location: '',
    service: 'Website Design & Build',
    budget: '$5k – $10k',
    message: 'Building a new studio showcase and enquiry site.',
  };

  // Missing key
  const missing = await submitWeb3FormsEnquiry('', sampleForm);
  assert.deepEqual(missing, { ok: false, reason: 'missing-key' });

  // 200 OK + success: true
  let capturedUrl = '';
  let capturedInit: RequestInit | undefined;
  const okFetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    capturedUrl = String(input);
    capturedInit = init;
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }) as typeof fetch;

  const success = await submitWeb3FormsEnquiry('valid-key', sampleForm, false, okFetch);
  assert.deepEqual(success, { ok: true });
  assert.equal(capturedUrl, WEB3FORMS_ENDPOINT);
  assert.equal(capturedInit?.method, 'POST');
  const parsedBody = JSON.parse(String(capturedInit?.body));
  assert.equal(parsedBody.access_key, 'valid-key');
  assert.equal(parsedBody.replyto, 'sam@northstar.io');
  assert.equal(parsedBody.from_name, 'WebVibe Studio');
  assert.equal(parsedBody.botcheck, false);

  // HTTP 500
  const httpErrFetch = (async () => new Response('Server Error', { status: 500 })) as typeof fetch;
  assert.deepEqual(
    await submitWeb3FormsEnquiry('valid-key', sampleForm, false, httpErrFetch),
    { ok: false, reason: 'http-error' }
  );

  // 200 OK + success: false
  const apiErrFetch = (async () =>
    new Response(JSON.stringify({ success: false }), { status: 200 })) as typeof fetch;
  assert.deepEqual(
    await submitWeb3FormsEnquiry('valid-key', sampleForm, false, apiErrFetch),
    { ok: false, reason: 'api-error' }
  );

  // Network failure (e.g. ad-blocker or offline)
  const networkErrFetch = (async () => {
    throw new TypeError('Failed to fetch');
  }) as typeof fetch;
  assert.deepEqual(
    await submitWeb3FormsEnquiry('valid-key', sampleForm, false, networkErrFetch),
    { ok: false, reason: 'network-error' }
  );
});

test('validateEnquiryField provides real-time per-field feedback for name, email, and message', async () => {
  const { validateEnquiryField } = await import('./studioLogic');

  assert.equal(validateEnquiryField('name', ''), 'Please enter your name.');
  assert.equal(validateEnquiryField('name', 'A'), 'Name must be at least 2 characters.');
  assert.equal(validateEnquiryField('name', 'Alex'), undefined);

  assert.equal(validateEnquiryField('email', ''), 'Please enter your email address.');
  assert.equal(validateEnquiryField('email', 'alex@'), 'Please enter a valid email address.');
  assert.equal(validateEnquiryField('email', 'alex@studio'), 'Please enter a valid email address.');
  assert.equal(validateEnquiryField('email', 'alex@studio.co'), undefined);

  assert.equal(
    validateEnquiryField('message', ''),
    'Tell us briefly what you are looking to build.'
  );
  assert.equal(
    validateEnquiryField('message', 'Too short'),
    'Please share at least a sentence about your project.'
  );
  assert.equal(
    validateEnquiryField('message', 'Building a bespoke web storefront for Q2.'),
    undefined
  );
});





