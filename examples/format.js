/*
 * Print a formatted string using the given binding.
 */
var logger = require('slf4n').get(module);

logger.info('This a {0} string.', 'formatted');