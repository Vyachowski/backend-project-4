import {
  isValidUrl,
  generateFileNameFromUrl,
  generateFilePath,
} from '../src/utilities.js';

test('Validate URL: valid url', () => {
  expect(isValidUrl('http://example.com')).toBe(true);
});

test('Validate URL: non-string format', () => {
  expect(isValidUrl([])).toBe(false);
});

test('Validate URL: invalid url', () => {
  expect(isValidUrl('http://example')).toBe(false);
});

test('Validate URL: invalid url', () => {
  expect(isValidUrl('example,.com')).toBe(false);
});

test('Generate filename from URL: valid url', () => {
  expect(generateFileNameFromUrl('https://ru.hexlet.io/courses')).toBe('ru-hexlet-io-courses.html');
});

test('Generate filename from URL: wrong argment type', () => {
  expect(() => generateFileNameFromUrl(['https://ru.hexlet.io/courses'])).toThrow('Not a valid url string');
});

test('Generate filepath: valid arguments', () => {
  expect(generateFilePath('/temp/courses', 'file.example')).toBe('/temp/courses/file.example');
});
