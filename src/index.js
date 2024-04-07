import { writeFile } from 'node:fs/promises';
import validPath from 'valid-path';
import { homedir } from 'os';
import axios from 'axios';
import path from 'path';

import {
  isValidUrl,
  generateFileNameFromUrl,
} from './utilities.js';

const fetchHtmlPage = (url) => axios
  .get(url)
  .then((res) => {
    if (!res.data) {
      throw new Error('This page doesn\'t exist. Please try another url.');
    }

    const contentStart = res.data.trim().substring(0, 15).toLowerCase();

    if (!contentStart.includes('<!doctype html>') && !contentStart.includes('<html>')) {
      throw new Error('The fetched content is not an HTML document.');
    }

    return res.data;
  });

const pageLoader = (url, outputDirPath) => {
  if (typeof url !== 'string' || !isValidUrl(url)) {
    throw new Error('Url is not valid. Provide a proper link such as http://example.com');
  }
  if (typeof outputDirPath !== 'string' || !validPath(outputDirPath)) {
    throw new Error(`An output directory path should be a valid string, for example: ${homedir}`);
  }

  const filePath = path.join(outputDirPath, generateFileNameFromUrl(url, '.html'));
  return fetchHtmlPage(url)
    .then((data) => writeFile(filePath, data))
    .then(() => filePath);
};

export default pageLoader;
