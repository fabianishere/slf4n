/*
 * Print a formatted string using the given binding.
 */
import slf4n from 'slf4n';
const logger = slf4n.get(module);

logger.info('This a {0} string.', 'formatted');