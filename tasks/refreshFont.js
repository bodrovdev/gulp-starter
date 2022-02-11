const {src, dest} = require('gulp');

// Обновление шрифтов в папке билд
module.exports = function copyFont(browserSync) {
	return src('src/fonts/**/*')
		.pipe(dest('build/fonts/'))
		.pipe(browserSync.stream())
};
