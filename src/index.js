import { writeFile } from 'node:fs/promises';
import * as cheerio from 'cheerio';
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

const downloadResources = (dom, outputPath) => {
  // Create directory
  // Download images and get the links
  const $images = dom('img');
  const imageLinks = $images.map((_, index) => dom(index).attr('src')).get();
  console.log(imageLinks);
  // Download other resources and get the links
  return new Promise(() => {
    return imageLinks;
  });
};

const replaceUrlToLocal = (document, urlList) => document + urlList;

const pageLoader = (url, outputDirPath) => {
  if (typeof url !== 'string' || !isValidUrl(url)) {
    throw new Error('Url is not valid. Provide a proper link such as http://example.com');
  }
  if (typeof outputDirPath !== 'string' || !validPath(outputDirPath)) {
    throw new Error(`An output directory path should be a valid string, for example: ${homedir}`);
  }

  const filePath = path.join(outputDirPath, generateFileNameFromUrl(url, '.html'));
  return fetchHtmlPage(url)
    .then((htmlString) => {
      const $ = cheerio.load(htmlString);
      return downloadResources($, outputDirPath)
        .then((downloadedUrlList) => replaceUrlToLocal(htmlString, downloadedUrlList));
    })
    .then((updatedDocument) => writeFile(filePath, updatedDocument))
    .then(() => filePath);
};

export default pageLoader;
