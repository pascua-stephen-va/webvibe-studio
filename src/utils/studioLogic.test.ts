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


