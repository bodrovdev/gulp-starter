const { src, dest } = require('gulp');
const gulpSquoosh = require('gulp-squoosh');
const path = require('path');
const plumber = require('gulp-plumber');

// Минификация изображений
module.exports = function minImg(browserSync) {
	return src('src/img/image/**/*.+(png|jpg|jpeg)')
		.pipe(plumber())
		.pipe(gulpSquoosh(({ filePath }) => {
			const imageExtension = path.extname(filePath);
			const isPng = imageExtension === ".png";
			const optionsForPng = {
				oxipng: {}
			};
			const optionsForJpg = {
				mozjpeg: {}
			};
			const options = isPng ? optionsForPng : optionsForJpg;
			return {
				encodeOptions: {
					...options
				},
			};
		}))
		.pipe(dest('build/img/image'))
		.pipe(browserSync.stream())
};
