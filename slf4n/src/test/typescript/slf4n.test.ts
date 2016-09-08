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
import { node, default as factory } from '../../main/typescript/node';
import { TestLogger } from './logger';
import { expect }  from 'chai';

describe('slf4n-node', () => {
	it('should fall back to NOPLogger when a binding cannot be found.', () => {
		const logger = factory.get(null);
		expect(logger)
			.instanceof(slf4n.NOPLogger, 'slf4n does not fall back to NOPLogger when a binding is not found.');
	});

	it('should select the correct binding when an environmental variable is set.', () => {
		process.env['SLF4N_BINDING'] = '../../../build/test/typescript/logger';
		(<any> process).slf4n = null; // clear cache in order to resolve a new instance.
		const factory = slf4n.init(new node.NodeLoggerFactoryResolver(), "test", (_: string): void => null);
		const logger = <TestLogger> factory.get(module);
		expect(logger.name()).to.equal('test');
	});
});