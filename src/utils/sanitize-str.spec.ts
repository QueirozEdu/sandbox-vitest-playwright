import { error } from 'console';
import { sanitizeStr } from './sanitize-str';

describe('sanitizeStr (unit)', () => {
  test('returns an empty string when given a false value', () => {
    //@ts-expect-error testing function without parameters
    expect(sanitizeStr()).toBe('');
  });

  test('returns an empty string when given a value that is not a string', () => {
    //@ts-expect-error testing function without parameters
    expect(sanitizeStr(123)).toBe('');
  });

  test('trims the given string', () => {
    expect(sanitizeStr('  a   ')).toBe('a');
  });

  test('string normalized with NFC', () => {
    const original = 'e\u0301 ';
    const expected = 'é';
    expect(expected).toBe(sanitizeStr(original));
  });
});
