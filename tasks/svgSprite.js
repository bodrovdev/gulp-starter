const { src, dest } = require('gulp');
const sprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const plumber = require('gulp-plumber');

// Создание svg-спрайта
module.exports = function svgSprite(browserSync) {
	return src('src/img/icon/**/*.svg')
		.pipe(plumber())
		.pipe(svgmin({
			plugins: [
				'removeComments',
				'removeEmptyContainers',
			]
		}))
		.pipe(sprite({
			mode: {
				stack: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe(dest('build/img/icon'))
		.pipe(browserSync.stream())
};
