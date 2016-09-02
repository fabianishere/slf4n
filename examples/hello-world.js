/*
 * Print the string "Hello World" using the given binding.
 */
import slf4n from 'slf4n';
const logger = slf4n.get(module);

logger.info('Hello World');