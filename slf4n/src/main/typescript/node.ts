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
import slf4n from './slf4n';
import * as path from 'path';

/**
 * Simple logging facade for NodeJS allowing the end user to choose the desired
 *	logging framework at deployment time.
 */
namespace node {
	/**
	 * Default {@link slf4n.LoggerFactoryResolver} for the node platform.
	 *
	 * @author Fabian Mastenbroek <mail.fabianm@gmail.com>
	 */
	export class LoggerFactoryResolver implements slf4n.LoggerFactoryResolver {
		/** @inheritDoc */
		resolve(): slf4n.LoggerFactory | Error {
			if (process.env['SLF4N_BINDING'])
				return this.byName(process.env['SLF4N_BINDING']);
			const configuration = this.getConfiguration(require.main) || {};
			if (configuration.slf4n && configuration.slf4n.binding)
				return this.byName(configuration.slf4n.binding);
			return new Error('Failed to determine binding (No configuration found)');
		}

		/**
		 * Get a {@link slf4n.LoggerFactory} by module name.
		 *
		 * @param name The name of the module.
		 * @returns The {@link slf4n.LoggerFactory} or an error.
		 */
		private byName(name: string): slf4n.LoggerFactory | Error {
			try {
				return require.main.require(name);
			} catch (e) {
				return new Error('Failed to load binding "' + name + '" (' + e.message + ')');
			}
		}

		/**
		 * Get the package.json configuration for the given module.
		 *
		 * @param module The module to get the package.json configuration of.
		 * @param dir The directory to search in (optional).
		 */
		private getConfiguration(module: NodeModule, dir?: string): any {
			/**
			 * From node-pkginfo
			 * https://github.com/indexzero/node-pkginfo
			 * Licensed under MIT.
			 */
			dir = dir || path.dirname(module.filename || module.id);

			if (dir === '/') {
				return false;
			} else if (!dir || dir === '.') {
				return false;
			}

			try {
				const contents = require(dir + '/package.json');
				if (contents) return contents;
			} catch (_) {
			}
			return this.getConfiguration(module, path.dirname(dir));
		}
	}
}

export default Object.assign(slf4n.init(new node.LoggerFactoryResolver(), "node", console.error), slf4n);