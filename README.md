SLF4N is a simple logging facade for NodeJS allowing the end user to choose the desired logging framework at deployment time.
Thanks for visiting!

Using SLF4N is really simple as shown below:
	
	var logger = require("slf4n").get(module);
	logger.info("Hello World!");

To install SLF4N, just run the following command in the terminal:

	$ npm install --save slf4n

This project is licensed under the MIT License. More information can be found in LICENSE.
