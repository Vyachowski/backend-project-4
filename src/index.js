import { writeFile, mkdir } from 'node:fs/promises';
import * as cheerio from 'cheerio';
import validPath from 'valid-path';
import { homedir } from 'os';
import axios from 'axios';
import Listr from 'listr';
import path from 'path';

import {
  isValidUrl,
  formatFileName,
  getResourceType,
  generatePageNameFromUrl,
} from './utilities.js';

const fetchSourcePage = (url) => axios
  .get(url)
  .then((res) => {
    if (!res.data) {
      throw new Error('This page doesn\'t exist. Please try another url.');
    }

    const $ = cheerio.load(res.data);
    const isHtml = $('html').length > 0;

    if (!isHtml) {
      throw new Error('The fetched content is not an HTML document.');
    }

    return res.data;
  });

const getLinksToDownload = ($, { hostname, href }) => {
  const $elements = $('img, script, link'); // types: image, script, html, css
  const linksToDownload = [];

  $elements.each((index, el) => {
    const linkString = $(el).attr('src') || $(el).attr('href');
    if (linkString) {
      const resourceType = getResourceType($(el));
      const link = new URL(linkString, href);
      if (link.hostname === hostname) linksToDownload.push({ link: link.href, type: resourceType });
    }
  });

  return linksToDownload;
};

const replaceDomLinks = ($, url) => {
  const $elements = $('img, script, link');
  const assetsDirectory = generatePageNameFromUrl(url.href, '_files');

  $elements.each((index, el) => {
    const link = $(el).attr('src') || $(el).attr('href');
    if (link) {
      const targetLink = new URL(link, url.href);
      if (targetLink.hostname === url.hostname) {
        if ($(el).attr('rel') === 'canonical') {
          $(el).attr('href', `${assetsDirectory}/${formatFileName(targetLink.href)}.html`);
        } else if ($(el).attr('src')) {
          $(el).attr('src', `${assetsDirectory}/${formatFileName(targetLink.href)}`);
        } else {
          $(el).attr('href', `${assetsDirectory}/${formatFileName(targetLink.href)}`);
        }
      }
    }
  });

  return $;
};

const fetchResource = (url) => {
  const name = formatFileName(url);

  return axios
    .get(url, { responseType: 'arraybuffer' })
    .then(({ status, data }) => {
      if (status === 200) {
        return { name, data };
      }
      throw new Error(`Failed to download resource. Status: ${status}`);
    })
    .catch((error) => {
      throw error;
    });
};

const writeResource = (filePath, data, link, resolve) => writeFile(filePath, data)
  .then(() => resolve({ url: link, status: 'success' }))
  .catch(() => resolve({ url: link, status: 'failed' }));

const displayTaskStatus = (promisesList, urlsList) => {
  const taskList = promisesList.map((promise, index) => ({
    title: urlsList[index],
    task: () => promise,
  }));
  const tasks = new Listr(taskList, { concurrent: true });

  tasks.run().catch((err) => { console.error(err); });
};

const downloadResources = (urlList, outputDirPath) => mkdir(outputDirPath, { recursive: true })
  .then(() => {
    const taskList = urlList.map((resource) => new Promise((resolve) => {
      const { link, type } = resource;
      fetchResource(link)
        .then(({ name, data }) => {
          const fileName = type === 'html' ? `${formatFileName(name)}.html` : formatFileName(name);
          const filePath = path.join(outputDirPath, fileName);
          writeResource(filePath, data, link, resolve);
        })
        .catch(() => resolve({ url: link, status: 'failed' }));
    }));
    displayTaskStatus(taskList, urlList.map((resource) => resource.link));
    return Promise.allSettled(taskList);
  })
  .then((results) => results.map((result) => result.value));

const pageLoader = (urlString, outputDirPath = process.cwd()) => {
  if (typeof urlString !== 'string' || !isValidUrl(urlString)) {
    throw new Error('Url is not valid. Provide a proper link such as http://example.com');
  }
  if (typeof outputDirPath !== 'string' || !validPath(outputDirPath)) {
    throw new Error(`An output directory path should be a valid string, for example: ${homedir}`);
  }

  const url = new URL(urlString);
  const sourceFilePath = path.join(outputDirPath, generatePageNameFromUrl(urlString));
  const dirPath = path.join(outputDirPath, generatePageNameFromUrl(urlString, '_files'));

  return fetchSourcePage(url)
    .then((html) => {
      const dom = cheerio.load(html);
      const linksToDownload = getLinksToDownload(dom, url);
      const htmlWithReplacedLinks = replaceDomLinks(dom, url).html();

      if (linksToDownload.length > 0) {
        return downloadResources(linksToDownload, dirPath).then(() => htmlWithReplacedLinks);
      }

      return htmlWithReplacedLinks;
    })
    .then((updatedDocument) => writeFile(sourceFilePath, updatedDocument))
    .then(() => sourceFilePath)
    .catch((e) => {
      throw e;
    });
};

export default pageLoader;
