/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Fabian M. <mail.fabianm@gmail.com>
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
var fs = null, path = null;

/*
 * Simple logging facade for NodeJS allowing the end user to choose the desired 
 *	logging framework at deployment time.
 */
function slf4n() {
	return this;
}

/*
 * Cache containing created {@link slf4n.Logger} instances.
 */
slf4n.cache = {};

/*
 * The {@link slf4n.LoggerFactory} slf4n uses.
 */
slf4n.factory = null;

/*
 * Return a {@link slf4n.Logger} implementation for the given module.
 *
 * @param module The module to get the {@link slf4n.Logger} implementation for.
 */
slf4n.get = function(module) {
	if (slf4n.factory == null)
		initialise();
	if (slf4n.cache.hasOwnProperty && slf4n.cache.hasOwnProperty(module))
		return cache[module];
	return slf4n.cache[module] = slf4n.factory.getLogger(module);
};

/*
 * Format the given message with the given arguments.
 *
 * @param message The message to format.
 * @param varargs The arguments.
 * @return The formatted message.
 */
slf4n.format = function(message, varargs) {
	if (!(typeof message == 'string' || message instanceof String))
		return message;
	var args = Array.prototype.slice.call(varargs).slice(2);
	message = message.replace(/{(\d+)}/g, function(match, number) {
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
	return message;
};

/*
 * The {@link slf4n.LoggerFactory} is an abstract logging factory for a 
 *	{@link slf4n.Logger} instance.
 *
 * SLF4N bindings should be simple Node modules returning a 
 *	{@link slf4n.LoggerFactory#getLogger(module)} function.
 */
slf4n.LoggerFactory = function() {
	return this;
};

/*
 * Return a {@link slf4n.Logger} instance for the given module.
 *
 * @param module The module to get the {@link slf4n.Logger} instance for.
 */
slf4n.LoggerFactory.prototype.getLogger = function(module) {
	return new slf4n.Logger();
};

/*
 * The {@link slf4n.Logger} class is a logging interface which should be provided by
 *	the logging implementation.
 */
slf4n.Logger = function() {
	return this;
};

/*
 * Log a message at the DEBUG level.
 * 
 * @param message The message to log at the DEBUG level.
 */
slf4n.Logger.prototype.debug = function(message) {};

/*
 * Determine whether the DEBUG level is enabled or not.
 * 
 * @return <code>true</code> if the DEBUG level is enabled, <code>false</code>
 *	otherwise.
 */
slf4n.Logger.prototype.isDebugEnabled = function() { return false; };

/*
 * Log a message at the ERROR level.
 * 
 * @param message The message to log at the ERROR level.
 */
slf4n.Logger.prototype.error = function(message) {};

/*
 * Determine whether the ERROR level is enabled or not.
 * 
 * @return <code>true</code> if the ERROR level is enabled, <code>false</code>
 *	otherwise.
 */
slf4n.Logger.prototype.isErrorEnabled = function() { return false; };

/*
 * Log a message at the INFO level.
 * 
 * @param message The message to log at the INFO level.
 */
slf4n.Logger.prototype.info = function(message) {};

/*
 * Determine whether the INFO level is enabled or not.
 * 
 * @return <code>true</code> if the INFO level is enabled, <code>false</code>
 *	otherwise.
 */
slf4n.Logger.prototype.isInfoEnabled = function() { return false; };

/*
 * Log a message at the TRACE level.
 * 
 * @param message The message to log at the TRACE level.
 */
slf4n.Logger.prototype.trace = function(message) {};

/*
 * Determine whether the TRACE level is enabled or not.
 * 
 * @return <code>true</code> if the TRACE level is enabled, <code>false</code>
 *	otherwise.
 */
slf4n.Logger.prototype.isTraceEnabled = function() { return false; };

/*
 * Log a message at the WARN level.
 * 
 * @param message The message to log at the WARN level.
 */
slf4n.Logger.prototype.warn = function(message) {};

/*
 * Determine whether the WARN level is enabled or not.
 * 
 * @return <code>true</code> if the WARN level is enabled, <code>false</code>
 *	otherwise.
 */
slf4n.Logger.prototype.isWarnEnabled = function() { return false; };

/*
 * Find the package.json file that belongs to the given module.
 *
 * @param module The module to find the package.json file for.
 */
function findConfiguration(module, dir) {
	dir = dir || path.dirname(module.filename);
  
	var files = fs.readdirSync(dir);
  
	if (~files.indexOf('package.json')) 
		return require(path.join(dir, 'package.json'));
	if (dir === '/' || !dir || dir === '.')
		return null;  
	return findConfiguration(module, path.dirname(dir));
}

/*
 * Load a binding by package name.
 *
 * @param name The name of the binding to load.
 */
function loadBinding(name) {
	try {
		module.paths = require.main.paths.concat(module.paths);
		slf4n.factory = require(name);
	} catch(e) {
		console.log(module);
		console.error("SLF4N: Failed to load binding \"" + name + "\":");
		console.trace(e);
		console.error("SLF4N: Defaulting to no-operation (NOP) logger implementation.");
		console.error("SLF4N: See https://github.com/fabianm/slf4n for further details.");
		slf4n.factory = new slf4n.LoggerFactory();
	}
}
 
/*
 * Initialise this simple logging facade.
 */
function initialise() {
	if (process.env.hasOwnProperty("SLF4N_BINDING")) {
		loadBinding(process.env["SLF4N_BINDING"]);
		return;
	}
	
	fs = fs || require("fs");
	path = path || require("path");
	
	var configuration = findConfiguration(require.main);
	if (configuration != null) {
		if (configuration.hasOwnProperty("slf4n-binding")) {
			loadBinding(configuration["slf4n-binding"]);
			return;
		}
	}
 
	console.error("SLF4N: Failed to determine binding.");
	console.error("SLF4N: Defaulting to no-operation (NOP) logger implementation.");
	console.error("SLF4N: See https://github.com/fabianm/slf4n for further details.");
	slf4n.factory = new slf4n.LoggerFactory();
}
module.exports = slf4n;
