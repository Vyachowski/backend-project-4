import path from 'path';

const isValidUrl = (urlString) => {
  const urlPattern = new RegExp('^(https?:\\/\\/)?'
        + '(localhost|'
        + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'
        + '((\\d{1,3}\\.){3}\\d{1,3}))'
        + ')'
        + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'
        + '(\\?[;&a-z\\d%_.~+=-]*)?'
        + '(\\#[-a-z\\d_]*)?$', 'i');
  return !!urlPattern.test(urlString);
};

const formatFileName = (input) => {
  if (typeof input !== 'string') {
    throw new Error('Not a valid url string');
  }

  const extension = path.extname(input);
  const pathname = input.replace(extension, '');

  const urlWithoutProtocol = pathname.replace(/^(https?:\/\/)?/, '');
  const symbolsReplacedUrl = urlWithoutProtocol.replace(/[^a-zA-Z0-9]/g, '-');
  return `${symbolsReplacedUrl}${extension}`;
};

const generatePageNameFromUrl = (input, prefix = '.html') => {
  if (typeof input !== 'string') {
    throw new Error('Not a valid url string');
  }

  const trimmedUrl = input.replace(/\/$/, '');
  const urlWithoutProtocol = trimmedUrl.replace(/^(https?:\/\/)?/, '');
  const symbolsReplacedUrl = urlWithoutProtocol.replace(/[^a-zA-Z0-9]/g, '-');

  return `${symbolsReplacedUrl}${prefix}`;
};

export {
  isValidUrl,
  formatFileName,
  generatePageNameFromUrl,
};
