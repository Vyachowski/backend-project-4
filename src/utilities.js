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

const generateFileName = (input, hasExtension = false, postfix = '') => {
  if (typeof input !== 'string') {
    throw new Error('Not a valid url string');
  }

  let pathname = input;
  let extension = '';
  if (hasExtension) {
    extension = path.extname(input);
    pathname = pathname.replace(extension, '');
  }

  const urlWithoutProtocol = pathname.replace(/^(https?:\/\/)?/, '');
  const symbolsReplacedUrl = urlWithoutProtocol.replace(/[^a-zA-Z0-9]/g, '-');
  return `${symbolsReplacedUrl}${postfix}${extension}`;
};

const getResourceType = (url) => {
  const fileTypes = {
    image: new Set(['jpg', 'jpeg', 'png', 'gif']),
    text: new Set(['css', 'js', 'txt']),
  };
  const urlExtension =  path.extname(url);

  for (let type in fileTypes) {
    if (fileTypes[type].has(urlExtension)) return type;
  }

  return 'text';
}

export {
  isValidUrl,
  generateFileName,
  getResourceType,
};
