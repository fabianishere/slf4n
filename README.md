# SLF4N
SLF4N is a simple logging facade for NodeJS allowing the end user to choose the desired logging framework at deployment time.
Thanks for visiting!

Using SLF4N is really simple as shown below:
```js	
var logger = require("slf4n").get(module);
logger.info("Hello World!");
```

## Installation
To install SLF4N, just run the following command in the terminal:
```sh
$ npm install --save slf4n
```
## License
This project is licensed under the MIT License. More information can be found in `LICENSE`.
