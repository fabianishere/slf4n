/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Fabian M. <mail.fabianm@gmail.com>
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

/**
 * Simple logging facade for NodeJS allowing the end user to choose the desired
 *	logging framework at deployment time.
 */
namespace slf4n {
	/**
	 * The {@link slf4n.Logger} interface is a logging interface which should be
	 *  provided by a concrete logging implementation.
	 *
	 * @author Fabian Mastenbroek <mail.fabianm@gmail.com>
	 */
	export interface Logger {
		/**
		 * Log a message at the DEBUG level.
		 *
		 * @param msg The message to be logged at the DEBUG level.
		 */
		debug(msg: string): void;

		/**
		 * Determine whether the DEBUG level is enabled or not.
		 *
		 * @return <code>true</code> if the DEBUG level is enabled,
		 *  <code>false</code> otherwise.
		 */
		isDebugEnabled(): boolean;

		/**
		 * Log a message at the ERROR level.
		 *
		 * @param msg The message to be logged at the DEBUG level.
		 */
		error(msg: string): void;

		/**
		 * Determine whether the ERROR level is enabled or not.
		 *
		 * @return <code>true</code> if the ERROR level is enabled,
		 *  <code>false</code> otherwise.
		 */
		isErrorEnabled(): boolean;

		/**
		 * Log a message at the INFO level.
		 *
		 * @param msg The message to be logged at the INFO level.
		 */
		info(msg: string): void;

		/**
		 * Determine whether the INFO level is enabled or not.
		 *
		 * @return <code>true</code> if the INFO level is enabled,
		 *  <code>false</code> otherwise.
		 */
		isInfoEnabled(): boolean;

		/**
		 * Log a message at the TRACE level.
		 *
		 * @param msg The message to be logged at the TRACE level.
		 */
		trace(msg: string): void;

		/**
		 * Determine whether the TRACE level is enabled or not.
		 *
		 * @return <code>true</code> if the TRACE level is enabled,
		 *  <code>false</code> otherwise.
		 */
		isTraceEnabled(): boolean;

		/**
		 * Log a message at the WARN level.
		 *
		 * @param msg The message to be logged at the WARN level.
		 */
		warn(msg: string): void;

		/**
		 * Determine whether the WARN level is enabled or not.
		 *
		 * @return <code>true</code> if the WARN level is enabled,
		 *  <code>false</code> otherwise.
		 */
		isWarnEnabled(): boolean;

		/**
		 * Get the name of this {@link slf4n.Logger} instance.
		 *
		 * @return The name of this logger.
		 */
		name(): string;
	}

	/**
	 * Implementations of the {@link slf4n.LoggerFactory} interface manufacture
	 *  {@link slf4n.Logger} instances given a <code>module</code> object.
	 *
	 * @author Fabian Mastenbroek <mail.fabianm@gmail.com>
	 */
	export interface LoggerFactory {
		/**
		 * Return a {@link slf4n.Logger} instance for a <code>module</code>
		 *  object.
		 *
		 * @param module The {@link NodeModule} to get the {@link slf4n.Logger} instance for.
		 */
		get(module: NodeModule): Logger;
	}

	/**
	 * The {@link slf4n.NOPLogger} is a no operation implementation of the
	 *  {@link slf4n.Logger} class and is used as default logger in case
	 *  a {@link slf4n.LoggerFactory} resolving strategy is not found for the
	 *  current platform or a binding is not given.
	 *
	 * @author Fabian Mastenbroek <mail.fabianm@gmail.com>
	 */
	export class NOPLogger implements Logger {
		/** @inheritDoc */
		debug(msg: string): void {}

		/** @inheritDoc */
		isDebugEnabled(): boolean { return false; }

		/** @inheritDoc */
		error(msg: string): void {}

		/** @inheritDoc */
		isErrorEnabled(): boolean { return false; }

		/** @inheritDoc */
		info(msg: string): void {}

		/** @inheritDoc */
		isInfoEnabled(): boolean { return false; }

		/** @inheritDoc */
		trace(msg: string): void {}

		/** @inheritDoc */
		isTraceEnabled(): boolean { return false; }

		/** @inheritDoc */
		warn(msg: string): void {}

		/** @inheritDoc */
		isWarnEnabled(): boolean { return false; }

		/** @inheritDoc */
		name(): string { return "nop"; }
	}

	/**
	 * A {@link slf4n.LoggerFactory} for the {@link slf4n.NOPLogger}.
	 *
	 * @author Fabian Mastenbroek <mail.fabianm@gmail.com>
	 */
	export class NOPLoggerFactory implements LoggerFactory {
		private static logger = new NOPLogger();

		/** @inheritDoc */
		get(_: NodeModule): Logger { return NOPLoggerFactory.logger; }
	}

	/**
	 * Implementations of the {@link slf4n.LoggerFactoryResolver} interface
	 *  resolve the {@link slf4n.LoggerFactory} for a platform (e.g. node).
	 *
	 * @author Fabian Mastenbroek <mail.fabianm@gmail.com>
	 */
	export interface LoggerFactoryResolver {
		/**
		 * Resolve the {@link slf4n.LoggerFactory} for this platform.
		 *
		 * @return The factory or an error when the resolving failed.
		 */
		resolve(): LoggerFactory | Error;
	}

	/**
	 * Format the given message with the given arguments.
	 *
	 * @param message The message to format.
	 * @param args The arguments.
	 * @return The formatted message.
	 */
	export function format(message: string, ...args: any[]) {
		return message.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	}

	/**
	 * The default {@link slf4n.LoggerFactory} instance slf4n uses.
	 */
	let defaultFactory: LoggerFactory = new NOPLoggerFactory();

	/**
	 * Initialize slf4n and resolve a {@link slf4n.LoggerFactory} using the
	 * 	given {@link slf4n.LoggerFactoryResolver}.
	 *
	 * @param resolver The {@link slf4n.LoggerFactoryResolver} to resolve a {@link slf4n.LoggerFactory} for the
	 * 	platform slf4n is running on.
	 * @param platform The name of the platform slf4n is running on.
	 * @param error The function to call when an error occurs. For example, <code>console.error</code> can be passed
	 * 	as argument and will be used to log an error in case one occurs.
	 * @return The {@link slf4n.LoggerFactory} resolved, or {@link slf4n.NOPLoggerFactory} in case the resolving failed.
	 */
	export function init(resolver: LoggerFactoryResolver, platform: string, error: (msg: string) => void): LoggerFactory {
		const result = resolver.resolve();

		if (result instanceof Error) {
			error(`SLF4N: ${result.message}.`);
			error('SLF4N: Defaulting to no-operation (NOP) logger implementation.');
			error('SLF4N: See https://github.com/fabianishere/slf4n for further details.');

			return defaultFactory;
		} else {
			return result;
		}
	}
}

export default slf4n;