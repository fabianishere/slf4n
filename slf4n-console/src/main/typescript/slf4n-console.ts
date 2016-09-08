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
import slf4n from 'slf4n-api';
import { basename } from 'path';

/**
 * A {@link slf4n.Logger} implementation for logging.js.
 *
 * @author Fabian Mastenbroek <mail.fabianm@gmail.com>
 */
export class Logger implements slf4n.Logger {
	/**
	 * The module instance of this {@link Logger}.
	 */
	private module: NodeModule;

	/**
	 * Construct a {@link Logger} instance.
	 *
	 * @param module The module to create a logger for.
	 */
	constructor(module: NodeModule) {
		this.module = module;
	}

	/** @inheritDoc */
	debug(msg: any, ...args: any[]): void {
		if (!this.isDebugEnabled())
			return;
		console.debug(basename(this.module.filename), 'debug:', slf4n.format(msg, args));
	}

	/** @inheritDoc */
	isDebugEnabled(): boolean {
		return true;
	}

	/** @inheritDoc */
	error(msg: any, ...args: any[]): void {
		if (!this.isErrorEnabled())
			return;
		console.error(basename(this.module.filename), 'error:', slf4n.format(msg, args));
	}

	/** @inheritDoc */
	isErrorEnabled(): boolean {
		return true
	}

	/** @inheritDoc */
	info(msg: any, ...args: any[]): void {
		if (!this.isInfoEnabled())
			return;
		console.info(basename(this.module.filename), 'info:', slf4n.format(msg, args));
	}

	/** @inheritDoc */
	isInfoEnabled(): boolean {
		return true;
	}

	/** @inheritDoc */
	trace(msg: any, ...args: any[]): void { /* NOP */ }

	/** @inheritDoc */
	isTraceEnabled(): boolean {
		return false;
	}

	/** @inheritDoc */
	warn(msg: any, ...args: any[]): void {
		if (!this.isWarnEnabled())
			return;
		console.warn(basename(this.module.filename), 'warn:', slf4n.format(msg, args));
	}

	/** @inheritDoc */
	isWarnEnabled(): boolean {
		return true;
	}

	/** @inheritDoc */
	name(): string {
		return "console";
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