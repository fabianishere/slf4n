# SLF4N
SLF4N is a simple logging facade for NodeJS allowing the end user to choose the desired logging framework at deployment time.
Thanks for visiting!

Using SLF4N is really simple as shown below:
```js
import slf4n from 'slf4n';

const logger = slf4n.get(module);
logger.info("Hello World!");
```

## Configuration
You can specify the binding by either:

- Export `SLF4N_BINDING` with the name of the binding.
- Adding a `slf4n` field to your package.json with the name of the binding.
	
## Methods

- `.trace(message, arguments)`
- `.debug(message, arguments)`
- `.info(message, arguments)`
- `.warn(message, arguments)`
- `.error(message, arguments)`
- `.isTraceEnabled()`
- `.isDebugEnabled()`
- `.isInfoEnabled()`
- `.isWarnEnabled()`
- `.isErrorEnabled()`

## Installation
To install SLF4N, just run the following command in the terminal:
```sh
$ npm install --save slf4n
```
## License
This project is licensed under MIT. More information can be found in `LICENSE`.
