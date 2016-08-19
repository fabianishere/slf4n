/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Fabian M. <mail.fabianm@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var slf4n = require("slf4n"), logging = require("logging-js");

/*
 * Construct a new {@link Logger} instance.
 *
 * @param module The module to get the {@link slf4n.Logger} implementation for.
 */
function Logger(module) {
	this.logger = logging.get(module);
	return this;
};

/*
 * Log the given message with the given level.
 * 
 * @param level The level to log this message with.
 * @param message The message to log.
 * @param varargs The arguments of the message.
 */
Logger.prototype.log = function(level, message, varargs) {
	var record = new logging.Record(level, message);
	record.loggerName = this.logger.name;
	record.parameters = varargs;
	if (message instanceof Error) {
		record.message = null;
		record.thrown = message;
	}
	record.inferCaller(inferCaller);
	this.logger.logr(record);
};

/*
 * Log a message at the DEBUG level.
 * 
 * @param message The message to log at the DEBUG level.
 */
Logger.prototype.debug = function(message) {
	if (!this.isDebugEnabled())
		return;
	this.log(this.logger.levels.CONFIG, message, Array.prototype.slice.call(record.parameters).slice(2));
};

/*
 * Determine whether the DEBUG level is enabled or not.
 * 
 * @return <code>true</code> if the DEBUG level is enabled, <code>false</code>
 *	otherwise.
 */
Logger.prototype.isDebugEnabled = function() { 
	return this.logger.level.value <= this.logger.levels.CONFIG.value;
};

/*
 * Log a message at the ERROR level.
 * 
 * @param message The message to log at the ERROR level.
 */
Logger.prototype.error = function(message) {
	if (!this.isErrorEnabled())
		return;
	this.log(this.logger.levels.SEVERE, message,
			Array.prototype.slice.call(arguments).slice(2));
};

/*
 * Determine whether the ERROR level is enabled or not.
 * 
 * @return <code>true</code> if the ERROR level is enabled, <code>false</code>
 *	otherwise.
 */
Logger.prototype.isErrorEnabled = function() { 
	return this.logger.level.value <= this.logger.levels.SEVERE.value;
};

/*
 * Log a message at the INFO level.
 * 
 * @param message The message to log at the INFO level.
 */
Logger.prototype.info = function(message) {
	if (!this.isInfoEnabled())
		return;
	this.log(this.logger.levels.INFO, message,
			Array.prototype.slice.call(arguments).slice(2));
};

/*
 * Determine whether the INFO level is enabled or not.
 * 
 * @return <code>true</code> if the INFO level is enabled, <code>false</code>
 *	otherwise.
 */
Logger.prototype.isInfoEnabled = function() { 
	return this.logger.level.value <= this.logger.levels.INFO.value;
};

/*
 * Log a message at the TRACE level.
 * 
 * @param message The message to log at the TRACE level.
 */
Logger.prototype.trace = function(message) {
	if (!this.isTraceEnabled())
		return;
	this.log(this.logger.levels.FINE, message,
			Array.prototype.slice.call(arguments).slice(2));
};

/*
 * Determine whether the TRACE level is enabled or not.
 * 
 * @return <code>true</code> if the TRACE level is enabled, <code>false</code>
 *	otherwise.
 */
Logger.prototype.isTraceEnabled = function() { 
	return this.logger.level.value <= this.logger.levels.FINE.value;
};

/*
 * Log a message at the WARN level.
 * 
 * @param message The message to log at the WARN level.
 */
Logger.prototype.warn = function(message) {
	if (!this.isWarnEnabled())
		return;
	this.log(this.logger.levels.WARNING, message,
			Array.prototype.slice.call(arguments).slice(2));
};

/*
 * Determine whether the WARN level is enabled or not.
 * 
 * @return <code>true</code> if the WARN level is enabled, <code>false</code>
 *	otherwise.
 */
Logger.prototype.isWarnEnabled = function() { 
	return this.logger.level.value <= this.logger.levels.WARNING.value;
};

/*
 * Infer the caller's module and method name.
 * 
 * @return The found stack frame that contains the module and method name.
 */
function inferCaller(stack) {
	for (var index = stack.length; index > 0; index--)
		if (stack[index - 1].getFileName() == __filename)
			return stack[index];
}

/*
 * Return a {@link slf4n.Logger} implementation for the given module.
 *
 * @param module The module to get the {@link slf4n.Logger} implementation for.
 */
module.exports.getLogger = function(module) {
	return new Logger(module);
};