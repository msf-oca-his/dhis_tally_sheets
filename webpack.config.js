var CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
	entry: {
		dependencies: "./src/dependencies.js",
		services: "./src/services.js",
		directives: "./src/directives.js",
		app: "./src/app.js",
		utils: "./src/utils.js",
		'pff-model': "./src/pff-model.js"
	},
	plugins: [
		new CopyWebpackPlugin([
			// {output}/file.txt
			// { from: './src/app.js', to: './app.js' },
			{from: './src/config/config.js', to: './config.js'}, //TODO: move this config as a entry point when we have more config files
			{from: './src/index.html', to: './index.html'}
		])],

	output: {
		path: './.temp',
		filename: "[name].js"
	},
	module: {
		loaders: [{test: /\.html$/, loader: "raw-loader"}]
	}
};
