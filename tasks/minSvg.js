const { src, dest } = require('gulp');
const svgmin = require('gulp-svgmin');

// Минификация svg-изображений
module.exports = function minSvg(browserSync) {
	return src('src/img/image/**/*.+(svg)')
		.pipe(svgmin({
			plugins: [
				'removeComments',
				'removeEmptyContainers',
			]
		}))
		.pipe(dest('build/img/image/'))
		.pipe(browserSync.stream())
};
