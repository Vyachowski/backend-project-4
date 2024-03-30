import {
  readFile, mkdtemp, rm,
} from 'node:fs/promises';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import nock from 'nock';
import os from 'os';

import pageLoader from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Page loader functional testing', () => {
  const testData = {
    domain: 'https://ru.hexlet.io/',
    fileNamePrefix: 'ru-hexlet-io-',
    fileExtension: '.html',
    getUrl() { return `${this.domain}courses`; },
    getUrl404() { return `${this.domain}404`; },
    getFileName() { return `${this.fileNamePrefix}courses${this.fileExtension}`; },
    getFileName404() { return `${this.fileNamePrefix}courses${this.fileExtension}`; },
  };

  const tempData = {
    htmlResponse: null,
    innerTempDir: null,
    tempDir: null,
  };

  beforeAll(async () => {
    const htmlExampleFilePath = path.join(__dirname, '..', '__fixtures__', 'example.html');
    tempData.htmlResponse = await readFile(htmlExampleFilePath, 'utf-8');

    nock('https://ru.hexlet.io/')
      .persist()
      .get('/courses')
      .reply(200, tempData.htmlResponse);
  });

  afterAll(async () => {
    nock.cleanAll();
  });

  beforeEach(async () => {
    tempData.tempDir = await mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
    tempData.innerTempDir = await mkdtemp(path.join(tempData.tempDir, 'inner-'));
  });

  afterEach(async () => {
    try {
      await rm(tempData.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to delete temporary directory:', error);
    }
  });

  test('App run: link provided, existing test directory', async () => {
    const expectedHtml = tempData.htmlResponse;
    const testUrl = testData.getUrl();
    const { tempDir } = tempData;

    const loadedPagePath = await pageLoader(testUrl, tempDir);
    console.log(loadedPagePath); // Special command for mac os testing
    const loadedPageContent = await readFile(loadedPagePath, 'utf-8');

    await expect(loadedPageContent).toBe(expectedHtml);
  });

  test('App run: link provided, existing directory inside test dir', async () => {
    const expectedHtml = tempData.htmlResponse;
    const testUrl = testData.getUrl();
    const { innerTempDir } = tempData;

    const loadedPagePath = await pageLoader(testUrl, innerTempDir);
    console.log(loadedPagePath); // Special command for mac os testing
    const loadedPageContent = await readFile(loadedPagePath, 'utf-8');

    await expect(loadedPageContent).toBe(expectedHtml);
  });

  test('App run: link not provided', async () => {
    const testUrl = null;
    const { tempDir } = tempData;

    await expect(async () => await pageLoader(testUrl, tempDir)).rejects.toThrow();
  });

  test('App run: link invalid', async () => {
    const testUrl = 'null.ru';
    const { tempDir } = tempData;

    await expect(async () => await pageLoader(testUrl, tempDir)).rejects.toThrow();
  });

  // test('App run: link not provided, existing test directory', async () => {

  // });

  // // Invalid url
  // test('App run: link invalid, default directory', async () => {

  // });

  // test('App run: link invalid, existing test directory', async () => {

  // });
});
