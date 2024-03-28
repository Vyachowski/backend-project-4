import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import nock from 'nock';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Nock usage
beforeAll(async () => {
  const htmlExampleFilePath = path.join(__dirname, '..', '__fixtures__', 'example.html');
  const htmlResponse = await fs.readFile(htmlExampleFilePath, 'utf-8');

  nock('http://example.com')
    .get('/')
    .reply(200, htmlResponse)
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


// Positive cases
test('App run: link provided, default directory (no option)', async () => {
  // expect().
});

test('App run: link provided, existing test directory', async () => {

});

test('App run: link provided, non-existing directory inside test dir', async () => {

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
