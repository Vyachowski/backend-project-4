import {
  isValidUrl,
  generateFileNameFromUrl,
} from '../src/utilities.js';

test('Validate URL: valid url', () => {
  expect(isValidUrl('http://example.com')).toBe(true);
});

test('Validate URL: non-string format', () => {
  expect(isValidUrl([])).toBe(false);
});

test('Validate URL: invalid url(no first level domain)', () => {
  expect(isValidUrl('http://example')).toBe(false);
});

test('Validate URL: invalid url(excess chars)', () => {
  expect(isValidUrl('example,.com')).toBe(false);
});

test('Generate filename from URL: valid url', () => {
  const testExtension = '.pug';
  expect(generateFileNameFromUrl('https://ru.hexlet.io/courses', testExtension)).toBe('ru-hexlet-io-courses.pug');
});

test('Generate filename from URL: wrong argment type', () => {
  expect(() => generateFileNameFromUrl(['https://ru.hexlet.io/courses'])).toThrow('Not a valid url string');
});
