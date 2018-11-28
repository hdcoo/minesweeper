const url = require('url');
const path = require('path');

const isExternal = function (descriptor) {
  return /^[a-zA-Z0-9_\\-]+@/.test(descriptor)
};

const makeError = function (message) {
  return new Error(`[assets-parser] ${message}`)
};

const getInformationFromDescriptor = function (descriptor) {
  const regExp = /^([a-zA-Z0-9_\\-]+)@([^?@]+)([\s\S]*)/;
  const matches = descriptor.match(regExp);
  if(!matches) {
    throw makeError(`${descriptor} is invalid`)
  }
  const [, name, version, search] = matches;
  const {query = {}} = url.parse(`http://example${search}`, true);
  const protocol = query.protocol;
  const host = query.host;
  const pathname = query.pathname;
  const filename = query.filename;
  return {name, version, protocol, host, pathname, filename}
};

const getUrlInformation = function (descriptor, options = {}) {
  const {
    name,
    version,
    protocol,
    host,
    pathname,
    filename
  } = getInformationFromDescriptor(descriptor);
  
  return {
    protocol: protocol || options.protocol || 'https',
    host: host || options.host || 'm0-file2.bybutter.com',
    pathname: pathname || path.join(options.basePath || '/', name, version),
    filename: filename || `${name}${options.ext}`
  }
};

const generateUrl = function (descriptor, options) {
  const {protocol, host, pathname, filename} = getUrlInformation(descriptor, options);
  return `${protocol.match(/https?/)[0]}://${host}${path.join(pathname, filename).replace(/\\/g, '/')}`
};

const parse = function (descriptor, options) {
  return isExternal(descriptor) ? generateUrl(descriptor, options) : descriptor
};


module.exports = parse;