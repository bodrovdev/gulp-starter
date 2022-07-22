const { src, dest } = require('gulp');

// Обновление favicon в папке build
module.exports = function refreshFavicon(browserSync) {
	return src('src/img/favicon/*.+(png|svg|ico)')
		.pipe(dest('build/img/favicon/'))
		.pipe(browserSync.stream())
};
