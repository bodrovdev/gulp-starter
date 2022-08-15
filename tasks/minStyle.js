const { src, dest } = require('gulp');
const autoprefixer = require('autoprefixer');
const clean = require('gulp-clean-css');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const postcssColorMod = require('@alexlafroscia/postcss-color-mod-function');
const postcssPresetEnv = require('postcss-preset-env');
const scss = require('gulp-sass')(require('sass'));

// Минификация CSS
module.exports = function minStyle(browserSync) {
	const plugins = [
		postcssPresetEnv(),
		postcssColorMod({
			unresolved: 'warn',
		}),
		autoprefixer(),
	];

	return src('src/scss/style.scss')
		.pipe(plumber())
		.pipe(scss({ outputStyle: 'compressed' }))
		// .pipe(scss())
		.pipe(postcss(plugins))
		.pipe(clean({ 
			// format: 'beautify',
			level: {
			1: {
				all: true,
				normalizeUrls: false
			},
			2: {
				restructureRules: true
			}
		} }))
		.pipe(concat('style.min.css'))
		.pipe(dest('build/css/'))
		.pipe(browserSync.stream())
};
