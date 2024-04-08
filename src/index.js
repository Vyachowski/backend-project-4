import { writeFile } from 'node:fs/promises';
import * as cheerio from 'cheerio';
import validPath from 'valid-path';
import { homedir } from 'os';
import axios from 'axios';
import path from 'path';

import {
  isValidUrl,
  generateFileName,
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

const replaceDomLinks = (htmlDocument, outputDir, url) => {
  const $ = cheerio.load(htmlDocument);
  const currentLink = new URL(url);
  const $elements = $('img, script, link');
  const assetsDirectory = generateFileName(url, false, '_files');
  const linksToDownload = [];

  $elements.each((index, el) => {
    const link = $(el).attr('src') || $(el).attr('href');
    if (link) {
      const targetLink = new URL(link, currentLink);
      if (targetLink.hostname === currentLink.hostname) {
        if ($(el).attr('src')) {
          $(el).attr('src', `${assetsDirectory}/${generateFileName(targetLink.href, true)}`);
        } else {
          $(el).attr('href', `${assetsDirectory}/${generateFileName(targetLink.href, true)}`);
        }
        linksToDownload.push(targetLink.href);
      }
    }
  });

  return {
    localDom: $.html(),
    urlList: linksToDownload,
  };
};

const downloadResources = (urlList, outputDirPath) => {
  const downloadQueue = urlList.map((url) => downloadResource(url));
  return Promise
    .all(downloadQueue)
    .then((files) => {
      console.log(files);
      const writeFilesQueue = downloadQueue.map((file) => writeFile(outputDirPath));
      return Promise
        .allSettled(writeFilesQueue)
        .then((results) => results.every((value) => value.status === 'fulfilled'));
    })
};

const pageLoader = (url, outputDirPath) => {
  if (typeof url !== 'string' || !isValidUrl(url)) {
    throw new Error('Url is not valid. Provide a proper link such as http://example.com');
  }
  if (typeof outputDirPath !== 'string' || !validPath(outputDirPath)) {
    throw new Error(`An output directory path should be a valid string, for example: ${homedir}`);
  }
  const filePath = path.join(outputDirPath, generateFileName(url, '.html'));
  return fetchHtmlPage(url)
    .then((htmlString) => {
      const { localDom, urlList } = replaceDomLinks(htmlString, outputDirPath, url);
      // console.log(urlList);
      if (urlList.length > 0) {
        return downloadResources(urlList).then((r) => (r && localDom));
      }
      return localDom;
    });
  // .then((updatedDocument) => writeFile(filePath, updatedDocument))
  // .then(() => filePath);
};

export default pageLoader;
