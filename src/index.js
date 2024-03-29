import { writeFile } from 'node:fs/promises';
import validPath from 'valid-path';
import { homedir } from 'os';
import axios from 'axios';

import {
  isValidUrl,
  generateFileNameFromUrl,
  generateFilePath,
} from './utilities.js';

const fetchHtmlPage = (url) => axios
  .get(url)
  .then((res) => {
    if (!res.data) {
      throw new Error('This page doesn\'t exist. Please try another url.');
    }

    const contentStart = res.data.trim().toLowerCase().substring(0, 15);

    if (!contentStart.includes('<!doctype html>') && !contentStart.includes('<html>')) {
      throw new Error('The fetched content is not an HTML document.');
    }

    return res.data;
  });

const saveHtmlPage = (outputPath, data) => {
  writeFile(outputPath, data);
  return outputPath;
};

const pageLoader = (url, outputDirPath) => {
  if (typeof url !== 'string' || !isValidUrl(url)) {
    throw new Error('Url is not valid. Provide a proper link such as http://example.com');
  }
  if (typeof outputDirPath !== 'string' || !validPath(outputDirPath)) {
    throw new Error(`An output directory path should be a valid string, for example: ${homedir}`);
  }

  const filePath = generateFilePath(outputDirPath, generateFileNameFromUrl(url));
  return fetchHtmlPage(url)
    .then((data) => saveHtmlPage(filePath, data))
    .then((outputPath) => outputPath);
};

export default pageLoader;
