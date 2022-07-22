const { src, dest } = require('gulp');
const plumber = require('gulp-plumber');
const webpack = require('webpack-stream');

let isDev = true;

// Минификация JavaScript
let webConfig = {
	output: {
		filename: 'index.min.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: '/node_modules/',
			}
		]
	},
	mode: isDev ? 'development' : 'production'
}

module.exports = function minJs(browserSync) {
	return src('src/js/**/*.js')
		.pipe(plumber())
		.pipe(webpack(webConfig))
		.pipe(dest('build/js'))
		.pipe(browserSync.stream())
};