const { src, dest } = require('gulp');
const gulpSquoosh = require('gulp-squoosh');
const plumber = require('gulp-plumber');

// Конвертация контентных изображений в webp
module.exports = function imgToWebp(browserSync) {
	return src('src/img/image/content/**/*.+(png|jpg|jpeg)')
		.pipe(plumber())
		.pipe(gulpSquoosh({
			encodeOptions: {
				webp: {}
			},
		}))
		.pipe(dest('build/img/image/content'))
		.pipe(browserSync.stream())
};
