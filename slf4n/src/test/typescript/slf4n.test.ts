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
import test from 'ava';
import slf4n from '../../main/typescript/node';
import { TestLogger } from './logger';

test('Whether slf4n will fall back to NOPLogger when a binding cannot be found.', t => {
	const logger = slf4n.get(null);
	t.true(logger instanceof slf4n.NOPLogger, 'slf4n does not fall back to NOPLogger when a binding is not found.');
});

test('Whether NOPLogger returns the correct values.', t => {
	const logger = slf4n.get(null);
	t.false(logger.isDebugEnabled(), 'Debug messages should be disabled.');
	t.false(logger.isInfoEnabled(), 'Info messages should be disabled.');
	t.false(logger.isWarnEnabled(), 'Warning messages should be disabled.');
	t.false(logger.isErrorEnabled(), 'Error messages should be disabled.');
	t.false(logger.isTraceEnabled(), 'Trace messages should be disabled.');
	t.is(logger.name(), 'nop', 'Name should be equal to "nop".');
});

test('Whether NOPLoggerFactory always returns a NOPLogger.', t => {
	const factory = new slf4n.NOPLoggerFactory();
	for (let i = 0; i < 1000; i++)
		t.true(factory.get(null) instanceof slf4n.NOPLogger);
});

test('Whether slf4n.format functions correctly.', t => {
	t.is(slf4n.format('{0} {0}'), '{0} {0}');
	t.is(slf4n.format('{0} {0}', 1, 2), '1 1');
	t.is(slf4n.format('{0} {1}', 1, 2), '1 2');
	t.is(slf4n.format('{1} {2}', 1, 2), '2 {2}');
	t.is(slf4n.format('{1} {0}', 1, 2), '2 1');
});

test('Whether environmental variables work when determining a binding.', t => {
	process.env['SLF4N_BINDING'] = '../../../build/test/typescript/logger';
	const factory = slf4n.init(new slf4n.NodeLoggerFactoryResolver(), "test", (_) => null);
	const logger = <TestLogger> factory.get(module);
	t.is(logger.name(), 'test');
});