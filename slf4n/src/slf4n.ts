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
import * as fs from 'fs';
import * as path from 'path';

/**
 * Simple logging facade for NodeJS allowing the end user to choose the desired
 *	logging framework at deployment time.
 */
export namespace slf4n {
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
        get(_: any): Logger { return NOPLoggerFactory.logger; }
    }

    /**
     * Implementations of the {@link slf4n.LoggerFactoryResolver} interface
     *  resolve the {@link slf4n.LoggerFactory} for a platform (e.g. node).
     *
     * @author Fabian Mastenbroek <mail.fabianm@gmail.com>
     */
    interface LoggerFactoryResolver {
        /**
         * Resolve the {@link slf4n.LoggerFactory} for this platform.
         *
         * @return The factory or an error when the resolving failed.
         */
        resolve(): LoggerFactory | Error;
    }

    /**
     * Default {@link slf4n.LoggerFactoryResolver} for the node platform.
     *
     * @author Fabian Mastenbroek <mail.fabianm@gmail.com>
     */
    class DefaultLoggerFactoryResolver implements LoggerFactoryResolver {
        /** @inheritDoc */
        resolve(): LoggerFactory | Error {
            function getBinding(name: string) {
                try {
                    return require.main.require(name);
                } catch (e) {
                    return new Error('Failed to load binding "' + name + '" (' + e.message + ')');
                }
            }
            /*
             * From node-pkginfo
             * https://github.com/indexzero/node-pkginfo
             * Licensed under MIT.
             */
            function getConfiguration(module: NodeModule, dir?: string): any {
                dir = dir || path.dirname(module.filename);
                var files = fs.readdirSync(dir);
                if (~files.indexOf('package.json'))
                    return require(path.join(dir, 'package.json'));
                if (dir === '/' || !dir || dir === '.')
                    return null;
                return getConfiguration(module, path.dirname(dir));
            }

            if (process.env['SLF4N_BINDING'])
                return getBinding(process.env['SLF4N_BINDING']);
            const configuration = getConfiguration(require.main) || {};
            if (configuration['slf4n-binding'])
                return getBinding(configuration['slf4n-binding']);
            return new Error('Failed to determine binding (No configuration found)');
        }
    }

    /**
     * The global {@link slf4n.LoggerFactory} instance slf4n uses.
     */
    let factory: LoggerFactory = new NOPLoggerFactory();

    /**
     * Initialize slf4n and resolve a {@link slf4n.LoggerFactory}.
     */
    function init() {
        const resolver = new DefaultLoggerFactoryResolver();
        const result = resolver.resolve();

        if (result instanceof Error) {
            console.error('SLF4N: ' + (!resolver ? 'No LoggerFactoryResolver found for current platform' : result.message) + '.');
            console.error('SLF4N: Defaulting to no-operation (NOP) logger implementation.');
            console.error('SLF4N: See https://github.com/fabianishere/slf4n for further details.');
        } else {
            factory = result;
        }
    }

    /**
     * Return a {@link slf4n.Logger} implementation for the given module using the
     *	user-defined {@link slf4n.LoggerFactory} instance.
     *
     * @param module The {@link NodeModule} to get the {@link slf4n.Logger} implementation for.
     */
    export function get(module: NodeModule) {
        return factory.get(module);
    }

    init();
}

module.exports = slf4n;