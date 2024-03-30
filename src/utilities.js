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

const generateFileNameFromUrl = (url, postfix) => {
  if (typeof url !== 'string') {
    throw new Error('Not a valid url string');
  }

  const urlWithoutProtocol = url.replace(/^(https?:\/\/)?/, '');
  const symbolsReplacedUrl = urlWithoutProtocol.replace(/[^a-zA-Z0-9]/g, '-');
  return `${symbolsReplacedUrl}${postfix}`;
};

const generateFilePath = (dirPath, filePath) => path.join(dirPath, filePath);

export {
  isValidUrl,
  generateFileNameFromUrl,
  generateFilePath,
};
