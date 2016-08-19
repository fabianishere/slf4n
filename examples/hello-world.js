/*
 * Print the string "Hello World" using the given binding.
 */
var logger = require('slf4n').get(module);

logger.info('Hello World');