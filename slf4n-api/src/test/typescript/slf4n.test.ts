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
import slf4n from '../../main/typescript/slf4n';
import { expect }  from 'chai';

describe('slf4n-api', () => {
	describe('NOPLoggerFactory', () => {
		it('should always return an instance of NOPLogger.', () => {
			const factory = new slf4n.NOPLoggerFactory();
			for (let i = 0; i < 1000; i++) {
				expect(factory.get(null)).to.be.instanceof(slf4n.NOPLogger,
					'All loggers created by NOPLoggerFactory must be an instance of NOPLogger.');
			}
		});
	});

	describe('NOPLogger.', () => {
		it('should return correct values when directly instantiated.', () => {
			const logger = new slf4n.NOPLogger();
			expect(logger.isDebugEnabled()).to.be.false;
			expect(logger.isInfoEnabled()).to.be.false;
			expect(logger.isWarnEnabled()).to.be.false;
			expect(logger.isErrorEnabled()).to.be.false;
			expect(logger.isTraceEnabled()).to.be.false;
			expect(logger.name()).to.equal('nop', 'Name should be equal to "nop".');
		});

		it('should return correct values when instantiated by NOPLoggerFactory.', () => {
			const factory = new slf4n.NOPLoggerFactory();
			const logger = factory.get(null);
			expect(logger.isDebugEnabled()).to.be.false;
			expect(logger.isInfoEnabled()).to.be.false;
			expect(logger.isWarnEnabled()).to.be.false;
			expect(logger.isErrorEnabled()).to.be.false;
			expect(logger.isTraceEnabled()).to.be.false;
			expect(logger.name()).to.equal('nop', 'Name should be equal to "nop".');
		});
	});

	describe('format', () => {
		it('should process arguments correctly.', () => {
			expect(slf4n.format('{0} {0}')).to.equal('{0} {0}');
			expect(slf4n.format('{0} {0}', 1, 2)).to.equal('1 1');
			expect(slf4n.format('{0} {1}', 1, 2)).to.equal('1 2');
			expect(slf4n.format('{1} {2}', 1, 2)).to.equal('2 {2}');
			expect(slf4n.format('{1} {0}', 1, 2)).to.equal('2 1');
		});
	});
});