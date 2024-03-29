import { writeFile } from 'node:fs/promises';
import validPath from 'valid-path';
import { homedir } from 'os';
import axios from 'axios';
import path from 'path';

const isValidUrl = (urlString) => {
  const urlPattern = new RegExp('^(https?:\\/\\/)?'
        + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'
        + '((\\d{1,3}\\.){3}\\d{1,3}))' //
        + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'
        + '(\\?[;&a-z\\d%_.~+=-]*)?'
        + '(\\#[-a-z\\d_]*)?$', 'i');
  return !!urlPattern.test(urlString);
};

const generateFileNameFromUrl = (url) => {
  if (typeof url !== 'string') {
    throw new Error('Not a valid url string');
  }

  const urlWithoutProtocol = url.replace(/^(https?:\/\/)?/, '');
  const symbolsReplacedUrl = urlWithoutProtocol.replace(/[^a-zA-Z0-9]/g, '-');
  return `${symbolsReplacedUrl}.html`;
};

const generateFilePath = (dirPath, filePath) => path.join(dirPath, filePath);

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
    .then((outputPath) => `Page was successfully downloaded into '${outputPath}'`);
};

export default pageLoader;
