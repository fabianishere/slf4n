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
import slf4n from './slf4n';
import * as path from 'path';
import * as util from 'util';

/**
 * Simple logging facade for NodeJS allowing the end user to choose the desired
 *	logging framework at deployment time.
 */
export namespace node {
	/**
	 * Default {@link slf4n.LoggerFactoryResolver} for the node platform.
	 *
	 * @author Fabian Mastenbroek <mail.fabianm@gmail.com>
	 */
	export class NodeLoggerFactoryResolver implements slf4n.LoggerFactoryResolver {
		/** @inheritDoc */
		resolve(): slf4n.LoggerFactory | Error {
			const cache = (<any> process).slf4n;
			if (cache)
				// If a LoggerFactory has already been resolved, return that one.
				return cache;
			else if (process.env['SLF4N_BINDING'])
				return NodeLoggerFactoryResolver.byName(process.env['SLF4N_BINDING']);

			const configuration = NodeLoggerFactoryResolver.getConfiguration(require.main) || {};
			if (configuration.slf4n) {
				if (configuration.slf4n.binding)
					return NodeLoggerFactoryResolver.byName(configuration.slf4n.binding);
				else if (configuration.slf4n instanceof String)
					return NodeLoggerFactoryResolver.byName(configuration.slf4n);
			}
			return new Error('Failed to determine binding (No configuration found)');
		}

		/**
		 * Get a {@link slf4n.LoggerFactory} by module name.
		 *
		 * @param name The name of the module.
		 * @returns The {@link slf4n.LoggerFactory} or an error.
		 */
		private static byName(name: string): slf4n.LoggerFactory | Error {
			try {
				const res = require.main.require(name);
				if (res && res.get)
					return res;
				else if (res && res.default && res.default.get)
					return res.default;
				throw new Error('Not a valid LoggerFactory');
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
		private static getConfiguration(module: NodeModule, dir?: string): any {
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
			return NodeLoggerFactoryResolver.getConfiguration(module, path.dirname(dir));
		}
	}
}


/** {@link Object#assign} polyfill. */
const assign = (<any> Object).assign || ((...xs: any[]) => xs.reduce((<any> util)._extend));

export default assign(
	((<any> process).slf4n = slf4n.init(new node.NodeLoggerFactoryResolver(), "node", console.error) || {}),
	slf4n,
	node
);