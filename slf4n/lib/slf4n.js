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

/*
 * Simple logging facade for NodeJS allowing the end user to choose the desired 
 *	logging framework at deployment time.
 *
 * @author Fabian M. <mail.fabianm@gmail.com>
 */
function slf4n() {
	return this;
}

/*
 * The global {@link slf4n.LoggerFactory} instance slf4n uses.
 */
slf4n.factory = null;

/*
 * The {@link slf4n.LoggerFactory} is an abstract logging factory for a 
 *	{@link slf4n.Logger} instance.
 *
 * SLF4N bindings should be simple Node modules returning a 
 *	{@link slf4n.LoggerFactory#getLogger(module)} function.
 */
slf4n.LoggerFactory = function() {
	this.cache = {};
	return this;
};

/*
 * Return a {@link slf4n.Logger} instance for the given module.
 *
 * @param module The module to get the {@link slf4n.Logger} instance for.
 */
slf4n.LoggerFactory.prototype.getLogger = function(module) {
	if (this.cache.hasOwnProperty && this.cache.hasOwnProperty(module))
		return this.cache[module];
	return this.cache[module] = new slf4n.Logger(module);
};

/*
 * The {@link slf4n.Logger} class is a logging interface which should be provided by
 *	the logging implementation.
 *
 * @param module The module of this {@link slf4n.Logger} instance.
 */
slf4n.Logger = function(module) {
	this.module = module;
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
 * Format the given message with the given arguments.
 *
 * @param message The message to format.
 * @param varargs The arguments.
 * @return The formatted message.
 */
slf4n.format = function(message, varargs) {
	/* 
	 * Created by user fearphage from Stackoverflow.com 
	 * https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436 
	 */
	if (!(typeof message == 'string' || message instanceof String))
		return message;
	var args = Array.prototype.slice.call(varargs).slice(2);
	message = message.replace(/{(\d+)}/g, function(match, number) {
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
	return message;
};

/*
 * Resolve the user-defined {@link slf4n.LoggerFactory} instance for the NodeJS
 *	platform.
 *
 * @throws An excpetion when failed to resolve the binding.
 */
slf4n.resolveForNode = function() {
	var fs = require('fs'), path = require('path'), configuration = {};
	module.paths = require.main.paths.concat(module.paths);
	function getBinding(name) { 
		try {
			return require(name);
		} catch (e) {
			throw new Error('Failed to load binding "' + name + '" (' + e.message + ')');
		}
	}
	/* 
 	 * From node-pkginfo
 	 * https://github.com/indexzero/node-pkginfo
	 * Licensed under MIT.
 	 */
	function getConfiguration(module, dir) {
		dir = dir || path.dirname(module.filename);
		var files = fs.readdirSync(dir);
		if (~files.indexOf('package.json')) 
			return require(path.join(dir, 'package.json'));
		if (dir === '/' || !dir || dir === '.')
			return null;  
		return getConfiguration(module, path.dirname(dir));
	}
	
	if (process.env.hasOwnProperty("SLF4N_BINDING"))
		return getBinding(process.env["SLF4N_BINDING"]);
	configuration = getConfiguration(require.main) || configuration;
	if (configuration.hasOwnProperty("slf4n-binding"))
		return getBinding(configuration["slf4n-binding"]);
	throw new Error('Failed to determine binding (No configuration found)');
};

/*
 * Return a {@link slf4n.Logger} implementation for the given module using the 
 *	user-defined {@link slf4n.LoggerFactory} instance.
 *
 * @param module The module to get the {@link slf4n.Logger} implementation for.
 */
slf4n.get = (function() {
	slf4n.factory = new slf4n.LoggerFactory();
	
	console = console || {};
	console.trace = console.trace || function() {};
	console.error = console.error || function() {};
	
	var strategy = null;
	if (typeof module !== 'undefined' && module.exports)
		strategy = slf4n.resolveForNode;
	
	try {
		slf4n.factory = strategy();
	} catch(e) {
		console.error('SLF4N: ' + (!strategy ? 'No LoggerFactory resolving strategy found for current platform' : e.message) + '.');
		console.error('SLF4N: Defaulting to no-operation (NOP) logger implementation.');
		console.error('SLF4N: See https://github.com/fabianm/slf4n for further details.');
	}
	return function(module) {
		return slf4n.factory.getLogger(module);
	};
})();

module = module || {};
module.exports = slf4n;