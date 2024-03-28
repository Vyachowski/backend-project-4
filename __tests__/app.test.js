import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import nock from 'nock';
import path from 'path';
import os from 'os';

import pageLoader from '../src/index.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Nock usage
let htmlResponse;

beforeAll(async () => {
  const htmlExampleFilePath = path.join(__dirname, '..', '__fixtures__', 'example.html');
  htmlResponse = await readFile(htmlExampleFilePath, 'utf-8');

  nock(/.*/)
    .get('/404')
    .reply(404, htmlResponse);

  nock(/.*/)
    .get('/')
    .reply(200, htmlResponse);
});

afterAll(async () => {
  nock.cleanAll();
});

// Creating temp folders
let tempDir;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
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
const exampleNonExistingUrl = 'https://ru.hexlet.io/404';
const exampleFileName = 'ru-hexlet-io-courses.html';

// Positive cases
test('App run: link provided, default directory (no option)', async () => {
  const loadedPage = pageLoader(exampleUrl);
  const loadedPageContent = await readFile(path.join(process.cwd(), exampleFileName));

  expect(loadedPageContent).toEqual(htmlResponse);
});

test('App run: link provided, existing test directory', async () => {
  const loadedPage = pageLoader(exampleUrl, tempDir);
  const loadedPageContent = await readFile(path.join(tempDir, exampleFileName));

  expect(loadedPageContent).toEqual(htmlResponse);
});

test('App run: link provided, non-existing directory inside test dir', async () => {
  const innerFolderPath = path.join(tempDir, 'inner_folder')
  const loadedPage = pageLoader(exampleUrl, innerFolderPath);
  const loadedPageContent = await readFile(path.join(innerFolderPath, exampleFileName));

  expect(loadedPageContent).toEqual(htmlResponse);
});

// Negative cases
// Without an url
test('App run: link not provided', async () => {

});

test('App run: link not provided, existing test directory', async () => {

});

// Invalid url
test('App run: link invalid, default directory', async () => {

});

test('App run: link invalid, existing test directory', async () => {

});
