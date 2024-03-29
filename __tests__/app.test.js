import {
  readFile, mkdir, mkdtemp, rm, stat,
} from 'node:fs/promises';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import nock from 'nock';
import os from 'os';

import pageLoader from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Nock usage
let htmlResponse;

beforeAll(async () => {
  const htmlExampleFilePath = path.join(__dirname, '..', '__fixtures__', 'example.html');
  htmlResponse = await readFile(htmlExampleFilePath, 'utf-8');

  nock('https://ru.hexlet.io/')
    .get('/courses')
    .reply(200, htmlResponse);
});

afterAll(async () => {
  nock.cleanAll();
});

// Creating temp folders
let tempDir;
let innerTempDir;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  innerTempDir = await mkdtemp(path.join(tempDir, 'inner-'));
});

afterEach(async () => {
  try {
    await rm(tempDir, { recursive: true });
  } catch (error) {
    console.error('Failed to delete temporary directory:', error);
  }
});

// Common variables
const exampleUrl = 'https://ru.hexlet.io/courses';
const exampleFileName = 'ru-hexlet-io-courses.html';
const exampleNonExistingUrl = 'https://ru.hexlet.io/404';
const exampleNonExistingFileName = 'ru-hexlet-io-404.html';

// Positive cases
test('App run: link provided, existing test directory', async () => {
  const loadedPagePath = await pageLoader(exampleUrl, tempDir);
  console.log(loadedPagePath);
  const loadedPageContent = await readFile(loadedPagePath, 'utf-8');

  await expect(loadedPageContent).toBe(htmlResponse);
});

// test('App run: link provided, existing directory inside test dir', async () => {
//   const loadedPagePath = await pageLoader(exampleUrl, innerTempDir);
//   console.log(loadedPagePath);
//   const loadedPageContent = await readFile(loadedPagePath, 'utf-8');

//   await expect(loadedPageContent).toBe(htmlResponse);
// });

// Negative cases
// Without an url
// test('App run: link not provided', async () => {

// });

// test('App run: link not provided, existing test directory', async () => {

// });

// // Invalid url
// test('App run: link invalid, default directory', async () => {

// });

// test('App run: link invalid, existing test directory', async () => {

// });
