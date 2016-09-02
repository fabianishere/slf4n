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
import slf4n from 'slf4n';
import * as winston from 'winston';

/**
 * A {@link slf4n.Logger} implementation for Winston.
 *
 * @author Fabian Mastenbroek <mail.fabianm@gmail.com>
 */
export class Logger implements slf4n.Logger {
	/** @inheritDoc */
	debug(msg: any, ...args: any[]): void {
		winston.debug(slf4n.format(msg, args));
	}

	/** @inheritDoc */
	isDebugEnabled(): boolean {
		return winston.level <= (<any> winston).config.npm.debug;
	}

	/** @inheritDoc */
	error(msg: any, ...args: any[]): void {
		winston.error(slf4n.format(msg, args));
	}

	/** @inheritDoc */
	isErrorEnabled(): boolean {
		return winston.level <= (<any> winston).config.npm.error;
	}

	/** @inheritDoc */
	info(msg: any, ...args: any[]): void {
		winston.info(slf4n.format(msg, args));
	}

	/** @inheritDoc */
	isInfoEnabled(): boolean {
		return winston.level <= (<any> winston).config.npm.info;
	}

	/** @inheritDoc */
	trace(msg: any, ...args: any[]): void { /* NOP */ }

	/** @inheritDoc */
	isTraceEnabled(): boolean {
		return false
	}

	/** @inheritDoc */
	warn(msg: any, ...args: any[]): void {
		winston.warn(slf4n.format(msg, args));
	}

	/** @inheritDoc */
	isWarnEnabled(): boolean {
		return winston.level <= (<any> winston).config.npm.warn;
	}

	/** @inheritDoc */
	name(): string {
		return "winston";
	}
}

/**
 * The {@link slf4n.LoggerFactory} for the logging-js logger.
 *
 * @author Fabian Mastenbroek <mail.fabianm@gmail.com>
 */
export class LoggerFactory implements slf4n.LoggerFactory {
	private logger: Logger = new Logger();
	/** @inheritDoc */
	get(_: NodeModule): Logger {
		return this.logger;
	}
}

export default new LoggerFactory();