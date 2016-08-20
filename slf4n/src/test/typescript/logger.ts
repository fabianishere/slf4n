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
import slf4n from '../../main/typescript/slf4n';

export class TestLogger implements slf4n.Logger {
	/** @inheritDoc */
	debug(msg: string): void { }

	/** @inheritDoc */
	isDebugEnabled(): boolean { return false; }

	/** @inheritDoc */
	error(msg: string): void { }

	/** @inheritDoc */
	isErrorEnabled(): boolean { return false; }

	/** @inheritDoc */
	info(msg: string): void { }

	/** @inheritDoc */
	isInfoEnabled(): boolean { return false; }

	/** @inheritDoc */
	trace(msg: string): void { }

	/** @inheritDoc */
	isTraceEnabled(): boolean { return false; }

	/** @inheritDoc */
	warn(msg: string): void { }

	/** @inheritDoc */
	isWarnEnabled(): boolean { return false; }

	/** @inheritDoc */
	name(): string { return "test"; }
}

export class TestLoggerFactory implements slf4n.LoggerFactory {
	private static logger = new TestLogger();

	/** @inheritDoc */
	get(_: NodeModule): slf4n.Logger { return TestLoggerFactory.logger; }
}

export default new TestLoggerFactory();