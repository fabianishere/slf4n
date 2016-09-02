/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Fabian Mastenbroek <mail.fabianm@gmail.com>
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
import slf4n from 'slf4n';
const logging = require('logging-js');

/**
 * A {@link slf4n.Logger} implementation for logging.js.
 *
 * @author Fabian Mastenbroek <mail.fabianm@gmail.com>
 */
export class Logger implements slf4n.Logger {
	/**
	 * The underlying {@link logging.Logger} instance.
	 */
	private logger: any;

	/**
	 * Construct a {@link Logger} instance.
	 *
	 * @param module The module to create a logger for.
	 */
	constructor(module: NodeModule) {
		this.logger = logging.get(module);
	}
	/**
	 * Log the given message with the given level.
	 *
	 * @param level The level to log this message with.
	 * @param message The message to log.
	 * @param args The arguments of the message.
	 */
	private log(level: any, message: any, args: any[]) {
		var record = new logging.Record(level, message);
		record.loggerName = this.logger.name;
		record.parameters = args;
		if (message instanceof Error) {
			record.message = null;
			record.thrown = message;
		}
		record.inferCaller(Logger.inferCaller);
		this.logger.logr(record);
	}

	/**
	 * Infer the caller's module and method name.
	 *
	 * @return The found stack frame that contains the module and method name.
	 */
	private static inferCaller(stack: any[]): any {
		for (var index = stack.length; index > 0; index--)
			if (stack[index - 1].getFileName() == __filename)
				return stack[index];
	}

	/** @inheritDoc */
	debug(msg: any, ...args: any[]): void {
		if (!this.isDebugEnabled())
			return;
		this.log(this.logger.levels.CONFIG, msg, args);
	}

	/** @inheritDoc */
	isDebugEnabled(): boolean {
		return this.logger.level.value <= this.logger.levels.CONFIG.value;
	}

	/** @inheritDoc */
	error(msg: any, ...args: any[]): void {
		if (!this.isErrorEnabled())
			return;
		this.log(this.logger.levels.SEVERE, msg, args);
	}

	/** @inheritDoc */
	isErrorEnabled(): boolean {
		return this.logger.level.value <= this.logger.levels.SEVERE.value;
	}

	/** @inheritDoc */
	info(msg: any, ...args: any[]): void {
		if (!this.isInfoEnabled())
			return;
		this.log(this.logger.levels.INFO, msg, args);
	}

	/** @inheritDoc */
	isInfoEnabled(): boolean {
		return this.logger.level.value <= this.logger.levels.INFO.value;
	}

	/** @inheritDoc */
	trace(msg: any, ...args: any[]): void {
		if (!this.isTraceEnabled())
			return;
		this.log(this.logger.levels.FINE, msg, args);
	}

	/** @inheritDoc */
	isTraceEnabled(): boolean {
		return this.logger.level.value <= this.logger.levels.FINE.value;
	}

	/** @inheritDoc */
	warn(msg: any, ...args: any[]): void {
		if (!this.isWarnEnabled())
			return;
		this.log(this.logger.levels.WARNING, msg, args);
	}

	/** @inheritDoc */
	isWarnEnabled(): boolean {
		return this.logger.level.value <= this.logger.levels.WARNING.value;
	}

	/** @inheritDoc */
	name(): string {
		return "logging-js";
	}
}

/**
 * The {@link slf4n.LoggerFactory} for the logging-js logger.
 *
 * @author Fabian Mastenbroek <mail.fabianm@gmail.com>
 */
export class LoggerFactory implements slf4n.LoggerFactory {
	private cache: { [module: string]: Logger } = {};
	/** @inheritDoc */
	get(module: NodeModule): Logger {
		return this.cache[module.id] || (this.cache[module.id] = new Logger(module));
	}
}

export default new LoggerFactory();