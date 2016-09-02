/*
 * All logging levels.
 */
import slf4n from 'slf4n';
const logger = slf4n.get(module);

if (logger.isTraceEnabled())
	logger.trace("The TRACE level is enabled");

if (logger.isDebugEnabled())
	logger.debug("The DEBUG level is enabled");

if (logger.isInfoEnabled())
	logger.info("The INFO level is enabled");

if (logger.isWarnEnabled())
	logger.warn("The WARN level is enabled");

if (logger.isErrorEnabled())
	logger.error("The ERROR level is enabled");

