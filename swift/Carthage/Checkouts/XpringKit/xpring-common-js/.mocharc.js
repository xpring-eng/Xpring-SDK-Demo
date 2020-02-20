'use strict';

module.exports = {
  require: [
    'ts-node/register',
    'source-map-support/register',
  ],
  extension: [
    'ts'
  ],
  
  // Do not look for mocha opts file
  opts: false,

  // Warn if test exceed 75ms duration
  slow: 75,

  // Fail if tests exceed 2000ms
  timeout: 2000,

  // Check for global variable leaks
  'check-leaks': true,
}
