function errorMessageConstructor(message) {
  return `[minesweeper] ${message}`
}

function _Error(message, errorType) {
  return new window[errorType](errorMessageConstructor(message))
}

export function TypeError(message) {
  return _Error(message, 'TypeError')
}