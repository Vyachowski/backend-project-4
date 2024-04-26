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
  generateFileNameFromUrl,
  getResourceType,
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

const getLinksToDownload = ($, { hostname }) => {
  const $elements = $('img, script, link, a');
  const linksToDownload = [];

  $elements.each((index, el) => {
    const link = $(el).attr('src') || $(el).attr('href');
    if (link) {
      const linkHost = new URL(link, host);
      if (linkHost === hostname) linksToDownload.push(link.href);
    }
  }

  return linksToDownload;
};

const replaceDomLinks = ($, url) => {
  // const $ = cheerio.load(htmlDocument);
  const currentLink = new URL(url);
  const $elements = $('img, script, link');
  const assetsDirectory = generateFileNameFromUrl(url, '_files');
  const linksToDownload = [];

  $elements.each((index, el) => {
    const link = $(el).attr('src') || $(el).attr('href');
    if (link) {
      const targetLink = new URL(link, currentLink);
      if (targetLink.hostname === currentLink.hostname) {
        if ($(el).attr('rel') === 'canonical') {
          $(el).attr('href', `${assetsDirectory}/${formatFileName(targetLink.href)}.html`);
        } else {
          if ($(el).attr('src')) {
            $(el).attr('src', `${assetsDirectory}/${formatFileName(targetLink.href)}`);
          } else {
            $(el).attr('href', `${assetsDirectory}/${formatFileName(targetLink.href)}`);
          }
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

const downloadResource = (url) => {
  const name = formatFileName(url);
  const resourceType = getResourceType(url); // 'image' or 'text'

  return axios
    .get(url, { responseType: 'arraybuffer'})
    .then(({ status, data }) => {
      if (status === 200) {
        return { name, data };
      } else {
        throw new Error(`Failed to download resource. Status: ${response.status}`);
      }
    })
    .catch((error) => {
      throw error;
    });
}

const displayTaskStatus = (promisesList, urlsList) => {
  const taskList = promisesList.map((promise, index) => {
    return {
      title: urlsList[index],
      task: () => promise
    }
  });
  const tasks = new Listr(taskList, { concurrent: true });

  tasks.run().catch(err => { console.error(err) });
};

const downloadResources = (urlList, outputDirPath) => {
  return mkdir(outputDirPath, { recursive: true })
    .then(() => {
      const taskList = urlList.map((url) => {
        return new Promise((resolve) => {
          downloadResource(url)
            .then(({ name, data }) => {
              writeFile(path.join(outputDirPath, name), data)
                .then(() => resolve({ url, status: 'success' }))
                .catch(() => resolve({ url, status: 'failed' }));
            })
            .catch(() => resolve({ url, status: 'failed' }));
        });
      });
      displayTaskStatus(taskList, urlList);
      return Promise.allSettled(taskList);
    })
    .then((results) => {
      return results.map((result) => result.value);
    });
};

const pageLoader = (urlString, outputDirPath) => {
  if (typeof url !== 'string' || !isValidUrl(url)) {
    throw new Error('Url is not valid. Provide a proper link such as http://example.com');
  }
  if (typeof outputDirPath !== 'string' || !validPath(outputDirPath)) {
    throw new Error(`An output directory path should be a valid string, for example: ${homedir}`);
  }

  const url = new URL(urlString);
  const sourceFilePath = path.join(outputDirPath, generateFileNameFromUrl(url, '.html'));
  const dirPath = path.join(outputDirPath, generateFileNameFromUrl(url, '_files'));

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
  .then(() => sourceFilePath);
};

export default pageLoader;
