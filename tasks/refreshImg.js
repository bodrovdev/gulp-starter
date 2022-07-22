const { src, dest } = require('gulp');

// Обновление изображений в папке build
module.exports = function refreshImg(browserSync) {
	return src('src/img/image/**/*.+(png|jpg|jpeg|gif|svg|ico)')
		.pipe(dest('build/img/image'))
		.pipe(browserSync.stream())
};
